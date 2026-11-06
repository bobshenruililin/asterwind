"""Package just this isolated prototype. Does not deploy or modify the main game."""
from pathlib import Path
import hashlib, json, zipfile
ROOT = Path(__file__).resolve().parent
FILES = ['index.html', 'style.css', 'motion.js', 'scene.js', 'app.js', 'README.md', 'PROVENANCE.md'] + ['assets/' + n + '.png' for n in ['harbor', 'boat', 'keeper', 'lantern', 'departure', 'fishers', 'brace', 'reach', 'place', 'receive', 'surge']]
def build():
    manifest = {}
    for name in FILES:
        p = ROOT / name
        data = p.read_bytes()
        assert data, f'Empty file: {name}'
        if p.suffix == '.png':
            assert data.startswith(b'\x89PNG\r\n\x1a\n'), f'Invalid PNG: {name}'
        manifest[name] = hashlib.sha256(data).hexdigest()
    out = ROOT.parents[2] / 'dist' / 'last-light'
    out.mkdir(parents=True, exist_ok=True)
    target = out / 'asterwind-last-light.zip'
    with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as z:
        for name in FILES:
            z.write(ROOT / name, 'last-light/' + name)
        z.writestr('last-light/build-manifest.json', json.dumps(manifest, indent=2))
    with zipfile.ZipFile(target) as z:
        assert z.testzip() is None
        for name, expected in manifest.items():
            assert hashlib.sha256(z.read('last-light/' + name)).hexdigest() == expected
    print(f'{len(FILES)} verified files, {target.stat().st_size:,} bytes: {target}')
    return target
if __name__ == '__main__':
    build()
