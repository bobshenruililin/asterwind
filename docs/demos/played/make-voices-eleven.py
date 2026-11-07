"""Render the played scripts with ElevenLabs (Eleven v4, audio tags) into voices/eleven/, by the same cue keys as
voices/v2, so a scene can be heard both ways: scene.html?ep=slides&voices=eleven.

    python3 make-voices-eleven.py --list-voices            print the account's voices (name, id) to choose a cast
    python3 make-voices-eleven.py [ep ...] [--takes 3]     render; picks a take per line, keeps the others for review

Setup (Bob): an ElevenLabs plan that allows commercial use (Starter, $6/month at the time of writing). In our cloud
session the key is saved through the secure credential form and injected by the proxy; the key never goes in the repo
or in this file. Locally, set ELEVEN_API_KEY. Fill voices/eleven-cast.json with voice ids (character -> id).

Cost guide: all six scripts are about 8,500 characters; three takes each is about 25,500 characters (about $2 at
$0.08 per 1,000 characters, the listed v4 API rate). Check the current rate before running."""
import sys, os, json, re, time, pathlib, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / 'voices' / 'eleven'; CAST = HERE / 'voices' / 'eleven-cast.json'
API = 'https://api.elevenlabs.io/v1'; MODEL = os.environ.get('ELEVEN_MODEL', 'eleven_v4')
KEY = os.environ.get('ELEVEN_API_KEY', 'injected-by-proxy')  # a placeholder: the session proxy replaces it


def call(path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None, method='POST' if body else 'GET',
                                 headers={'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' if body else 'application/json'})
    return urllib.request.urlopen(req, timeout=120).read()


def lines(ep, s):
    parts = ['setup', *s['branches']]
    for part in parts:
        for i, b in enumerate(s['setup'] if part == 'setup' else s['branches'][part]):
            yield (b['id'] if ep == 'standup' else f'{part}-{i}'), b
    if s.get('lesson'): yield 'lesson', {'speaker': '', 'line': s['lesson'], 'direction': 'calm, warm storyteller, unhurried'}


def tagged(b):
    """Eleven v4 reads short bracketed audio tags; the script's direction becomes one, the words stay exact."""
    d = (b.get('direction') or ('calm, warm storyteller' if not b.get('speaker') else '')).split(';')[0].strip()
    return (f'[{d}] ' if d else '') + b['line']


def main(args):
    if '--list-voices' in args:
        for v in json.loads(call('/voices'))['voices']: print(v['voice_id'], v['name'], v.get('labels', {}))
        return
    takes = int(args[args.index('--takes') + 1]) if '--takes' in args else 1
    eps = [a for a in args if not a.startswith('--') and not a.isdigit()] or ['standup', 'slides', 'scope', 'pixel', 'ship', 'seam']
    cast = json.loads(CAST.read_text()); man = json.loads((OUT / 'manifest.json').read_text()) if (OUT / 'manifest.json').exists() else {}
    for ep in eps:
        s = json.loads((HERE / 'scripts' / f'{ep}.json').read_text()); (OUT / ep).mkdir(parents=True, exist_ok=True); man.setdefault(ep, {})
        for key, b in lines(ep, s):
            if not b.get('line') or b.get('black'): continue
            who = b.get('speaker') or 'Narrator'; vid = cast.get(ep, {}).get(who) or cast.get('*', {}).get(who)
            if not vid: print('no voice for', ep, who); continue
            for t in range(takes):
                f = OUT / ep / (f'{key}.mp3' if t == 0 else f'{key}.take{t + 1}.mp3')
                if f.exists(): continue
                f.write_bytes(call(f'/text-to-speech/{vid}?output_format=mp3_44100_128', {'text': tagged(b), 'model_id': MODEL}))
                print(ep, key, who, f.name, flush=True); time.sleep(.3)
            man[ep][key] = f'{ep}/{key}.mp3'
            (OUT / 'manifest.json').write_text(json.dumps(man, indent=1))


if __name__ == '__main__':
    main(sys.argv[1:])
