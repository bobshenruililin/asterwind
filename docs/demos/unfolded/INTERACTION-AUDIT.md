# Interaction audit: the five rooms and the six films

6 November 2026, Opus. Written in reply to Bob's relay of Dots' question: *did we lose the interactive elements, and is leadership actually shown better?*

I checked the code and the story files (`docs/demos/unfolded/index.html`, `anthology/episodes/*/story.json`, `film/story.json`). I also played the HEARD route end to end in a browser. I haven't replayed the six films for this audit; their lines come from the source files.

## The short answer

- **Nothing was lost.**
  - Every room still turns on one untimed choice between two actions.
  - Every film still has its own in-scene choice and both outcomes.
  - The films play whole and unchanged inside the journey.
- **The new layer adds three things the films can't do alone:**
  - meeting the person before the scene;
  - an optional look at what they carry;
  - a world that remembers.
- **Dots is right about the risk.** Three of my rooms (**shared**, **help**, **ship**) had a right answer hidden in the metaphor. I've fixed them.
- **Three film endings are weaker than their dilemmas.** I propose line changes below but haven't applied them. Story text is Bob's to approve.

## The test

For every branch I asked five questions:

1. Why would a thoughtful person choose it?
2. What does it protect?
3. What does it cost?
4. Does the consequence follow from *this action*, rather than from a mistake the player didn't make?
5. Would a player guess the "right" one from the framing?

A branch passes when both answers to question 1 are real, both costs are visible on screen, and question 5 has no answer.

## Rooms in *Leadership, unfolded* (my prototype: changed where it failed)

### heard: The Listening Tide (rewritten, now with Ellis)

| Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- |
| Offer to make sure it's heard | Ellis keeps getting talked over; someone with standing can guarantee a hearing | The route gets heard tomorrow; Ellis isn't exposed alone | The room will hear *your* voice; Ellis's route stays folded in Ellis's hand | Yes. The sea calms around your words, not Ellis's. |
| Set the lantern down and listen | What stops Ellis may not be Theo; listening first finds the real obstacle | Ellis's ownership of the idea | No guarantee. You can't protect tomorrow, and the sea stays rough. | Yes. Ellis says "I'll bring it. Myself." and nothing promises it'll go well. |

**Before:** Wen's room let the listen branch look deeper (she made her own boat, and the offer branch was polite but shallow), which made it a mild quiz. Now both branches end with something real kept and something real given up.

### shared: The Shared Roof (changed)

| Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- |
| Take the clamp | You're faster, and the rain is falling on people's work *now* | The tables; everyone else's work tonight | Arun doesn't do it himself. The next night he takes the clamp and asks you to stay while he tries. | Yes |
| Hold the other side | He learns by doing | His skill and ownership | Slower. The rain reaches the tables (a wet patch spreads) and the seam is crooked. | Yes |

**Before:** taking over led to "I'll wait for you" (dependence) and helping led to independence. That was the quiz Dots named.

### shield: What the Armour Keeps (unchanged)

| Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- |
| Tell him what you've noticed | Silence can feel like indifference; naming it shows you see him | Connection and honesty | Pressure and exposure: "I didn't want it torn apart in front of everyone." | Yes. He opens one plate himself. |
| Sit with him; leave the door open | He said "not tonight", and the pace is his | His control | You leave not knowing; the armour stays closed | Yes. A leaf slips out, a small sign. |

**Watch in playtest:** the garden reveal is a bigger image than the leaf, and it may read as the reward.

### help: The Hand That Opens (changed)

| Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- |
| Keep one ribbon | It's a first flight, and a fall would wreck the wing | The wing. A gust drops it hard and your ribbon catches it. | It flies lower, and she keeps looking back at you | Yes |
| Let every ribbon go | She asked, and the flight is hers | Her ownership | A hard dip, and a feather tears loose | Yes |

**Before:** letting go had no cost beyond a wobble, and keeping had no visible benefit.

### ship: The Lantern and the Horizon (changed)

| Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- |
| Keep the flame and light the way | A boat is in danger now, and only a strong beam reaches it | That boat comes home | The shelters never light, and at dawn you're spent | Yes |
| Share the flame | Many keepers last longer than one | The shelters' own light, and a neighbour who answers | The far boat has no light to steer by and waits for daylight | Yes |

**Before:** keeping led to darkness and sharing solved everything.

## The six films

**Update, 6 Nov:** Bob approved changes 1–3 below, and they're now in the films (commit `60767ff`). Change 4 was not made.

| Film | Branch | Why choose it | Protects | Costs | Follows? |
| --- | --- | --- | --- | --- | --- |
| **The 3:00 AM Seam** | fit the spare | Mara's fellowship footage is due at noon; the spare is cut | The deadline and a working test | Julian's own cracked rib isn't the one that moves | **No.** See (1) below. |
| | splint this seam | It protects Julian's design and the team's learning | The original | Only half the canopy works ("Half of it.") | Yes |
| **The Quiet Minute** | turn the table | Everyone speaks, and nobody replies until all have | Spoken voice and order | Time: the harbour stays unfinished | Yes |
| | pass the slips | Quiet people can write what they won't say | Those who won't speak in a round | Written slips lose nuance, and one is misread | Mostly. See (4) below. |
| **The Missing Name** | move the microphone | Asha offered: her voice, her work | Asha's authorship in her own words | Time: the model reveal doesn't happen | **Wording.** See (2) below. |
| | show the notebook | Asha said either was fine and she can't do the whole pitch | The pitch and the model; Asha's comfort | The credit comes in your voice | Yes. "This answer is hers." |
| **One More Chair** | pull in the spare chair | Sam's placement starts tomorrow; the need is small and real | Sam tomorrow | The umbrella promised for 5:50 misses its last seam | **Tilted.** See (3) below. |
| | offer the return slot | Three bookings were promised | Promises and volunteers | Sam leaves without a mended bag | Yes |
| **The Empty Square** | lower the console | Jo prefers the large controls | Equal quality of access | The display pauses, and some visitors leave | Yes |
| | connect the panel | Now, without stopping | Continuity; Jo operates at once | Smaller switches; "the difference in feel is still there" | Yes. The best-balanced film. Lived-experience review is still required. |
| **Before the Doors Open** | run it live | Visitors came to try it; honesty about a prototype | Participation | The fault shows, and the queue waits | Yes |
| | play the rehearsal | A clean first showing, with no fault in public | Reliability and the team's nerve | Nobody can make it move | Yes |

