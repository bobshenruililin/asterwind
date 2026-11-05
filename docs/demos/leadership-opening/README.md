# Leadership, unfinished

An additive, original **blocking and interaction study**, not finished film art or a replacement for the Asterwind opening. It is deliberately separate from `app/`, `film/` and `hub/`.

Open `index.html` in a modern browser. The entire runtime is that one file: inline SVG, CSS and JavaScript, with no build, account, network, fonts, assets or storage required. A static server also works. The `qa/` folder and `package.json` are development-only and can be omitted when sharing the playable file.

## What works

- One persistent SVG “Leadership” text object. At 1.4 seconds, its material changes from cream lettering to ink without changing the glyph definition or its transform. The notebook then pulls back around it.
- A roughly 25-second, user-started opening: word → notebook → look up → leave the classroom → stairway → dispenser. Timing is authored, not a measured audience-completion claim.
- One optional, untimed original doorway scene. Hold the door, leaving the fragile model in its carrier’s hands, or take the other end and change its balance. Each gesture has a different visible consequence.
- The notebook returns with an action-specific pencil question. “Leadership” stays a heading; no correct-answer signal, score or personality judgement appears.
- Pause, previous/next shot, replay, optional captions, keyboard choice, a native About dialog, and user-selectable still shots. Still shots default on for `prefers-reduced-motion: reduce` and never advance automatically. Hiding the tab pauses playback.
- Narrow portrait framing and a short-screen notebook close-up. All essential action wording remains semantic HTML. The SVG supplies an equivalent scene description.

## Creative boundaries

Every classroom, stairway, corridor, person and dispenser here is an original stylized placeholder. **None depicts HKU or a verified campus route.** There are no photographs, real students or identifiable personal details. Real location references can replace the invented sets only after their geography and usage are checked.

The coda is an **original concept, not a source-workbook question**. Its consequences are authored possibilities rather than measured educational or psychological results. It exists to test the move from a fixed definition into a lived, ambiguous action. It can be dropped if the final opening should hand directly to the established dispenser.

This is silent, modest SVG staging with simple camera and cut-paper motion. It is not finished character performance, a 3D environment, generated film, or final Asterwind art direction. No paid media service was used. No existing runtime was modified or connected to this study.

## Timing / replacement seams

| Opening clock | Beat | Main SVG group |
| --- | --- | --- |
| 0–1.4 s | The word | `wordAnchor`, `titleSet` |
| 1.4–5.4 s | Material match cut, notebook pull-back | `notebook`, same `wordAnchor` |
| 5.4–9.3 s | Look up | `classroom` |
| 9.3–12.4 s | Door / leave class | `classroom`, `doorLeaf` |
| 12.4–17.3 s | Downward stair study | `stairs`, `stepFlight` |
| 17.3–25 s | Notice the dispenser | `corridor`, `machine` |
| Untimed | Enter the optional paper story | HTML `enterScene` |
| Untimed | Hold the door / take the other end | `choiceSet`, semantic HTML actions |
| 7.2 s after a choice | Consequence and return | branch geometry, `annotations` |

The steep stair perspective is a timing/blocking placeholder and should be re-boarded against the actual descent reference. The entire camera route should be reviewed as an edit, rather than treating the invented geometry as continuous real space.

A later alternative could return the word against dark paper after a story, using the screen as a metaphorical reflective pause. It would not be an actual mirror, would not require a camera, and should retain an accessible textual reflection route. This alternative is not implemented here.

For later integration, preserve the match cut’s common text node and equal transform at the cut, but replace subsequent scenery and the final `enterScene` action with the approved opening/hub contract. Do not copy this study over the production opening or assume it implements its history, audio, completion or return protocols.

## Controls

- Tab / Enter: semantic controls.
- Space: pause/resume when a focused button is not handling its normal activation.
- Left / Right: previous/next opening shot. Right also continues from a still consequence to the notebook.
- R: replay from the word.
- 1 / 2: the two doorway gestures, only while that choice is active.
- Escape: close About. Closing leaves the film paused.

“Try the other gesture” reopens the same untimed choice. It does not secretly select the other branch, accumulate a score, or preserve a previous answer.

## Development and verification

No dependencies are needed to play. The DOM tests need Node and development-only `jsdom` 26.1.0. With that dependency available, run:

```sh
npm test
# Or use an existing dependency installation:
NODE_PATH=/path/to/node_modules node qa/state-tests.cjs
node qa/state-tests.cjs --write-results
```

The tests check state and DOM contracts, not rendered glyph pixels or screen-reader behavior. `qa/viewports.html` presents actual 390×844, 320×812 and 667×375 iframe viewports for manual browser inspection. See [QA.md](QA.md) for the observed coverage, repaired defects and remaining limits.

## Provenance and delivery scope

Created on 5 November 2026 as a separate original contribution. The existing repository’s contributor instructions and creative handoff were read. The inspected integration base was `claude/awesome-hypatia-6bf97q` at `b90d47790076d4c1e131aef3aa7d6ab9471b5144`.

All new files are confined to `docs/demos/leadership-opening/`. No prior story text, images, generated media, fonts, workbook content or source history is copied into the playable file. Repository visibility and hosting settings are not changed by this contribution.
