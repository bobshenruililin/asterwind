"""The morning table for the listening Quiet Minute: the clean decision plate without the platter's footprint ring.
A thin band around the fitted ellipse is refilled with the same plate's wood from just inside and outside it, along
the same angle (the table's grain is concentric). Hands, Theo's fingers and the token are masked out. Local only.
    python make-morning.py      (needs opencv-python-headless, numpy, Pillow)"""
import cv2, numpy as np, pathlib
from PIL import Image
P = pathlib.Path(__file__).resolve().parents[3] / 'plates' / 'qm-layers'
im = cv2.imread(str(P / 'clean.webp')).astype(np.float32); h, w = im.shape[:2]
g = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32); hp = g - cv2.GaussianBlur(g, (0, 0), 18)
best = None  # fit the ring: the ellipse along which the high-passed plate is darkest
for cx in np.linspace(.39, .41, 9):
    for cy in np.linspace(.53, .56, 9):
        for rx in np.linspace(.232, .25, 7):
            for ry in np.linspace(.28, .305, 9):
                t = np.linspace(0, 2 * np.pi, 900); x = (cx + rx * np.cos(t)) * w; y = (cy + ry * np.sin(t)) * h
                ok = (x > 0) & (x < w - 1) & (y > 0) & (y < h - 1); v = hp[y[ok].astype(int), x[ok].astype(int)].mean()
                if best is None or v < best[0]: best = (v, cx, cy, rx, ry)
_, cx, cy, rx, ry = best; cx, cy, rx, ry = cx * w, cy * h, rx * w, ry * h
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); dx, dy = (xx - cx) / rx, (yy - cy) / ry; r = np.sqrt(dx * dx + dy * dy) + 1e-6
b = .03; band = cv2.GaussianBlur(np.clip(1 - np.abs(r - 1) / b, 0, 1), (0, 0), 2.5)
def shifted(k):
    s = (r + k) / r; return cv2.remap(im, cx + dx * s * rx, cy + dy * s * ry, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
fill = (shifted(2.4 * b) + shifted(-2.4 * b)) / 2
keep = np.ones((h, w), np.float32)
for (x0, y0, x1, y1) in [(.575, .27, .68, .50), (.10, .78, .36, 1.0), (.52, .78, .78, 1.0)]:
    keep[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 0
cv2.circle(keep, (int(.39 * w), int(.867 * h)), int(.045 * w), 0, -1); keep = cv2.GaussianBlur(keep, (0, 0), 6)
m = (band * keep)[..., None]; res = np.clip(im * (1 - m) + fill * m, 0, 255).astype(np.uint8)
Image.fromarray(cv2.cvtColor(res, cv2.COLOR_BGR2RGB)).save(P / 'morning.webp', quality=88, method=6)
print('ring', best, '->', P / 'morning.webp')
