# Visual wish list: an art department for *Hold the Light*

5 November 2026, for Robert (generation and curation) and Bob (steering). It accompanies the [Exchange note](EXCHANGE-OPUS-2026-11-05.md). Status: **proposed**. Nothing here is approved story, approved art or a spending decision. Image 2.5 budget has been offered as unlimited, but every request still goes through screening before adoption, and through Bob for anything that changes the story.

There are two layers. **Layer 1** is the smallest set for one extraordinary playable film: The Seam, in the light grammar. It is 6 canon sheets and 10 plates, plus 3 selected physics clips. **Layer 2** is the world. Quantity is not the goal. One locked, relit decision master is worth more than forty pretty stills.

## How to read an entry

- **Communicates:** what the viewer must feel. If an image is beautiful but doesn't do this, it fails.
- **Adjacent:** the shot before and after. Cuts must match eyelines, light and prop state.
- **References:** what to learn from. Never copy.
- **Spec:** dimensions, layers and alignment.
- **Canon / fixed:** what must not drift.
- **Variants:** asked for only when a choice is genuinely open.

## House rules (every image)

- **Material.** Fibrous layered card and tissue: visible cut edges, a slight deckle, paper grain at close range, puppet-scale proportions. Skin is matte paper with faint fibre, not plastic. Hair is layered torn strips.
- **Light.** Night is a single amber practical (about 2700 K) against an indigo fill. Morning is cool, even window light, with no amber from the lamp. Warmth means shared worklight, not virtue: never give one branch "good" light.
- **No text in images.** Clocks, phone screens, labels and signage are left blank and overlaid by code. No logos and no recognisable products.
- **Hands are the film.** Five fingers, correct knuckles and readable grip. Each character's sleeve identifies whose hand it is.
- **Master size:** 2560×1440 (16:9) PNG, sRGB. We derive WebP for runtime. Every master declares a **portrait focus** (x%, y%) whose 9:19.5 crop (665×1440) still tells the beat on its own. Plates marked **tall** also need a native 1440×3120 companion, as `decisionPortrait.webp` already is.
- **Relit pairs** (marked **L/N** or **L/N/D**). The camera, poses, geometry and edges are identical, and only the light changes. Make the lamp-lit **L** first, then edit it into **N** (lamp off or turned away, indigo moonlight only) and, where listed, **D** (morning daylight). We check registration as we do for the hub layers: anything more than 2 px of edge drift fails.
- **Layers** are RGBA PNGs on the full master canvas (not cropped), so they register by stacking. Contact shadows go on their own layer.
- **Screening** (in our workflow). Inspect the actual pixels, check registration, safe crop, caption-safe zone (bottom 18%) and hotspot fit, then test in context at desktop and phone size. Delivery is not approval: Bob steers taste and story.

## Layer 1: one extraordinary film (The Seam, light grammar)

### Canon: lock these before any new plate

Each canon sheet is a single 3840×2160 board on neutral grey card with flat studio light, plus the same board relit at 2700 K, so we can see the materials under the film's light. The current plates are the starting point for identity. Please don't redesign the characters. Keep them and make them *specific*.

**C1 · Mara.**
- *Communicates:* competent and tired, holding a deadline that is hers. Her restraint is strength, not martyrdom.
- *Canon/fixed:* olive felted-card coat with layered lapels; dark tee; loose bun with a yellow pencil through it; dark brows; fine freckle flecks; her phone (which carries her stake) and its little card stand.
- *Board:* front, three-quarter and profile; hands at rest and gripping.
- *Expressions (8, registered as one head angle at 512×512, so code can swap them on twos):* listening · the ask (a direct look at Ren) · stake (eyes to the phone) · hearing the call (a small breath in, jaw set) · effort ("I am") · contained ("Half of it", eyes down) · making room (softening) · alone with the spare (a private glance at what she cut).
- *Variants:* none for identity. Two takes of the "hearing the call" expression.

