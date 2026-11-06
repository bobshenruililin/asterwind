"""Assemble the shareable playable build of Asterwind ("Leadership, unfolded" + After Hours + six films)
into dist/play/ (static, no server code, no network) and dist/asterwind-play.zip.

    python3 scripts/build-play.py

Host the folder on any static host (GitHub Pages, Netlify, a USB stick served by `python3 -m http.server`).
The root index.html opens the journey. Paths inside keep the repository layout, so nothing is rewritten.
Run python3 film/build.py, anthology/build-all.py and hub/build.py first if their sources changed."""
from pathlib import Path
import shutil, zipfile, json, hashlib
from play_assets import verify_play

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'qa', 'dist', '__pycache__', 'source', 'incoming', 'review', 'art-standin', 'art-brief', 'templates', 'node_modules', 'reference-v1-originals'}
SKIP_SUFFIX = {'.cjs', '.py', '.md', '.ts', '.mid', '.zip', '.psd', '.txt'}
KEEP_MD = {'PROVENANCE.md'}

def tree(src, dst, extra_skip=()):
    for p in sorted(src.rglob('*')):
        rel = p.relative_to(src)
        if any(part in SKIP_DIRS or part in extra_skip for part in rel.parts[:-1]) or p.is_dir():
            continue
        if p.name.startswith('test') or (p.suffix in SKIP_SUFFIX and p.name not in KEEP_MD):
            continue
        q = dst / rel; q.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(p, q)

def build(root=ROOT):
    root = Path(root).resolve()
    OUT = root / 'dist' / 'play'

    def one(rel):
        q = OUT / rel; q.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(root / rel, q)

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    tree(root / 'docs/demos/unfolded', OUT / 'docs/demos/unfolded')
    for f in ['seam-night-sketch.mp3', 'seam-dawn-sketch.mp3', 'PROVENANCE.md']:
        one(f'docs/demos/sound-board/music/{f}')
    tree(root / 'hub', OUT / 'hub')
    one('anthology/progress.js')
    tree(root / 'anthology/episodes', OUT / 'anthology/episodes')
    tree(root / 'film', OUT / 'film')
    for f in ['Kalam-Regular.ttf', 'Kalam-Bold.ttf', 'OFL.txt']:
        one(f'app/assets/fonts/{f}')
    (OUT / 'index.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Asterwind</title><meta http-equiv="refresh" content="0; url=docs/demos/unfolded/"><style>body{background:#08080d;color:#e9c27a;font:16px Georgia,serif;display:grid;place-items:center;height:100vh;margin:0}a{color:inherit}</style></head>
    <body><p><a href="docs/demos/unfolded/">Asterwind · Leadership</a></p></body></html>\n''')
    (OUT / '.nojekyll').write_text('')
    verify_play(OUT)  # Fail before packaging if a declared runtime asset did not survive export.
    files = sorted(p for p in OUT.rglob('*') if p.is_file())
    manifest = {p.relative_to(OUT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()[:16] for p in files}
    (OUT / 'build-manifest.json').write_text(json.dumps({'files': len(files), 'bytes': sum(p.stat().st_size for p in files), 'sha256_16': manifest}, indent=1))
    z = root / 'dist' / 'asterwind-play.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(OUT.rglob('*')):
            if p.is_file():
                zf.write(p, Path('asterwind-play') / p.relative_to(OUT))
    print(f'{len(files)} files, {sum(p.stat().st_size for p in files)/1e6:.1f} MB in {OUT.relative_to(root)}; zip {z.stat().st_size/1e6:.1f} MB')
    return OUT, z

if __name__ == '__main__':
    build()
