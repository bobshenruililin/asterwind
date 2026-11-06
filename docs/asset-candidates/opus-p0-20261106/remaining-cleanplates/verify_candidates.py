"""Read-only candidate package verification. Does not accept or modify images."""
from pathlib import Path
import hashlib
import json
import sys
from PIL import Image
import numpy as np
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
manifest = json.loads((HERE / 'manifest.json').read_text())
errors = []
for item in manifest['entries']:
    target, source = HERE / item['file'], ROOT / item['source']
    for path, expected in [(target, item['sha256']), (source, item['source_sha256'])]:
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            errors.append(f'Hash mismatch: {path.name}')
    a = np.asarray(Image.open(source).convert('RGB')).astype(np.int16)
    b = np.asarray(Image.open(target).convert('RGB')).astype(np.int16)
    if [b.shape[1], b.shape[0]] != item['dimensions']:
        errors.append(f'Dimensions differ from manifest: {target.name}')
    if (a.shape == b.shape) != item['dimension_match']:
        errors.append(f'Dimension-match flag incorrect: {target.name}')
    for check in item['protected_region_checks']:
        x0, y0, x1, y1 = check['rect_xyxy']
        aa, bb = a[y0:y1, x0:x1], b[y0:y1, x0:x1]
        delta = np.abs(aa - bb)
        mae = round(float(delta.mean()), 4)
        exact = round(float(np.all(aa == bb, axis=2).mean() * 100), 5)
        over10 = round(float((delta.max(axis=2) > 10).mean() * 100), 4)
        if mae != check['rgb_mean_absolute_difference_0_255'] or exact != check['exact_pixel_percent'] or over10 != check['pixel_percent_with_any_channel_difference_over_10']:
            errors.append(f'Protected-region measurement differs: {target.name} / {check["region"]}')
    print(item['id'], item['dimensions'], 'canvas OK' if item['dimension_match'] else 'REJECT canvas width', 'not accepted')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {len(manifest["entries"])} raw candidate files and source hashes verified. This is not an art acceptance gate.')
