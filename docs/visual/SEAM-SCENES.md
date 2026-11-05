# The Seam, scene by scene: a brief for the visual director

5 November 2026, from Opus to Robert. Status: **proposal for discussion**. Nothing here is approved story or approved art. Bob steers through demos.

The point of this brief is to say what each moment must make us **feel**, what the camera should **reveal and withhold**, and what must **never drift**. *How* it looks is yours. Every scene ends with a question for you. If you see a better image, metaphor or movement than the one I describe, bring it, and bring an experiment rather than an argument if you can. The [candidate harness](../demos/seam-light-test/candidates/README.md) shows your experiment inside the playable scene within minutes.

**The quality bar** is the two atmospheric concept frames Bob loved. I haven't seen them; they're not in the repository or the PR. Please commit them to [`docs/visual/reference/`](reference/README.md) with a line on what Bob loved about each, so I can measure every screen against them (light ratio, palette, grain, depth).

**The grammar.** The player holds the light. At night, the light *is* attention: what's lit is what you look at, and what's dark still exists. In the morning, daylight takes the light out of your hands and shows everything. Warmth is shared worklight, never virtue. Neither branch gets the "good" light.

**Words on screen.** Captions (with speaker names) and the few controls a player needs. Nothing else: no hints, no secondary labels, no explanations. If a moment needs a label to be understood, the image or the light isn't doing its job yet. Tell me, and we'll fix the picture rather than add words. Accessible names and descriptions stay in the markup for screen readers.

## The formats we can use (pick per moment)

| Format | Use it when | What you deliver | What I do with it |
| --- | --- | --- | --- |
| **Still** | The moment is a held look | A 2560×1440 master and, if it's interactive, its relit pair (lamp-lit **L**, unlit **N**, morning **D**) registered pixel for pixel | Light, camera crop, cut |
| **Loop** | Something should breathe without anyone acting: dust, moths, a fan ribbon, rain on glass | A seamless PNG sequence (RGBA, 12 fps on twos for paper, 24 for light), 1–4 s, registered to a box on the plate. GIF only as a preview. | Composite it, optionally seen only inside the light; frame 0 under reduced motion |
| **Pose set** | A consequential gesture: a hand hovers and withdraws, the spare is set down, a finger finds the switch | 3–8 key poses, each a full registered plate (or an RGBA layer), plus the **held** pose the scene rests on | Swap them on the beat, like replacement animation; the hold is where the feeling lands |
| **Rig** | A part must move with exact geometry, or respond to the player: the lamp, the louvres, the splint, the phone's frame | Separate RGBA layers with pivot points marked (a sidecar note), in lit and unlit states | Animate them in code (SVG/CSS), so the motion obeys the interaction |
| **Film shot** | Physics or time that code and poses can't fake: a canopy catching the wind, a rib buckling, morning sweeping across a room | A generated clip that starts and ends on locked plates, the same size, no camera move unless the brief asks, silent, 6 s or less | A clip slot with the still as fallback; never used for an interactive moment |

## Consistency that must never drift

These are the canon from the [wish list](../VISUAL-WISHLIST-2026-11-05.md) (C1–C6).
- **Mara:** olive felted-card coat, yellow pencil through her bun, her phone on its little card stand.
- **Julian:** oatmeal tissue hoodie, a graphite smudge on his right cheek and graphite on his fingertips, persisting into morning.
- **Ren:** navy-indigo cuff over a white cuff; hands at the edge of frame, never centre.
- **The model:** six translucent louvres, the rib's seam bend, birch card, a kraft splint.
- **The room:** table axis with Mara left, Julian right and Ren foreground; window left; lamp centre-left.
- **Time:** one night, 3:14 to 8:00. The morning light is the same in both outcomes; only the model and the people differ.

---

## 0 · Threshold: the label becomes the room

- **Feel:** stepping into someone's 3 AM. The hush of a room that has been working for hours.
- **Camera:** the label's little picture on the bottle grows until it *is* the opening frame. It reveals the lamp first, then the people it lights. It withholds faces until the light finds them.
- **Movement:** the K-01 bridge (film shot), already being prepared. It keeps the locked-frame and size contracts; the still is the fallback.
- **Sound:** the corridor's hum thins to a room tone; one paper creak.
- **Over to you:** what's the very first thing we see in the room, before any person? I'd guess the lamp's shade from very close, but you may find a better first image: the six louvres in silhouette, or Julian's hand.

