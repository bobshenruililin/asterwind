# Scenarios first: understanding, feeling, learning

7 November 2026, Opus. This responds to Bob's playtest: as a first-time player he couldn't tell what was happening or why the choice mattered, the voices felt robotic, and the leadership learning wasn't clear. Robert's preview (`preview-stories-e4e6722`) moved the scripts in the right direction; this builds on it.

## What a player now gets in every scene

1. **Before you sit down:**
   - a short intro along the bottom of the frame: where you are, who you are, what's at stake tonight (two or three sentences);
   - who's who: each person's name and what they want, both listed and tagged on the picture beside their face. The frame stays bright enough to see them.
2. **The scene:**
   - rewritten lines in which people want something and say why it matters, for example:
     - Nia's courtyard is where she met her first friend;
     - Asha walked three weeks of streets;
     - Sam starts a placement at eight tomorrow;
     - Mara's fellowship closes at noon;
   - the player's own lines name the tension ("If we take the bag now, somebody else's promise slips");
   - narration only carries what you can't see.
3. **The decision:**
   - the question in words above the scene ("Five minutes. How will you put Asha's work back where it belongs?");
   - the same tactile choice as before: drag or tap the object, or use Tab and Enter.
4. **After:** a reflection card with
   - **what the choice kept**;
   - **what it cost**;
   - **one lesson that holds for either choice** (from the workbook's style: "Fix the room, not just the person");
   - **a question to take away**.

   *Again* and *The other way* sit in the card. After you've seen both, it says plainly that neither was the right answer. Nothing is scored.

The scripts are `docs/demos/played/scripts/<ep>.json`, one per story. The episode still owns the choice ids and outcomes, so completion, saves and the registry are unchanged. Without a script, a scene falls back to the film's own lines.

### What I kept from Robert's preview, and what I changed

**Kept:**
- his briefing-card idea;
- the clearer stakes in every setup;
- his careful, two-sided reflections. None of them reads as a quiz.

**Changed:**
- **Briefings** became an intro plus who's who, tagged on the picture, because names alone didn't let a newcomer map voices to faces.
- **Dialogue** moved from explaining the options ("The panel works straight away, but its switches are smaller") towards people wanting something. The options are still said, but by someone who cares.
- **Reflections** went from five paragraphs (about 120 words) to four short parts (kept, cost, lesson, question), so they're read rather than skipped.
- **The lesson** is the same for both choices, so neither looks like the answer.
- **A narrator voice** reads the lesson.

### The lessons, one per story

| Story | Lesson |
| --- | --- |
| The Quiet Minute | Fix the room, not just the person: the format you choose decides who gets heard. |
| The Missing Name | Credit isn't only a name on a slide. It's whose voice explains the work, and the time to agree that is before the day. |
| One More Chair | Every yes to the person in front of you is paid for by someone, often someone who isn't in the room. Name who pays before you choose. |
| The Empty Square | Access works best when the person it's for decides how, and when it's built in from the start rather than fixed on the day. |
| Before the Doors Open | Telling the truth is non-negotiable either way. The real choice is which risk your team can carry: a failure in public, or a promise you can't keep today. |
| The 3:00 AM Seam | Deadlines and ownership pull against each other. Whichever you choose, say out loud whose work you're putting first, and why. |

**For human review:**
- whether these lessons match what the CCGL course teaches. Bob and the team know the course, so edit them freely;
- **The Empty Square still needs its lived-experience review.** The intro card says so in the game.

## Voices

**What I did:**
- **Rendered locally with Qwen3-TTS 1.7B CustomVoice** (Apache-2.0, run on this machine's CPU), from each line's acting direction in the script.
- **Cast:**
  - one voice per person within a story;
  - the same voice for *You* everywhere;
  - a calm storyteller for narration.
- **Checked every take:** a speech recogniser (Whisper small.en) must hear the scripted words. A take that drifts is re-rendered once, then flagged.
- **Report:** `docs/demos/played/qa/voice-report.json` lists every line with its voice, direction, what was heard, and word error.
- **Result:** 122 takes and 11.7 minutes, all six stories plus the narrated lessons.
  - Three slipped consonants were re-rendered.
  - Inez is recast to the clearer voice.
  - The remaining flags are recogniser artefacts (too/two, wanna), still worth one human listen.

**What I can and can't say:**
- **I can't listen.** I can only measure.
- **The old scratch lines (Kokoro):** a narrow pitch range (about 7–8.5 semitones) and almost no pauses (2–17% silence). That matches "robotic and flat".
- **The Qwen takes:** natural pauses (about 30% silence) and much more movement on emotional lines.
- **That's evidence, not a verdict.** Bob needs to hear them in the scene.

**Recommendation:**
- **Audition Eleven v4 against these** on The Quiet Minute first, then the whole game if it wins. It's the strongest commercial option in Astra's research (`docs/VOICE-AUDITION-2026-11-06.md`) and takes natural-language audio tags per line.
- **Cost:** all 116 lines × 3 takes is about 25,000 characters. That's roughly **$2** at the listed $0.08 per 1,000, plus the **$6/month Starter plan** that commercial use requires.
- **Setup:** Bob creates the account; I'll ask for the API key through the session's secure credential form. No key goes in the repository.
- **Human recordings** still beat both if the team can do it. The recording brief and cue keys are ready; recordings drop into `voices/v2/` by the same keys.

## Sound

- **Openverse** works, and its CC0 results for our scenes are mostly Freesound recordings:
  - rain on glass, a café, an audience, a museum hall;
  - a door knock, chair scrape, hand sewing, a switch click;
  - a toy train, a spring mechanism, a film projector, pencil, paper.
- **Freesound's CDN refuses downloads from this cloud session** (HTTP 403 from the site; it isn't our network setting). So:
  - the exact picks are in `docs/demos/played/sound-shortlist.json`;
  - `python3 docs/demos/played/fetch-sounds.py`, run on a laptop, downloads, trims and loudness-matches them and writes provenance;
  - the scenes pick them up automatically (an ambience under the synthesised room, plus one-shots on the moments that need them).
- **Real SFX** (realsfx.com) is a UK practical special-effects company: rain machines and explosions for film sets. It isn't a sound library.
- **Earshot:**
  - the "Earshot SFX" pack on itch.io is described as royalty-free, but I couldn't read its licence text, so it's unconfirmed;
  - earshot.app is a JavaScript-only page I couldn't read.

## Visual direction (for discussion, not a rebuild)

The confusion Bob described came from the scripts and voices, not the style, so the scenarios come first. On style, my recommendation is Robert's **sculpted miniature**, built the way a stop-motion studio would build it.

**Why this style:**
- It gives faces volume, which carries emotion.
- It keeps the handmade objects that make the choices tactile.
- Its native animation language (held poses, replacement faces, small imperfections) is exactly what image generation can produce consistently. So what we can make reads as craft rather than error.

**Why not the others:**
- **Painterly** is lovely but asks for fluid motion we can't make consistently.
- **Pixel art** loses the faces.
- **Realism** invites an uncanny valley.

**How a studio would build it:**
- a style bible;
- character model sheets with turnarounds;
- expression sheets: the same face in 4–6 emotions, plus mouth shapes;
- empty sets: the room with nobody in it;
- separate props on transparent backgrounds.

**What the stage would then do:** composite those layers and act with them.
- swap expressions on cue (Theo's face falls at "Show me your first stop");
- move mouths with the voice;
- turn heads towards whoever speaks.

That's the step from "stills with captions" to "people performing".

**A small pilot before any whole-game regeneration:** see the brief for Robert below.

**Go/no-go for regenerating all six stories:**
1. The pilot's faces stay the same person across every expression at phone size.
2. Expression swaps read without a caption.
3. Edges composite cleanly over the empty set.
4. A first-time player watching the pilot scene says it's clearer and more moving than today's. Bob and two friends decide that.

### Brief for Robert: The Quiet Minute pilot kit (sculpted miniature)

Match `docs/production/quiet-minute-style-auditions/02-quiet-minute-sculpted-miniature.png` (branch `collab/quiet-minute-style-auditions-20261106`) for look, camera and light. 1672×941.

**Images:**
1. **The empty set:** the table, chairs, lamp, rain windows and room, with no people, no model, no tray and no papers. Same camera.
2. **Theo**, from the waist up, seated, on a transparent background, registered to his place in the set. Four faces:
   - proud;
   - talking over someone (mid-word, eyebrows up);
   - caught out (the smile dropping);
   - listening.

   For each face, two mouths: closed and open.
3. **Nia**, the same, four faces:
   - careful, about to speak;
   - firm, hurt;
   - relieved;
   - warm (remembering her first friend).
4. **Ellis**, the same, four faces:
   - withdrawn, eyes down;
   - hesitant, starting to speak;
   - braver;
   - quietly pleased.
5. **Ren:** the back view only, unchanged, indigo.
6. **Props**, each on transparent backgrounds:
   - the platter with its model;
   - the slips tray;
   - Nia's open route;
   - Ellis's folded sheet;
   - the speaking token.

**Rules for every image:**
- the same identities (hair, glasses, clothes) in every image;
- no new people, no text;
- true alpha with no halos.

**Acceptance:**
- I composite them in the stage and post a side-by-side with today's scene;
- the faces must hold identity at 390 px wide.

## Kling

- **Kling 4.0** launched in October 2026 with native audio, but its public pricing isn't confirmed. Only an early Flash version is open, on the yearly Ultra plan.
- **Kling 3.0** is documented: with native audio, about 9 credits/s at 720p and 12 credits/s at 1080p; silent, 6 and 8 credits/s. These are third-party figures, so confirm on kling.ai. On those figures, Bob's approved 60 seconds at 1080p is about 720 credits with audio, or 480 silent.
- **How to use the audio:** generate **foley only**, such as the canopy buckling, paper, the tower springing. Never dialogue: Kling's voices wouldn't match our cast.
- **Shots:** the briefs in `docs/KLING-BRIEFS-2026-11-06.md` still stand.
- **If the sculpted pilot passes:** K1 (Ellis unfolding the route) and K3 (the canopy buckling) are the natural first proofs. Motion in a stop-motion look is forgiving, and the start and end frames would come from the pilot kit.

Sources for the Kling figures (third-party; to be checked against Kling's own pages):
- [Wikipedia: Kling AI](https://en.wikipedia.org/wiki/Kling_AI)
- [Virse: Kling 3.0 pricing](https://www.virse.ai/blog/kling-3-0-pricing)
- [Voyager: Kling AI pricing](https://voyager.so/blog/kling-ai-pricing)
- [Framesurfer: Kling AI pricing](https://framesurfer.com/blogs/kling-ai-pricing)
