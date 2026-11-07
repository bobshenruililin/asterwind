# Playtest kit: Asterwind · After Hours

For Bob to send to teammates and friends with the link. Copy the box below as it is; the rest of this page is for us.

---

> **Asterwind** is a short night in a paper world. After hours in a design studio, a vending machine holds six drinks. Each one opens into a small story where someone on a team has to lead. You listen, and when the question comes, you choose with your hands. It runs in a browser, best on a laptop with sound. On a phone, sideways is best.
>
> **Open:** https://bobshenruililin.github.io/asterwind/
>
> - **About three minutes a story,** about twenty minutes for all six. You can wait for morning after any story. It remembers where you were (in your browser only).
> - **There's no score and no right answer.** Each choice keeps something and costs something, and after each story you can try the other way. Nothing you choose or write leaves your screen.
> - **It's a draft.** The voices are computer voices directed line by line; we haven't recorded people yet. One story, *The Empty Square*, follows Jo, a visiting student designer who uses a wheelchair. **It hasn't yet had a review by people with lived experience of disability.** If anything in it rings false, please tell me.
> - The keyboard works throughout (Tab and Enter), and captions are always on screen.
>
> **Afterwards, please tell me, in a sentence or two each:**
> 1. Pick one story. Before you chose, who were the people, and what did each of them want?
> 2. Was there a choice you hesitated over? What made it hard?
> 3. What did your choice keep, and what did it cost?
> 4. Did anything feel like it was telling you the "right" answer?
> 5. Where were you bored or confused?
> 6. At dawn, did the notebook's line about your habit ring true?

---

## The published build

- **URL:** `https://bobshenruililin.github.io/asterwind/`, the root of `pages-runtime` (commit `871f285`), verified live on 7 November.
- **Built from:** commit `d0a012169c3a9037863f973d17bcd671ca106905` on `claude/awesome-hypatia-6bf97q`, by `python3 scripts/build-play.py` from a clean tree.
- **Size:** 531 files, 36.1 MB.
- **To check which build someone played:**
  - the root page carries `<meta name="asterwind-build" content="d0a012169c3a">`;
  - `/build-manifest.json` gives the full commit and a hash of every file.
- **Older links:** `/play/` now forwards to the root. The earlier snapshots stay where they were (`/play-a378e89/`, `/play-d4fca19/`, `/play-833b5f1/`), as do Robert's `/preview-stories-e4e6722/` and the nine-scenario `classic.html`.

## The route players will take

1. **An opening card.** It says where you are, how to play, that no choice is right, roughly how long it takes, and that The Empty Square awaits its lived-experience review. *Begin* turns the sound on.
2. **The corridor.** Only Standup Seltzer is lit ("Each drink holds one story. Start with the one that's lit."). Catch it and open it.
3. **Every story plays the same way:**
   - **intro:** a line along the bottom says where you are and what's at stake, and each person's name and what they want is tagged beside them;
   - **setup:** the people talk it through, in voices directed line by line;
   - **the question:** it appears above the scene, each object is labelled with what it means, and you drag, tap or Tab-and-Enter one;
   - **the consequence:** it plays out;
   - **the reflection:** what it kept, what it cost, whether this time you put the people or the plan first, one lesson, and a question to take away. *Again*, *The other way* and *Back into the night* sit there. After both ways, the card shows them side by side.
4. **The stories:**
   - *The Quiet Minute*: turn the table, or pass the slips;
   - *The Missing Name*: move the microphone, or show the notebook;
   - *One More Chair*: pull in the spare chair, or offer the return-slot box;
   - *The Empty Square*: lower the console, or connect the panel;
   - *Before the Doors Open*: run it live, or play the rehearsal;
   - *The 3:00 AM Seam*: fit the spare, or repair together.
5. **Morning.**
   - Press *Morning* after any story.
   - The notebook opens on *Leadership*, with the words you walked and a pencil note of what each choice kept and cost.
   - A line names your pattern, for example "People first twice; the plan first once." It adds that neither is the right habit, and that knowing your default is where leading starts.
   - Then *Leadership is…* asks for your own word. *Begin again* at the very end clears the night.

## What we're watching for

- **Comprehension, first.** Can a player say who the people are, what they want, why the choice matters and what each outcome costs, without help? (Question 1 tests this.)
- **The opening card.** Do people read it, or skip straight to *Begin*?
- **At each decision.** Do the labels make the meaning of each object clear? Do people hover both before choosing?
- **Hesitation** at the choice is good: it means both sides held.
- ***The other way*:** is it used to reflect, or to look for the "right" answer?
- **Voices:** where does a line sound flat, rushed or wrong for the moment? Note the story and the line.
- **Where people stop,** and which story they leave.
- **The dawn line:** does naming a habit feel insightful, or like a score?
- **The Empty Square:**
  - write down reactions word for word, for the lived-experience review;
  - friends' feedback is not that review.

## Known placeholders

- **Voices are synthetic:** Qwen3-TTS, directed per line and checked by speech recognition. Nobody on the team has listened to all of them in context yet.
- **Sound:** ambience and one-shots come from the built-in set. The licensed CC0 picks in `docs/demos/played/sound-shortlist.json` still need fetching on a laptop (Freesound refuses our cloud session).
- **Motion:** objects move as cut-out layers, and people have small acting (head turns, breathing). No generated video yet: the Kling shots are briefed in `docs/KLING-BRIEFS-2026-11-06.md`, and the slots are wired.
- **Not yet tried:**
  - a real screen reader;
  - a real phone (only emulated phone sizes have been tested);
  - a listening pass on the full mix.
- **Progress** is kept in the browser's local storage (`asterwind.night2.v1`). *Begin again* at the end clears it, and so does clearing site data.
