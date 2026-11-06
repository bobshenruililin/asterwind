"""Runtime object layers for the four generic played films, from the P0 clean-plate candidates.

    python3 docs/demos/played/make-film-layers.py <dir-with-candidate-pngs>

The candidates are the team's delivery on codex/opus-remaining-cleanplates-20261106 (commit f108040,
docs/asset-candidates/opus-p0-20261106/remaining-cleanplates/); extract the chosen takes into one folder first
(see PROVENANCE.md). They regenerate texture everywhere, so nothing is taken from them outside the objects:

- clean.webp: the decision plate, pixel for pixel, except under the two objects, where the candidate shows.
- <action>.webp (RGBA): each object is exact source pixels; its alpha is a difference matte (where the source
  differs from the clean candidate), limited to that action's decision region, holes filled, edge feathered.
"""
import sys, pathlib, json, numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = ROOT / 'docs/demos/played/plates'
# decision regions, copied from scene.js REG (each film's layout.js)
REG = {'slides': {'microphone': (.08, .53, .27, .30), 'notebook': (.60, .36, .35, .40)},
       'scope': {'extend': (.055, .15, .37, .68), 'return': (.68, .30, .28, .40)},
       'pixel': {'lower': (.06, .31, .12, .42), 'connect': (.71, .69, .28, .23)},
       'ship': {'live': (.02, .45, .32, .43), 'rehearsal': (.71, .28, .27, .60)}}
SRC = {'slides': 'anthology/episodes/slides/assets/decision.webp', 'scope': 'anthology/episodes/scope/assets/runtime/decision.webp',
       'pixel': 'anthology/episodes/pixel/assets/decision.webp', 'ship': 'anthology/episodes/ship/assets/decision.webp'}
TAKE = {'slides': 'missing-name-02.png', 'scope': 'one-more-chair-03.png', 'pixel': 'pixel-03.png', 'ship': 'ship-03.png'}
MARGIN = .025
# where an object reaches past its decision region (the easel's front feet stand below it)
EXTRA = {'notebook': (0, 0, 0, .1)}
# The viewer's own hands, traced on the decision plates (pixels). They sit in front of the objects: they're cut out
# of every object layer, drawn above as the occluder (over.webp), and where a hand hid part of an object, that part is
# continued from the object's own pixels above it, down to the object's bottom edge either side of the hand.
HANDS = {'slides': [[(300, 785), (320, 771), (360, 759), (415, 752), (440, 767), (475, 785), (490, 800), (500, 825), (495, 850), (450, 870), (400, 900), (350, 912), (320, 920), (300, 941),
                     (0, 941), (20, 895), (60, 865), (140, 845), (210, 855), (235, 840), (280, 835), (280, 810)]],
         'scope': [[(165, 830), (205, 772), (225, 760), (250, 750), (295, 735), (315, 742), (350, 747), (370, 765), (410, 790), (414, 804), (400, 809), (360, 797), (342, 793),
                    (330, 805), (345, 818), (385, 812), (400, 822), (394, 834), (360, 842), (322, 838), (300, 872), (285, 905), (150, 941), (60, 941), (60, 880)]]}


def rgba(rgb, a):
    a = np.clip(a, 0, 255).astype(np.uint8); out = np.dstack([rgb.round().clip(0, 255).astype(np.uint8), a]); out[a == 0, :3] = 0
    return Image.fromarray(out, 'RGBA')


