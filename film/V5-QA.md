# V5 interaction safety patch

Preserves V4 story, art, audio and timing. No aesthetic rewrite or paid generation.

## Changes
- Captions remain on when temporary voice is off. Turning temporary voice off restores captions; playback rejection also restores captions.
- Production notes are a labelled modal with background inert, single-button Tab containment, Escape dismissal, focus restoration and pause/resume state preservation.
- An unobtrusive notes button makes the modal reachable during playback.
- Begin and choice commit move keyboard focus to Pause. Completion moves it to Replay.
- Hiding the browser tab while notes are open cancels automatic resume.

## Tests
Automated regression: both branches, single commit, untimed choice, replay, dialogue/audio windows, pause/resume, hidden-tab pause, prior narrative semantics, caption safeguard, modal state/focus, prior-paused preservation and choice/end focus all pass.
Real browser: caption-off attempt with voice off retained captions and displayed explanation; opening notes paused the film and added inert to controls; Tab stayed on close button; Escape closed, restored originating notes control and resumed.
Audio remains synthetic optional timing guidance, default off, not acted dialogue. No fresh subjective listening verification. No physical mobile or screen-reader test. Story/art unchanged from V4; full-route browser story review not repeated for this functional patch.

Additional verification: real-browser decision focused the first action, Enter on Repair committed once and moved focus to visible Pause. Automated rejected-playback simulation restored captions. The safeguard notice now dismisses after five seconds (final one-line timeout addition tested by build/regressions, not a fresh browser reload).
