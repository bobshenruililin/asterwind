# Verification — Asterwind nine-scene build

## Real browser, final app
All **36** source-option branches completed through the supported Sites managed preview, controlled through CUA. Each option's source text, distinct possible consequence and workbook feedback were captured to `evidence/final-branches.json` and compared with the authoritative JSON: **36/36 match, 36 distinct consequences**. This was rerun after final application logic changes.

Additional real UI checks:
- Q5 A/C two-choice adaptation; Q3 optional contrast with all four responses.
- Keyboard Enter and numeric selection, Tab with visible dashed focus.
- Double-click choice guard; replay of a different option.
- Neutral skip without response; reflection and continuation.
- Pause then About then close retains pause state.
- Reduced-motion toggle sets effective preference true and computed reveal animation to `none`; system-preference integration inspected in source, not OS-emulated.
- Reload then Continue resumes chosen feedback. Browser Back returns Q1 reflection from Q2; Forward returns Q2 intro.
- Scrollable full source notes at 320×568, including keyboard access to lower C/D options.
- Actual 1366×768, 390×844, 320×568 iframe viewports (same app, same CSS/media queries); primary browser viewport 1180×757. These are browser viewport tests, not physical-device tests.
- Standalone 10.7 MB HTML loaded through preview and reached Q5C feedback; no external script or stylesheet nodes. All images/fonts statically embedded.
- App-origin console error list empty. The browser extension emitted metadata errors; these are not application errors.

All nine rendered background crops were captured and compared against all nine delivery images; every scene was decisively closest to its matching image. See evidence/scene-backgrounds.json. Settled arrival was recaptured after explicitly clearing the reveal curtain when returning home.

Visual defects fixed during QA: missing system-font glyphs replaced with SVG/CSS drawn marks; white scrollbar tracks replaced with warm paper colors. Background and Q5 image remain full-bleed. No synthetic screenshot substitutes.

## Screen capture
`Asterwind-Actual-Playthrough.mp4`: 300 screenshots sampled from the real browser during arrival → Q5 setup → choice → selected response → reflection. Screenshot capture timestamps are retained. FFmpeg encodes the frames with actual observed intervals (13.8 seconds, no fabricated acting). It is a demonstration of interaction and authored camera/paper motion, not a classroom timing rehearsal or generated video. Frames are not included in the source ZIP to keep it small.

## Separate isolated state tests
`node qa/state-tests.cjs` passes all 36 branches and additional state invariants using a minimal DOM adapter. This is separately identified, never substituted for visual/browser evidence.

## Remaining limits
- Literal network-disabled/file:// execution cannot be tested with this cloud browser (file protocol is blocked). Folder assets exist; standalone embeds required bytes and loaded successfully via HTTP. User browser/file-viewer behavior and local file storage vary.
- Clip slots are deliberately empty. No rendered clip playback or failure integration test was possible without adding test media. Missing slots use verified stills. Future video requires its own QA.
- No physical mobile device, screen-reader session, or measured classroom rehearsal.

## Reproducibility
The CUA tests used `sites-preview start` and the exact returned preview URL. The final branch loop selected each of four HTML `[data-choice]` buttons for each scene, waited for `#response`, read its consequence and opened Workbook perspective, then reflected/replayed/continued. The JSON is actual captured rendered text.

For a browser-capable local executor, `qa/browser-qa.cjs` is an additional reproducible test script. It was supplied, not executed here: direct Chromium launch is infrastructure-blocked. `scripts/standalone.cjs` rebuilds the self-contained HTML. Both require Node; browser script also requires Playwright and Chromium. No dependency installation is needed to play the app.

## 1 November 2026 — guided-route revision

- Isolated DOM-adapter tests exercised all 36 unchanged source branches, both Q5 quick choices, the explicit three-hour hypothetical, reflection and closing, no-choice skip, replay, resume and a history-state restoration. These are logic tests, not browser layout tests.
- The original Q5 three-day scenario and all 36 workbook options remain unchanged. The five-minute timings in the README are proposed discussion targets, not a timed rehearsal.
- Desktop browser preview was exercised through Q5, a representative choice, the consequence, hypothetical, reflection and closing. A narrow browser window at 150% zoom (333 × 505 CSS pixels) was exercised through the same route, and a 125% zoom window (400 × 606 CSS pixels) reached replay; the long opening card required internal scrolling at the smaller size. These are not exact 320/390-pixel device emulations. Hosted access was verified at the sign-in gate, not behind authentication.