def continue_under(m, rgb, hand):
    """Where a hand hid part of an object, continue the object down from its own pixels above, to its bottom edge
    interpolated from the columns either side of the hand."""
    H, W = m.shape; cols = np.where(m.any(0))[0]
    if not len(cols): return m, rgb
    bottom = np.full(W, -1)
    for x in cols:
        ys = np.where(m[:, x] & ~hand[:, x])[0]
        if len(ys) and not hand[min(H - 1, ys.max() + 2), x]: bottom[x] = ys.max()
    known = np.where(bottom >= 0)[0]
    if len(known) < 2: return m, rgb
    est = np.interp(np.arange(W), known, bottom[known]).astype(int)
    m = m.copy(); rgb = rgb.copy()
    for x in range(cols.min(), cols.max() + 1):
        ys = np.where(m[:, x])[0]
        if not len(ys): continue
        top = ys.min(); last = None
        for y in range(top, min(H, est[x] + 1)):
            if m[y, x]: last = rgb[y, x]
            elif hand[y, x] and last is not None: m[y, x] = True; rgb[y, x] = last
    return m, rgb


def main(cands):
    report = {}
    for ep, regs in REG.items():
        src = np.asarray(Image.open(ROOT / SRC[ep]).convert('RGB')).astype(np.float32); H, W, _ = src.shape
        clean = np.asarray(Image.open(cands / TAKE[ep]).convert('RGB')).astype(np.float32)
        assert clean.shape == src.shape, (ep, clean.shape)
        diff = ndimage.gaussian_filter(np.abs(src - clean).sum(-1), 2.0)
        d = OUT / ep / 'layers'; d.mkdir(parents=True, exist_ok=True)
        hand = np.zeros((H, W), bool)
        if HANDS.get(ep):
            im = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(im)
            for poly in HANDS[ep]: dr.polygon(poly, fill=255)
            hand = ndimage.binary_dilation(np.asarray(im) > 0, iterations=2)
        ha = ndimage.gaussian_filter(hand.astype(np.float32), 1.0) * 255
        rgba(src, ha if hand.any() else np.zeros((H, W))).save(d / 'over.webp', 'WEBP', quality=92, exact=True)
        under = np.zeros((H, W), np.float32); report[ep] = {}
        for act, (x, y, w, h) in regs.items():
            ex = EXTRA.get(act, (0, 0, 0, 0))
            x0, y0 = max(0, int((x - MARGIN - ex[0]) * W)), max(0, int((y - MARGIN - ex[1]) * H)); x1, y1 = min(W, int((x + w + MARGIN + ex[2]) * W)), min(H, int((y + h + MARGIN + ex[3]) * H))
            box = np.zeros((H, W), bool); box[y0:y1, x0:x1] = True
            m = (diff > 60) & box & ~hand
            m = ndimage.binary_closing(m, iterations=4); m = ndimage.binary_fill_holes(m); m = ndimage.binary_opening(m, iterations=2)
            lab, n = ndimage.label(m)
            if n > 1:  # keep the larger pieces only: specks of regenerated texture are not the object
                sizes = ndimage.sum(m, lab, range(1, n + 1)); keep = [i + 1 for i, s in enumerate(sizes) if s >= .08 * sizes.max()]; m = np.isin(lab, keep)
            rgb = src.copy()
            if hand.any() and (m & ndimage.binary_dilation(hand, iterations=6)).any():
                m, rgb = continue_under(m, rgb, hand)
            a = ndimage.gaussian_filter(m.astype(np.float32), 1.3) * 255
            rgba(rgb, a).save(d / f'{act}.webp', 'WEBP', quality=92, exact=True)
            under = np.maximum(under, a); report[ep][act] = {'pixels': int(m.sum()), 'box': [x0, y0, x1, y1]}
        k = ndimage.gaussian_filter((ndimage.grey_dilation(under, size=9) > 8).astype(np.float32), 3)[..., None]
        Image.fromarray((src * (1 - k) + clean * k).round().clip(0, 255).astype(np.uint8)).save(d / 'clean.webp', 'WEBP', quality=92)
        print(ep, report[ep])
    (OUT / 'film-layers.json').write_text(json.dumps({'source': 'codex/opus-remaining-cleanplates-20261106 @ f108040', 'takes': TAKE, 'layers': report}, indent=1))


if __name__ == '__main__':
    main(pathlib.Path(sys.argv[1]))
