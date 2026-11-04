# After Hours art slots

Every visual layer of the corridor journey has a code-native placeholder in `hub/art.js`, drawn on fixed templates. Delivered paper art replaces a placeholder **layer by layer** through `hub/art/manifest.js` (schema 2) without code changes. Each slot is probed on its own; a slot that fails to load keeps its placeholder. Requests and acceptance checks: [docs/AFTER-HOURS-ASSET-REQUESTS.md](../../docs/AFTER-HOURS-ASSET-REQUESTS.md).

Timing (every beat a layer takes part in, and what a clip may replace) is in [docs/AFTER-HOURS-CONTRACTS.md](../../docs/AFTER-HOURS-CONTRACTS.md).

Nothing is a flattened picture. The machine's face, interior and glass, each drink's body and each opening part stay separately controllable, so light, parallax, fog, the dispense, the six opening rituals and the empties keep working when paper art lands.

## Machine (1200×2000, straight-on, no perspective)

| Slot | Request | Content | Holes / bounds |
| --- | --- | --- | --- |
| `machine.face` | ART-AH-01 | Cabinet front: marquee, display strip (kept plain, the clock is HTML), keypad, knob area (kept plain, the knob is a control), maker plate, feet, card edges | Transparent window 80,428→860,1540 and chute 140,1612→800,1836 |
| `machine.interior` | ART-AH-01 | Back wall, tube light, two shelves at y 960 and 1500, chute well. **No drinks, no coils** | Full canvas; only the window and chute areas show |
| `machine.glass` | ART-AH-01 | 780×1112 overlay for the window: reflections, grime, a crease of light. Mostly transparent | Drawn over the drinks, under the cursor fog |
| `machine.side` | ART-AH-05 | Turned side panel, 600×2000 | Folds, latch and table stay HTML |

Template: `templates/machine-guide.svg|webp`. For a single material study, use the alignment bench `hub/qa/align.html` (served locally) to register it to the template and export candidate face/glass/interior crops. Exports are for review only.

## Drinks (960×2080 per drink, base line y 2000, centre x 480)

| Slot | Content |
| --- | --- |
| `drinks.<id>.body` | Vessel and label with a **transparent cameo hole** (template magenta); mouth drawn **open**; **no closure**. Required for layered mode. |
| `drinks.<id>.parts.<part>` | One transparent cut-out per opening part, cropped to its box below, or `{src,x,y,w,h}` to use a different box. All of a drink's parts are required for layered mode. |
| `drinks.<id>.opened` | Optional full-canvas remnants after opening (torn seal stubs, slack string, swung bail, wax crumbs). |
| `drinks.<id>.empty` | Optional drained vessel, opened, with the cameo hole, for the roof. Without it the roof uses the vector empty. |

Parts and their boxes (x, y, w, h in template pixels). The rituals pivot on these boxes, so a cut-out must fill its box the way the vector part does:

| Drink | Closure | Parts |
| --- | --- | --- |
| `seam` | cap | `cap` 386,652,188,160 · `seal-l` 392,800,88,42 · `seal-r` 480,800,88,42 |
| `standup` | tab | `tab` 436,574,88,38 |
| `slides` | wax | `wax` 434,780,96,168 (the gold dasher spout belongs to the body; small wax fragments stay code-drawn) |
| `scope` | swing-top | `stopper` 418,548,124,108 · `bail` 388,598,184,206 (pivots at 480,770) |
| `pixel` | crown | `crown` 410,756,143,78 |
| `ship` | cork | `cork` 434,638,92,140 · `string` 406,636,192,256 |

Rules enforced by `Art.layersFor` and `hub/test-art-states.cjs`: layered mode needs the body and every part; sealed shows body plus parts; open shows body plus optional remnants and never the parts; empty never falls back to a full bottle. The story frame always shows through the cameo hole. Schema-1 `sealed/open` whole-bottle keys are ignored.

Templates: `templates/drink-<id>-guide.svg|webp`, sheet `drinks-guide`. Regenerate after geometry changes: `node hub/art/make-guides.cjs` (WebP needs sharp; SVG always). Registered stand-ins rendered from the vector art: `node hub/qa/make-standins.cjs` (QA only, untracked).

## Corridor and later slots

| Slot | Request | Notes |
| --- | --- | --- |
| `corridor.portrait`, `corridor.dawn`, `corridor.portraitDawn` | ART-AH-03 | Dawn plates cross-fade with progress, so they must register exactly with the night plate. |
| `hand.back`, `hand.front` | ART-AH-04 | Optional. Not wired; slot reserved. |
| `clips.<id>` | ART-AH-06 | Proposed. Silent clip ending exactly on the story's first frame. The still reveal is the fallback. |

## Integrating a delivery

1. Save the inspected WebP derivative under `hub/art/<group>/` and keep the original and its provenance next to it.
2. Screen it first without committing a manifest change: write a candidate manifest JSON and run `ART_MANIFEST=candidate.json node hub/qa/journey.cjs art-candidate` with the repository served on port 8731. Inspect the screenshots at 1440×900 and 390×844.
3. Put the paths (relative to `hub/`) into `manifest.js`, run `python3 hub/build.py`, then `node hub/qa/journey.cjs art,routes,mobile,offline`.
4. Record acceptance against the request ID. Delivery is not automatic visual approval.