## 1 · "Again." The failure

- **Feel:** a third failure, in the fingers. Tiredness, not drama.
- **Camera:** hands and the rib, close. The brush taps and the rib gives. No faces yet: we feel the problem before we meet the people.
- **Movement:** the existing three poses (stable, slip, buckle) are the floor. Better is a **rig**, with the louvres and rib as layers so the buckle obeys physics in code. Best might be a **film shot** of the buckle (KL2), cut on the beat.
- **Sound:** a dry crack, the brush tap, a held silence, then "Again."
- **Over to you:** does the failure need the brush? Is there a smaller, truer gesture of a person who has failed three times?

## 2 · The room in one light (setup)

- **Feel:** three exhausted people bound by one lamp. Intimacy. The stakes are discovered by looking, not told.
- **Camera:** the decision master, the "orrery" (Wright of Derby): one lit object at the centre and every face responding differently. The light rests on whoever speaks, and the player can take it anywhere. Darkness is the frame.
- **Movement:**
  - The master is a **still with a relit pair**; this is the asset the whole grammar stands on.
  - **Loops** make it breathe: moths at the shade, dust turning in the beam (seen only in the light), the window's branch shadows moving in the moonlight.
  - **Expression replacements** (pose sets on 512×512 registered heads) for each speaker's beat.
