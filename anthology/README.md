> Current lineup: **The Seam**, **One More Chair** and **The Quiet Minute**, **Before the Doors Open** and **The Missing Name** are playable prototypes. Dead Pixel Tonic remains clearly in development. Run `python3 anthology/build-all.py` before the hub exporter.

> Paper-shot update: five inspected generated plates now drive Scope, including distinct outcomes. Original vector artwork remains a fallback. Shots dissolve/cut; they are not generated video or matched animation frames. Current visual integration notes: `episodes/scope/ART-INTEGRATION.md`.

# Original anthology foundation

This adds **One More Chair / Scope Creep Fizz**, an original fictional leadership story. It is not from, or a replacement for, Amanda and Hannah's source workbook. The Seam remains untouched. The registry has six intended drinks; Seam, Scope, Standup, Ship and Slides currently run. Dead Pixel Tonic remains an outlined pitch, not a finished episode.

## What runs

`python3 anthology/build.py` produces `anthology/dist/scope.html`, a self-contained review file with vector paper artwork, camera framing, five opening beats, an untimed two-action choice and two five-beat consequences. It needs no external service or asset. `python3 hub/build.py` now includes that episode alongside the previously built `film/dist/index.html`.

Scope launches from the existing Fizz can. It enters without Seam's studio bridge: that asset belongs to another location. The existing can lineup is retained rather than pretending four new films are ready. Return/retry/Back tear down and recreate the episode. Only actual ending completion records progress. Opening a can and choosing an action do not count as finishing.

## Story and tradeoff

A student repair café has three booked repairs before the hall closes. A late arrival needs a bag for placement tomorrow. Taking the bag now requires the lead to take over an unfamiliar umbrella repair; the bag is finished, but the umbrella misses its promised time and the lead must own that cost. Protecting the booked work keeps the deadline, but leaves the newcomer with a loan-bag option and a concrete return appointment rather than a repaired bag. Neither branch is labelled good or bad. The question is not whether compassion or boundaries win: it is whether a leader makes capacity and consequences visible, then follows through.

The branch specifics are authored fictional outcomes, not claims that these actions always produce these results. A full production pass should add visibly changing props, expressive performance and checked voice acting. This is a **captioned vector animatic**, not a finished animated film. The composed native SVG deliberately avoids recycling Seam characters or labelling generated raster assets as new work.

## Episode interface

Registry `schemaVersion:1`; each entry has a stable ID, drink, title, origin and honest status. Playable entries declare entry path, adapter and allowed outcomes. Existing Seam uses its legacy adapter. New modules expose `window.__asterwindEpisode = {id, version:1, start(), state}`. Parent starts only after load/bridge readiness.

New modules emit `postMessage({channel:'asterwind.episode.v1', episodeId, session, type:'ready'|'completed', outcome?})`. Parent validates the exact iframe source, live session token and active episode; completion additionally validates outcome against the registry. These messages contain no secrets. For embedded offline `srcdoc`, the parent injects the session before script execution; hosted routes receive it as a query parameter. Return invalidates old sessions.

`progress.js` keeps versioned, allowlisted local completion sets. Malformed, inaccessible or quota-exhausted storage does not stop play. The in-memory record still works. No identities, timestamps, analytics, virtue points or psychological ratings. No reset button or destructive save migration. No meta-puzzle is falsely claimed complete. Seam completion is deliberately not inferred from opening/choosing; it still needs an explicit legacy completion adapter.

## Verification

`node anthology/test-anthology.cjs`: both branches, one untimed choice, pauses, repeats, malformed actions, corrupt/denied storage, idempotence, forged/stale message rejection and offline export.

`node hub/test-state.cjs` preserves existing transition/lifecycle coverage. These are source/state tests, **not rendered browser verification**. A known browser security denial remains respected; no loopback workaround was used. Narrow-screen composition and physical-target alignment require permitted visual QA before release. The mobile layout supplies large semantic action targets, but has not been visually approved. Captions remain visible because no reliable recorded dialogue is yet included. There is no spend, publication, dependency install or account change in this addition.
