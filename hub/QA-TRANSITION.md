# Transition revision: evidence and limits

Mac browser inspection of preview v1 found: one-click entry worked, other drinks were previews, double-click launched once, first Back worked, Return focus restored, keyboard outline visible, real macOS Reduce Motion skipped transition, images loaded and both viewports fit. It also found defects. That version was not visually approved.

Code repairs following those observations:
- Dispenser control is below the film controls on portrait/mobile and at bottom-left on desktop, avoiding Pause.
- Return/reopen destroys and recreates the iframe; src/srcdoc are configured before attachment, not removed from an attached browsing context. This avoids extra child-frame navigation and stale load handlers.
- Shelf tabs are 12 px and use short The Seam / Preview labels. Can lettering reserves lid space; mobile cabinet is larger and decorative subtitles are hidden.
- The opening's portrait framing prioritizes Julian's active hand and the canopy, with a matching reveal crop. Later shots keep their authored framing. This crop is an adapter stylesheet, not a change to film source or story.
- Failure hides the iframe and has opaque backing. Retry and Return are local controls; no unavailable standalone relative-film fallback.
- Return remains visible and usable during unfolding.

Fresh dependency-free tests pass readiness barriers, no hidden autoplay, duplicate selection, timeout/retry, stale loads, transition cancellation, fresh iframe identity after Return/reopen, Back teardown and reduced motion. Syntax and offline export pass.

These fixes have NOT been browser-retested. Previous testing stopped after the worker clarified a file-URL security-policy denial; its subsequent HTTP route had not adequately resolved that prohibition. No further alternate browser route is authorized or used. Do not claim corrected layout, mobile crop, actual Back/Forward or screen-reader behavior passed. Screenshots from before repairs exist only on the Mac; they are historical evidence, not final screenshots. No screenshot upload succeeded.

## Independent static-review corrections

The reveal image, frame host, loading state, error panel and Return now share one isolated screen stacking context, in that back-to-front order. Return no longer sits below a sibling portal despite a larger child z-index. Cabinet width/position follow one continuous formula across all viewport widths; 700/701 px now produce 630/630.9 px rather than the previous cliff. Short windows may scroll the lobby instead of crushing touch targets.

Each can and lid shares a wrapper; a separate 30 px shelf row is reserved and stays still during dispensing. Duplicate legacy CSS overrides were removed. `node hub/test-layout.cjs` checks hierarchy, formula continuity from 320 through 1800 px, target bounds and wrapper structure. These are structural/math assertions, not rendered-pixel or browser proofs. Post-fix visual verification remains pending.
