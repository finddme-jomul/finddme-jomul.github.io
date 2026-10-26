"""SVG drawing primitives adapted from enesozturk/dimensional-drawing (MIT).

Copyright (c) 2026 Enes Ozturk. See assets/vendor/dimensional-drawing/LICENSE.
Python adaptation: explicit SVG return values, mm labels and package-local IDs.
"""
from html import escape
import math
import textwrap

CSS = '''text{font-family:Arial,Helvetica,sans-serif;fill:#222;font-size:12px}
.outline{stroke:#222;stroke-width:1.6;fill:none}
.hidden{stroke:#888;stroke-width:.55;stroke-dasharray:5 4;fill:none}
.axis{stroke:#999;stroke-width:.55;stroke-dasharray:10 3 2 3;fill:none}
.dim,.lead{stroke:#333;stroke-width:.7;fill:none}
.ext{stroke:#777;stroke-width:.55;fill:none}
.dt{paint-order:stroke;stroke:white;stroke-width:4;stroke-linejoin:round}
.title{font-size:14px;letter-spacing:1.2px}.small{font-size:10px;fill:#666}
.head{font-size:20px;letter-spacing:1.2px}.table{stroke:#777;stroke-width:.55;fill:none}
'''


def text(x, y, value, cls='', anchor='start', extra=''):
    return f'<text x="{x:.4f}" y="{y:.4f}" class="{cls}" text-anchor="{anchor}" {extra}>{escape(str(value))}</text>'


def line(x1, y1, x2, y2, cls='ext', extra=''):
    return f'<line x1="{x1:.4f}" y1="{y1:.4f}" x2="{x2:.4f}" y2="{y2:.4f}" class="{cls}" {extra}/>'


def defs():
    return '<defs><marker id="dd-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#333"/></marker><pattern id="dd-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#777" stroke-width=".55"/></pattern></defs>'


def dim_h(x1, x2, y, feature_y, label, *, below=False, dx=0, dy=0, feature_y2=None):
    x1,x2=sorted((x1,x2)); sign=1 if y>=feature_y else -1
    out=[line(x,fy+sign*3,x,y+sign*5) for x,fy in zip((x1,x2),(feature_y,feature_y if feature_y2 is None else feature_y2))]
    if x2-x1>=28:
        out.append(line(x1,y,x2,y,'dim','marker-start="url(#dd-arrow)" marker-end="url(#dd-arrow)"'))
    else:
        out.extend([line(x1-13,y,x1,y,'dim','marker-end="url(#dd-arrow)"'),line(x2+13,y,x2,y,'dim','marker-end="url(#dd-arrow)"'),line(x1,y,x2,y,'dim')])
    return ''.join(out)+text((x1+x2)/2+dx,y+(16 if below else -6)+dy,label,'dt','middle')


def dim_v(y1, y2, x, feature_x, label, *, side=None, dx=0, dy=0, feature_x2=None):
    y1,y2=sorted((y1,y2)); sign=1 if x>=feature_x else -1
    out=[line(fx+sign*3,y,x+sign*5,y) for y,fx in zip((y1,y2),(feature_x,feature_x if feature_x2 is None else feature_x2))]
    if y2-y1>=28:
        out.append(line(x,y1,x,y2,'dim','marker-start="url(#dd-arrow)" marker-end="url(#dd-arrow)"'))
    else:
        out.extend([line(x,y1-13,x,y1,'dim','marker-end="url(#dd-arrow)"'),line(x,y2+13,x,y2,'dim','marker-end="url(#dd-arrow)"'),line(x,y1,x,y2,'dim')])
    cy=(y1+y2)/2
    if side not in (None,'left','right'):raise ValueError('Invalid dimension side')
    if side:return ''.join(out)+text(x+(-8 if side=='left' else 8)+dx,cy+4+dy,label,'dt','end' if side=='left' else 'start')
    return ''.join(out)+text(x-7+dx,cy+dy,label,'dt','middle',f'transform="rotate(-90 {x-7+dx} {cy+dy})"')


def detail_ref(cx,cy,r,label,lx,ly):
    angle=math.atan2(ly-cy,lx-cx)
    return (f'<circle cx="{cx:.4f}" cy="{cy:.4f}" r="{r:.4f}" class="hidden"/>'
            +line(cx+r*math.cos(angle),cy+r*math.sin(angle),lx,ly,'lead')
            +text(lx+(-5 if lx<cx else 5),ly+4,label,'dt','end' if lx<cx else 'start'))


def callout(px,py,ex,ey,label,direction=None):
    """Port of upstream dot + leader + shoulder annotation."""
    if direction not in (None,"left","right"):raise ValueError("Invalid leader direction")
    sign=-1 if direction=="left" or (direction is None and ex<px) else 1
    return (f'<circle cx="{px:.4f}" cy="{py:.4f}" r="1.8" fill="#333"/>'
            +line(px,py,ex,ey,'lead')+line(ex,ey,ex+sign*10,ey,'lead')
            +text(ex+sign*14,ey+4,label,'dt','end' if sign<0 else 'start'))


def table(x,y,title,rows,width=280):
    out=[text(x,y-14,title,'title')]
    for i,(code,name,value) in enumerate([('CODE','DIMENSION','mm'),*rows]):
        top=y+i*25
        out.append(line(x,top,x+width,top,'table'))
        out.extend([text(x+5,top+17,code),text(x+55,top+17,name),text(x+width-5,top+17,value,anchor='end')])
    out.append(line(x,y+(len(rows)+1)*25,x+width,y+(len(rows)+1)*25,'table'))
    return ''.join(out)


def notes(x,y,rows,width=43,numbered=False):
    out=[]
    for i,row in enumerate(rows):
        for j,chunk in enumerate(textwrap.wrap(row,width=width) or ['']):
            label=(f'{i+1:02d}  {chunk}' if j==0 else '     '+chunk) if numbered else chunk
            out.append(text(x,y,label,'small'))
            y+=18
        y+=8
    return ''.join(out)


def radius_leader(point, elbow, code):
    """Upstream rad/callout convention, anchored to a verified CAD circle point."""
    return callout(*point,*elbow,code)


def numbered_badge(x,y,number):
    return (f'<rect x="{x-9:.4f}" y="{y-9:.4f}" width="18" height="18" fill="white" stroke="#333" stroke-width=".7"/>'
            +text(x,y+4,str(number),'','middle'))


def view_title(x,y,title,scale):
    return text(x,y,title,'title','middle')+text(x,y+17,f'SCALE {scale:.2f} SVG units/mm','small','middle')
