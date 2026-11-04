# After Hours art slots

Every visual layer of the corridor journey has a code-native placeholder in `hub/art.js`, drawn on fixed templates. Delivered paper art replaces a placeholder through `hub/art/manifest.js` without code changes. A slot that fails to load keeps its placeholder.

| Request | Slot in `manifest.js` | Template | Notes |
| --- | --- | --- | --- |
| ART-AH-01 | `machine.face`, `machine.interior` | `templates/machine-guide.svg|webp` (1200×2000) | Face needs transparent window (80,428→860,1540) and chute (140,1612→800,1836) holes. Interior has no drinks. |
| ART-AH-02 | `drinks.<id>.sealed|open|empty` | `templates/drink-<id>-guide.svg|webp` (960×2080), sheet `drinks-guide` | Base line y 2000, centre x 480, transparent cameo hole (magenta). The story frame shows through the hole. |
| ART-AH-03 | `corridor.portrait`, `corridor.dawn`, `corridor.portraitDawn` | `hub/assets/corridor.webp` | Dawn plates cross-fade with progress, so they must register exactly with the night plate. |
| ART-AH-04 | `hand.back`, `hand.front` | — | Optional. Not wired yet; slot reserved. |
| ART-AH-05 | `machine.side` | `templates/side-guide.svg|webp` (600×2000) | Background of the turned side; folds, latch and table stay HTML. |
| ART-AH-06 | `clips.<id>` | — | Proposed. Silent clip ending exactly on the story's first frame. The still reveal is the fallback. |

To integrate: save the inspected WebP derivative under `hub/art/<group>/`, put its path (relative to `hub/`) in the slot, run `python3 hub/build.py`, and check the composed scene at desktop and 390 px portrait. Keep the original PNG and record provenance next to it. Regenerate guides after changing geometry: `node hub/art/make-guides.cjs`.
