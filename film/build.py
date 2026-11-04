"""Deterministic, dependency-free exports; never overwrite authored assets."""
from pathlib import Path
import base64, hashlib, json
ROOT = Path(__file__).resolve().parent
story = json.loads((ROOT / 'story.json').read_text())
assets = {p.stem: 'assets/' + p.name for p in sorted((ROOT / 'assets').glob('*.webp'))}
manifest = json.loads((ROOT / 'audio/manifest.json').read_text())
voices = {c['id']: {'src': 'audio/' + c['file'], 'duration': c['duration']} for c in manifest}
required = {s['asset'] for route in ('setup', 'backup', 'repair') for s in story[route]} - {'black'}
required |= {story['cover'], 'decisionPortrait', story['decision']['asset']}
missing = required - assets.keys()
if missing: raise SystemExit('Missing required art: ' + ', '.join(sorted(missing)))
for key, clip in voices.items():
    if not (ROOT / clip['src']).is_file(): raise SystemExit('Missing audio: ' + key)
data = {'ASSETS': assets, 'STORY': story, 'VOICES': voices}
dump = lambda obj: json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')
(ROOT / 'data.js').write_text('window.SEAM_DATA=' + dump(data) + ';\n')
embed = lambda path, mime: 'data:' + mime + ';base64,' + base64.b64encode((ROOT / path).read_bytes()).decode()
embedded = {'ASSETS': {k: embed(v, 'image/webp') for k,v in assets.items()}, 'STORY':story,
            'VOICES': {k: {**v, 'src':embed(v['src'], 'audio/mpeg')} for k,v in voices.items()}}
page = (ROOT / 'index.html').read_text().replace('<link rel="stylesheet" href="player.css">', '<style>'+(ROOT/'player.css').read_text()+'</style>')
page = page.replace('<script src="data.js"></script><script src="player.js"></script>', '<script>window.SEAM_DATA='+dump(embedded)+';\n'+(ROOT/'player.js').read_text()+'</script>')
(ROOT / 'dist').mkdir(exist_ok=True)
(ROOT / 'dist/index.html').write_text(page)
files = sorted(list((ROOT/'assets').rglob('*.webp'))+list((ROOT/'audio').glob('*.mp3')))
inventory = [{'path':str(f.relative_to(ROOT)), 'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in files]
(ROOT/'asset-manifest.json').write_text(json.dumps(inventory,indent=2)+'\n')
print(f'Built split runtime and standalone: {len(assets)} images, {len(voices)} voice cues; {len(files)} hashed assets.')
