# Scope paper-shot integration

Five inspected image-generated plates now supply the runtime, with explicit per-beat camera focus and branch ownership in `art-manifest.json`. They depict fictional university-age students in the original repair-café scenario. Original PNGs are retained in the authoring workspace at `assets/reference-v1` and in Space; this commit includes compressed runtime assets rather than duplicating the source PNGs. compressed WebP derivatives under `assets/runtime` preserve their 1672×941 dimensions. Runtime conversion changes encoding only, not composition. The master and capacity derivatives use the separately generated **no-clock** edits. Deadlines appear accurately in dialogue/captions; there is no clock insert pretending to match generated hands.

## Visual meaning

- Master establishes Inez/lamp, Bo/umbrella, Sam/torn bag and Ren's position between spare capacity and promises already made.
- Capacity moves closer to occupied hands and the waiting student's need.
- Decision is a first-person view of two real objects. Neither outcome is revealed before choice.
- Extend consequence shows the repaired bag alongside Ren's unfinished umbrella. It is used only after choosing extend.
- Return consequence shows the appointment card, still-torn bag, finished umbrella and unused chair. It is used only after choosing return.

These are edited still shots with short dissolves and changes of framing, not matched-motion frames, performed voice acting or completed stop-motion video. The original SVG remains an offline/error fallback and an editable source. A failed/missing image or eight-second preload timeout falls back to that whole vector treatment, including its own target layout, instead of mixing incompatible hotspot geometry. Essential captions and the same single untimed choice remain available.

## Interaction geometry

Landscape targets are projected from the inspected decision plate's 1672×941 coordinates through `cover` scaling. They are deliberately generous and separate: chair left, card box right. For aspect ratios below 1.35, the choice uses two edge-to-edge object closeups from that same plate as a split-screen composition. This avoids letting portrait `cover` crop both interactive objects out of view. Labels identify the two physical actions, not moral outcomes. Keyboard focus, semantic accessible names and at least 44px targets remain. Reduced motion uses cuts and no framing interpolation.

## Verification and limits

`node anthology/test-art.cjs` checks branch art ownership, coverage of all story beats, landscape target bounds/separation, portrait split activation, offline embedding and asynchronous preload success/failure/timeout. Existing anthology and hub regressions also pass. Original/edited source plates were viewed directly. **The assembled browser interface has not been visually inspected**; the existing browser-security restriction was respected. Phone composition, touch behavior and actual dissolve quality still need permitted visual QA before publication. No paid video generation was used.
