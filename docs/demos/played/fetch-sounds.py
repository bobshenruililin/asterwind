"""Download the CC0 scene sounds in sound-shortlist.json (found through Openverse; hosted by Freesound) and prepare them
for the played scenes: mono, trimmed, loudness-matched MP3s in sound/, plus sound/PROVENANCE.md.

Run this on your own machine: Freesound's CDN refuses requests from our cloud session (HTTP 403 from the site).
    python3 docs/demos/played/fetch-sounds.py          (needs ffmpeg)

Every file is CC0 (no attribution required); we credit the creators anyway. Listen before committing: pick, trim or
replace anything that doesn't fit the scene, and note it in PROVENANCE.md."""
import json, pathlib, subprocess, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / 'sound'; RAW = OUT / 'raw'
LOOP = {'rain window', 'cafe ambience', 'audience murmur', 'museum ambience', 'clock ticking', 'film projector'}


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    rows = json.loads((HERE / 'sound-shortlist.json').read_text()); prov = ['# Scene sounds: provenance', '',
        'All CC0 (public-domain dedication), found through [Openverse](https://openverse.org) and hosted by Freesound.', '']
    for r in rows:
        name = r['query'].replace(' ', '-'); raw = RAW / (name + pathlib.Path(r['file']).suffix)
        if not raw.exists():
            req = urllib.request.Request(r['file'], headers={'User-Agent': 'Asterwind student project (sound scout)'})
            raw.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        dur = '40' if r['query'] in LOOP else '6'  # loops: 40 s with a fade at each end; one-shots: first 6 s
        af = f'atrim=0:{dur},afade=t=in:d=0.4,areverse,afade=t=in:d={1.5 if r["query"] in LOOP else 0.3},areverse,loudnorm=I={-30 if r["query"] in LOOP else -20}:TP=-2'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(raw), '-af', af, '-ac', '1', '-ar', '44100', '-b:a', '80k', str(OUT / (name + '.mp3'))], check=True)
        prov.append(f'- **{name}.mp3**: "{r["title"]}" by {r["creator"]} (CC0), {r["landing"]}. Used in {r["scenes"]}: {r["use"]}.')
        print('ok', name)
    (OUT / 'PROVENANCE.md').write_text('\n'.join(prov) + '\n')
    (OUT / 'manifest.json').write_text(json.dumps({'files': sorted(p.stem for p in OUT.glob('*.mp3'))}, indent=1))


if __name__ == '__main__':
    main()
