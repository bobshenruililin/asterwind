#!/usr/bin/env python3
"""Read-only validation: no pixel writing, source changes or image synthesis."""
from pathlib import Path
from hashlib import sha256
import json
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'reference-v1/02-turn-or-pass-decision.webp'
src = np.asarray(Image.open(SOURCE).convert('RGB'))
H, W = src.shape[:2]
assert (W, H) == (1672, 941)
report = {'source': str(SOURCE.relative_to(ROOT.parent.parent.parent.parent.parent)), 'source_sha256': sha256(SOURCE.read_bytes()).hexdigest(), 'canvas': [W, H], 'layers': {}}
for name in ('platter', 'tray'):
    path = ROOT / f'{name}-registered.png'
    im = Image.open(path)
    assert im.mode == 'RGBA', (name, im.mode)
    pix = np.asarray(im)
    assert pix.shape == (H, W, 4), (name, pix.shape)
    alpha = pix[:, :, 3]
    visible = alpha > 0
    diff = np.abs(pix[:, :, :3].astype(int) - src.astype(int))[visible]
    assert diff.max() == 0, (name, 'Source RGB changed', diff.max())
    assert np.count_nonzero(alpha == 0) > W * H // 2
    assert np.count_nonzero((alpha > 0) & (alpha < 255)) > 100
    assert np.count_nonzero(alpha == 255) > 10000
    ys, xs = np.where(visible)
    bbox = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    x0, y0, x1, y1 = bbox
    crop = np.asarray(Image.open(ROOT / f'{name}-crop.png'))
    assert crop.shape == (y1-y0, x1-x0, 4), (name, crop.shape, bbox)
    assert np.array_equal(crop, pix[y0:y1, x0:x1]), (name, 'Crop mismatch')
    probes = ([(700,300),(690,461),(850,633)] if name == 'platter' else [(1360,540),(1250,680),(1500,660)])
    for x, y in probes:
        assert alpha[y,x] == 255, (name, 'Missing object interior', x, y)
    for x, y in [(10,10),(1100,300),(657,807),(440,723),(1033,380),(1300,200)]:
        assert alpha[y,x] == 0, (name, 'Unexpected background/hand/token', x, y)
    if name == 'tray':
        assert alpha[500,700] == 0
    else:
        assert alpha[550,1350] == 0
    report['layers'][name] = {'registered_file': path.name, 'crop_file': f'{name}-crop.png', 'registration_offset_px': [0,0], 'crop_origin_px': [x0,y0], 'crop_size_px': [x1-x0,y1-y0], 'nonzero_alpha_bbox_xyxy': bbox, 'visible_pixel_count': int(visible.sum()), 'opaque_pixel_count': int((alpha == 255).sum()), 'partial_alpha_pixel_count': int(((alpha > 0) & (alpha < 255)).sum()), 'source_rgb_max_abs_error': int(diff.max()), 'source_rgb_mean_abs_error': float(diff.mean()), 'registered_sha256': sha256(path.read_bytes()).hexdigest(), 'crop_sha256': sha256((ROOT/f'{name}-crop.png').read_bytes()).hexdigest()}
print(json.dumps(report, indent=2))
