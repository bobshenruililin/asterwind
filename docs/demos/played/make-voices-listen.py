"""Scratch performances for the listening Quiet Minute (scripts/listen.json), rendered locally with the same
Qwen3-TTS voices as make-voices-v2.py, so Theo, Nia, Ellis and You sound like themselves in both versions.
Lines marked "reuse" already have takes in voices/v2/standup/ and are not re-rendered.
Writes voices/v2/listen/<id>.mp3, the 'listen' entry in voices/v2/manifest.json, and qa/voice-report.json.

    python make-voices-listen.py [--redo] [--only=L-t3,L-n3]   (needs qwen-tts, torch, soundfile, faster-whisper, librosa, ffmpeg)

Stand-ins, like every v2 take: a person's recording replaces any of them under the same id."""
import sys, re, json, time, pathlib, subprocess, tempfile
import numpy as np, torch, soundfile as sf, librosa
from qwen_tts import Qwen3TTSModel
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / 'voices' / 'v2'; REPORT = ROOT / 'qa' / 'voice-report.json'
CAST = {'Theo': 'ryan', 'Nia': 'serena', 'Ellis': 'aiden', 'You': 'eric', '': 'uncle_fu'}
HUMAN = ' Speak naturally, like a real person in the room, not an announcer.'
words = lambda s: re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('’', "'")).split()


def wer(ref, hyp):
    r, h = words(ref), words(hyp); d = np.arange(len(h) + 1)
    for i in range(1, len(r) + 1):
        prev, d[0] = d.copy(), i
        for j in range(1, len(h) + 1): d[j] = min(prev[j] + 1, d[j - 1] + 1, prev[j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(h)] / max(1, len(r))


def main():
    only = next((a.split('=', 1)[1].split(',') for a in sys.argv if a.startswith('--only=')), None)
    s = json.loads((ROOT / 'scripts' / 'listen.json').read_text())
    torch.set_num_threads(4)
    tts = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice', device_map='cpu', dtype=torch.float32, attn_implementation='sdpa')
    asr = WhisperModel('small.en', device='cpu', compute_type='int8')
    man = json.loads((OUT / 'manifest.json').read_text()) if (OUT / 'manifest.json').exists() else {}
    rep = json.loads(REPORT.read_text()) if REPORT.exists() else {}
    man.setdefault('listen', {}); rep.setdefault('listen', {}); (OUT / 'listen').mkdir(parents=True, exist_ok=True)
    for key, b in s['lines'].items():
        if b.get('reuse'):
            man['listen'][key] = f"{b['reuse']}/{key}.mp3"; continue
        if only and key not in only: continue
        if man['listen'].get(key) and (OUT / 'listen' / f'{key}.mp3').exists() and '--redo' not in sys.argv and not only: continue
        who = b.get('speaker') or ''; voice = CAST[who]; text = b['line']
        ins = (b.get('direction') or 'natural, sincere').rstrip('.') + '.' + HUMAN
        best = None
        for attempt in range(3):
            t = time.time(); w, sr = tts.generate_custom_voice(text=text, language='English', speaker=voice, instruct=ins); w = w[0]; secs = time.time() - t
            y = librosa.resample(np.asarray(w, dtype=np.float32), orig_sr=sr, target_sr=16000)
            heard = ' '.join(x.text.strip() for x in asr.transcribe(y, beam_size=5)[0]); e = wer(text, heard)
            if best is None or e < best[0]: best = (e, w, heard, secs)
            if e <= .1: break
        e, wav, heard, secs = best
        with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
            sf.write(tmp.name, wav, sr)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp.name, '-af',
                            'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2:LRA=11',
                            '-ac', '1', '-ar', '44100', '-b:a', '64k', str(OUT / 'listen' / f'{key}.mp3')], check=True)
        man['listen'][key] = f'listen/{key}.mp3'
        rep['listen'][key] = {'who': who or 'Narrator', 'voice': voice, 'direction': ins, 'text': text, 'heard': heard, 'word_error': round(float(e), 3),
                              'flag': bool(e > .12), 'seconds': round(len(wav) / sr, 2), 'render_s': round(secs, 1)}
        print(key, voice, f'wer={e:.2f}', round(len(wav) / sr, 1), 's', 'render', round(secs), 's', flush=True)
        (OUT / 'manifest.json').write_text(json.dumps(man, indent=1)); REPORT.write_text(json.dumps(rep, indent=1))
    (OUT / 'manifest.json').write_text(json.dumps(man, indent=1))


if __name__ == '__main__':
    main()
