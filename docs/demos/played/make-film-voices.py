"""Scratch voices for the films played through scene.js: every spoken line of each episode's story.json, unchanged,
keyed <ep>-<part>-<index>. Kokoro-82M ONNX (Apache-2.0). Usage (from a venv with kokoro-onnx):
  python make-film-voices.py <repo-root> <voices.npz>"""
import sys, json, pathlib, subprocess, soundfile as sf
from huggingface_hub import hf_hub_download
from kokoro_onnx import Kokoro
root = pathlib.Path(sys.argv[1]); dest = root / 'docs/demos/played/voices'; dest.mkdir(parents=True, exist_ok=True)
CAST = {'You': ('bf_emma', .92, 'en-gb'), 'Ren': ('bf_emma', .92, 'en-gb'), 'Asha': ('bf_isabella', .92, 'en-gb'), 'Kit': ('am_puck', .95, 'en-us'), 'Visitor': ('bm_george', .95, 'en-gb'),
        'Inez': ('af_nicole', .93, 'en-us'), 'Sam': ('am_adam', .95, 'en-us'), 'Bo': ('bm_fable', .92, 'en-gb'), 'Jo': ('af_bella', .95, 'en-us'), 'Remy': ('am_michael', .95, 'en-us'),
        'Dev': ('am_adam', .93, 'en-us'), 'Lio': ('af_heart', .95, 'en-us')}
k = Kokoro(hf_hub_download('onnx-community/Kokoro-82M-v1.0-ONNX', 'onnx/model_quantized.onnx'), sys.argv[2])
n = 0
for ep in ['slides', 'scope', 'pixel', 'ship']:
    st = json.loads((root / f'anthology/episodes/{ep}/story.json').read_text())
    parts = [('setup', st['setup'])] + list(st['branches'].items())
    for part, beats in parts:
        for i, b in enumerate(beats):
            who, text = b.get('speaker'), b.get('line', '')
            if not who or not text: continue
            v, sp, lang = CAST.get(who, ('bm_george', .95, 'en-gb'))
            say = text.replace('—', '...').replace('’', "'").replace('“', '').replace('”', '')
            a, sr = k.create(say, voice=v, speed=sp, lang=lang); sf.write('/tmp/_v.wav', a, sr)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/_v.wav', '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-20:TP=-2', '-ar', '44100', '-ac', '1', '-b:a', '72k', str(dest / f'{ep}-{part}-{i}.mp3')], check=True)
            n += 1
print('rendered', n)
