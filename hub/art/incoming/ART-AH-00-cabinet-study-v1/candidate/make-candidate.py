"""Interim machine face from ART-AH-00 (dev tool; not a build step; adopted 5 Nov pending ART-AH-01).

Registers the cabinet study to the 1200x2000 machine template with one axis-aligned fit that makes
the window exact, cleans alpha noise, and writes the face-geometry declaration so live controls
(key lights, knob, flap, clock) can follow the art. No repaint, crop of content, or compositing.
Run from the repository root:  python3 -I hub/art/incoming/ART-AH-00-cabinet-study-v1/candidate/make-candidate.py
"""
import json, pathlib
from PIL import Image
here = pathlib.Path(__file__).resolve().parent
src = here.parent / 'cabinet-study.webp'
# Window hole measured from the study's alpha: pixels 76..686 x 338..1221 (edges 76/687, 338/1222).
# Template window: 80..860 x 428..1540.
sx, sy = 780 / 611, 1112 / 884
tx, ty = 80 - 76 * sx, 428 - 338 * sy
T = lambda x, y: (x * sx + tx, y * sy + ty)
im = Image.open(src).convert('RGBA')
r, g, b, a = im.split()
# Alpha noise: near-zero becomes 0 (clean holes); 248+ becomes 255 (a solid board).
a = a.point(lambda v: 0 if v < 8 else 255 if v >= 248 else v)
im = Image.merge('RGBA', (r, g, b, a))
face = im.transform((1200, 2000), Image.AFFINE, (1 / sx, 0, -tx / sx, 0, 1 / sy, -ty / sy), resample=Image.BICUBIC)
# The template window must be fully clear: drinks, glass and fog live there.
fa = face.getchannel('A'); fa.paste(0, (80, 428, 860, 1540)); face.putalpha(fa)
# Adopted 5 Nov as the interim face: written where the manifest reads it.
out = here.parents[2] / 'machine' / 'machine-face-interim.webp'
face.save(out, 'WEBP', quality=90, method=6, exact=True)
# Controls measured in study pixels (+/-3 px), mapped to template pixels.
k0 = T(742, 374); k1 = T(828, 487); kw = 70 * sx; kh = 92 * sy
knob = T(818, 1062); chute0 = T(117, 1318); chute1 = T(639, 1469)
geometry = {
    'keys': [round(k0[0], 1), round(k0[1], 1), round(kw, 1), round(kh, 1), round(k1[0] - k0[0], 1), round(k1[1] - k0[1], 1)],
    'knob': [round(knob[0], 1), round(knob[1], 1), round(80 * (sx + sy) / 2, 1)],
    'chute': [round(chute0[0], 1), round(chute0[1], 1), round(chute1[0] - chute0[0], 1), round(chute1[1] - chute0[1], 1)],
    # Clock well inside the seam band between the sign (95..322) and the window frame (from ~390).
    'display': [96, 332, 1008, 56],
    'well': True,
    'sign': [42, 95, 1118, 227],
}
recipe = {'source': 'cabinet-study.webp', 'sha256_source': 'bde7dbd83618d279aca13638036b03b91b78b1b9c1e74a8d4b13c0df71da1fda',
          'scale': [sx, sy], 'translate': [tx, ty], 'alpha': 'v<8 -> 0, v>=248 -> 255', 'windowCleared': [80, 428, 860, 1540], 'geometry': geometry}
(here / 'recipe.json').write_text(json.dumps(recipe, indent=1) + '\n')
manifest = {'schemaVersion': 2, 'machine': {'face': {'src': 'art/machine/machine-face-interim.webp', 'geometry': geometry, 'lettering': 'AFTER HOURS'}, 'interior': None, 'glass': None, 'side': None},
            'drinks': {}, 'corridor': {'portrait': None, 'dawn': 'art/corridor/corridor-dawn.webp', 'portraitDawn': None}, 'hand': {}, 'clips': {}}
(here / 'candidate-manifest.json').write_text(json.dumps(manifest, indent=1) + '\n')
print(json.dumps(geometry), out.stat().st_size, 'bytes')
