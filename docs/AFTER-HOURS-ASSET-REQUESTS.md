# After Hours: asset requests for dot

Branch `claude/awesome-hypatia-6bf97q` (Last Light on the Floor / After Hours dispenser). Opened 4 November 2026. This file is the durable request list; status lines are updated in place. Format follows [ASSET-REQUEST-TEMPLATE.md](ASSET-REQUEST-TEMPLATE.md).

## Priorities at a glance

| # | ID | What | Tool | Status | Unblocks |
| --- | --- | --- | --- | --- | --- |
| 1 | ART-AH-00 | The existing cabinet material study, committed as is | — | **delivered (review WebP), screening** — original PNG transfer pending | Registration and look test for ART-AH-01 |
| 2 | ART-AH-01 | Machine face, layered (1200×2000) | Image 2.5 | requested | The whole lobby's material read |
| 3 | ART-AH-02 | 3:00 AM Cold Brew opening pilot: body, cap, two seal halves, remnants, empty | Image 2.5 | requested | The layered drink pipeline; then the other five |
| 4 | ART-AH-03a | Dawn corridor plate registered to the night plate (1672×941) | Image 2.5 | **delivered, screened, integrated as candidate** (provenance pending) | The dawn finale's end state; K-02's last frame |
| 5 | K-01 | The Seam: the label's still breathes into the film (silent, 4–6 s) | Kling | **proposed, decide together** | A living threshold into the flagship film |
| 6 | K-02 | Dawn finale: last light leaves the floor (silent, 8–10 s) | Kling | **proposed, decide together**, needs ART-AH-03a | The ending of the whole night |

Every slot has a working placeholder, so nothing here blocks play. Exact timings and layer orders each asset must fit are in [AFTER-HOURS-CONTRACTS.md](AFTER-HOURS-CONTRACTS.md).

**Order:** ART-AH-00 (the existing study) → ART-AH-01 machine face → ART-AH-02 one drink-opening pilot, then ART-AH-03a. K-01 and K-02 are proposals for us to decide together. The queued list at the end is for planning only. The game stays fully playable on its code-native placeholders while these are pending.

**Why:** Dot's review is right that the dispenser reads flatter and more vector-like than the photographed paper-miniature corridor and stories. The machine and drinks should share the world's fibrous layered card, physical cut edges, amber practical light and indigo night fill.

**Current state, for reference** (committed screenshots, Chromium 153, code-native art):

| | |
| --- | --- |
| Lobby 1440×900 | [after-hours/2026-11-04-lobby-1440x900.webp](after-hours/2026-11-04-lobby-1440x900.webp) |
| Machine close-up | [after-hours/2026-11-04-machine-closeup.webp](after-hours/2026-11-04-machine-closeup.webp) |
| Held drink (Ship-It), opened Cold Brew | [held-ship](after-hours/2026-11-04-held-ship-1440x900.webp) · [held-seam-opened](after-hours/2026-11-04-held-seam-opened-1440x900.webp) |
| Lobby 390×844 | [after-hours/2026-11-04-lobby-390x844.webp](after-hours/2026-11-04-lobby-390x844.webp) |
| Turned side (has a known rendering defect, being fixed) | [after-hours/2026-11-04-turned-side-1440x900.webp](after-hours/2026-11-04-turned-side-1440x900.webp) |

**How delivered art is used:** every layer stays separately controllable, so light, parallax, cursor fog, the dispense, each opening ritual and the roof empties keep working. Slots, geometry and the layer rules are in [hub/art/README.md](../hub/art/README.md); templates are in `hub/art/templates/`. Please deliver to `hub/art/incoming/<request-id>/` with the original, the WebP derivative and a short `provenance.md` (tool, date, prompt or source, variants rejected and why). I register, slice and browser-test before anything enters `hub/art/manifest.js`; delivery is not automatic acceptance on either side.

**Shared look for every request** (material and light):
- **Material:** fibrous layered paperboard and card at miniature scale. Visible cut edges with card thickness (1–2 mm at model scale), faint deckle and fibre, laminated layers slightly offset so depth reads. Matte. No glossy plastic, no airbrushed vector gradients, no metallic chrome. Paint is flat gouache-like colour on card; wear shows as soft scuffs at edges.
- **Light:** amber practical from the open doorway at frame left (warm, ~2700 K, like the lamp in `hub/assets/corridor.webp`), indigo night fill from the right. The machine's left edges catch amber; its right side falls into indigo. Inside the window, the machine's own warm-white tube from the top.
- **Camera:** straight-on orthographic, no perspective, no cast shadow outside the silhouette (the game draws floor contact, parallax and the 3D turn).
- **Continuity references:** `hub/assets/corridor.webp` (the world: palette, paper grain, light direction), `anthology/episodes/slides/assets/master.webp` and `film/assets/performanceStable.webp` (paper-miniature finish of the stories), and the current palette (cabinet teal-green about `#4f6560`, marquee vellum `#f0d394`, brass `#c49a46`).
- **No essential text in images.** Decorative lettering is fine (marquee AFTER HOURS, drink labels). The clock, keypad meanings and every control stay HTML.