**C2 · Julian.**
- *Communicates:* gentle, exhausted, and attached to an idea he drew. When he's hurt he goes quiet, not bitter.
- *Canon/fixed:* oatmeal fibrous tissue hoodie with drawstrings; tousled layered hair; a graphite smudge on his right cheek and graphite on his right fingertips (the smudge persists into morning); a pencil.
- *Expressions (8 at 512×512, registered):* "Again" (spent) · hovering hand (attachment) · "wanted to be here" (unguarded) · focused (splinting) · relief ("It held") · generous (**proposal**, guiding the spare) · looking at his cracked original (grief without blame) · "Start here" (pride returning).

**C3 · Ren: the player's hands.**
- *Communicates:* you. Ren is mostly hands at the edge of frame, and through the light.
- *Canon/fixed:* navy-indigo card shirt cuff over a white tee cuff; pencil in the breast pocket; plain hands with short nails.
- *Hands sheet (each pose RGBA on its own canvas):* bracing the rib · reaching for the spare · reaching for the original · gripping the lamp head · fingers cupped around the shade with light glowing through the fingertips (de La Tour) · setting the lamp down · the light switch at dawn.
- *Face:* one three-quarter face for morning wides only. Ren never takes the centre of the frame.

**C4 · The studio set (plan and master).**
- *Communicates:* a shared room that has been lived in all night.
- *Fixed:* the table axis (Mara left, Julian right, Ren foreground between, as in the treatment); the window on the left (moon at night, sun at 8:00); shelves and rolled drawings; the glass wind-tunnel box at right; the lamp at centre-left of the table.
- *Deliverables:* a top-down plan drawing of the set for continuity, and one empty master in **L/N/D** at 2560×1440 that later plates must match.

**C5 · The pavilion model and its states.**
- *Communicates:* a beautiful, fragile idea that might not work.
- *Fixed:* six translucent tissue louvres; the rib's "seam" bend profile; pale birch card for the rib and the spare; tissue canopy; the splint is torn kraft strip.
- *States (turnaround board, same angle each):* intact · cracked · buckling · splint half-wrapped · splinted and holding · spare fitted · canopy half-open with two louvres caught · canopy fully open.
- *Details:* the spare carries Mara's pencil tick marks (no numerals), and the original carries Julian's graphite fingerprints.

**C6 · The lamp.**
- *Communicates:* it is the player's instrument. It should feel heavy, warm and trustworthy.
- *Fixed:* hammered-copper paper shade; two arms; brass knuckles; a visible spring; card base.
- *Deliverables:* a separate layer for each part (base, lower arm, upper arm, head) with pivot points marked in a sidecar note, so code can swing it. Three head angles (toward the spare, centre, toward the original), each in an on and an off state.

### Plates

**K2 · The decision master, "the orrery". This is the most important image of the film.**
- *Communicates:* one light, two ribs, two people, and the player's hand about to decide. Every face is a different response, as in Wright of Derby.
- *Adjacent:* setup lines play over it, and the choice happens on it. It cuts to R1 (Mara close) or B1 (Ren and Julian).
- *Spec:* **L/N**, **tall**. Layers: set+table · spare · original/model · Mara · Julian · lamp (C6 parts) · Ren's hand (foreground, optional). Hotspot bounds must stay clear of the caption zone: the spare's left third at y 60–92%, the original's right third at y 40–85%.
- *Canon:* C1–C6.
- *Variants:* **three compositions** (wider and calmer · closer and lower, from table height · a slight top-down "plan" angle) so Bob can choose the film's look. Two lamp-shade warmths.
- *Fallback:* `performanceOffer.webp`, already used in the demo.

**K1 · "Again": the failure insert.**
- *Communicates:* the third failure, felt in the fingers.
- *Adjacent:* opens the film, then cuts to K2.
- *Spec:* **L/N**. Layers: canopy and louvres separate from the rib, so code or a short Kling clip can buckle them. Same camera as the existing `performanceStable` / `Slip` / `Buckle` set.
- *References:* the existing three frames, and Julian's hand from C2.

