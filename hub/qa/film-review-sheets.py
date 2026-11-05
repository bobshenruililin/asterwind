"""Contact sheets for hub/qa/film-review.cjs: one image per story and outcome, desktop beats above,
phone beats below, each labelled with its beat key. QA tool only."""
import json, sys, pathlib
from PIL import Image, ImageDraw
out = pathlib.Path(sys.argv[1])
runs = json.loads((out / 'review.json').read_text())
by = {}
for r in runs:
    by.setdefault((r['id'], r['outcome']), {})[r['size']] = r
for (sid, outcome), sizes in by.items():
    rows = []
    for size, tw, per in (('desk', 300, 5), ('phone', 130, 11)):
        r = sizes.get(size)
        if not r or not r['frames']:
            continue
        thumbs = []
        for f in r['frames']:
            im = Image.open(out / f['file']).convert('RGB')
            th = im.resize((tw, round(im.height * tw / im.width)))
            pad = Image.new('RGB', (tw, th.height + 16), (18, 18, 22))
            pad.paste(th, (0, 16))
            ImageDraw.Draw(pad).text((3, 2), f['key'], fill=(240, 210, 150))
            thumbs.append(pad)
        h = max(t.height for t in thumbs)
        for i in range(0, len(thumbs), per):
            row = Image.new('RGB', (per * (tw + 6), h + 6), (10, 10, 12))
            for j, t in enumerate(thumbs[i:i + per]):
                row.paste(t, (j * (tw + 6), 3))
            rows.append(row)
    if not rows:
        continue
    W = max(r.width for r in rows)
    sheet = Image.new('RGB', (W, sum(r.height for r in rows)), (10, 10, 12))
    y = 0
    for r in rows:
        sheet.paste(r, (0, y)); y += r.height
    sheet.save(out / f'sheet-{sid}-{outcome}.png')
    print('sheet', sid, outcome, sheet.size)
