# Verification record

Date: 5 November 2026. Scope: this additive opening study only. This is not an audit of the existing Asterwind app, film or hub.

## Automated checks

- Inline JavaScript parses successfully with Node.
- **14 deterministic jsdom cases pass**, including all six still-shot stops; both consequential branches and repeated activation; replay; caption preference; modal pause/shortcut suppression/return focus; reduced-motion preference changes; scene-description preservation; keyboard boundaries; and arrival focus.
- At the 1.4-second material match cut, the same SVG text node, glyph definition and affine transform are retained at desktop and phone dimensions. This verifies the implementation contract, not pixel identity across operating-system fonts.
- The test suite and JSON result are in `qa/`. No production dependency is added.

## Fresh cloud Chromium observation

The local runtime was served through the supported internal preview. No Site or public deployment was created.

Observed directly in Chromium:

- Title, notebook pull-back endpoint, classroom reveal, doorway passage, stair frame and dispenser frame all render.
- The normal opening plays automatically from the user’s start gesture to its dispenser, then stops at the untimed action. Focus moves off the disabled playback control onto that action.
- The still-shot route reaches all scenes and the dispenser without time pressure.
- Both doorway branches work using the 1 / 2 keyboard shortcuts at **390×844, 320×812 and 667×375** iframe viewport sizes.
- Both branches return to their different notebook annotations. Revisit reopens the choice without selecting an answer.
- The small-screen figures, controls, choice wording, ending text and return buttons were inspected after responsive fixes. `qa/viewports.html` makes these layouts reproducible.
- The moving “take the other end” consequence completes its automatic return to the notebook and focuses Revisit.
- Pause/resume updates its control while retaining the SVG’s meaningful scene description. Optional captions render.
- Native About opens and Escape closes it, returning focus to its initiating control in the phone viewport.

Captured browser evidence:

- `qa/desktop-notebook.jpg`
- `qa/desktop-discovery.jpg`
- `qa/responsive-choice.jpg`
- `qa/responsive-endings.jpg`

These are real browser screenshots. The portrait/short frames are iframe viewport checks, not physical-device or touch testing.

## Defects found and fixed during this pass

- A CSS opacity rule overrode the scene controller and hid later sets.
- Still shots could retain a fully opaque transition mask.
- Pause announcements overwrote the accessible scene description.
- Automatic arrival could leave focus on a disabled control.
- Portrait cropping cut essential notebook text and part of a figure.
- Narrow controls and short-height choice controls could overlap.
- Ending buttons had poor contrast on the notebook paper.

The independent state audit and browser pass were rerun after the relevant repairs.

## Remaining limits

- No physical phone, Safari, Firefox, screen reader or reduced-motion operating-system session was tested. Reduced motion was tested through the visible still-shot control in Chromium and a simulated media query in jsdom.
- The standalone file is structurally self-contained. The cloud browser disallows `file:` navigation, so browser QA used HTTP; literal file-protocol playback was not browser-verified.
- A direct headless Chromium launch failed under the environment’s socket restrictions. The supported internal preview and existing cloud browser provided the successful visual checks instead.
- Browser extension metadata errors appeared in the developer log; no runtime-origin JavaScript error was observed in the inspected log slice. This is not a proof that all possible browser errors are absent.
- No human-paced rehearsal, accessibility certification, film-quality approval or location-faithfulness claim is made.
- The stair perspective, schematic characters and simple movement remain rough staging. Final art, character performance, sound and verified real geography need a separate pass.
- No integration or regression tests against production Asterwind are claimed, because this study does not change or invoke it.
