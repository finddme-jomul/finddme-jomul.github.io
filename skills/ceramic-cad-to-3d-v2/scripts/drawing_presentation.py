"""Source-backed title blocks and an accessible, vector reading surface."""
from html import escape
from pathlib import Path

def reading_page(data,items,revision,back=None):
    e=lambda v:escape(str(v),quote=True)
    out=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CAD drawing review</title><style>',
'''*{box-sizing:border-box}:root{color-scheme:light}body{margin:0;color:#222;background:#fff;font:16px Arial,Helvetica,sans-serif}
header,article>section{padding:24px;max-width:1700px;margin:auto}h1{font-size:24px;font-weight:500;margin:0 0 12px}h2{font-size:20px;font-weight:500}
dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:16px 0;border:1px solid #777}
dl>div{padding:12px;border-bottom:1px solid #ddd}dt{font-size:12px;text-transform:uppercase;color:#555;margin-bottom:6px}dd{margin:0;overflow-wrap:anywhere}
details{margin:12px 0}summary,button,a{min-height:44px}summary{padding:12px 0;cursor:pointer}
button,a{font:inherit;color:inherit}button{background:white;border:1px solid #555;padding:10px 16px;cursor:pointer}a{display:inline-block;padding:10px 0}
.toolbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.toolbar p{margin:0;color:#555}
.sheet{overflow:auto;max-width:100%;max-height:80dvh;border-block:1px solid #aaa;overscroll-behavior:contain}
.sheet img{display:block;width:100%;min-width:1700px;height:auto}.sheet.fit img{min-width:0}
:focus-visible{outline:2px solid #111;outline-offset:3px}
@media(max-width:700px){header,article>section{padding:16px}dl{grid-template-columns:repeat(2,minmax(0,1fr))}.sheet img{min-width:1100px}}
</style><header><h1>CAD drawing review</h1><p>Read dimensions in mm. Screen size is not print scale.</p>''']
    if back:out.append(f'<a href="{e(back)}">Back to motion</a>')
    out.append('</header><main>')
    for i,item in enumerate(items,1):
        pid=item['id']
        cells=[('Drawing',pid),('Revision',revision),('Part',f"{i} / {len(items)}"),
               ('Units','mm'),('Scale','Per view · SVG units/mm'),('Review status',data['status'])]
        out.append(f'<article id="{e(pid)}"><section><h2>{e(pid.replace("-"," ").upper())}</h2><dl>')
        out.extend(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k,v in cells)
        out.append('</dl>')
        out.append(f'<details><summary>Source and evidence</summary><p>Project: {e(Path(data["sourceProject"]).name)}</p><p>STEP SHA-256: <span style="overflow-wrap:anywhere">{e(item["sourceStepSha256"])}</span></p><p>Review status is not manufacturing approval. Asterisks retain unconfirmed source dimensions.</p></details>')
        out.append(f'<div class="toolbar"><button type="button" data-fit="{e(pid)}" aria-pressed="false" aria-controls="sheet-{e(pid)}">Fit whole sheet</button><p>Scroll inside the drawing to inspect details. Fit shows an overview.</p></div></section>')
        out.append(f'<div class="sheet" id="sheet-{e(pid)}" role="region" tabindex="0" aria-label="{e(pid)} drawing, scroll to read"><picture><source media="(max-width:700px)" srcset="{e(pid)}-mobile.svg"><img src="{e(pid)}-desktop.svg" alt="{e(pid)} CAD views, dimensions and feature notes"></picture></div></article>')
    out.append('''</main><script>
for(const button of document.querySelectorAll('[data-fit]'))button.addEventListener('click',()=>{
 const sheet=document.getElementById('sheet-'+button.dataset.fit),fit=sheet.classList.toggle('fit');
 button.setAttribute('aria-pressed',String(fit));button.textContent=fit?'Read at full size':'Fit whole sheet';
 sheet.scrollTo(0,0);
});
</script></html>''')
    return ''.join(out)
