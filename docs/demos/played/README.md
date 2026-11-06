# Played scenes: the living miniature

The films' own photographed-paper plates, made playable. You decide by moving an object in the picture, and the people react before anyone speaks. The reasons are in `docs/DIRECTION-2026-11-06.md`.

## Open

Serve the repository root (`python3 -m http.server 8000`), then:

| Page | What it is |
| --- | --- |
| `index.html` | **The Quiet Minute**, played and staged by hand: puppet handles, the platter that turns, the slips tray, Ellis's route (an optional look) |
| `scene.html?ep=slides` | **The Missing Name** (microphone / notebook) |
| `scene.html?ep=scope` | **One More Chair** (chair / return slot) |
| `scene.html?ep=pixel` | **The Empty Square** (catches / second panel) |
| `scene.html?ep=ship` | **Before the Doors Open** (crank / projector) |
| `pixel.html` | The pixel-art audition of the same beat (comparison only) |

The draft night (`docs/demos/unfolded/?v=2`) embeds these pages. Add `&session=<id>` to a URL and the page posts the episode contract (`asterwind.episode.v1`: `ready`, then `completed` with an outcome from `anthology/registry.json`).

## Files

- `stage.js`: the WebGL1 renderer, with no dependencies. It handles depth parallax, puppet warps, a rotating disc region, a sliding region, lamp, rain, depth of field, a depth-aware dissolve, the hover rim, vignette and grain.
- `quiet.js`: The Quiet Minute's timeline, gestures and endings. Its test hook is `window.QM`.
- `scene.js`: the generic adapter. It reads an episode's `story.json`, `art-manifest.json` and the decision regions copied from its `layout.js`. Its test hook is `window.FILMPLAY`.
- `plates/`: depth maps (`make-depth.py`, Depth Anything V2 Small). The plates themselves load from `anthology/` and aren't copied.
- `voices/`: scratch voices (`make-voices.py`, `make-film-voices.py`, Kokoro-82M).
- `PROVENANCE.md`: sources and licences.

## Controls

- **Pointer:** drag or tap the lit object.
- **Keyboard:** Tab to an object, then Enter.
- Captions are on by default, with a toggle.
- Pause suspends all sound.
- Reduced motion stills the camera drift and breathing, and shortens every move.

## Checks (repo served on 8731)

```bash
node docs/demos/played/qa/films.cjs http://127.0.0.1:8731/ <outdir> fast
```

```bash
node docs/demos/played/qa/keyboard.cjs
```

```bash
node docs/demos/played/qa/night-v2.cjs <outdir>
```

## Placeholders

- **Objects move as image regions.** They'll move as true layers once Robert's P0 clean plates and object layers land (`docs/ROBERT-PRODUCTION-BRIEF-2026-11-06.md`).
- **Acting:** only The Quiet Minute has puppet handles so far.
- **Optional looks:** only The Quiet Minute has one so far.
- **Voices** are scratch until the team records them.
- **The 3:00 AM Seam** isn't converted yet. It still plays as its film.
