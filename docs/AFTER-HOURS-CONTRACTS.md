# After Hours: layer and timing contracts

What delivered art, clips and sound must fit. Timings live in one table, [`hub/timing.js`](../hub/timing.js), which the journey and the story lifecycle both read; `node hub/test-contracts.cjs` fails if this page and that table disagree. Layer geometry and slots: [hub/art/README.md](../hub/art/README.md). Requests: [AFTER-HOURS-ASSET-REQUESTS.md](AFTER-HOURS-ASSET-REQUESTS.md).

**Ground rules.** Nothing essential lives only in an image, a clip or a sound: every beat has a semantic control or a live-region line. Reduced motion collapses every timed beat to an immediate state change (sound still plays when on). Story entry, completion and teardown belong to `hub/hub.js`; the journey only stages them, so no art or clip can award, block or delay a completion.

## Layers, back to front

| # | Layer | Element | Slot | Moves with |
| --- | --- | --- | --- | --- |
| 1 | Corridor plate (night; dawn cross-fades over it) | `#world .corridor-plate` | `corridor.*` | Pointer parallax (world) |
| 2 | Corridor light: door glow, lamp-off shade, dawn shaft, dawn grade | `#world .door-light, .lamp-off, .sunshaft, .dawn` | code | Night progress, finale |
| 3 | Machine interior (back wall, tube, shelves) | `.interior` | `machine.interior` | Cabinet 3D, tube-off |
| 4 | Drinks on the shelf | `#drinks .drink` | `drinks.<id>.*` | Dispense, restock |
| 5 | Coils and shelf lips | `.coils` | code | Coil spin |
| 6 | Glass (reflections, grime) and cursor fog | `.glass` | `machine.glass` | Pointer |
| 7 | Machine face (window and chute holes) | `.face-art` | `machine.face` | Cabinet 3D |
| 8 | Clock, key lights, flap, knob (HTML) | `#display, .keylights, .flap, #turn` | code | Dispense |
| 9 | Roof empties | `#roof` | `drinks.<id>.empty` | Landing, dawn glint |
| 10 | Held drink, tag and string, Put back, Sound (dialog) | `#held` | `drinks.<id>.*` | Catch, ritual, house lights |
| 11 | Homecoming frame | `#homecoming` | — (the story's last frame) | Return |
| 12 | Story screen: film, portal, Return | `#screen` | stories; `clips` | Reveal |

## Beats

Durations in milliseconds. "Replaceable by" names what delivered media may take over; the code beat stays as the fallback.

| Beat | Key | ms | What happens | Sound | Replaceable by |
| --- | --- | --- | --- | --- | --- |
| Arrival | `wake` | 2600 | Tube flicker, drinks surface | — | — |
| Press | `coil` | 600 | Key lights, coil turns, glint runs | `press`, `coil` | Interior art (static) |
| Fall | `fall` | 600 | Drink tips and falls behind the panel | `drop` | — |
| Flap | `flap` | 330 | Flap bangs and settles | — | Face art (static) |
| Catch | `catch` | 980 | Drink flies from the chute to the hand | `pickup` | ART-AH-04 hand (later) |
| Tag | `tagSwing` | 1300 | Tag swings on its string and settles | — | — |
| Ritual | `open.cap` | 1150 | Cap twists off, seal band tears in two | `twist` | Drink part layers |
| Ritual | `open.tab` | 820 | Tab lifts and flips | `tab` | Drink part layers |
| Ritual | `open.wax` | 900 | Wax cracks, crumbs fly | `wax` | Drink part layers |
| Ritual | `open.swing` | 1000 | Bail swings, stopper flips away | `swing` | Drink part layers |
| Ritual | `open.crown` | 900 | Crown cap pops and spins off | `crown` | Drink part layers |
| Ritual | `open.cork` | 1100 | String drops, cork works loose and flies | `cork` | Drink part layers |
| House lights down | `beat` | 420 | The room darkens around the bottle; only the label's window stays lit | ambience ducks | — |
| Reveal | `reveal` | 1150 | The label's picture grows to fill the screen (object-fit continuity) | `whoosh` | K-01 bridge clip plays after it (Seam) |
| Put back | `putBack` | 460 | Drink sinks out of the hand | `putback` | — |
| Homecoming | `homecoming.shrink` | 1050 | The last frame seen folds back into the label | `homecoming` | — |
| Homecoming | `homecoming.fade` | 240 | The frame dissolves into the label window | — | — |
| House lights up | `homecoming.lightsUp` | 900 | The corridor comes back up around the bottle | ambience returns | — |
| Settle | `homecoming.settle` | 450 | A held breath before the drink goes home | — | — |
| Roof | `roof.fly` | 1000 | A finished drink arcs up to its place on the roof | — | — |
| Roof | `roof.land` | 500 | It lands with a clink; clock flips forward | `clink` | Empty layer |
| Clock hold | `clockHold` | 3600 | After a real ending the display holds the new time (hover and focus wait) | — | — |
| Sink | `sink` | 520 | An unfinished drink sinks back; the shelf restocks | `putback`, `restock` | — |
| Restock | `restock` | 900 | A fresh drink drops into its cell | — | — |
| Turn focus | `turnFocus` | 700 | Focus moves to the side once the machine has turned | `turn` | Side art |
| Finale | `finale.tubeOff` | 700 | Sixth story ended: the machine's tube flickers and goes out | `tubeOff` | Interior art |
| Finale | `finale.lampOff` | 4200 | The doorway lamp's pool drains off the floor | hum fades | K-02 clip |
| Finale | `finale.sunrise` | 5200 | Daylight slides in across the floor; the night grade lifts | `dawn`, birds | K-02 clip, ART-AH-03a |
| Finale | `finale.glint` | 1800 | First light runs along the six empties, one by one | — | — |

**Finale rules.** It plays once, when a real ending makes the sixth story finished in this visit. On any later load with six finished, the corridor is already at dawn (tube off, lamp off, daylight resting) with no replay. Reduced motion jumps straight to that resting state. The live region says "Morning. All six stories are finished." The machine stays fully usable at dawn, and every story can still be replayed.

**Clip slots.** A Seam bridge clip uses the existing `hub/bridge-manifest.json` contract (silent, still fallback, stall and duration guards, skipped under reduced motion). A dawn clip (K-02), if approved, gets an optional `clips.dawn` slot in the world layer with the same guards, ending exactly on the dawn plate; the coded finale is its fallback.
