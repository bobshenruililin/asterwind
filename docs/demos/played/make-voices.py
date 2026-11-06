"""Scratch voices for The Quiet Minute, played. Lines are the film's own (anthology/episodes/standup/story.json).
Kokoro-82M ONNX (Apache-2.0)."""
import sys, json, pathlib, subprocess, soundfile as sf
from huggingface_hub import hf_hub_download
from kokoro_onnx import Kokoro
dest = pathlib.Path(sys.argv[1]); dest.mkdir(parents=True, exist_ok=True)
L = {'qm-01': ('Theo', 'Main gate, courtyard, then the harbour. Everyone happy?'), 'qm-02': ('Nia', 'The courtyard gate closes...'),
     'qm-03': ('Theo', "We'll be through by then."), 'qm-04': ('Nia', 'We arrive after it closes.'), 'qm-05': ('You', "We haven't heard the whole route yet."),
     'qm-r1': ('You', "One concern each. No replies until we've gone around."), 'qm-r2': ('Nia', 'The gate will be shut. We need to reach the courtyard first.'),
     'qm-r3': ('Ellis', "Mine starts here. But we'd lose the harbour."), 'qm-s1': ('You', "Put down the concern you haven't said. Then we'll sort them together."),
     'qm-s2': ('You', 'Then we leave the courtyard out?'), 'qm-s3': ('Nia', 'Not cancel the courtyard. Go there first.'), 'qm-s4': ('You', 'Thank you. I read that too quickly.')}
CAST = {'Theo': ('am_michael', .95, 'en-us'), 'Nia': ('af_heart', .95, 'en-us'), 'Ellis': ('bm_lewis', .88, 'en-gb'), 'You': ('bf_emma', .92, 'en-gb')}
k = Kokoro(hf_hub_download('onnx-community/Kokoro-82M-v1.0-ONNX', 'onnx/model_quantized.onnx'), 'voices.npz')
dur = {}
for cid, (who, text) in L.items():
    v, sp, lang = CAST[who]; a, sr = k.create(text, voice=v, speed=sp, lang=lang); sf.write('tmp.wav', a, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'tmp.wav', '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-20:TP=-2', '-ar', '44100', '-ac', '1', '-b:a', '80k', str(dest / f'{cid}.mp3')], check=True)
    dur[cid] = round(len(a) / sr, 2)
print(json.dumps(dur))
