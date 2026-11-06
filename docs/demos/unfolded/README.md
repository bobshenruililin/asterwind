# Asterwind · Leadership (Leadership, unfolded)

One night in paper, built from the strongest pieces of Asterwind:
- the notebook word find;
- the **After Hours** corridor and dispenser (`hub/`);
- six symbolic rooms;
- the six films, played whole.

## Play it

- **Locally:** run `python3 -m http.server` at the repository root, then open `http://localhost:8000/docs/demos/unfolded/`.
- **To share:** run `python3 scripts/build-play.py`. It builds `dist/play/` (a static folder, about 23 MB) and `dist/asterwind-play.zip`. Put the folder on any static host; its `index.html` opens the night.
- **Before sending to players**, read [PLAYTEST.md](PLAYTEST.md). It has the note to send and what we're watching for.

## The night

1. **Title.** *Leadership*, in cream; a match cut puts the same word in ink in your CCGL notebook.
2. **Notebook.** Find the words inside the word: *heard, lead, shared, shield, help, ship*. Type, or tap the letters.
3. **Corridor, 03:14.** The After Hours dispenser in journey mode:
   - the bottles whose words you found are lit, and the rest stay dark;
   - you catch one and turn its tag: the word, *Drink when…*, the ingredients and the small print;
   - then you open it.
4. **The label opens.** The room appears upside down in the label's window, rights itself and grows out.
5. **Room.** The inside of one person from the film:
   - Ellis, Asha, Julian, Dev, Ivy or Inez;
   - an optional look at what they carry;
   - one choice where both actions protect something and both cost something.
6. **Stay with the night, or go into its film.** The film plays unchanged in the frame; its real ending is read from its own message (or, for *The 3:00 AM Seam*, its read-only adapter).
7. **Mirror.**
   - A memory line joins your room choice and the film's outcome, for example: "You said you'd say it for Ellis. Then you turned the table, and Ellis said it."
   - Then one question.
   - *See the other way* replays the other branch in pencil without changing anything.
8. **Back in the corridor.** The film's last frame (or the room as you left it) folds into the label; the empty flies to the roof and the clock moves on.
9. **Dawn.** After any walk you can *Wait for morning*; after all six it comes on its own. The tube goes off, sun reaches the roof of empties, then *Leadership is…* and *You are in this one too.*

| Word | Bottle | Room | Person | Film |
| --- | --- | --- | --- | --- |
| heard | Standup Seltzer | The Listening Tide | Ellis | The Quiet Minute |
| lead | Slide Deck Bitters | The Map Turns Around | Asha | The Missing Name |
| shared | 3:00 AM Cold Brew | The Shared Roof | Julian | The 3:00 AM Seam |
| shield | Ship-It Ginger Ale | What the Armour Keeps | Dev | Before the Doors Open |
| help | Dead Pixel Tonic | The Hand That Opens | Ivy (recast on hold for lived-experience review) | The Empty Square |
| ship | Scope Creep Fizz | The Lantern and the Horizon | Inez | One More Chair |

## Play and access

- **Keyboard:**
  - Enter begins.
  - Type in the notebook.
  - Tab to *Close the notebook*.
  - In the corridor, arrow keys move between bottles, Enter catches and opens, Escape puts back.
  - In rooms, the first choice takes focus, then the optional look, then the other choice.
  - The mirror's *Continue* takes focus.
- **Reduced motion:** cuts instead of the wobble, the crossing, the dispense and the dawn.
- **Phones:** in portrait the notebook stacks, the corridor uses its portrait layout, and rooms sit in a 16:9 box with captions below. A hint suggests landscape.
- **Sound** (on from the first click; ♪ toggles):
  - paper recordings, the music sketch, the corridor's ambience;
  - **Voices:** scratch Kokoro voices (Apache-2.0) until the team's recordings land in `voices/team/` (see [RECORDING-BRIEF.md](RECORDING-BRIEF.md));
  - hidden during films, which have their own.
- **Progress** is kept in this browser only. *Continue the night* or *Begin again* on the title.

## Checked (Chromium, headless)

- **`qa/night.cjs`**, against the built `dist/play/` on its own server:
  - the whole night: six words, six rooms (each with its look), two films played to their real endings and four entered and left;
  - the combined mirror lines, six empties, the clock at 06:02, the dawn, the ending and the save;
  - no failed requests and no console errors.
- **`qa/keyboard.cjs`**, at 1280×720 and at 390×844 with touch and reduced motion: one full route keyboard-only, focus correct at every step including inside the corridor, no horizontal scroll.
- **`qa/rooms.cjs`:** every room's choice with its look open, and both endings.
- **Hub tests:** all pass with journey mode added, and the hub's standalone behaviour is unchanged.

**Not checked:** a human playtest, a screen reader, or listening by ear.

## Read next

| | |
| --- | --- |
| [PLAYTEST.md](PLAYTEST.md) | What to send players, and what to watch |
| [JOURNEY.md](JOURNEY.md) | Structure, pairings and reasons, bottle copy, transitions |
| [INTERACTION-AUDIT.md](INTERACTION-AUDIT.md) | Every branch: why, protects, costs, follows (the three film changes are now applied) |
| [CAST.md](CAST.md) | Ren and the film people; Robert's requests and the review of candidates A |
| [RECORDING-BRIEF.md](RECORDING-BRIEF.md) | Scripts and a practical guide for recording our own voices |
| [art/README.md](art/README.md) | How painted room layers plug in |

## What's placeholder

- **Room art** is code-cut paper; painted layers replace it through `art/index.json`.
- **Voices** are scratch.
- **The corridor** is the After Hours plate; Bob's real CCGL photos turned to paper remain a proposal.
- **Room characters and lines** are fictional proposals.
