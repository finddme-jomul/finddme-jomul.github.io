"""Register reviewed page input and publish immutable, browser-gated revisions."""
import copy
import json
import uuid
from pathlib import Path
from ceramic_paths import ROOT, SKILL
from photos import sha
from stages import hashes


def current(project, state):
    entry=state.get('pageReview') or {}
    if entry.get('generator')!='selected-page': return False
    try:
        output=(project/entry['output']).resolve()
        if not output.is_relative_to(project.resolve()/'page-revisions'): return False
        return (entry['reviewedInput']==state.get('reviewedPageInput')
                and entry['runtimeSha256']==sha(SKILL/'runtime-lock.json')
                and hashes(output)==entry['filesSha256']
                and all(sha(ROOT/name)==value for name,value in entry['inputsSha256'].items()))
    except (OSError,KeyError,ValueError,TypeError): return False


def build(project, state, review):
    from project import save, record
    from selected_page import restore
    old=copy.deepcopy(state.get('pageReview'))
    state['reviewedPageInput']=copy.deepcopy(review)
    target=project/'page-revisions'/uuid.uuid4().hex
    state['pageJob']={'status':'running','target':str(target.relative_to(project)),
                      'retry':f'resume {project.name}'}
    save(project/'pipeline-state.json',state)
    try:
        target.parent.mkdir(exist_ok=True)
        restore(target,cad_project=project,review=review)
        bridge=json.loads((target/'cad-bridge.json').read_text())
        state['pageReview']={'generator':'selected-page','output':str(target.relative_to(project)),
                             'filesSha256':hashes(target),'inputsSha256':bridge['inputsSha256'],
                             'runtimeSha256':sha(SKILL/'runtime-lock.json'),
                             'reviewedInput':copy.deepcopy(review),'status':'browser-verified-candidate'}
        state['pageJob']={'status':'complete'}
        save(project/'pipeline-state.json',state)
    except Exception as error:
        if old is None: state.pop('pageReview',None)
        else: state['pageReview']=old
        state['pageJob']={'status':'failed','error':str(error),'target':str(target.relative_to(project)),
                          'retry':f'resume {project.name}'}
        save(project/'pipeline-state.json',state)
        record(project,'Page failed; previous verified page retained: '+str(error))
        raise
    record(project,'Selected-page revision browser-verified: '+str(target.relative_to(project)))
    print('CERAMIC_PROJECT_PAGE_READY',target/'index.html')


def resume(project, state):
    # Never migrate withdrawn scene inputs implicitly.
    if state.get('pageGenerator')!='selected-page' or not state.get('reviewedPageInput'): return
    from stages import describe
    if describe(project,state)['cad']['status']!='complete': return
    if current(project,state) and state.get('pageJob',{}).get('status')=='complete': return
    from project import snapshot
    snapshot(project)
    build(project,state,state['reviewedPageInput'])