### Proposed line changes, for Bob

1. **Seam, *backup* branch.**
   - **The choice:** the player chose "Fit the backup".
   - **What the film adds:** Ren also offers Julian a break, Julian sleeps through the 08:00 test, and the morning turns on "I missed it." / "We kept going. I should have checked with you."
   - **Problem:** the hurt comes from an *added* mistake (carrying on without checking in) that the player didn't choose. The cost the choice really carries is that Julian's own rib isn't the one that moves.
   - **Proposal (lines only):** keep every still. The same four `morningA` beats become:
     > JULIAN: It moved.
     >
     > REN: On Mara's spare. Your rib is still on the table.
     >
     > JULIAN: I wanted to see mine move.
     >
     > REN: Then that's the next test.
   - **Unchanged:** the existing close stays: "Before we record, let's compare it with your drawing." / "Can we do that together?" / "Yes. Start with the rib."
   - **Alt text:** the beat "Ren acknowledges that continuing without checking in was avoidable" would need new wording.
2. **Missing Name, *microphone* branch.**
   - **Problem:** "The slot ends before the **decorative** model reveal." *Decorative* belittles what the team gave up and tells the player which choice was right.
   - **Proposal:** "The slot ends before the model reveal. Asha and Kit share the projection; the model they built stays in its closed box."
3. **One More Chair, *extend* branch.**
   - **Problem:** the extend branch ends on an apology *and* a lesson ("Next time, let's count the hands as well as the chairs."), while the return branch ends on "We kept a promise." The overrun follows from the choice, so the apology is fair. Ending on a correction tilts the scales.
   - **Proposal:** keep Ren's apology and replace Inez's lesson with what the choice protected, shown as well as said:
     > (Sam shoulders the mended bag at the door.)
     >
     > SAM: Tomorrow, then.

     Or keep Inez's line and give the return branch an equal-weight line about what it cost Sam.
4. **Quiet Minute, *slips* branch (optional).**
   - **Assessment:** the misread follows from the method (a terse slip loses nuance), so it passes.
   - **Wording:** "Thank you. I read that too quickly." puts it on the player as a personal slip.
   - **Gentler option:** a stage line before it, so the ambiguity is the slip's: "The slip says only: courtyard, gate."

## The three additions in the HEARD route: did they make the story better?

All three are built and playable in the HEARD route. My honest read, before any playtest:

1. **An optional look at the folded route (object and thought). Better; keep.**
   - **What it is:** before choosing, you can look closer at the paper in Ellis's hand. It opens in your imagination: a route that starts at a courtyard gate and never reaches the sea. Ellis's thought appears in pencil: *"It's better. I think it's better. It just doesn't end anywhere this beautiful."*
   - **Why it helps:** it changes what the choice *means* without changing what's allowed.
     - The offer protects a good idea.
     - Listening invites Ellis to own one.
     - It also sets up the film: you now know Ellis's route solves Nia's gate problem and loses the harbour, which is exactly what Ellis says if you turn the table in the film.
   - **Risk:** one more control at the moment of choice. It's dashed, quieter and optional, and the first choice still takes focus.
2. **See the other way. Better for reflection, with a real risk.**
   - **What it is:** after the mirror, you can watch the branch you didn't take, drawn in pencil and labelled "it doesn't change what you did". Your empty bottle, its frame and the notebook keep your choice.
   - **Risk:** it can turn a dilemma back into a comparison test ("which was the good ending?"). It's offered only *after* the mirror question, never before the choice.
   - **Playtest question:** do players use it to reflect, or to grade themselves?
3. **A later response that remembers. The strongest of the three.**
   - **What it is:** the mirror after the film combines your room choice with the film's outcome, for example: *"You said you'd say it for Ellis. Then you turned the table, and Ellis said it."*
   - **Why it works:** it holds a contradiction, a promise and what actually happened, without scoring it, and it makes the film part of the same night.
   - **Other memory:** the empty on the dispenser roof holds a frame of how the room ended, and the dawn leans in on those frames.

**What I didn't do:** change any film dialogue based on the room. The films stay whole. A deeper, low-risk step for later (Bob decides) would be to let the film's *choice copy* acknowledge the room while keeping the same two actions and outcomes. After the offer branch, for example, "Turn the table" could read "Give Ellis the turn you promised to fill."

## So: is leadership shown better?

- **The films carry the concrete human dilemma:** a meeting, a deadline, a door at closing time.
- **The rooms carry what the person brings into that scene**, which the film can only hint at. "Ellis lowers a pencil. Another route stays folded." is one caption in the film. After the harbour, it's the moment you've been waiting for.
- **That's the enhancement:** dramatic irony, a person you've met, and a choice whose costs you can feel twice.
- **The guardrail:** a room must never replace a film's people and trade-offs with a lesson. Each room is the inside of one person *in* its film, and both of its branches must cost something.
