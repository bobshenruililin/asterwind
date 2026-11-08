# The Quiet Minute, listened: design and state map

8 November 2026, Opus. The pilot episode for the ambition brief ([AMBITION-HANDOFF-2026-11-08.md](AMBITION-HANDOFF-2026-11-08.md)). Playable at `docs/demos/played/listen.html`; the night opens it from the Standup Seltzer. The 7 November played version stays at `docs/demos/played/index.html`.

## Why this, of the lab's ideas

Three approaches were compared against the lab and the review:

| Approach | What the player does | Why not / why |
| --- | --- | --- |
| Polish the 7 Nov scene | Watch, then pick one of two labelled objects | Leadership stays a menu choice. The scene is pretty but the player is idle until the question. |
| **Say it** (lab 03) | Build a sentence from paper strips | Strong teaching verb, but a composition panel over the film; better as a second verb, in The Seam. |
| **Listen, as cinematography** (lab 01 + 10) | Turn to someone; whoever you face gets the floor | **Chosen.** Attention is the verb most native to film: where you look *is* the camera. The interaction and the visual ambition become the same thing. |

The review's first recommendation was Listen plus a small Notes ending. This keeps it, and goes further: the camera, the light, the depth of field and the sound mix all follow the player's attention, so the leadership action and the Pear-style camera move through a painting are one gesture.

## Who wants what

| | Practical claim | What it means to them | Reached by |
| --- | --- | --- | --- |
| **Theo** | Main gate, courtyard, harbour at sunset; forty minutes, timed twice | He found the harbour alone and lost on his first night; he wants them to find it together | Staying with him while he talks (`theo.why`, ~12 s, mid-scene) |
| **Nia** | The courtyard gate locks at six; start at half five | It's where she met her first friend here | Turning to her when she tries to get in, or inviting her; she says the personal part only if you stay |
| **Ellis** | Another route: courtyard first, ending on the open ground with the whole campus in view; no harbour | Never said | Turning to him: he speaks only when invited |

Both Theo's harbour and Nia's courtyard are about being welcomed. A player who hears both learns that the conflict is not plan against people. Nobody's claim is the hidden right answer; time spent on one person is time not spent on another.

## Act one: the floor (about 70–90 s, 9:40 to 9:48)

Rules, as built in `listen.js` (`listenTick`) and parameterised in `scripts/listen.json`:

- **Attention** is a discrete choice: click or tap a person, Tab to them and press Enter, arrow keys, or 1/2/3. No hover, no holding, no precision. Pausing stops the clock and sound, and you can still change who you face while paused: that is the untimed alternative.
- **Theo** talks whenever the floor is free. When you turn to someone with something to say, he finishes his sentence and waits.
- **Nia** tries to get in twice, on her own clock (≈9 s and ≈33 s). Her name pulses, a warm light falls on her, her words appear faintly near her, and screen readers hear "Nia is trying to speak." If you turn to her during the attempt (about 4–5 s), Theo stops and she finishes. If not, Theo talks over her; after the second time she says "Never mind" and stops trying, though she still answers a direct invitation. Once she has made her point about the gate, she does not repeat it.
- **Ellis** speaks only when invited. Turning to him: he looks up (a caption says so), then speaks. If you turn away mid-thought, he trails off ("It's fine. Later.") and that thought waits. This is his character, not a universal rule: Theo and Nia speak regardless.
- **Unheard speech** stays perceivable: muffled and quieter in the mix, and a few faint words near the speaker (or at the frame edge) in captions. Essential meaning never depends on sound alone.
- **The chair's own thought** ("Twenty minutes left, and I've only really heard one person.") plays once at ≈24 s if you have only ever faced Theo.
- **Heard** means you faced the speaker for at least 60% of the line, not the last second of it.
- The room runs out at 92 s of scene time, or earlier once nobody has anything left to say. Theo: "Twelve minutes. So, are we agreed?"

## Act two: one untimed choice (unchanged outcomes)

The decision plate, your hands on the table. Two actions on the objects themselves, one line each: **Turn the table** (`round`) or **Pass the slips** (`slips`). These are the registry's two outcomes for `standup`; listening adds none.

What you heard changes what people say and do inside each outcome:

| Outcome | If you heard… | Then | Otherwise |
| --- | --- | --- | --- |
| Turn the table | `theo.why` | You name it: "Could it be its own night?" Theo: "Its own night. Okay." | Theo: "It is. Show me your first stop." |
| Pass the slips | `nia.why` | You read her slip right: "The gate's the problem, not the courtyard." | You misread it, she corrects you, you own it |
| Pass the slips | any of Ellis | He claims "A different start?" and slides his sheet across; Theo: "That works with the gate." | Nobody claims it; the sheet stays folded |

Both outcomes keep a visible cost: the round runs out of room with no ending and the harbour gone ("We've got a start"); the slips leave "Too crowded at the harbour" unowned, and Theo asks who wrote it. Nobody answers.

## Act three: the morning

Dawn grade over the empty table (the clean decision plate), then the notes they leave you, from `scripts/listen.json` `notes`, chosen by outcome and by what you heard. Thanks and cost together; the unsigned slip stays unsigned. One line: *Your attention gave the floor. The format decided who kept it.* Then: **What you didn't hear** (optional: the lines said while you were turned away, voiced, back in the night room), **Again**, **The other way** (the other outcome, with what you heard kept).

The `completed` message (`asterwind.episode.v1`) is posted once, when the notes have landed: the real ending. Nothing listening produces is saved.

## Visual system

- Full-bleed: the plate covers the screen (`stage.js` `S.fit`), the camera leans toward whoever you face, depth of field and a pool of light follow them (`S.spot`). Phones hold one face at a time, with the three names as a row of large buttons; for the choice, the whole table fits the width and the actions sit below it.
- Type: Newsreader (light, optical size) for titles, captions and the lesson; IBM Plex Mono for the few labels; Kalam for handwriting on slips and notes. Local OFL files, `docs/demos/played/fonts/`.
- The opening: the title in the rain on the glass, a dark pill to *Take the chair*. Registration marks, the print-shop's own crosses, frame the title and the morning (Pear's grid, translated into paper theatre).
- Dawn (`S.dawn`): the far glass lifts to first light, the room cools, a soft shaft crosses the table.

## Voices

All of Theo, Nia, Ellis and You use the same local Qwen3-TTS voices as the 7 Nov takes. 21 new lines rendered here by `make-voices-listen.py` (CPU, no cost), checked by Whisper; the report is `qa/voice-report.json` under `listen`. The remaining word-error flags are spelling and numerals ("harbor", "200"), except where noted in the handoff. These are scratch takes, not a listening judgment.

## Limits

- No first-time player has played it yet. Whether people can explain who wants what without a walkthrough is the next human check (see the handoff).
- The listening is real-time with a pause; there is no separate slower pace. Nia's windows are about 4–5 s.
- The consequence plates are the 4 November reference plates; nobody's lips move. Acting is puppet warps, camera and light.
