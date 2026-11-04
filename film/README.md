# The Seam: Asterwind's film pilot

Start with `film/index.html` (or serve the repository and open `/film/`). All art/audio are local; there is no API, paid generation, account, backend service or remote dependency. `python3 film/build.py` rebuilds the split browser runtime and an offline, self-contained `film/dist/index.html`.

This is the delivered V5 story and art, integrated into the repository without replacing `app/` or the nine workbook scenarios. Ren leads an architecture-studio team through one untimed decision. The two possible aftermaths have different costs; neither receives a moral score. This is original fiction developed from Aragon's proposal, not a reenactment of real classmates or a direct Q5 adaptation.

## Edit without losing the film

- `story.json`: shot order, dialogue, cue timing, framing, two action labels, branch endings.
- `index.html`: minimal semantic stage and accessible controls.
- `player.js` / `player.css`: playback and full-bleed presentation.
- `assets/`: 14 optimized runtime frames; `assets/reference/`: three visual references.
- `audio/`: 28 optional synthetic timing cues with exact text and duration manifests. Off by default. These are not acted voices.
- `source/`: preserved story development and attribution, not runtime files.
- `asset-manifest.json`: hashes for all 45 image/audio files.
- `data.js`: generated from sources. Do not hand-edit.
- `dist/`: generated offline export. Do not commit duplicate embedded media.

The builder uses only Python's standard library, never reaches outside this folder and never silently regenerates approved images. All required media must exist or the build stops.

## Verification

Run `python3 film/build.py`, then `node film/test-state.cjs`. Browser test: serve repository on port8768 and run `node film/qa/browser.cjs`; set FILM_URL / CHROMIUM_PATH if needed. See `REPOSITORY-QA.md` for current results and limits.

## What is actually finished

The playable illustrated animatic has automatic setup/consequences, exactly one consequential choice, untimed decision, replay, pause, keyboard access, portrait choice composition, caption/voice safeguards and notes modal. It is not completed character animation. Natural recorded performances, continuous character movement and audience-tested pacing remain production work. No new paid media or publication occurred in this integration.

The audience's job is to notice the two legitimate needs, choose an action and witness what that action does not settle. For course presentation, discuss who carried its cost and what a follow-up conversation should change. Do not claim validated learning outcomes.
