"""P1 question/answer state PoC. Image interpretation remains an agent task."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import tempfile
from validate import validate

ROOT = Path(__file__).resolve().parent


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile('w',encoding='utf-8',dir=path.parent,delete=False) as tmp:
        json.dump(data,tmp,ensure_ascii=False,indent=2)
        tmp.write('\n')
        temp=Path(tmp.name)
    temp.replace(path)


def load_extraction(state: dict) -> dict:
    path=Path(state['extractionPath'])
    if digest(path)!=state['extractionSha256']:
        raise ValueError('Extraction changed; explicit migration/review required before resume')
    extraction=json.loads(path.read_text())
    errors=validate(extraction)
    if errors:
        raise ValueError('Extraction invalid: '+'; '.join(errors))
    return extraction


def initialize(extraction_path: Path, state_path: Path) -> dict:
    if state_path.exists():
        raise ValueError('State already exists; use resume or a new state path')
    extraction=json.loads(extraction_path.read_text())
    errors=validate(extraction)
    if errors:
        raise ValueError('Extraction invalid: '+'; '.join(errors))
    state={
        'schemaVersion':1,'project':extraction['project'],
        'extractionPath':str(extraction_path.resolve()),
        'extractionSha256':digest(extraction_path),
        'sourceImageSha256':extraction['source']['sha256'],
        'questionFields':{q['id']:{f['field']:{'status':'pending'} for f in q['fields']} for q in extraction['questions']},
        'answers':[], 'confirmedFields':{}, 'deferredFields':{}
    }
    save(state_path,state)
    return state


def check_value(spec: dict, value: object) -> None:
    kind=spec['type']
    if kind=='number':
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not spec['min'] <= value <= spec['max']:
            raise ValueError(f"{spec['field']}: value outside {spec['min']}..{spec['max']}")
    elif kind=='enum':
        if value not in spec['choices']:
            raise ValueError(f"{spec['field']}: not one of {spec['choices']}")
    elif kind=='text':
        if not isinstance(value,str) or not value.strip():
            raise ValueError(f"{spec['field']}: empty explanation")
    else:
        raise ValueError('Invalid question schema')


def apply_answer(state: dict, answer: dict) -> dict:
    extraction=load_extraction(state)
    if answer.get('project')!=state['project']:
        raise ValueError('Answer project does not match state')
    answer_id=answer.get('answerId')
    if not isinstance(answer_id,str) or not answer_id:
        raise ValueError('A stable answerId is required')
    previous=next((a for a in state['answers'] if a['answerId']==answer_id),None)
    if previous:
        if previous['answer']==answer:
            return state  # reapplying a reply must not ask or mutate again
        raise ValueError('answerId reused with different content; use a new review event')
    evidence=answer.get('evidence',{})
    if evidence.get('kind')!='user-message' or not evidence.get('reference') or not answer.get('verbatim'):
        raise ValueError('A user-message reference and verbatim reply are required')
    q=next((q for q in extraction['questions'] if q['id']==answer.get('questionId')),None)
    if q is None:
        raise ValueError('Unknown question ID')
    specs={f['field']:f for f in q['fields']}
    updates=answer.get('updates',[])
    defer=answer.get('deferFields',[])
    if not updates and not defer:
        raise ValueError('Answer must update or explicitly defer at least one field')
    update_keys=[u.get('field') for u in updates]
    if len(update_keys)!=len(set(update_keys)) or len(defer)!=len(set(defer)) or set(update_keys)&set(defer):
        raise ValueError('Duplicate or conflicting fields')
    if not set(update_keys+defer).issubset(specs):
        raise ValueError('Answer contains field outside this question')
    # Validate every operation before mutating state.
    for update in updates:
        key=update['field']
        check_value(specs[key],update.get('value'))
        if key in state['confirmedFields']:
            raise ValueError(f'{key} already confirmed; revise explicitly instead of overwriting')
    for key in defer:
        if key in state['confirmedFields']:
            raise ValueError(f'{key} already confirmed')
    for update in updates:
        key=update['field'];spec=specs[key]
        confirmed={'value':update['value'],'status':'user-confirmed','answerId':answer_id,
                   'evidence':evidence,'verbatim':answer['verbatim']}
        if spec['type']=='number':confirmed['unit']=spec['unit']
        state['confirmedFields'][key]=confirmed
        state['questionFields'][q['id']][key]={'status':'answered','answerId':answer_id}
        state['deferredFields'].pop(key,None)
    for key in defer:
        state['deferredFields'][key]={'status':'deferred','answerId':answer_id,'evidence':evidence,
                                      'verbatim':answer['verbatim']}
        state['questionFields'][q['id']][key]={'status':'deferred','answerId':answer_id}
    state['answers'].append({'answerId':answer_id,'answer':answer})
    return state


def summary(state: dict) -> dict:
    extraction=load_extraction(state)
    pending=[];deferred=[]
    for q in extraction['questions']:
        for spec in q['fields']:
            status=state['questionFields'][q['id']][spec['field']]['status']
            record={'questionId':q['id'],'field':spec['field'],'prompt':spec['prompt'],'priority':q['priority']}
            if status=='pending':pending.append(record)
            elif status=='deferred':deferred.append(record)
    return {'project':state['project'],'confirmedFields':state['confirmedFields'],
            'pending':pending,'deferred':deferred,
            'readyForConfirmedCAD':not any(r['priority'] in ('before-CAD','before-final-CAD','before-confirmed-section','before-section-CAD') for r in pending+deferred)}


def export_for_specification(state: dict) -> dict:
    """Hand off only source-backed values after every CAD-blocking question is settled."""
    info=summary(state)
    if not info['readyForConfirmedCAD']:
        blocking=[x['field'] for x in info['pending']+info['deferred']
                  if x['priority'] in ('before-CAD','before-final-CAD','before-confirmed-section','before-section-CAD')]
        raise ValueError('CAD handoff blocked by unresolved fields: '+', '.join(blocking))
    extraction=load_extraction(state)
    return {'schemaVersion':1,'project':state['project'],
            'sourceImageSha256':state['sourceImageSha256'],
            'confirmedObservations':[o for o in extraction['observations'] if o['status']=='user-confirmed'],
            'priorUserConfirmations':extraction['userConfirmations'],
            'answeredFields':state['confirmedFields'],
            'note':'P1 evidence handoff to 02 specification; not a CAD geometry or final dimensions.json'}


def main() -> int:
    parser=argparse.ArgumentParser()
    sub=parser.add_subparsers(dest='command',required=True)
    init=sub.add_parser('init');init.add_argument('extraction',type=Path);init.add_argument('state',type=Path)
    answer=sub.add_parser('answer');answer.add_argument('state',type=Path);answer.add_argument('reply',type=Path)
    resume=sub.add_parser('resume');resume.add_argument('state',type=Path)
    export=sub.add_parser('export');export.add_argument('state',type=Path);export.add_argument('output',type=Path)
    args=parser.parse_args()
    if args.command=='init':
        state=initialize(args.extraction.resolve(),args.state.resolve())
    else:
        state=json.loads(args.state.read_text())
        load_extraction(state)
        if args.command=='answer':
            state=apply_answer(state,json.loads(args.reply.read_text()))
            save(args.state,state)
        elif args.command=='export':
            save(args.output,export_for_specification(state))
    print(json.dumps(summary(state),ensure_ascii=False,indent=2))
    return 0


if __name__=='__main__':
    raise SystemExit(main())