**K3 · Mara's stake.**
- *Communicates:* the spare in her hands and the phone in front of her, so her future is legible without a word.
- *Adjacent:* setup line 4, and R1 "Then I need you on the canopy with me."
- *Spec:* **L/N**; her face registered to C1 so the expression swaps work. The phone screen is blank (code overlay). It upgrades `offer.webp`.

**K4 · Julian's stake.**
- *Communicates:* the hovering hand that doesn't quite touch the rib.
- *Spec:* **L/N**; face registered to C2; it upgrades `julian.webp`. *References:* the restraint of *Past Lives*. No tears.

**K5 · "Hold it there": the repair.**
- *Communicates:* three people, three burdens and one light. The player feels they are holding it.
- *Adjacent:* R1, then R3 morning.
- *References:* de La Tour, *Saint Joseph the Carpenter*: the light-holder's fingers glowing.
- *Spec:* **L/N**. Layers: set and model · Mara's hand (steadying the canopy) · Julian's hand with three splint states · Ren's hand on the lamp head. The spare lies unused in frame, as in `workB.webp`.

**K6 · "It sits here": the backup (proposal; needs Bob).**
- *Communicates:* Julian is awake and generous, guiding Mara's hands to seat the spare. His original lies cracked at the edge of the light. His design, not his presence, is what gets lost.
- *Spec:* **the same camera as K5**, so the two routes rhyme shot for shot. **L/N**, with the same layering as K5.
- *Fallback:* `workA.webp`, in which Julian is asleep (the current, flawed canon).

**K7 · Night into morning.**
- *Communicates:* the last light going off.
- *Spec:* Ren's hand on the lamp switch (C3) in **L**, then the same frame with the lamp off at blue hour, then **D**. This is the film's only transition that is a physical act.

**K8 · The morning match (two variants).**
- *Communicates:* daylight shows everything, and the light is no longer yours to place.
- *Spec:* **the same camera as K2**, in **D**, Hammershøi-quiet.
  - A: canopy fully open on the spare, with Julian's cracked original on the table where the light used to be.
  - B: canopy half-open on the splinted rib, two louvres caught, the spare unused on the table.
  - In both, Mara's phone is in the foreground on its stand, recording, with its screen blank for an overlay. This single frame replaces Cut B's two-image ending.
- *Fallback:* `morningA` / `morningB` + `payoffA` / `payoffB`.

**K9 · The account.**
- *Communicates:* the record includes everyone, and both people make room.
- *Spec:* a 3840×2160 **D** wide of both people, the actual (branch-correct) model and the cracked original, so code can crop a phone frame that starts on the model and widens to include both of them. A and B variants follow K8.

**K10 · Morning faces.**
- Mara's "Half of it" (B) and Julian looking at his original (A; the **proposed** line "It moves. Not the way I drew it."). In **D**, registered to C1 and C2. Each is a held close, 6 s minimum on screen.

### Selected physics clips (Kling, later, locked-frame)

Kling is for physics, never for the interactive moments. For every clip: the first and last frames equal their plate; the size equals the plate; there is no camera move; it is silent; it runs for 6 s or less; the still fallback stays. These are the same rules as the hub's bridge contract.
- **KL1:** the canopy opens in the wind (A full, B half with the louvres catching), from K8.
- **KL2:** the rib buckles, from K1.
- **KL3:** the lamp settles when it is set down, from K2 (optional; code may do it better).

### Not images, but they matter more

- **Scratch human voices** for every line, recorded on any phone, by anyone willing. This is the biggest gap.
- **Room tone and paper Foley.** A real desk lamp switch, card creaking, tissue fluttering in front of a fan, kraft tape. Two minutes of honest recordings beats any synthesis I can do.

## Layer 2: the world

