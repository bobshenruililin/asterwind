"""Directed scratch performances for the played scripts (scripts/<ep>.json), rendered locally with Qwen3-TTS
(Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice, Apache-2.0) from each line's acting direction. Writes
voices/v2/<ep>/<key>.mp3 and voices/v2/manifest.json. Each take is checked: Whisper must hear the scripted words;
a take that drifts is re-rendered once, then flagged in qa/voice-report.json for a human to hear.

    python make-voices-v2.py [ep ...]      (needs qwen-tts, torch, soundfile, faster-whisper, librosa, ffmpeg)

These are stand-ins. They replace nothing a person records: team recordings and any paid service plug into the same
cue keys (see docs/VOICES-2026-11-07.md)."""
import sys, json, re, time, pathlib, subprocess, tempfile
import numpy as np, torch, soundfile as sf, librosa
from qwen_tts import Qwen3TTSModel
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / 'voices' / 'v2'; REPORT = ROOT / 'qa' / 'voice-report.json'
CAST = {  # one voice per person within a story; You and the narrator are the same voice everywhere
 '*': {'You': 'eric', '': 'uncle_fu'},
 'standup': {'Theo': 'ryan', 'Nia': 'serena', 'Ellis': 'aiden'},
 'slides': {'Kit': 'ryan', 'Asha': 'sohee', 'Visitor': 'vivian'},
 'scope': {'Inez': 'serena', 'Sam': 'ono_anna', 'Bo': 'aiden'},
 'pixel': {'Jo': 'sohee', 'Remy': 'vivian'},
 'ship': {'Dev': 'ryan', 'Lio': 'serena', 'Visitor': 'ono_anna'},
 'seam': {'Mara': 'vivian', 'Julian': 'aiden'}}
NARRATOR = 'A calm, warm storyteller, quiet and unhurried, setting the scene for a friend.'
HUMAN = ' Speak naturally, like a real person in the room, not an announcer.'
BATCH = int(next((a.split('=')[1] for a in sys.argv if a.startswith('--batch=')), 4))
words = lambda s: re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('’', "'")).split()


def wer(ref, hyp):
    r, h = words(ref), words(hyp); d = np.arange(len(h) + 1)
    for i in range(1, len(r) + 1):
        prev, d[0] = d.copy(), i
        for j in range(1, len(h) + 1): d[j] = min(prev[j] + 1, d[j - 1] + 1, prev[j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(h)] / max(1, len(r))


def lines(ep, s):
    if ep == 'standup':
        for part in ['setup', *s['branches']]:
            for b in (s['setup'] if part == 'setup' else s['branches'][part]): yield b['id'], b
    else:
        for part in ['setup', *s['branches']]:
            for i, b in enumerate(s['setup'] if part == 'setup' else s['branches'][part]): yield f'{part}-{i}', b
    if s.get('lesson'): yield 'lesson', {'speaker': '', 'line': s['lesson']}  # the narrator reads it as the reflection opens


def main(eps):
    torch.set_num_threads(4)
    tts = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice', device_map='cpu', dtype=torch.float32, attn_implementation='sdpa')
    asr = WhisperModel('small.en', device='cpu', compute_type='int8')
    man = json.loads((OUT / 'manifest.json').read_text()) if (OUT / 'manifest.json').exists() else {}
    rep = json.loads(REPORT.read_text()) if REPORT.exists() else {}
    for ep in eps:
        s = json.loads((ROOT / 'scripts' / f'{ep}.json').read_text()); (OUT / ep).mkdir(parents=True, exist_ok=True)
        man.setdefault(ep, {}); rep.setdefault(ep, {})
        todo = []
        for key, b in lines(ep, s):
            text = (b.get('line') or '').strip()
            if not text or b.get('black'): continue
            if man[ep].get(key) and (OUT / ep / f'{key}.mp3').exists() and '--redo' not in sys.argv: continue  # keep existing takes
            who = b.get('speaker') or ''; voice = CAST.get(ep, {}).get(who) or CAST['*'].get(who) or 'aiden'
            ins = NARRATOR if not who else (b.get('direction') or 'natural, sincere').rstrip('.') + '.' + HUMAN
            todo.append((key, who, voice, ins, text))
        # Lines render in batches: on a CPU the model is memory-bound, so several lines cost little more than one.
        for i in range(0, len(todo), BATCH):
            chunk = todo[i:i + BATCH]; t = time.time()
            ws, sr = tts.generate_custom_voice(text=[c[4] for c in chunk], language=['English'] * len(chunk), speaker=[c[2] for c in chunk], instruct=[c[3] for c in chunk])
            secs = (time.time() - t) / len(chunk)
            for (key, who, voice, ins, text), w in zip(chunk, ws):
                best = None
                for attempt in range(2):
                    if attempt: t = time.time(); w = tts.generate_custom_voice(text=text, language='English', speaker=voice, instruct=ins)[0][0]; secs = time.time() - t
                    y = librosa.resample(np.asarray(w, dtype=np.float32), orig_sr=sr, target_sr=16000)
                    heard = ' '.join(x.text.strip() for x in asr.transcribe(y, beam_size=5)[0]); e = wer(text, heard)
                    if best is None or e < best[0]: best = (e, w, heard, secs)
                    if e <= .12: break
                e, wav, heard, secs = best
                with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
                    sf.write(tmp.name, wav, sr)
                    # trim edge silence, gentle loudness match (-18 LUFS), mono 64 kbps
                    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp.name, '-af',
                                    'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2:LRA=11',
                                    '-ac', '1', '-ar', '44100', '-b:a', '64k', str(OUT / ep / f'{key}.mp3')], check=True)
                man[ep][key] = f'{ep}/{key}.mp3'
                rep[ep][key] = {'who': who or 'Narrator', 'voice': voice, 'direction': ins, 'text': text, 'heard': heard, 'word_error': round(float(e), 3),
                                'flag': bool(e > .12), 'seconds': round(len(wav) / sr, 2), 'render_s': round(secs, 1)}
                print(ep, key, voice, f'wer={e:.2f}', round(len(wav) / sr, 1), 's', flush=True)
                (OUT / 'manifest.json').write_text(json.dumps(man, indent=1)); REPORT.write_text(json.dumps(rep, indent=1))


if __name__ == '__main__':
    main([a for a in sys.argv[1:] if not a.startswith('--')] or ['standup', 'slides', 'scope', 'pixel', 'ship', 'seam'])
