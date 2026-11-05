# Opus reply: the hybrid-scene proof, and from the classroom into paper

5 November 2026, evening. Replies to Robert's [hybrid-scene note](https://github.com/bobshenruililin/asterwind/blob/ab68ff5/docs/HYBRID-SCENE-NOTE-2026-11-05.md) and Bob's [classroom and packaging note](https://github.com/bobshenruililin/asterwind/blob/ab68ff5/docs/CLASSROOM-TO-PAPER-WORLD-2026-11-05.md). Status: **proposals and rough proofs**. No runtime, story, route, outcome or save changed.

## 1. Hybrid scenes (Robert)

I agree with the default: an approved still, matching cutouts, light and shadow coupled to the movement, and sound. I built your proposed proof so we can judge it in the scene rather than in prose.

**The beat that benefits most is the choice, with the lamp head as the one moving object.** It's the only beat where movement *is* the meaning: the lamp turns toward what the player attends to. It's interactive, so it has to be code. And the lamp is the light source, so the "physical effects that move too" are the whole point, not decoration. The runner-up is Mara setting the spare down (6R): a consequential gesture, and a pose set rather than a rig.

**Built: rigs in the candidate setup.**
- A rig takes a clean unlit plate, lit passes crossfaded by where the light is aimed, and one moving part (a cutout turned about a pivot, or a pose set), plus one settle sound.
- The head turns toward whoever the light rests on during the setup, and toward the hovered rib at the choice.
- Open `?candidate=standin-lamp-rig`. The [format](demos/seam-light-test/candidates/README.md#rig-a-moving-part-with-coupled-light) is documented.

**Where it looks false.** The stand-in kit is cut and graded from one still on purpose, and it shows every failure your note predicts:
1. **Revealed background.** A ghost of the old shade sits behind the turned head. The clean plate must rebuild the shelves behind it, as you said.
2. **Attachments.** The cord now ends in mid-air where the shade used to be. Every moving part needs its attachments (cord, knuckle, spring) either drawn on the part or rigged.
3. **Edges next to people.** The shade sits right against Mara's hair, so the cutout's edge chews her strands. Either the clean plate includes her hair behind the shade, or the head's turning range never crosses it.
4. **Baked light.** When the lamp turns to Julian, light stays on Mara's face, because the stand-in passes only push the old light around. Real passes must be relit art: the room lit *from* each head angle, with the shade's cast shadow on the back wall.
5. **Scale.** At the tightest planned crop (scene 0, "the lamp first"), the head needs at least 2× the master's resolution.

What surprised me: even crude, the lamp turning to look at whoever speaks reads as attention at full size. The idea survives the bad art; the craft is what will make it true.

**Smallest asset request, on the existing `performanceOffer` composition** (no new composition needed, same framing, ideally 2×):
- **N0:** the room unlit, with the lamp head removed and the shelves rebuilt behind it. Lamp arm and cord intact up to the knuckle.
- **H:** the head as an RGBA cutout (lamp on), with its cord stub, pivot marked. One cutout if a rotation reads true; three poses (toward the spare, centre, toward the original) if the shade foreshortens.
- **L×3:** the room lit by the lamp at each of those three angles, including the shade's cast shadow and its light on the table and faces. These must register to N0.

That's seven images on one canvas. I'll drop them into the rig the day they arrive and render the review.

**A stronger alternative to test alongside: toy-theatre honesty.** Layers look false when the picture pretends to be a photograph, and true when the world admits it's paper. Give every moving cutout a real card edge and a thin cast shadow offset, as the hub's bottles now have, so the head reads as a piece of card on a brass pin rather than a matte. It forgives the hardest seams (hair, cord) because the seam becomes the style. Proposal: one test, the same head in "seamless" and "toy theatre" styles, judged in the same scene.

**Formats.** I agree with your note. APNG is untested in the setup. Transparent video works in Chromium (WebM VP9 alpha) but not reliably elsewhere, so we shouldn't depend on it. Synchronised beats use poses, sequences or rigs.

## 2. From the classroom into paper (Bob)

**What makes the discovery believable: get the ordinary exactly right.**
- **Geography from the real photos:** the classroom door, the real turn, the real corner, at the hour the lecture ends.
- **Scale cues in frame:** a door (about 2.1 m), a light switch, a fire extinguisher, a notice board. The machine stands about 1.8 m, with its toe-kick touching the floor and a contact shadow.
- **Light that matches the corridor's tubes:** cool, flat, faintly green. The machine's glow is the only warm light.
- **Sound:** real corridor tone (ventilation, a door-closer's clunk, distant voices) and the machine's compressor hum. The hum is what carries across into the paper world.

**What makes it quietly uncanny: one wrong thing, and only one.** I'd choose this: **the machine's glass reflects the corridor at night, lamp-lit and made of paper, while you stand in it by day.** You notice it only if you look. Alternatives if that's too much (pick at most one): its clock reads 03:14 while the corridor clock says 17:10; there's no price, coin slot or brand, only the sign; the bottles cast shadows from a light that isn't there.

**The transition: "Hold it up to the light."** Of the three alternatives in the note, the liquid is strongest, because it's physical and it's in your hands. I sharpened it into one transformation:
- The label's little window looks into the coffee.
- In the coffee, faint and upside down, is a lamp-lit room. That's the bottle's one impossible detail.
- Hold the bottle up to the light and it becomes a camera obscura. The room brightens, rights itself and grows until it *is* the first frame of the film.

It rhymes with the discovery (night in the machine's glass, then night in the coffee) and with the film's grammar (the player holds the light). K-01's locked first frame can be exactly that image. The current reveal (the label's picture grows) stays intact as the fallback until a proof wins.

**Built: [docs/demos/bottle-crossing/](demos/bottle-crossing/index.html).**
- One bottle with a cylindrical wrapper: drag it, use the arrow keys or press the turn button to read the back.
- Hold it up to the light to cross.
- Keyboard, touch and reduced motion work, and the tall-screen crop keeps Mara and the lamp.
- Placeholders: the paper corridor stands in for the HKU corner, and the studio plate for K-01.

**The bottle, plausibly manufactured.**
- **Construction:** amber glass, 330 ml, a paper wrapper with a glued overlap seam at the back, an ingredients panel, small print and a fictional barcode, all typeset in code over the art.
- **One impossible detail:** the room in the coffee. It's visual, not textual, so it works for someone who never reads the back.
- **A sly joke** on the small print: "Store away from direct light." The one thing the bottle asks you to do is hold it up to the light.

**Hooks ("Drink when…", proposals).** Each names a predicament without naming the scenario or predicting the outcome.

| Drink | Hook (proposed) |
| --- | --- |
| 3:00 AM Cold Brew (The Seam) | Drink when two good ideas want the same hour. |
| Standup Seltzer (The Quiet Minute) | Drink when the room agrees too quickly. |
| Slide Deck Bitters (The Missing Name) | Drink when the work has more than one author. |
| Scope Creep Fizz (One More Chair) | Drink when someone arrives just as you're closing. |
| Dead Pixel Tonic (The Empty Square) | Drink when you're asked to test what you didn't design. |
| Ship-It Ginger Ale (Before the Doors Open) | Drink when the doors open before you're ready. |

The Empty Square's hook should go through the lived-experience review that the film itself still needs.

**Ingredients, proposed for the Seam:** "Water, cold-brewed coffee, cane sugar, someone else's deadline and a pinch of courage." This follows the note's pattern of ordinary things beside one or two impossible ones. The current tag-back lines ("A spare rib, cut clean…") name the scenario too directly; they'd move off the label and could become the bottle's fine print for the curious.

**What would help Robert most, in order:**
1. **Bob's real corner photos:**
   - straight on and at 45°;
   - a doorway in frame and the floor visible;
   - at the scene's hour;
   - one with a person standing where the machine would be, for scale, if a teammate is happy to stand in. No bystanders.
2. **The machine as an RGBA cutout** with its own contact shadow, plus a **clean plate of the empty corner**, so the machine can sit in the real place and its glass can carry the night reflection as a separate layer.
3. **The wrapper as flat art.** Unwrapped, as one strip whose width is the bottle's circumference (π × diameter), with the window position marked and every word left blank for code.

## Smallest decisions (Bob)

1. **The crossing:** "hold it up to the light" (proof), the label picture growing (current), or the wrapper unfolding (not built)?
2. **The uncanny detail:** the glass reflecting the night, or one of the alternatives?
3. **Still open from earlier:** Julian awake in the backup route.

## Candour

- **Tested:** both proofs show no console errors. Bottle: keyboard (Tab to the bottle, arrows turn it, the turn button, Enter on "Hold it up to the light", focus lands on "Enter"); a 390 px phone with reduced motion; no horizontal scroll. Rig: the setup run turns the head through −11° to +31°, crossfades the passes and creaks on settle.
- **Not tested:** a human playtest, listening by ear (sound is synthesised), screen readers and real HKU photos (none yet).
- **Placeholders throughout:** the bottle is drawn in code as a placeholder for Robert's wrapper art. The two stand-in kits are cut from existing stills and are not art.
