# Frontend review handback

Copy this into the draft PR description and update it as the branch changes. Keep conclusions tied to the exact tested revision.

## Change and decision

- **Player-facing result:**
- **Scope / surfaces changed:**
- **Base SHA / current head / exact tested SHA:**
- **Design reason:**
- **Decision or feedback requested:**

## Evidence

- **Before / after images:** Label viewport, state, story/branch and commit. Check that screenshots show the actual final code.
- **Playback reviewed:** Episodes, both outcomes, browser/version, desktop/portrait sizes and offline export
- **Checks:** List each command with passed, failed, blocked or not run. Include the meaningful failure, not only a success summary.
- **Interaction checks:** Keyboard/focus, pointer/touch targets, captions, pause/replay, reduced motion, repeated activation, Return, Back/Forward, retry, reload and cleanup
- **State checks:** Completion only at a real ending, stale/forged messages ignored, storage failure fallback, saves preserved, six-fold coda
- **Source and fallback checks:** Story/consent/agency unchanged, original media retained, attribution preserved, missing-art behavior
- **Runtime cost:** Added bytes/dependencies/network calls, if any; explain rather than quietly introducing them

## Remaining work

- **Known limitations:** Distinguish untested claims from observed defects. Browser emulation is not a physical-device or screen-reader review.
- **Asset requests:** IDs and links; playable fallback for each pending item
- **Conflicts / shared files:** Any overlapping edits to registry, progression, hub or story modules
- **Next step and owner:** One concrete action, or ready for the requested review

Keep the PR in draft during work. Report useful findings or blockers in the PR conversation with the exact commit and requested decision. Address review feedback in a new commit and rerun affected checks. Do not self-approve, merge, enable auto-merge, deploy or treat lack of reply as acceptance. A GitHub post is a durable handoff, not proof that another contributor has seen it.
