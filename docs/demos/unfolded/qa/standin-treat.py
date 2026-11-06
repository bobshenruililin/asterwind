"""Marks raw stand-in renders as stand-ins (warm paper wash, softened edges) and writes WebP into art-standin/heard/
with an index.json, so ?art=art-standin swaps them in. Usage: python3 -I qa/standin-treat.py <rawdir> <outdir>"""
import sys, json, pathlib
from PIL import Image, ImageFilter, ImageOps
raw, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); (out / 'heard').mkdir(parents=True, exist_ok=True)
idx = {'plate': {}, 'figures': {'ellis': {}, 'you': {}}}
for f in sorted(raw.glob('heard-*.png')):
    im = Image.open(f).convert('RGBA')
    rgb, a = im.convert('RGB'), im.getchannel('A')
    warm = ImageOps.colorize(ImageOps.grayscale(rgb).filter(ImageFilter.GaussianBlur(1.2)), black='#1e1626', white='#f3dfb6', mid='#9a6a58')
    rgb = Image.blend(rgb, warm, .55)
    o = Image.merge('RGBA', (*rgb.split(), a))
    name = f.stem.replace('heard-', '') + '.webp'
    o.save(out / 'heard' / name, 'WEBP', quality=72, method=6)
    parts = f.stem.split('-')
    if parts[1] == 'plate': idx['plate'][parts[2]] = name
    else: idx['figures'][parts[1]][parts[2]] = name
(out / 'index.json').write_text(json.dumps({'note': 'STAND-INS rendered from the code-cut room and tinted, to test the loader. Not art; never adopt.', 'rooms': {'heard': idx}}, indent=1))
print('treated', sum(len(v) for v in idx['figures'].values()) + len(idx['plate']), 'layers')
