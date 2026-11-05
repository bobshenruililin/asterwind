"""Neutral paper grain for code-native layers (dev tool; not a build step).

Takes a plain stretch of photographed wall from hub/assets/corridor.webp (the project's paper and light
reference), removes its lighting and colour with a high-pass, and stores the fibre detail as a transparent light/
dark overlay that adds grain to anything without shifting its colour. Mirror tiling makes it seamless.
Run from the repository root:  python3 -I hub/art/textures/make-textures.py
"""
import hashlib, pathlib
import numpy as np
from PIL import Image, ImageFilter
root = pathlib.Path(__file__).resolve().parents[3]
src = root / 'hub' / 'assets' / 'corridor.webp'
box = (1120, 40, 1600, 520)            # 480x480 of plain wall, right of the pinned drawing, above the skirting
im = Image.open(src).convert('L').crop(box)
L = np.asarray(im, dtype=np.float32)
low = np.asarray(im.filter(ImageFilter.GaussianBlur(5)), dtype=np.float32)
detail = L - low
detail = detail / (detail.std() + 1e-6) * 22.0      # fine fibre only (radius-5 high-pass), about +/-22 levels
detail = np.block([[detail, detail[:, ::-1]], [detail[::-1, :], detail[::-1, ::-1]]])   # seamless by mirroring
# An overlay that needs no blend mode: fibres lighter than the mean become white at partial alpha,
# darker ones black at partial alpha. Painted normally, it lightens and darkens like soft-light, so it
# also works inside 3D-transformed layers where CSS/SVG blend modes are not reliable.
d = np.clip(detail, -48, 48)
rgb = np.where(d > 0, 255, 0).astype(np.uint8)
alpha = np.clip(np.abs(d) * 2.4, 0, 255).astype(np.uint8)
rgba = np.dstack([rgb, rgb, rgb, alpha])
out = root / 'hub' / 'art' / 'textures' / 'paper-grain.webp'
Image.fromarray(rgba, 'RGBA').resize((512, 512), Image.LANCZOS).save(out, 'WEBP', quality=58, method=6)
print(out.name, Image.open(out).size, out.stat().st_size, 'bytes; source sha256',
      hashlib.sha256(src.read_bytes()).hexdigest()[:16], 'crop', box)
