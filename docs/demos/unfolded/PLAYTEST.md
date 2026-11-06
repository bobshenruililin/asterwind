# Playtest kit: Asterwind · After Hours (draft night)

For Bob to send to teammates and friends with the link. Copy the box below as it is; the rest of this page is for us.

---

> **Asterwind · After Hours** is a short night in a paper world. It's 03:14 in a corridor, and a vending machine holds six bottles. Each one opens into a small story about working with other people, and you play it. It runs in a browser, best on a laptop with sound. On a phone, turn it sideways.
>
> **Open:** https://bobshenruililin.github.io/asterwind/play/
>
> - **About 15 minutes for all six stories,** about two minutes each. You can call it a night after any story. It remembers where you were (in your browser only).
> - **There's no score and no right answer.** Nothing you choose or write leaves your screen.
> - **It's a draft.** The voices are temporary computer voices. One story, *The Empty Square*, follows Jo, a visiting student designer who uses a wheelchair. **It hasn't yet had a review by people with lived experience of disability.** If anything in it rings false, please tell me.
> - The keyboard works throughout (Tab and Enter).
>
> **Afterwards, please tell me, in a sentence or two each:**
> 1. Which moment stayed with you?
> 2. Was there a choice you hesitated over? What made it hard?
> 3. Did you know what you could do without being told? Where weren't you sure?
> 4. Did anything feel like it was telling you the "right" answer?
> 5. Where were you bored or confused?
> 6. What did you write after *Leadership is…*, and why?

---

## The published build

- **URL:** `https://bobshenruililin.github.io/asterwind/play/`, published on `pages-runtime` under `play/`.
- **Built from:** commit `a378e892e98d0177577e25782479f7b1e33adfce` on `claude/awesome-hypatia-6bf97q`, by `python3 scripts/build-play.py` from a clean tree.
- **Size:** 336 files, 25.1 MB.
- **To check which build someone played:**
  - the page `/play/` carries `<meta name="asterwind-build" content="a378e892e98d">`;
  - `/play/build-manifest.json` gives the full commit and a hash of every file.
- **Unchanged:**
  - the existing Pages root (`/asterwind/`);
  - the integrated night, the known-good build, which stays reachable at `/play/docs/demos/unfolded/` (without `?v=2`).

## The route players will take

1. **The corridor at 03:14, with no title.** Only Standup Seltzer is lit.
2. **Catch it and open it.** The tag reads one word and *Drink when…*, and the label's picture grows into the scene.
3. **Sit down, and *The Quiet Minute* plays at the table.**
   - At the decision you turn the table (drag the platter round) or pass the slips (slide the tray across). Hovering lights the object; Tab and Enter do the same.
   - The film's consequence follows, then *Again*, *The other way* or *Back into the night*.
4. **Back in the corridor.** The empty goes up to the roof, the clock moves, and the other five bottles wake.
5. **Four more stories play the same way:**
   - *The Missing Name*: move the microphone, or show the notebook;
   - *One More Chair*: pull in the spare chair, or offer the return-slot box;
   - *The Empty Square*: lower the console, or connect the panel;
   - *Before the Doors Open*: run it live, or play the rehearsal.

   *The 3:00 AM Seam* still plays as its original film.
6. **Morning.**
   - You can press *Morning* after any story. After all six it comes by itself.
   - The notebook opens on *Leadership*, with the words you walked and a pencil note of what you did. Then comes *Leadership is…* for your own word.
   - *Begin again* at the very end clears the night and starts fresh.

**Cut, compared with the integrated night:**
- the word hunt as an opening gate;
- the symbolic rooms;
- the choice between staying with the night and watching the film;
- the mirror screen after each story.

## What we're watching for

- **The first 30 seconds.** Does a new player find and catch the lit bottle without help?
- **At each decision.** Do people find the objects by moving the pointer, or stall? For how long?
- **Hesitation** at the choice is good: it means both sides held.
- ***The other way*:** is it used to reflect or to grade?
- **Where people stop.** Do they press *Morning* early? Which story do they leave?
- **The Seam:** does the switch to an older-style film feel like a break?
- **The ending:** what do people write after *Leadership is…*?
- **The Empty Square:**
  - write down reactions word for word, for the lived-experience review;
  - friends' feedback is not that review.

## Known placeholders

- **Objects move as image regions.** On some plates you can see stretching at the edge. Robert's object layers and clean plates replace this.
- **Acting:** only *The Quiet Minute* has small character acting (breathing, head turns, the pencil going down). In the other four stories people don't react yet.
- **Optional looks:** only *The Quiet Minute* has an optional closer look (Ellis's folded route).
- **Voices are scratch** (Kokoro-82M) until we record our own.
- **Not yet tried:**
  - a real screen reader;
  - a real phone (only emulated phone sizes have been tested);
  - a listening pass on the sound mix.
- **Progress** is kept in the browser's local storage (`asterwind.night2.v1`). *Begin again* at the end clears it, and so does clearing site data.
