"""Runtime object layers for The Quiet Minute's decision, from the team's P0 deliveries.

    python3 docs/demos/played/make-layers.py

Inputs (all in the repository):
- the decision plate: anthology/episodes/standup/assets/reference-v1/02-turn-or-pass-decision.webp
- registered source layers (exact source RGB + alpha): anthology/episodes/standup/assets/source-layers-v1/
- a clean-plate candidate (objects removed): docs/art/quiet-clean-20261106/quiet-clean-take-03.png

Outputs (docs/demos/played/plates/qm-layers/):
- clean.webp: the decision plate, pixel for pixel, except under the platter and tray, where the clean
  candidate's wood shows through a feathered mask. Faces, hands and light stay exactly the source's.
- platter.webp (RGBA): the registered platter. Where hands hid its rim, the gap is filled from the rim's own
  pixels at the same radius, a few degrees round (marked in PROVENANCE.md as a reconstruction).
- tray.webp (RGBA): the registered tray and slips, unchanged.
- occluder.webp (RGBA): Theo's hand, the lead's hand and the token, exact source pixels from the
  occlusion mask, drawn above the moving platter so it turns under them.
"""
import pathlib, re, numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[3]
SRC = ROOT / 'anthology/episodes/standup/assets/reference-v1/02-turn-or-pass-decision.webp'
LAY = ROOT / 'anthology/episodes/standup/assets/source-layers-v1'
CLEAN = ROOT / 'docs/art/quiet-clean-20261106/quiet-clean-take-03.png'
OUT = ROOT / 'docs/demos/played/plates/qm-layers'
CX, CY, RX, RY = .401, .528, .232, .283  # the platter ellipse in plate UV (quiet.js OBJ.platter)


def svg_mask(path, size):
    """Rasterise the black paths of a mask SVG (M/L/C/Q/Z only) to a 0/255 array."""
    W, H = size
    img = Image.new('L', size, 0); d = ImageDraw.Draw(img)
    for p in re.findall(r'<path fill="black" d="([^"]+)"', path.read_text()):
        tok = re.findall(r'[MLCQZ]|-?\d+(?:\.\d+)?', p); pts, cur, i = [], (0, 0), 0
        while i < len(tok):
            c = tok[i]; i += 1
            if c in 'ML': cur = (float(tok[i]), float(tok[i + 1])); i += 2; pts.append(cur)
            elif c == 'C':
                a, b, e = [(float(tok[i + k]), float(tok[i + k + 1])) for k in (0, 2, 4)]; i += 6
                for t in np.linspace(0, 1, 16)[1:]:
                    u = 1 - t; pts.append(tuple(u**3 * np.array(cur) + 3 * u * u * t * np.array(a) + 3 * u * t * t * np.array(b) + t**3 * np.array(e)))
                cur = e
            elif c == 'Q':
                a, e = [(float(tok[i + k]), float(tok[i + k + 1])) for k in (0, 2)]; i += 4
                for t in np.linspace(0, 1, 12)[1:]:
                    u = 1 - t; pts.append(tuple(u * u * np.array(cur) + 2 * u * t * np.array(a) + t * t * np.array(e)))
                cur = e
            elif c == 'Z':
                if len(pts) > 2: d.polygon(pts, fill=255)
                pts = []
        if len(pts) > 2: d.polygon(pts, fill=255)
    return np.asarray(img)


def rgba(a):
    """RGBA image with fully transparent pixels zeroed (smaller files; no hidden colour is kept)."""
    a = a.round().clip(0, 255).astype(np.uint8); a[a[..., 3] == 0, :3] = 0
    return Image.fromarray(a, 'RGBA')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
    H, W, _ = src.shape
    plat = np.asarray(Image.open(LAY / 'platter-registered.png').convert('RGBA')).astype(np.float32)
    tray = np.asarray(Image.open(LAY / 'tray-registered.png').convert('RGBA')).astype(np.float32)
    clean = np.asarray(Image.open(CLEAN).convert('RGB').resize((W, H))).astype(np.float32)

    # Clean plate: source everywhere except under the objects (their alpha, grown a little and feathered).
    under = np.maximum(plat[..., 3], tray[..., 3]) > 8
    m = Image.fromarray((under * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(4))
    k = (np.asarray(m).astype(np.float32) / 255)[..., None]
    out = src * (1 - k) + clean * k
    Image.fromarray(out.round().clip(0, 255).astype(np.uint8)).save(OUT / 'clean.webp', 'WEBP', quality=92)

    # Platter: fill the rim gaps under the hands from the rim itself, rotating in ellipse space.
    yy, xx = np.mgrid[0:H, 0:W]
    ex, ey = (xx / W - CX) / RX, (yy / H - CY) / RY
    rho, th = np.hypot(ex, ey), np.arctan2(ey, ex)
    inside = rho < 1.0
    need = inside & (plat[..., 3] < 250)
    filled = plat.copy(); todo = need.copy()
    for step in range(1, 61):
        for sgn in (1, -1):
            if not todo.any(): break
            a = th + sgn * step * .015
            sx = ((CX + rho * np.cos(a) * RX) * W).round().astype(int).clip(0, W - 1)
            sy = ((CY + rho * np.sin(a) * RY) * H).round().astype(int).clip(0, H - 1)
            ok = todo & (plat[sy, sx, 3] >= 250)
            filled[ok] = plat[sy[ok], sx[ok]]; todo &= ~ok
    filled[..., 3] = np.where(need, np.maximum(filled[..., 3], plat[..., 3]), plat[..., 3])
    print('platter gap pixels filled', int((need & ~todo).sum()), 'left', int(todo.sum()))
    rgba(filled).save(OUT / 'platter.webp', 'WEBP', quality=92, exact=True)
    rgba(tray).save(OUT / 'tray.webp', 'WEBP', quality=92, exact=True)

    # Occluders: exact source pixels inside the occlusion mask, softened by a pixel at the edge.
    occ = svg_mask(LAY / 'masks/platter-occlusion.svg', (W, H))
    a = np.asarray(Image.fromarray(occ).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
    o = np.dstack([src, a])
    rgba(o).save(OUT / 'occluder.webp', 'WEBP', quality=92, exact=True)
    for f in sorted(OUT.glob('*.webp')): print(f.relative_to(ROOT), f.stat().st_size)


if __name__ == '__main__':
    main()
