"""Selected moon technical-sheet presentation, regenerated from CAD inputs.

Extracted only the selected drawing functions; no historical build dispatch,
comparison UI, absolute repository paths, or prebuilt image dependency.
The compatibility gate in selected_cad limits this layout to reviewed inputs.
"""
import pymupdf
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from ceramic_paths import ASSETS
from isometric_geometry import geometry

PAGE_W, PAGE_H = 1190, 842
HERO_CX, HERO_BASE, HERO_SCALE = 381, 157, 3.4
INK = colors.HexColor('#282B2C')
MUTED = colors.HexColor('#606669')
PALE = colors.HexColor('#BCC1C2')
ACCENT = colors.HexColor('#434749')
PAPER = colors.white


def setup_fonts():
    font_dir = ASSETS / 'fonts'
    pdfmetrics.registerFont(TTFont('Gowun', str(font_dir / 'gowun-batang.ttf')))
    pdfmetrics.registerFont(TTFont('Outfit', str(font_dir / 'outfit-variable.ttf')))


def label(pdf, x, y, text, size=9, color=INK, font='Gowun'):
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    pdf.drawString(x, y, text)


def rule(pdf, x1, y1, x2, y2, color=PALE, width=.7, dash=None):
    pdf.setStrokeColor(color)
    pdf.setLineWidth(width)
    pdf.setDash(dash or [])
    pdf.line(x1, y1, x2, y2)
    pdf.setDash([])


def outline(pdf, profile, cx, base, scale, stroke=INK, width=1.5):
    pdf.setStrokeColor(stroke)
    pdf.setLineWidth(width)
    path = pdf.beginPath()
    path.moveTo(cx - profile[0][0] * scale, base)
    for radius, z in profile:
        path.lineTo(cx - radius * scale, base + z * scale)
    for radius, z in reversed(profile):
        path.lineTo(cx + radius * scale, base + z * scale)
    pdf.drawPath(path)
    rule(pdf, cx - profile[-1][0] * scale, base + profile[-1][1] * scale,
         cx + profile[-1][0] * scale, base + profile[-1][1] * scale, stroke, width)
    rule(pdf, cx - profile[0][0] * scale, base,
         cx + profile[0][0] * scale, base, stroke, width)


def arrow(pdf, x, y, direction):
    s = 3.2
    rule(pdf, x, y, x + direction*s, y + s/2, MUTED, .8)
    rule(pdf, x, y, x + direction*s, y - s/2, MUTED, .8)


def dimensions(pdf, cx, base, height, diameter, scale):
    left = cx - diameter * scale / 2
    right = cx + diameter * scale / 2
    top = base + height * scale
    ydim = base + height * scale * .52
    xdim = left - 33
    rule(pdf, left-13, base, xdim-7, base)
    rule(pdf, left-13, top, xdim-7, top)
    rule(pdf, xdim, base, xdim, top, MUTED, .75)
    arrow(pdf, xdim, base, 1)
    arrow(pdf, xdim, top, -1)
    pdf.saveState()
    pdf.translate(xdim-9, base+height*scale/2)
    pdf.rotate(90)
    label(pdf, 0, 0, f'{height:g} mm · FIRED HEIGHT', 9, INK)
    pdf.restoreState()
    rule(pdf, left, ydim, right, ydim, MUTED, .75)
    arrow(pdf, left, ydim, 1)
    arrow(pdf, right, ydim, -1)
    label(pdf, cx-37, ydim+8, f'Ø {diameter:g} mm', 10, INK, 'Outfit')


def horizontal_dimension(pdf, left, right, feature_y, dim_y, text, text_y):
    """Dimension and extension lines tied to the model's actual mouth/foot span."""
    outward = 4 if dim_y > feature_y else -4
    rule(pdf,left,feature_y+outward,left,dim_y+outward*1.4,MUTED,.65)
    rule(pdf,right,feature_y+outward,right,dim_y+outward*1.4,MUTED,.65)
    rule(pdf,left,dim_y,right,dim_y,MUTED,.75)
    arrow(pdf,left,dim_y,1)
    arrow(pdf,right,dim_y,-1)
    pdf.setFont('Outfit',9)
    tw=pdfmetrics.stringWidth(text,'Outfit',9)
    label(pdf,(left+right-tw)/2,text_y,text,9,INK,'Outfit')


