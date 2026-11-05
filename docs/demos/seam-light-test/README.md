# The Seam: light test (rough review demo)

A review tool for the Creative Exchange ([note](../../EXCHANGE-OPUS-2026-11-05.md)). It is **not** the approved film, it is not part of any build or offline export, and nothing in it is approved story or art.

## What it tests

1. **Hold the Light.** Can holding the lamp make the player present?
   - The setup plays by itself while the light follows the speaker; move it and it's yours.
   - The choice is made by setting the light on one rib.
   - During the work you hold the light steady (press and hold, Space, or a toggle). Let go and the lamp sags and the work waits. After 8 s without input, Ren holds it anyway.
   - Morning takes the light away.
2. **The three-shot edit.** Cut A is Robert's *Hold it there*, as written. Cut B is my *Where the light goes*. Both use the same stills, so only the edit differs.

## Sources and provenance

- **Images:** the existing Seam stills in `film/assets/`, under their existing provenance. The night look is a CSS grade, and the light pool is a CSS mask that reveals the original plate. The plates are already lit from a fixed lamp, so the moving light is a known cheat until relit pairs arrive.
- **Lines:** only approved lines, verbatim from `film/story.json`. No line is added or changed. Where the backup route shows the causal problem, it plays the approved lines on purpose.
- **Voices:** the existing flite timing guides in `film/audio/`, off by default (the **Temp voices** button). They are not performances.
- **All other sound:** synthesised in the page with Web Audio (room tone, paper creak, wrap, lamp swing, fan, louvre flutter). No recorded or third-party audio. Levels were measured offline; they have not been checked by ear.

## Run it

Serve the repository root over HTTP:

```bash
python3 -m http.server 8731 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8731/docs/demos/seam-light-test/`.

Controls:
- Pointer: move to steer the light; press and hold on the picture to hold.
- Keyboard: arrow keys steer the light, Tab reaches the two choices, Space holds.
- Shot notes: toggle the director's notes on each shot.

Reduced motion keeps the camera still and moves the light instantly.

## Render the review videos

```bash
node docs/demos/seam-light-test/render.cjs [outDir] [only]
```

The renderer steps the same runner frame by frame at 24 fps (deterministic) and renders the audio from the run's event log through an `OfflineAudioContext`. It writes a captions-only MP4 and a `-tempvoice` MP4 for each run, plus the event log and frames taken every 2 s. `renders/` is gitignored; the reviewed copies live wherever the PR #1 comment points.

## Checked

- Scripted runs show no console errors.
- Keyboard-only path: Tab to the choice, Enter, hold with Space, reach the end card.
- 390×844 touch with reduced motion: tap to choose, toggle to hold; no horizontal scroll.
- With no input, the automatic hold passes the hold gate.

Not checked: a human playtest, listening by ear, phone portrait framing (16:9 is letterboxed) and screen readers.
