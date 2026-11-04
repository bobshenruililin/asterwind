# Optional video bridge foundation

Default remains the existing still reveal. No video asset is configured or generated, no paid service used, and no audio is added. Film content and the one consequential choice are unchanged.

`bridge-manifest.json` is the typed source (`bridge-types.d.ts`). It selects either a still or a local, reviewed MP4/WebM plus a required still fallback. A video must declare `audio: "silent"`, a 1–10 second stall watchdog and a maximum playback guard up to 60 seconds. The builder validates paths, files, extensions/MIME pairs and bounds, emits `bridge-data.js` and embeds exact `video/mp4` or `video/webm` data URLs offline. It never labels arbitrary media as WebP.

At the end of the existing spatial reveal, an optional video takes ownership of completion. The film remains unstarted until `ended`, or a still fallback after playback rejection, error, stall or maximum-duration guard. The 2.45-second still timer cannot end a running video; the iframe's 15-second loading watchdog applies only while that iframe is not ready. Video is always muted, zero-volume and inline, and is stopped/detached before film playback, avoiding competing audio. Reduced motion skips video construction entirely.

Return, retry, Back and page exit cancel media, clear its handlers/timers and invalidate late callbacks. Failures return to the existing opening still rather than blocking the leadership story. This bridge must remain decorative navigation, not the sole carrier of essential scenario context.

Tests: `node hub/test-bridge.cjs`, `node hub/test-state.cjs`, `node hub/test-layout.cjs`, `python3 hub/test-build.py`, and existing film regressions. They use mocked media events and synthetic encoder fixtures. **No real video decoding, autoplay policy, mobile media behavior or post-fix browser visual QA has been verified.** No browser workaround was attempted.