**One building, one night (the hub, reimagined; proposal).** The six films are six rooms of one building after hours, and you carry the light down its corridor. The vending machine stays at the corridor's heart, and its bottles are still how you enter a room.
- **W1:** exterior at 3:14 AM, six windows lit, the machine's glow at ground level (Hopper's *Office at Night* seen from the street). Time-of-day variants: 3:14 · 4:30 · blue hour 6:10 · dawn 6:40 · 8:00. A window goes dark as each story finishes, and the last one goes out at dawn.
- **W2:** the corridor floor, with the lamp's pool, the machine's glow and six doors: "last light on the floor", taken literally. **L/N/D**.
- **W3:** six door thresholds, each with a sliver of its room's light and one object visible through the gap (the canopy, a rain-wet chair, a projector beam, a reel, a square of tape on the floor, a slip box).

**Ren across the anthology.** Ren already leads in several films. Lock the C3 hands once and reuse them. Then each film gets a different light to hold, and its choice is where you put it: the studio lamp, a phone torch, the projector, the reel's work light, a candle in a power cut, the machine's own glow.

**Other films' canon (when their turn comes).**
- *One More Chair:* Inez, Sam, Bo and the café in rain. **Proposal:** the umbrella's owner, a new face at the door at 5:50, so the cost has a person.
- **Echo layers (proposal, cheap):** two RGBA figures registered to One More Chair's `master.webp` (1672×941) at the window table: Julian with his cracked original (after the Seam's backup), and Mara with her phone (after the repair). Both use C1/C2 canon, in the café's light, at the background scale of the existing customers. They show whether the world remembering you moves anyone.
- Every other film follows the same pattern: canon sheets first, then a relit decision master.

**Transitions.**
- Fold-through: the page folds and the next shot is printed on its back.
- Lamp-off iris (K7).
- The torn-edge reveal (it already exists in the hub).
- **Shadow theatre:** the lamp throws the characters' shadows onto the wall, and the shadows become the next scene (Lotte Reiniger).
- A push-in from W1's window into the room.

**Surprising details.**
- Tissue moths at the lamp.
- Three earlier failed ribs pinned on the wall: Julian's history.
- The hub's own Seam bottle, empty, standing on the studio table with its cap beside it.
- Dust in the morning shaft.
- A bird's shadow crossing the model at 8:00.
- Julian's graphite fingerprints still on the original in the morning.
- Mara's pencil tick marks on the spare.
- In A, the light's old position marked by a cooled circle of glue on the table.

**Daring pitches** (the technique is uncertain, and they are pitched anyway).
- **D1 · The empty bottle remembers.** When a story finishes, the bottle's label on the hub's roof shows the K8 frame of *your* ending. The machine remembers your choice without scoring it.
- **D2 · Real paper.** Build the pavilion model in real paper and photograph it under a lamp and in morning light, as *Lumino City* did. It becomes canon for C5, reference for Image 2.5 and the physics reference for Kling.
- **D3 · Shadow choice.** On K2, the lamp throws both ribs' shadows huge on the back wall. Moving the light makes one shadow swell and the other shrink, so the choice is visible as the shape of attention.
- **D4 · Replacement faces.** Do stop-motion style paper faces swapped on twos, with the seam line across each face left visible, as in *Anomalisa*: *The Seam* taken literally. Test one line against a Kling performance of the same line.
- **D5 · The night as a clock.** Each film ends at a time. The machine's display is the building's clock, and the dawn finale comes when the night has really been spent.

## Order of work (each step shown to Bob before the next)

1. **C1–C6 canon boards** → Bob locks the look.
2. **K2 in three compositions** → Bob picks one, and we make its **N** pair.
3. I build the light test on K2's L/N pair: the real version of the demo. We judge "present or gimmick?" on that.
4. **K5 and K6** (K6 only if the backup fix is approved), then **K8 A/B**.
5. Everything else, then Kling KL1 and KL2 from the locked plates.

Fallbacks remain the current runtime plates throughout. No adoption happens without screening and Bob's steer.