---

## ART-AH-00 · The first cabinet material study

- **Status:** requested (asking for the existing file, not new generation)
- **What:** the cabinet material study from Bob's chat with dot, as it is. It explores fibrous layered paperboard and warm/cool light to match the corridor.
- **Please commit:** the original file unchanged to `hub/art/incoming/ART-AH-00-cabinet-study-v1/`, plus `provenance.md` with the prompt and any notes on what it was meant to test.
- **What I will do with it:** register it against the 1200×2000 template in the alignment bench (`hub/qa/align.html`), export candidate face/glass/interior crops, screen them in the browser with `ART_MANIFEST=… node hub/qa/journey.cjs art-candidate` at 1440×900 and 390×844, and post the screenshots and a registration report here. It will not be wired into the manifest until it passes that review.
- **Dependencies:** informs ART-AH-01; does not block placeholder work.

## ART-AH-01 · Machine face (priority 1)

- **Status:** requested
- **Purpose and emotional role:** the dispenser is the warmest object in a quiet 3 a.m. corridor and the first thing a visitor touches. It should feel like a hand-built paper miniature that belongs in the same world as the corridor and the films: tactile, slightly worn, inviting. Right now it reads as a flat vector illustration pasted onto a photograph.
- **Asset:** `machine-face.png` with transparency, **1200×2000** exactly (a 2× master at 2400×4000 is welcome alongside).
- **Slot:** `machine.face` in `hub/art/manifest.js`. Template: `hub/art/templates/machine-guide.svg|webp` (shows every zone below).
- **Composition, in template pixels:**
  - Cabinet silhouette 24,24 → 1176,1904, rounded corners about r36; two feet 120,1904 → 270,1986 and 930,1904 → 1080,1986. Transparent outside the silhouette.
  - **Window hole, fully transparent:** 80,428 → 860,1540. **Chute hole, fully transparent:** 140,1612 → 800,1836. A thin card frame lip may overlap the hole edge by up to 18 px, no more.
  - Marquee 80,80 → 1120,308: vellum/cream card, lettering AFTER HOURS hand-cut or stencilled (decorative).
  - Display strip 88,336 → 1112,404: keep **plain and dark** (the clock is HTML text drawn here).
  - Keypad panel 900,450 → 1108,870 with six keys at x = 918 / 1012, y = 472 / 598 / 724, each 78×104; a small coloured dot per key in shelf order: `#e2b25c`, `#9cae98`, `#c58f7f`, `#9da6c2`, `#b1a4bc`, `#c1ac79`. HTML lights glow over these keys.
  - Coin slot 918,902 → 1090,1052. Vent lines 922 → 1088 at y 1588–1688. Maker plate 900,1730 → 1096,1788 (ASTERWIND, decorative).
  - **Knob area:** circle centre 1004,1340, r 96 — keep plain (the turning knob is a real control drawn on top).
- **Layers / transparency:** the face only. No drinks, no interior, no glass reflections, no coils (those are separate layers or code). Holes must be alpha 0.
- **Lighting and material:** as the shared look above; strongest amber rim on the left edge and marquee, indigo falloff on the right third, card edges visible at the window frame and chute surround.
- **Must preserve:** zone positions (they align with live HTML controls), the six key colours and order, the knob position.
- **Variants:** one direction is enough to start; if you explore, at most two, differing in paint colour of the cabinet card, not in layout.
- **Fallback while pending:** the current code-native face (fully playable).
- **Acceptance checks:** registers with the guide in the alignment bench (holes and zones within ±4 px); holes alpha 0; no perspective; reads as layered card at 390×844 and at 1440×900 in the composed lobby; no essential text; WebP derivative ≤ 450 KB.
- **Cost / permissions:** dot reports an unlimited Image 2.5 budget; no other service or disclosure needed.

## ART-AH-02 · One drink-opening pilot: 3:00 AM Cold Brew (priority 2)

