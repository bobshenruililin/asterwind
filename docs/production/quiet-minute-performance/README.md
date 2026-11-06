# Quiet Minute performance transfer

This is a director's review kit, not a second game, a selected visual style, or import-ready animation. Open `index.html` directly to compare two new three-pose acting studies. The viewer is offline, has no dependencies, makes no network requests, and moves only when a review button is pressed.

The aim is to transfer the strongest lesson from The Last Light performance pass: spend visual detail on a legible action and its response, not on decorative scene motion. These studies use the existing paper cast as continuity references. Claude's living miniature / pixel / painterly audition remains the style decision. No app runtime or existing image was changed.

## What the two studies contribute

- **Turn the table:** Theo prepares an answer, notices Nia is still speaking, and puts his hand down. The token remains near Nia. He is curious, not defeated. This is the existing `wait` beat made visible, not a new moral lesson.
- **Pass the slips:** Nia notices a misreading and points precisely to the courtyard gate. The lead receives the correction with an open palm, and Theo adds his sketch. Nobody is humiliated. A separate slip is retained to carry the intended unresolved ending; its meaning still needs dialogue.
- Both branches receive matching warmth, character scale, facial detail, three poses, and expressive hands. This is deliberate parity of production attention, not a claim that the methods produce identical results.
- Keep essential dialogue. A gesture alone cannot distinguish “go there first” from “remove it.” Preserve the unfinished harbour in the round ending and the unclear slip in the slips ending. These close studies are not substitutes for those ending shots or Ellis's alternative contribution.

## Smallest useful production request

Once the chosen audition camera and style are locked, request assets against its exact reference rather than compositing these sheets:

1. Theo: listening torso; inhale with finger starting to lift; mouth closed with hand returning. Same seat, eye line, scale and light, plus a clean background behind him.
2. Nia: speaking with token; precise gate-pointing hand and arm; correction expression. Keep her confident rather than frightened, and preserve the bob/cardigan identity.
3. Lead: held pointing gesture and relaxed open palm, with contact anchors registered to the model/tray.
4. Ellis: pencil pause and alternative route placement; do not let the two new studies erase this third voice.
5. Consequence inserts: harbour components visibly unfinished for round; one unresolved slip for slips. Equal readable area, not a brightness-coded verdict.

Each asset delivery should identify alpha status, source camera, scale, origin, hand-contact anchors, occlusion order, pose bounds, and which exact beat consumes it. Generate a proper background clean plate before hiding or moving a baked-in person. Alpha puppets over unchanged plates would produce doubled hands and the pasted-on look we are trying to avoid.

## Timing and interaction

The existing source has 28.5-second branches. Round's “Theo starts an answer, then leaves the speaking token with Nia” lasts 4 seconds. Slips has separate misread (3.5s), correct (5s), and acknowledge (4s) beats. The viewer presents poses, not a claimed animation at those timings.

Stage the central choice as an untimed physical action. Both a direct click and a semantic keyboard button must work; dragging can enrich the gesture but must never be required. A hand touching the model/tray, a visible change of ownership, and the other person's response carry meaning better than another explanatory label. Do not show consequences as pre-choice hover previews.

For a layered renderer, separate gaze, mouth, torso, and active hand when possible. A brief inhale, interrupted hand impulse and settle can be more communicative than large idle bobbing. Freeze at meaningful pose endpoints during pause. Reduced motion should preserve those endpoint poses and the same story information without camera travel or inertia.

## Candidate video use, not a purchase request

If later authorized, test only two matched **5-second locked-camera** shots, one per branch: Theo's impulse-to-listening beat, and Nia's correction-to-acknowledgment beat. Use selected-style start/end frames, no camera move, no text, no added props, stable fingers and eye lines. Review both before ordering any sequence. Do not spend video credits on the untimed interactive choice or a moving full-room plate that cannot remain registered with its controls. No video was generated or credits spent for this kit.

## Asset provenance and limits

Generated with the built-in image tool on 2026-11-06; full prompts are `round-prompt.txt` and `slips-prompt.txt`. Inputs are the repo's own `03-turn-shared-unfinished.webp` and `04-slips-nuance-unresolved.webp` in `anthology/episodes/standup/assets/reference-v1/`. Their provenance is documented there. No external code, sounds, or character assets were copied.

- `assets/round-acting-study.png`: 2172 × 724, three panels.
- `assets/slips-acting-study.png`: 2164 × 727, three panels.
- Preserve these originals. Panels have slight camera, hand and model drift; the round final finger lands beside the gate rather than precisely on it. They are useful acting references and rough animatic poses, not interchangeable registration frames or an atlas.
- The slips study's first pose has a surprised expression. Keep the final performance calm and precise rather than playing correction as distress. The final sketch is a contribution, not proof all uncertainty is solved.
- No selected pixel or painterly style is implied by these paper-continuity studies.

## Checks and concrete baseline risks

Run from the repository root:

```
node docs/production/quiet-minute-performance/qa/test-viewer.cjs
node docs/production/quiet-minute-performance/qa/audit-geometry.cjs
node anthology/episodes/standup/test-quiet.cjs
```

The source audit initially inspected `8d06d6ce748c433f9bf4e4f75939680e54fecc2a`; `git diff` verifies the entire standup episode is identical in the `fa072db189dbf5997fbccd67e1225859f7f49d4c` base of this branch. It does not cover Claude's uncommitted audition. See `qa/quiet-minute-audit.md` for exact analytical geometry and a browser acceptance list.

Most important: current portrait endings at 375 × 812 crop out both Nia's and Ellis's faces. The existing split-mode layout test has no hitboxes to inspect, so passing it is not evidence of real portrait choice geometry. Address these in the new stage rather than carrying the assumptions over.

Images were visually reviewed; PNG headers and viewer controls were tested in Node. Browser rendering, real keyboard/screen-reader behavior, device performance and Claude's new audition have not been verified here. Earlier browser results for other builds do not cover this kit.

Independent review of both images and the viewer found no publication blocker for this labelled study. Nine viewer checks pass; analytical target bounds pass across 11,750 scene-mode viewports. The repository film/anthology/hub builds and regression suite also pass on this branch. These remain source/mock/geometry checks, not browser or device acceptance.
