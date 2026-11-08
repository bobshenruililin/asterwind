# Played scenes: the living miniature

The films' own photographed-paper plates, made playable. Each scene opens with a short intro and who's who, plays its people's lines, and asks one question you answer by moving an object in the picture. It ends with a reflection on what your choice kept and what it cost.

The reasoning is in `docs/DIRECTION-2026-11-06.md` (the style) and `docs/SCENARIOS-2026-11-07.md` (the stories, voices and learning).

## Open

Serve the repository root (`python3 -m http.server 8000`), then:

| Page | What it is |
| --- | --- |
| `listen.html` | **The Quiet Minute, listened** (8 Nov; the night opens this one). Who you turn to gets the floor, then turn the table / pass the slips, then the morning's notes. Design: `docs/QUIET-MINUTE-LISTEN-2026-11-08.md` |
| `index.html` | **The Quiet Minute**, 7 November played version (turn the table / pass the slips), staged by hand with puppet acting and Ellis's route close-up |
| `scene.html?ep=slides` | **The Missing Name** (move the microphone / show the notebook) |
| `scene.html?ep=scope` | **One More Chair** (pull in the spare chair / offer the return-slot box) |
| `scene.html?ep=pixel` | **The Empty Square** (lower the console / connect the panel). Lived-experience review pending. |
| `scene.html?ep=ship` | **Before the Doors Open** (run it live / play the rehearsal) |
| `scene.html?ep=seam` | **The 3:00 AM Seam** (fit the spare / repair together) |
| `qa/voices.html` | Every voice take with its direction and what Whisper heard (review only) |

**URL options:**
- `?voices=eleven` (or `team`) plays a scene with another voice set;
- `?p2=0` turns off Ellis's close-up;
- `?clips=<shot>:<file>` previews a generated clip.

The draft night (`docs/demos/unfolded/?v=2`) embeds these pages. With `&session=<id>`, a page posts the episode contract (`asterwind.episode.v1`: `ready`, then `completed` with an outcome from `anthology/registry.json`).

## Files

- **`scripts/<ep>.json`:** the played script for each story:
  - the intro and cast, with tag positions on the opening plate;
  - lines with stages and acting directions;
  - the question;
  - the reflections (kept / cost / ask) and one lesson.

  The episode's `story.json` still owns the choice ids and outcomes.
- **`story.js`, `story.css`:** the intro, the question and the reflection card.
- **`stage.js`:** the WebGL renderer. It handles depth parallax, puppet warps, object layers (a clean plate, a turning disc, a sliding layer, an occluder), lamp, rain, depth of field, a depth-aware dissolve, the hover rim, vignette and grain. A 2D fallback keeps the story visible without WebGL.
- **`listen.html`, `listen.js`, `listen.css`, `scripts/listen.json`:** the listening Quiet Minute. The script holds every line, who says it, the rules of the floor (`listen`), what each line lets you know (`fact`), the choice labels and the morning notes. Test hook: `window.LISTEN` (`state`, `attend`, `commit`, `step`, `until`, `setPause`, `manual`, `log`).
- **`fonts/`:** Newsreader and IBM Plex Mono, local, OFL (`fonts/PROVENANCE.md`). Used by the listening episode, the story UI and the night's opening card.
- **`make-voices-listen.py`:** the listening episode's new lines, in the same local Qwen3-TTS voices (`voices/v2/listen/`).
- **`quiet.js`:** The Quiet Minute (7 Nov), sequenced from its script with puppet actions. Test hook: `window.QM`.
- **`scene.js`:** every other story, The Seam included, adapted from its own files. Test hook: `window.FILMPLAY`.
- **`plates/`:** depth maps (`make-depth.py`) and object layers (`make-layers.py`, `make-film-layers.py`).
- **`voices/v2/`:** scratch takes for the scripts (`make-voices-v2.py`: Qwen3-TTS, checked with Whisper; report in `qa/voice-report.json`). `voices/eleven/` comes from `make-voices-eleven.py` when an ElevenLabs key exists. The old `voices/*.mp3` belong to the old lines and only play without a script.
- **`sound/`:** recorded scene sound once downloaded (`fetch-sounds.py`, from `sound-shortlist.json`). Only files in `sound/manifest.json` are requested.
- **`clips.js`:** the slot for generated motion (`clips/manifest.json`).
- **`PROVENANCE.md`:** sources and licences.

## Controls

- **Pointer:** drag or tap the lit object.
- **Keyboard:** Tab to an object, then Enter. The intro's button and the reflection's buttons are ordinary buttons.
- Captions are on by default, with a toggle.
- Pause suspends all sound.
- Reduced motion stills the camera drift and breathing, and shortens every move.

## Checks (repo served on 8731; one at a time)

```bash
node docs/demos/played/qa/listen.cjs <outdir>
```

```bash
node docs/demos/played/qa/story.cjs <outdir>
```

```bash
node docs/demos/played/qa/films.cjs http://127.0.0.1:8731/ <outdir> fast
```

```bash
node docs/demos/played/qa/layers.cjs <outdir>
```

```bash
node docs/demos/played/qa/keyboard.cjs <outdir>
```

```bash
node docs/demos/played/qa/night-v2.cjs <outdir>
```

## Still placeholder

- **Voices** are scratch until we choose Eleven v4 or record our own.
- **Recorded scene sound** arrives when `fetch-sounds.py` is run on a laptop.
- **One More Chair's decision frame** crops its people's heads, so nobody turns toward your hand there.
- **The Seam** has no landscape clean plate yet, so its objects move as image regions.
- **The Empty Square** needs its lived-experience review.
