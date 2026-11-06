"""An original sketch cue for the Seam, composed in code for this project (no third-party melody), rendered with
FluidSynth and the FluidR3 GM SoundFont (MIT licence, Debian package fluid-soundfont-gm).
Night: 6/8, D major, a lullaby that leans on a borrowed minor iv before it comes home. Dawn: the same tune, brighter.
   python3 compose.py outdir   (needs mido; fluidsynth on PATH)"""
import sys, subprocess, pathlib, mido
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
N = {n: i for i, n in enumerate('C C# D D# E F F# G G# A A# B'.split())}; N.update({'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10})
def p(s):  # 'F#4' -> midi
    name, octv = s[:-1], int(s[-1]); return 12 * (octv + 1) + N[name]
E = 240  # ticks per eighth (480 per quarter)
MEL = [  # (note, eighths) — 6 eighths a bar
 [('A4',3),('F#4',1),('G4',1),('A4',1)], [('B4',2),('A4',1),('F#4',3)], [('E4',1),('F#4',1),('G4',1),('A4',2),('D5',1)], [('C#5',3),('A4',3)],
 [('B4',3),('G4',1),('A4',1),('B4',1)], [('C5',2),('B4',1),('A4',3)], [('G4',1),('F#4',1),('E4',1),('D4',2),('F#4',1)], [('E4',6)],
 [('A4',3),('F#4',1),('G4',1),('A4',1)], [('B4',2),('D5',1),('A4',3)], [('G4',2),('Bb4',1),('A4',3)], [('D4',6)]]
CH = ['D','Bm','Em','A', 'G','C','D','A', 'D','G','Gm','D']
INTRO = ['D','Bm','G','A']
TONES = {'D':['D','F#','A'],'Bm':['B','D','F#'],'Em':['E','G','B'],'A':['A','C#','E'],'G':['G','B','D'],'C':['C','E','G'],'Gm':['G','Bb','D']}
COUNTER = [None,None,None,None, ('D4',6),('E4',6),[('F#4',3),('G4',3)],('A4',6), None,None,[('Bb3',3),('C#4',3)],('D4',6)]
def track(mid, prog, chan, events, vol=100):
    t = mido.MidiTrack(); mid.tracks.append(t)
    t.append(mido.Message('program_change', program=prog, channel=chan, time=0)); t.append(mido.Message('control_change', control=7, value=vol, channel=chan, time=0))
    t.append(mido.Message('control_change', control=91, value=70, channel=chan, time=0))
    ev = sorted([(s, 1, n, v) for s, d, n, v in events] + [(s + d, 0, n, 0) for s, d, n, v in events])
    now = 0
    for at, on, n, v in ev:
        t.append(mido.Message('note_on' if on else 'note_off', note=n, velocity=v, channel=chan, time=at - now)); now = at
def cue(name, tempo, melody_prog, extra):
    mid = mido.MidiFile(ticks_per_beat=480); meta = mido.MidiTrack(); mid.tracks.append(meta)
    meta.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(tempo))); meta.append(mido.MetaMessage('time_signature', numerator=6, denominator=8))
    bars = INTRO + CH; bar = 6 * E
    harp, bass, mel, cnt, glk, pad = [], [], [], [], [], []
    for b, c in enumerate(bars):
        s = b * bar; tones = TONES[c]; root = tones[0]
        # Harp: rolling eighths, root-fifth-third-octave, the last bar held.
        pat = [root + '3', tones[2] + '3', tones[1] + '4', root + '4', tones[2] + '4', tones[1] + '4']
        for i, n in enumerate(pat if b < len(bars) - 1 else pat[:4]): harp.append((s + i * E, E * (2 if b == len(bars) - 1 else 1) + 60, p(n), 58 + (8 if i == 0 else 0)))
        # Pizzicato bass on the dotted-quarter pulse.
        bass.append((s, 2 * E, p(root + '2'), 82)); bass.append((s + 3 * E, 2 * E, p(tones[2] + '2'), 70))
        pad.append((s, bar, p(tones[0] + '3'), 40)); pad.append((s, bar, p(tones[1] + '3'), 36)); pad.append((s, bar, p(tones[2] + '3'), 36))
    for b, notes in enumerate(MEL):
        s = (len(INTRO) + b) * bar; t = 0
        for n, d in notes: mel.append((s + t * E, d * E - 20, p(n), 86)); t += d
        c = COUNTER[b]
        if c:
            seq = c if isinstance(c, list) else [c]; t = 0
            for n, d in seq: cnt.append((s + t * E, d * E - 30, p(n), 64)); t += d
    for b in (7, 11, 15):  # a glint at the ends of phrases
        s = b * bar + 3 * E; glk.append((s, 3 * E, p('A5'), 54)); glk.append((s + E, 2 * E, p('D6'), 48))
    track(mid, 46, 0, harp, 92); track(mid, 45, 1, bass, 96); track(mid, melody_prog, 2, mel, 104); track(mid, 71, 3, cnt, 84)
    track(mid, 9, 4, glk, 70)
    for prog, chan, vol, which in extra: track(mid, prog, chan, {'pad': pad, 'mel': [(s, d, n + 12, v - 20) for s, d, n, v in mel]}[which], vol)
    f = OUT / f'{name}.mid'; mid.save(f)
    wav = OUT / f'{name}.wav'
    subprocess.run(['fluidsynth', '-ni', '-g', '0.7', '-R', '1', '-C', '1', '-r', '44100', '-F', str(wav), SF2, str(f)], check=True, capture_output=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'afade=t=in:d=0.4,areverse,silenceremove=start_periods=1:start_threshold=-60dB,afade=t=in:d=1.5,areverse,loudnorm=I=-23:TP=-3', '-b:a', '160k', str(OUT / f'{name}.mp3')], check=True)
    wav.unlink(); print(name, 'ok')
cue('seam-night-sketch', 63, 8, [])                                   # celesta melody; harp, pizzicato, clarinet, glockenspiel
cue('seam-dawn-sketch', 74, 73, [(48, 5, 58, 'pad'), (8, 6, 70, 'mel')])  # flute melody, strings pad, celesta an octave up
