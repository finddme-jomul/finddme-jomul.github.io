"""Render the homepage's original coloured ASCII front view as site icons.
Run with Python + Pillow; pass --font to select a local monospace font.
"""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--font', default='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf')
args = parser.parse_args()
rows = (ROOT / 'src/assets/orbit-ascii.txt').read_text().splitlines()
palette = json.loads((ROOT / 'src/assets/orbit-ascii-colors.json').read_text())
font = ImageFont.truetype(args.font, 40)
# Match the homepage's monospace .6 character width and line-height: 1.
canvas = Image.new('RGBA', (palette['columns'] * 24, palette['rows'] * 40), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)
for y, row in enumerate(rows):
    for x, character in enumerate(row):
        if character.strip():
            draw.text((x * 24, y * 40 + 34), character, font=font,
                      fill=palette['colors'][y][x] or '#ff7c50', anchor='ls')
art = canvas.crop(canvas.getbbox())
side = max(art.size)
padding = round(side * .04)
square = Image.new('RGBA', (side + padding * 2,) * 2, (0, 0, 0, 0))
square.alpha_composite(art, ((square.width-art.width)//2, (square.height-art.height)//2))
icon = square.resize((192, 192), Image.Resampling.LANCZOS)
icon.save(ROOT / 'public/favicon.png')
icon.save(ROOT / 'public/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
print('Created public/favicon.png and public/favicon.ico from the coloured ASCII front view.')
