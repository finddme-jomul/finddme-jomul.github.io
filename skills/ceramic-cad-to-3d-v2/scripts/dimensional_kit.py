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


def dim_h(x1, x2, y, feature_y, label):
    x1,x2=sorted((x1,x2)); sign=1 if y>=feature_y else -1
    out=[line(x,feature_y+sign*3,x,y+sign*5) for x in (x1,x2)]
    if x2-x1>=28:
        out.append(line(x1,y,x2,y,'dim','marker-start="url(#dd-arrow)" marker-end="url(#dd-arrow)"'))
    else:
        out.extend([line(x1-13,y,x1,y,'dim','marker-end="url(#dd-arrow)"'),line(x2+13,y,x2,y,'dim','marker-end="url(#dd-arrow)"'),line(x1,y,x2,y,'dim')])
    return ''.join(out)+text((x1+x2)/2,y-6,label,'dt','middle')


def dim_v(y1, y2, x, feature_x, label):
    y1,y2=sorted((y1,y2)); sign=1 if x>=feature_x else -1
    out=[line(feature_x+sign*3,y,x+sign*5,y) for y in (y1,y2)]
    if y2-y1>=28:
        out.append(line(x,y1,x,y2,'dim','marker-start="url(#dd-arrow)" marker-end="url(#dd-arrow)"'))
    else:
        out.extend([line(x,y1-13,x,y1,'dim','marker-end="url(#dd-arrow)"'),line(x,y2+13,x,y2,'dim','marker-end="url(#dd-arrow)"'),line(x,y1,x,y2,'dim')])
    cy=(y1+y2)/2
    return ''.join(out)+text(x-7,cy,label,'dt','middle',f'transform="rotate(-90 {x-7} {cy})"')


def detail_ref(cx,cy,r,label,lx,ly):
    angle=math.atan2(ly-cy,lx-cx)
    return (f'<circle cx="{cx:.4f}" cy="{cy:.4f}" r="{r:.4f}" class="hidden"/>'
            +line(cx+r*math.cos(angle),cy+r*math.sin(angle),lx,ly,'lead')
            +text(lx+5,ly+4,label,'dt'))


def table(x,y,title,rows,width=280):
    out=[text(x,y-14,title,'title')]
    for i,(code,name,value) in enumerate([('CODE','DIMENSION','mm'),*rows]):
        top=y+i*25
        out.append(line(x,top,x+width,top,'table'))
        out.extend([text(x+5,top+17,code),text(x+55,top+17,name),text(x+width-5,top+17,value,anchor='end')])
    out.append(line(x,y+(len(rows)+1)*25,x+width,y+(len(rows)+1)*25,'table'))
    return ''.join(out)


def notes(x,y,rows,width=43):
    out=[]
    for i,row in enumerate(rows):
        for j,chunk in enumerate(textwrap.wrap(row,width=width) or ['']):
            out.append(text(x,y, f'{i+1:02d}  {chunk}' if j==0 else '     '+chunk,'small'))
            y+=18
        y+=8
    return ''.join(out)
