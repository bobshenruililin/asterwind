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