- **Status:** requested (pilot only; the other five follow once this one passes)
- **Why this drink:** it opens the flagship story, The 3:00 AM Seam; its cameo is a plain rectangle; and its ritual (twist the cap off, tear the paper seal band in two) tests both kinds of moving part.
- **Purpose and emotional role:** the visitor catches this bottle and holds it close; opening it is the threshold into the film. The bottle should feel like a real object made of paper and card that has been in a cold machine: slightly heavy, the label a little scuffed, the cap satisfying to twist. Nothing on it may hint at either ending.
- **Assets, all on the 960×2080 drink template** (`hub/art/templates/drink-seam-guide.svg|webp`; base line y 2000, centre x 480; 2× masters welcome):
  1. `seam-body.png` — amber glass growler in the template silhouette, dark cold brew filling to about y 1010, kraft paper label with tape and the decorative words 3:00 AM / COLD BREW, **transparent cameo hole** exactly rect 316,1352 → 644,1552 (the film's first frame shows through), **mouth drawn open, no cap, no seal band**.
  2. `seam-cap.png` — the black ribbed screw cap alone, cropped to box **386,652, 188×160**.
  3. `seam-seal-l.png` and `seam-seal-r.png` — the left and right halves of the paper tamper band, each cropped to **392,800, 88×42** and **480,800, 88×42**; they tear apart at x 480.
  4. `seam-opened.png` (optional) — full-canvas transparent remnants after opening: torn band stubs at the neck, the open rim.
  5. `seam-empty.png` (optional) — the same bottle drained, opened, same cameo hole, same light; it is placed on the machine's roof after a story's real ending.
- **Slots:** `drinks.seam.body`, `drinks.seam.parts.cap`, `…parts['seal-l']`, `…parts['seal-r']`, `drinks.seam.opened`, `drinks.seam.empty`.
- **Interaction:** the whole held bottle is the button; the ritual animates each part from its box (cap twists and lifts off from its bottom centre; seal halves swing out from the tear line). Parts must fill their boxes the way the guide shows, or the pivots will be off.
- **Lighting and material:** soft warm key from upper left, indigo fill from the right; it must read both small on the shelf behind glass and large when held against a blurred corridor. Paper-miniature glass: tinted translucent card or cellophane over card, not photoreal glass.
- **Continuity:** palette and label character from the current placeholder; cameo frame from `film/assets/performanceStable.webp`.
- **Fallback while pending:** the code-native bottle. Layered mode only activates when the body and all three parts load; any missing part keeps the vector bottle, so a partial delivery is safe.
- **Acceptance checks:** `node hub/qa/journey.cjs art` with the delivered files (layers register within ±4 px, cameo hole alpha 0, ritual moves each part, open never re-shows the cap); held view at 1440×900 and 390×844; shelf view; roof empty if delivered; set ≤ 350 KB as WebP.

## ART-AH-03a · Dawn corridor plate (priority 4)

- **Status:** delivered `c57f8bf` (5 Nov, on `codex/art-ah-03a-dawn-review-20261104`), screened, **integrated as the dawn candidate** in `hub/art/manifest.js` (`hub/art/corridor/corridor-dawn.webp`). Provenance file not yet supplied — please add tool, date, prompt and references. Screening results in Responses below.
- **Purpose and emotional role:** "Last Light on the Floor." All night, the doorway's amber lamp spills across the corridor floor. When the sixth story ends, that pool of light goes out and the first daylight crosses the same floor. This plate is the room after that moment: tired, quiet, a little hopeful. Same objects, different light.
- **Asset:** `corridor-dawn.png`, **1672×941**, registered **pixel-for-pixel** with `hub/assets/corridor.webp` (the code cross-fades them; any shift reads as a jump).
- **Slot:** `corridor.dawn` (and later `corridor.portraitDawn` if we make a portrait crop).
- **Lighting:** the doorway lamp **off**; cool, low early daylight from the room beyond the door and the window (blue-grey to pale gold where it lands), a long soft shaft across the floor; the indigo wall lifts toward grey-lilac. No warm pool on the floor.
- **Must preserve:** every object, crease and position in the night plate, the paper-craft material, the door's angle, the coat and the pinned drawing. Leave the machine's area exactly as it is in the night plate (the machine is a separate layer drawn on top).
- **Fallback while pending:** the current CSS dawn grade over the night plate.
- **Acceptance checks:** pixel registration (difference view in `hub/qa/align.html` or a 50% cross-fade shows no edge doubling); reads as dawn at 1440×900 and 390×844; WebP ≤ 350 KB.

## K-01 · The Seam: the label's still breathes into the film (Kling proposal)

- **Status:** proposed, for Bob, dot and me to decide together. Not requested yet.
- **The moment:** the visitor opens the Cold Brew; the house lights go down around the bottle; the label's little photograph grows to fill the screen. Today it arrives as a still, and the film starts. The clip would make that photograph **come alive for a breath** before the film begins: the lamp's light shifts, dust drifts through it, Julian's brush lifts and taps once, Mara's eyes move to the rib. Then it settles exactly on the film's first frame.
- **Contract (already in the code):** `hub/bridge-manifest.json` → `transition: {kind:'video', src, mime, audio:'silent', stallTimeoutMs, maxPlaybackMs}` with the still as fallback. It plays after the spatial reveal and before the film starts, muted and inline; reduced motion skips it; any error falls back to the still. See `hub/VIDEO-BRIDGE.md`.
- **Shot:** locked-off, the film's own camera. 16:9 at 1920×1080 (or 1672×941), 24 fps, **4–6 s**, silent. **First and last frames must both match `film/assets/performanceStable.webp` exactly** (Kling first+last frame), so it enters from the grown still and hands off to the film without a cut.
- **Performance limits:** small, natural movement only; no new action that changes the story, no dialogue, no mouth movement, no camera move. Hands and faces must stay anatomically stable; reject any variant with morphing fingers or face drift.
- **References:** `film/assets/performanceStable.webp` (first and last frame), `film/source/DIRECTOR-TREATMENT.md` (shot 1–2 tone), the stills in `film/assets/` for identities.
- **Fallback:** the still reveal (current behaviour).
- **Acceptance:** play the whole clip in the composed reveal at 1440×900 and 390×844; check the loop-free hand-off frame; file size ≤ 4 MB; then decide whether the other five drinks get one.

## K-02 · Dawn finale: last light leaves the floor (Kling proposal)

- **Status:** proposed, decide together; depends on ART-AH-03a.
- **The moment:** the sixth empty lands on the roof. The clock flips to 06:02. The machine's tube ticks off. In the corridor the doorway lamp goes out and its amber pool on the floor drains away, and pale daylight slides in across the same boards. Silence, then the first birds.
- **Shot:** locked-off on the corridor plate, **1672×941**, 24 fps, **8–10 s**, silent. **First frame = `hub/assets/corridor.webp`, last frame = ART-AH-03a**, so it can sit in the world layer behind the machine and hand off to the dawn still.
- **Motion limits:** light only. Objects do not move, and there is no camera move. The lamp's switch-off may flicker once.
- **Contract:** a new optional `clips.dawn` slot played once in the world layer by the finale (see the dawn finale beat in [AFTER-HOURS-CONTRACTS.md](AFTER-HOURS-CONTRACTS.md)); the CSS light change is the fallback, and reduced motion skips straight to the dawn still.
- **Acceptance:** registration of the first and last frames with the plates; no flicker on the machine area; ≤ 6 MB.

---

## Queued, not yet requested

Planning only; each becomes a request after the pilot is accepted.

- ART-AH-02b · the other five drinks (Standup tab; Slide Deck wax; Scope Creep swing-top stopper and bail; Dead Pixel crown; Ship-It cork and string), same layer scheme. Part boxes are in `hub/art/README.md`.
- ART-AH-01b · `machine.interior` (back wall, tube, shelves; no drinks or coils) and `machine.glass` (780×1112 mostly transparent reflections and grime).
- ART-AH-05 · `machine.side` (600×2000 turned side panel behind the six folds).
- ART-AH-03b · a portrait corridor crop and its dawn twin (after ART-AH-03a).
- K-01b · the other five label-to-film breaths, if K-01 earns its place.

## Responses

_dot: reply below or in the delivery's `provenance.md`. I'll record registration and browser results here with the exact commit._

### ART-AH-03a screening (5 Nov, Claude)

- **File:** `corridor-dawn.webp`, 1672×941 RGB WebP, 337,874 bytes (≤ 350 KB), SHA-256 `c821e2151fa2f06aa2c4ce35e9379f5c3abe43e8a7f9843daa2f88228a847d83`.
- **Registration with `hub/assets/corridor.webp`:** best-matching shift **0, 0 px** in all seven regions measured (door frame, coat, pinned drawing, baseboard, lamp, door knob, floor papers; gradient correlation, ±8 px search). A 50% cross-fade shows no edge doubling. **Pass.**
- **Look:** lamp off, cool daylight through the window and the door's panes, a pale shaft across the floor, the wall lifted toward grey-lilac; every object in place. Matches the brief.
- **How it is used:** through the night it shows only faintly (up to 30% at five stories), so the lamp's pool keeps its warmth; at the sixth real ending it takes over across the lamp-off beat (4.2 s), replacing the coded shade and shaft. Portrait screens showing the landscape plate now get it too (a pairing bug fixed in this change).
- **Browser:** with the plate, `finale,dawn` 12/12 (candidate manifest), then wired in: `finale,mobile,offline,routes` **44/44** (Chromium 153; offline export embeds it as a data URL with no network requests).
- **Open:** provenance file; a portrait dawn twin is not needed while portrait shows the landscape plate.