def section(pdf, profile, dims, x, bottom, scale, exact_floor=False):
    height = dims['height']
    wall = dims['wallThickness']
    floor = dims['baseThickness']
    cx = x
    outer = [(cx + r*scale, bottom + z*scale) for r,z in profile]
    inner = [(cx + (r-wall)*scale, bottom + z*scale) for r,z in profile if z >= floor]
    if exact_floor:
        a,b=next((a,b) for a,b in zip(profile,profile[1:]) if a[1]<=floor<=b[1])
        radius=a[0]+(b[0]-a[0])*(floor-a[1])/(b[1]-a[1])-wall
        inner=[(cx+radius*scale,bottom+floor*scale)]+[(cx+(r-wall)*scale,bottom+z*scale) for r,z in profile if z>floor]
    path = pdf.beginPath()
    path.moveTo(*outer[0])
    for point in outer[1:]: path.lineTo(*point)
    path.lineTo(*inner[-1])
    for point in reversed(inner[:-1]): path.lineTo(*point)
    path.lineTo(cx, bottom+floor*scale)
    path.lineTo(cx, bottom)
    path.close()
    pdf.saveState()
    pdf.clipPath(path,stroke=0,fill=0)
    pdf.setStrokeColor(MUTED)
    pdf.setLineWidth(.45)
    for yy in range(int(bottom-50),int(bottom+height*scale+100),6):
        pdf.line(cx-15,yy,cx+100,yy+115)
    pdf.restoreState()
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(1)
    pdf.drawPath(path, stroke=1, fill=0)
    rule(pdf,cx,bottom-7,cx,bottom+height*scale+7,MUTED,.6,[3,3])
    label(pdf,cx+100,bottom+height*scale-16,f'WALL {wall:g} mm*',8,ACCENT)
    label(pdf,cx+100,bottom+9,f'BASE {floor:g} mm*',8,ACCENT)
    label(pdf,cx+100,bottom-5,'* ASSUMED',7,MUTED)


def local_detail(pdf, profile, center_radius, z_min, z_max, x, y, title, wall=5):
    """Magnified right-hand CAD wall segment; inner wall remains an assumption."""
    segment = [(r, z) for r,z in profile if z_min <= z <= z_max]
    if len(segment) < 2: return
    label(pdf, x, y+65, title, 8, ACCENT)
    factor = 5.8
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(.9)
    for delta in (0, wall):
        path = pdf.beginPath()
        for index, (radius, z) in enumerate(segment):
            px = x+34+(radius-delta-center_radius)*factor
            py = y+12+(z-z_min)*factor
            if index == 0: path.moveTo(px,py)
            else: path.lineTo(px,py)
        pdf.drawPath(path)
    label(pdf,x,y,'ENLARGED · INNER WALL ASSUMED',7,MUTED)


def isometric(pdf, profile, dims, cx=886, base=492, scale=1.1):
    """Orthographic axonometric line study from the same revolved CAD profile.

    Every displayed ring samples a real profile elevation. The sparse ring
    selection keeps the highly tessellated STEP from turning into a black mass.
    """
    def poly(points, color, width=.65, dash=None):
        pdf.setStrokeColor(color)
        pdf.setLineWidth(width)
        pdf.setDash(dash or [])
        path = pdf.beginPath()
        for i, xy in enumerate(points):
            if i == 0: path.moveTo(*xy)
            else: path.lineTo(*xy)
        pdf.drawPath(path)
        pdf.setDash([])

    shape = geometry(profile, dims, cx, base, scale)
    for side in shape['sides']:
        poly(side, INK, .95)
    for ring in shape['rings']:
        poly(ring['back'], PALE, .45, [2,2])
        poly(ring['front'], INK, .65)
    for rim in shape['rims']:
        poly(rim, INK, .75)


def sheet_layout(dims, adapt=False):
    scale = min(510/dims['height'], 476/dims['maxDiameter']) if adapt else HERO_SCALE
    base = HERO_BASE + (510-dims['height']*scale)/2 if adapt else HERO_BASE
    return HERO_CX, base, scale