- **Ambitious:** paper-theatre depth. Split the master into 4–5 depth layers (back wall, shelves, table and model, the people, the foreground lamp and Ren's hand) so the light and the pointer give real parallax, like wings on a toy theatre.
- **Sound:** room tone, the lamp's filament, a chair creak, breath.
- **Over to you:** what do the people *do* while others speak? I want one small, specific action per person that the light can catch: Mara checking the time and putting the phone face-down, Julian's thumb on the rib's seam.

## 3 · Mara's stake

- **Feel:** her future is real, and she isn't the antagonist. She cut the spare at midnight so someone else's failure wouldn't sink her.
- **Camera:** the spare in her hands and the phone on its stand, both in one frame. Her eyes go to Ren, which is to us. Withhold the phone's screen; a cool glow is enough. Text is never generated; if we need it, code overlays it.
- **Movement:** a still with expression swaps ("the ask", "stake"), and a phone-glow loop.
- **Over to you:** is the phone the right object for her stake, or is there a stronger one? Her printed application, the fellowship's envelope, a calendar square circled in pencil?

## 4 · Julian's stake

- **Feel:** tenderness and attachment. A designer who wanted to be there when his design moved.
- **Camera:** his hand hovering over the original, *not quite touching*. The graphite smudge.
- **Movement:** a **pose set**: hover, near-touch, withdraw, with the withdraw held. This is a consequential gesture, so poses, not a loop.
- **Over to you:** I see restraint (*Past Lives*). You may see something else. Should we ever see his drawing?

## 5 · "Where will you put the light?" The choice

- **Feel:** the weight of attention. Both ribs are honourable, and nothing hints at an outcome.
- **Camera:** the decision master, with both ribs equally legible and the lamp between them. No predicted faces and no outcome preview.
- **Movement:** a **lamp rig**: the head turns toward whichever rib the player's light or focus is on, and settles with a spring when it's set down.
- **Ambitious:** the shadows of both ribs, thrown huge on the back wall. Moving the light makes one shadow swell and the other shrink (Lotte Reiniger). It's the choice made visible as the shape of attention.
- **Words:** the question, and two primary labels on the ribs. Nothing else.
- **Over to you:** can the composition make the two ribs feel like two people? Mara's spare could rhyme with her posture, and Julian's original with his.

## 6R · On her terms (repair)

- **Feel:** Mara agrees, with a condition. Consent, not martyrdom.
- **Camera:** Mara close. **She sets the spare down.** That's the gesture that tells us what this costs her.
- **Movement:** a **pose set** for the spare going down (3 poses, last one held), or a short **film shot** if the hands need physics.
- **Over to you:** where does the spare go? Beside the phone, face down, or into her bag?

## 7R · "Hold it there." (repair)

- **Feel:** presence. Three people, three burdens, one light, and the player is the one holding it.
- **Camera:** de La Tour's *Saint Joseph the Carpenter*: the light-holder's fingers glowing translucent around the shade. Three hands in the work, and the spare lying unused in frame.
- **Movement:**
  - A **rig**: hands as layers, and the splint wrap in three states that advance while the player holds.
  - The **light's tremble** is code.
  - A **loop** of fibre catching the light as it's wound.
- **Sound:** kraft tape rasp, breath, "Hold it there." / "I am."
- **Over to you:** what does the light reveal *only because* the player is holding it? A detail no one else would notice: Mara's knuckles whitening, a tear in Julian's cuff.

## 6B · "It sits here." (backup; **pending Bob's approval**)

- **Feel:** generosity. Julian, awake, guides Mara's hands to seat the spare. His original lies cracked at the edge of the light: his design, not his presence, is the cost.
- **Camera:** **the same camera as 7R**, so the two routes rhyme shot for shot.
- **Movement:** a **pose set** of his hands over hers.
- **Over to you:** how do we show it isn't his? Different card, no graphite on the new rib, his drawing face up beside it?

## 8 · The last light goes out

- **Feel:** time passing, and the night's choice settling into fact.
- **Camera:** Ren's hand finds the lamp switch. Click. Dark, then blue hour, then the room in daylight.
- **Movement:** a **pose set** for the hand, code for the dark, and an ambitious **film shot**: morning light sweeping across the room from the window, with locked start and end plates.
- **Sound:** the switch, then silence, then the first bird, then the fan's motor.
- **Over to you:** is there a paper-native way to show hours passing? A shadow on the table that rotates, the window's paper sky changing sheets?

## 9R · "It held." / "Half of it." (repair morning)

- **Feel:** an honest partial success. The cost lands on Mara, and she doesn't make a scene of it.
- **Camera:** the morning match of the decision master, Hammershøi-quiet. The canopy is half open, two louvres caught, and Mara's phone is in the foreground recording it. One frame holds the object and the cost together.
- **Movement:** the **film shot** this film most deserves (KL1-B): the fan rises and the canopy opens halfway, louvres catching and fluttering. Plus a **loop** of dust in the sun shaft.
- **Sound:** fan rising, a dry flutter, the fan stopping, "It held." … "Half of it."
- **Over to you:** where is Mara looking when she says it? I'd say not at the phone.

## 9B · "Not the way I drew it." (backup morning; **pending**)

- **Feel:** a working model and a quiet loss.
- **Camera:** the same morning match. The canopy is fully open on the spare, and Julian's cracked original sits on the table where the light used to be.
- **Movement:** KL1-A (a full opening), and Julian's face in morning light.

## 10 · The account

- **Feel:** shared authorship. It isn't resolution, and it doesn't undo the cost.
- **Camera:** the phone's frame starts on the model and widens to include both people and the actual, branch-correct model.
- **Movement:** a **rig**: code crops a 3840×2160 morning wide.

## 11 · Homecoming

- **Feel:** carrying the night out with you.
- **Camera:** the last frame folds back into the bottle's label (this exists). On the corridor roof, the empty bottle's label could now show **your** morning frame: the machine remembers what you chose, without scoring it.
- **Over to you:** what should the empty bottle look like? Rinsed, with a ring of light in it? The cap kept?

---

## The corridor (After Hours), briefly

The hub is how teammates enter. Your Cold Brew and interior candidates belong here, and they're welcome whenever they're ready.

- **Arrival:** the machine waking in the dark corridor. It should feel like a vending machine that has been waiting for you specifically.
- **Choosing:** the bottle in your hand. The tag names the story. The verb by the cap now appears only if you hesitate, because the closure's glow should be the invitation.
- **The ritual:** the opening is the gesture that commits you. Each closure is its own small rig (the parts are already independent layers).
- **Dawn:** the six empties catch first light (this exists). Could the corridor's door at the end of the hall be open at dawn?

## What I'd love you to challenge

1. **Is light the right metaphor for this film?** If you see a stronger one, such as a camera, a hand or a measuring tape, show me.
2. **The decision master's composition.** Show me three, and I'll build the one Bob picks.
3. **Faces.** Replacement faces, or a performed film shot? Let's test one line both ways before deciding.
4. **The morning.** Does it need people at all, or should the first morning frame be the model alone?
