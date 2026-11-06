# Leadership, unfolded

A playable night through one word. Open `index.html` over HTTP (`python3 -m http.server` at the repository root, then `/docs/demos/unfolded/`). There's no build, account or network. Proposals and placeholder art only: nothing here changes the hub, the films or the app. The films play whole and unchanged inside it.

## The night in one breath

- **The notebook.** Your CCGL notebook says **Leadership** and asks *What is it?* Inside the word are other words: **heard, lead, shared, shield, help, ship**.
- **The dispenser.** Each word you find lights a bottle in a dispenser in a corridor at 03:14.
- **The bottle.** Lift one, turn it to read the wrapper (*Drink when…*, ingredients, small print), and hold it up to the light. Inside the glass, upside down, is a room. It rights itself and you're in.
- **The room.** It's the inside of one person from a film. You make one choice between two defensible actions; both protect something, and both cost something.
- **The film.** Stay with the night, or go into the morning: the film where that person sits at a real table, played whole.
- **The mirror** remembers both choices together and asks one question. You can look at the way you didn't take, in pencil, without changing what you did.
- **The roof.** An empty goes up on the dispenser roof with a frame of how it ended. At dawn the view leans in on the roof, and the notebook asks again: *Leadership is…*

**Built end to end: HEARD**, with Ellis the night before *The Quiet Minute*. The other words open their rooms and films too; their rooms are earlier sketches.

## Read next

| | |
| --- | --- |
| [JOURNEY.md](JOURNEY.md) | The whole night: structure, the six pairings and why, bottle copy, transitions, ending, built vs proposed |
| [INTERACTION-AUDIT.md](INTERACTION-AUDIT.md) | Every branch in five rooms and six films: why choose it, what it protects, what it costs, whether the consequence follows. Proposed film line changes for Bob. |
| [CAST.md](CAST.md) | One "you" (Ren), people taken from the films, and exactly what to paint for HEARD |
| [RECORDING-BRIEF.md](RECORDING-BRIEF.md) | Scripts, direction and a practical guide for recording our own voices |
| [art/README.md](art/README.md) | How painted layers plug in, with a stand-in set that proves registration |

## Play and access

- **Word find:** tap the letters or just type. Backspace undoes a letter; Escape clears. After a while a letter glows, and later a pencil hint appears.
- **Dispenser and bottle:**
  - Tab to a lit bottle and press Enter.
  - Arrow keys (or drag, or the buttons) turn it.
  - Enter holds it up to the light; Escape puts it back.
- **Rooms:**
  - The first choice takes focus. The optional *look closer* follows the choices in Tab order.
  - Captions are always on, and descriptions are announced.
  - Pause is in the corner.
- **Films:** the episode's own controls work inside the frame. *Back into the night* is always available and takes focus when the film ends.
- **Reduced motion:** removes the wobble, the stepping, the crossing animation and the dawn push-in. Everything cuts instead.
- **Phone:** in portrait the notebook's pages stack, the corridor centres on the dispenser, and rooms sit in a 16:9 box with captions below.
- **Sound** (♪, off by default): paper recordings, the music sketch, and **Voices** (*off · scratch*, plus *team* once recorded).

## Checked (Chromium, headless)

- **The full HEARD route at 1280×720:**
  - the notebook, bottle, turning and crossing;
  - the optional look;
  - both branches;
  - *The Quiet Minute* auto-starting in the frame and completing (outcome read from its existing message);
  - the combined mirror line;
  - *See the other way* (and that it doesn't change the record);
  - the empty and the clock;
  - LEAD → *The Missing Name*;
  - dawn and the ending.
- **All six bottles:**
  - each opens its room (or LEAD's film) and offers its film;
  - five films auto-start;
  - *The 3:00 AM Seam* loads and waits for its own *Play as Ren* (older adapter).
- **Keyboard only:** notebook → corridor → bottle → choice → optional look → exit → mirror → morning → ending.
- **390×844** with touch and reduced motion: the same path, no horizontal scroll.
- **No console errors** in any run.
- **Art route:** the stand-in set (`?art=art-standin`) lands in register with the code-cut room (edge overlay).

**Not checked:** a human playtest, a screen reader, or listening by ear. The scratch voices and cues were measured, not heard.

## What's placeholder

- **All art** is drawn in code as a working stand-in. Painted layers replace it per [art/README.md](art/README.md) and [CAST.md](CAST.md).
- **The corridor** wants Bob's real photos turned to paper.
- **Characters and lines in the rooms** are fictional proposals. Film text is untouched; proposed changes are in the audit.
- **Scratch voices:** Kokoro (Apache-2.0); see `voices/PROVENANCE.md`.