def make_sheet(profile, calc, material, pdf_path, adapt=False):
    dims = calc['targetFiredMm']
    pdf = canvas.Canvas(str(pdf_path), pagesize=(PAGE_W,PAGE_H))
    pdf.setTitle('Ceramic technical CAD' if adapt else 'Moon jar technical CAD | fired form, materials and forming dimensions')
    pdf.setFillColor(PAPER)
    pdf.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)

    # Only design information appears on the exported sheet.
    rule(pdf,58,709,1132,709)

    # Hero: the exact same outer profile read by the existing sheet and front SVG.
    cx, base, scale = sheet_layout(dims, adapt)
    label(pdf,100,755,'01  ·  TARGET FIRED FORM',11,INK)
    label(pdf,100,735,'FRONT ELEVATION  /  DIMENSIONS mm',8,MUTED)
    rule(pdf,cx,137,cx,687,MUTED,.55,[3,4])
    outline(pdf,profile,cx,base,scale,width=1.6)
    dimensions(pdf,cx,base,dims['height'],dims['maxDiameter'],scale)
    # Two faint shape indicators: not presented as original sketch strokes.
    rule(pdf,588,503,649,522,PALE,.7)
    label(pdf,654,525,'SHOULDER CURVE',8,MUTED)
    local_detail(pdf,profile,dims['openingDiameter']/2,dims['height']-9,dims['height'],650,566,'RIM DETAIL*',dims['wallThickness'])
    rule(pdf,570,290,649,278,PALE,.7)
    label(pdf,654,275,'PROFILE TOWARD FOOT',8,MUTED)
    local_detail(pdf,profile,dims['footDiameter']/2,0,10,650,161,'FOOT DETAIL*',dims['wallThickness'])
    horizontal_dimension(pdf,cx-dims['openingDiameter']*scale/2,cx+dims['openingDiameter']*scale/2,base+dims['height']*scale,687,f"Ø {dims['openingDiameter']:g} mm",696)
    horizontal_dimension(pdf,cx-dims['footDiameter']*scale/2,cx+dims['footDiameter']*scale/2,base,129,f"Ø {dims['footDiameter']:g} mm",111)

    # CAD-derived axonometric view and material schedule, without page framing.
    rule(pdf,785,100,785,761)
    label(pdf,809,755,'02  ·  ISOMETRIC',11,INK)
    label(pdf,809,735,'SELECTED FORM LINES / CAD PROFILE',8,MUTED)
    isometric(pdf,profile,dims,scale=min(165/dims['height'],154/dims['maxDiameter']) if adapt else 1.1)
    label(pdf,816,459,'ISOMETRIC / CAD PROFILE' if adapt else 'ISOMETRIC · 1:2.6',8,INK,'Outfit')
    rule(pdf,975,465,975,703,PALE,.55)
    label(pdf,992,678,'MATERIALS',10,INK)
    label(pdf,992,655,'CLAY  /  '+material['clay']['name'] if adapt else 'CLAY  /  백토',10,INK)
    pdf.setFillColor(colors.HexColor(material['clay']['wetPreviewHex']))
    pdf.rect(1105,649,17,17,fill=1,stroke=0)
    label(pdf,992,625,'PRODUCT UNCONFIRMED' if not material['clay']['product'] else material['clay']['product'],7,MUTED)
    rule(pdf,992,606,1130,606,PALE,.5)
    label(pdf,992,582,'GLAZE  /  '+material['glaze']['name'] if adapt else 'GLAZE  /  무광투명',10,INK)
    pdf.setFillColor(colors.HexColor(material['glaze']['firedAppearancePreviewHex']))
    pdf.setStrokeColor(PALE)
    pdf.rect(1105,576,17,17,fill=1,stroke=1)
    label(pdf,992,553,('APPEARANCE / '+material['glaze']['optical'].upper()+' · '+material['glaze']['finish'].upper()) if adapt else 'APPEARANCE / CLEAR · MATTE',7,MUTED)
    rule(pdf,992,535,1130,535,PALE,.5)
    label(pdf,992,510,'COLOR SUBJECT TO FINAL FIRING',7,MUTED)
    rule(pdf,810,382,1131,382)
    label(pdf,809,363,'03  ·  PLAN VIEW',10,INK)
    label(pdf,990,363,'04  ·  PROVISIONAL SECTION',10,INK)
    top_cx, top_cy = 886,269
    pdf.setStrokeColor(INK); pdf.setLineWidth(1)
    pdf.circle(top_cx,top_cy,69,stroke=1,fill=0)
    pdf.setStrokeColor(MUTED); pdf.circle(top_cx,top_cy,69*dims['openingDiameter']/dims['maxDiameter'],stroke=1,fill=0)
    rule(pdf,top_cx-80,top_cy,top_cx+80,top_cy,PALE,.5,[3,3])
    rule(pdf,top_cx,top_cy-80,top_cx,top_cy+80,PALE,.5,[3,3])
    label(pdf,833,177,f"OUTER Ø {dims['maxDiameter']:g} / RIM Ø {dims['openingDiameter']:g} mm",8,MUTED)
    section(pdf,profile,dims,1016,196,min(124.5/dims['height'],116.2/dims['maxDiameter']) if adapt else .83,exact_floor=adapt)
    rule(pdf,809,148,1131,148)
    wet = calc['wetBuildMm']
    rate = calc['shrinkage']['totalPercent']
    label(pdf,809,125,f'05  ·  FORMING SIZE / SHRINKAGE {rate:g}% ASSUMED',9,ACCENT)
    label(pdf,809,103,f"WET H {wet['height']:.1f} mm  ·  MAX Ø {wet['maxDiameter']:.1f} mm",8,MUTED)
    firing = calc.get('firing', '')
    if firing and '미확인' not in firing:
        label(pdf,809,84,f'FIRING / {firing}',8,MUTED)
    pdf.save()


def render(profile, calc, material, output, adapt=False):
    """Return drawing and front-box metadata from the same dimensions."""
    output.mkdir(parents=True, exist_ok=True)
    setup_fonts()
    make_sheet(profile, calc, material, output/'cad-sheet.pdf', adapt=adapt)
    with pymupdf.open(output/'cad-sheet.pdf') as document:
        document[0].get_pixmap(matrix=pymupdf.Matrix(1.4, 1.4), alpha=False).save(output/'cad-sheet.png')
    dims = calc['targetFiredMm']
    cx,base,scale=sheet_layout(dims,adapt)
    return {'cx':cx/PAGE_W,'cy':1-(base+dims['height']*scale/2)/PAGE_H,
            'width':dims['maxDiameter']*scale/PAGE_W,'height':dims['height']*scale/PAGE_H}
