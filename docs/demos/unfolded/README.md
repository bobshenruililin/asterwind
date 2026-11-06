# Leadership, unfolded

A playable journey through one word. Open `index.html` over HTTP (`python3 -m http.server` at the repository root, then `/docs/demos/unfolded/`). There's no build, account or network. Proposals and placeholder art only: nothing here changes the hub, the films or the app.

## The idea in one breath

Your CCGL notebook says **Leadership** and asks *What is it?* The word lifts off the page as paper letters, and inside it are other words: **heard, shared, shield, help, ship**. Each word you find folds into a paper boat, sails to a pencil map, and opens a room.

In each room:
- a lantern finds the scene in the dark;
- you make **one choice between two defensible actions**;
- the paper itself changes because of what you did;
- a **mirror moment** on dark paper asks one question.

At the end, the words you found are written around *Leadership*, and you may write your own. Nothing is scored, and nothing you write leaves the screen.

## Why this shape

- **The word is the map.** Leadership isn't defined for you. It's *decomposed*. Every hidden word is something leadership asks of a person, and you find them yourself. Spelling DEALERSHIP gets a joke; PRIDE gets "Careful with that one." Finding is learning by noticing.
- **The medium teaches.** Paper isn't here for realism. It's here so that an image can bend to show what a choice does: a tear mended neatly or crookedly, armour that only its owner opens, ribbons that turn into birds, light passed hut to hut. Every key frame shows a feeling, a choice or a consequence.
- **Both choices are human.** Advice *is* help, and listening *is* help. Mending it yourself is caring, and holding the other side is caring. Each branch shows what it made possible and what someone else carried. Robert's notes guided the ethics:
  - listening doesn't have to calm the sea;
  - only Leo opens his armour;
  - letting go doesn't become absence;
  - shared lights need a way to call for help.
- **The mirror.** After each room the screen goes to dark, slightly glossy paper with one question. On a glossy screen you may glimpse yourself; nothing depends on it, and no camera is used. The last screen says *You are in this one too.*
- **Few elements.** Each room has at most two people, one symbolic object, one light and plenty of empty paper. This is a deliberate correction to busy, everything-at-once concept art.
- **"You" across a life.** The player is the same violet coat in every room: younger as a listener and a maker, grey-haired as a mentor and a keeper. You can visit the rooms in any order.

## Rooms

| Word | Room | Choice | What the paper does |
| --- | --- | --- | --- |
| heard | The Listening Tide | Offer what worked for you / Set the lantern down and listen | A bridge of your words calms the sea, but her note stays folded. Or the lantern makes a sheltered fold, and she folds her own boat while the sea stays rough. |
| shared | The Shared Roof | Take the clamp / Hold the other side | A neat seam, and the next night he waits for you. Or a crooked seam he made, and the next night he mends the new tear alone. |
| shield | What the Armour Keeps | Tell him what you've noticed / Sit with him; leave the door open | He opens one plate himself, and a garden glows inside. Or the armour stays closed, and a leaf slips out beside you. |
| help | The Hand That Opens | Keep one ribbon / Let every ribbon go | The ribbons become birds. It flies lower and steady, tethered to you. Or it flies high, wobbles, and she steadies it herself while you stay with open hands. |
| ship | The Lantern and the Horizon | Keep the flame and light the way / Share the flame | Your beam brings one boat home, then the sea goes dark when you tire. Or the light passes hut to hut, one flickers, and a neighbour answers. |

## Play and access

- **Word find:** tap the letters or just type. Backspace undoes a letter; Escape clears. After a while a letter glows, and later a pencil hint appears. Any order works.
- **Rooms:** Tab or tap to reach the choices. Captions are always on, and the descriptions are in the markup. Pause is in the corner. Reduced motion removes the wobble, the stepping and the lantern reveal.
- **Phone:** in portrait the notebook's pages stack and the rooms sit in a 16:9 box with captions below.
- **Sound** (♪, off by default): public-domain paper recordings (page turns, folds, pencil) and the original music sketch from `../sound-board/`. See `sound/PROVENANCE.md`.

## Checked

- **Played headlessly in Chromium:**
  - every word find, including bonus words and a deliberate wrong spelling;
  - all five rooms through to the mirror, at least one branch each;
  - the ending, including writing your own word.
- **Rendered every branch once** for the art templates.
- **Keyboard-only:** type the word, Tab to the boat, Enter, the first choice takes focus, Enter, then the mirror.
- **Phone:** 390×844 with touch and reduced motion; tiles 27×37 px; no horizontal scroll; no console errors.

**Not checked:** a human playtest, a screen reader, or listening by ear. The cues were measured, not heard.

## What's placeholder

- **The art:** I drew it in code as a working stand-in. [`art-brief/ART-BRIEF.md`](art-brief/ART-BRIEF.md) tells GPT (or any illustrator) exactly what to paint so it can replace each layer, and [`art-brief/templates/`](art-brief/templates/) holds the composition of every state.
- **All characters and lines are fictional proposals** written for this prototype.
- **Bob's classroom opening** (`../leadership-opening/`, on its own branch) can lead straight into this notebook.
