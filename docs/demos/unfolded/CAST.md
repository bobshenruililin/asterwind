# Cast: one "you", the people in the films, and what I need from Robert

6 November 2026, Opus, for Bob and Robert. **Decisions for Bob are in bold**, and nothing here is locked until Bob says so.

**I haven't seen Robert's candidate pack.** `Asterwind-Heard-Cast-Candidates-A.zip` didn't reach this machine and isn't on any branch. Robert: please push it, for example to `collab/paper-forest-20261105` under `cast/` or to a new `collab/cast-20261106` branch, and I'll screen the actual pixels in the scene. Until then, my notes on Wen and the violet "you" go only by your description.

## 1. Who "you" are: Ren

The briefs disagreed:
- my art brief had a violet coat, plus a grey-haired mentor and keeper;
- the shield room had a rust coat and a bun;
- the films already decided.

| Source | What it says about the lead |
| --- | --- |
| *The 3:00 AM Seam* (`film/story.json`) | "Ren, you're leading this." |
| *One More Chair* (`anthology/episodes/scope/story.json`) | The lead speaks as **Ren** |
| *The Quiet Minute* casting (`anthology/episodes/standup/assets/reference-v1/README.md`) | "lead **indigo** sleeves / short dark hair" |

**Proposal: "you" is Ren, all night, every room.**

- **One person, one age:**
  - indigo coat (`#3f4775`, shadow `#2f355a`), short dark hair;
  - gender left open, and never a pronoun in any line;
  - no grey-haired versions, because it's one night now, not a life.
- **In the game now:**
  - Ren in every room;
  - the violet coat, the grey hair and the rust coat are gone.
- **In films**, Ren is mostly seen from behind or in the hands (*The Quiet Minute* frames the lead from behind). Keep that: Ren is the player's body, not a face to perform.
- **For Robert:** your violet "younger you" becomes indigo. Keep everything else that's working: construction, edge, proportion.

## 2. The rooms take their people from the films

Each room is the inside of one person *in* its film. That's how the films become one world.

| Room | Person | Locked by | Reference that controls identity | Status |
| --- | --- | --- | --- | --- |
| heard | **Ellis** | *The Quiet Minute* casting | Plum overshirt, round glasses, short wavy black hair (`anthology/episodes/standup/assets/reference-v1/01-quiet-minute-master.webp`, right) | **In the game now** (code-cut) |
| lead | **Asha** | *The Missing Name* | `anthology/episodes/slides/assets/master.webp` | Room proposed |
| shared | **Julian** (replaces Arun) | *The 3:00 AM Seam* | `film/assets/julian.webp` | Recast proposed |
| shield | **Dev** (replaces Leo) | *Before the Doors Open* | `anthology/episodes/ship/assets/master.webp` | Recast proposed |
| help | Ivy (for now) | — | — | **Hold.** Recasting as Jo (*The Empty Square*) needs lived-experience review first. |
| ship | **Sam** (replaces Sana) | *One More Chair* | `anthology/episodes/scope/assets/runtime/master.webp` | Room proposed |

### Wen

**Decision for Bob: Ellis or Wen for HEARD?** My recommendation is Ellis:

- the film's caption "Ellis lowers a pencil. Another route stays folded" is the room's whole subject;
- the folded paper in Ellis's hand is already in the film's locked art;
- the film's round branch pays it off: "Mine starts here. But we'd lose the harbour."

Robert's Wen work isn't wasted. Muted teal is **Nia**'s colour in the same film (teal cardigan, black bob), so Wen's construction and expression studies carry straight over if Nia gets a moment. Or Wen can simply be retired. Bob decides.

## 3. HEARD: exactly what I need, in order

**Format and placement:**
- Everything registers to the template sheet: [`art-brief/templates/heard-v2-poses.jpg`](art-brief/templates/heard-v2-poses.jpg). These are code-cut poses rendered from the playable room; the red + marks are the hip anchors.
- **Canvas:** 3200×1800, 16:9. Double every 1600-space coordinate.
- **Figures:** transparent PNG on the full canvas, standing exactly at the anchor.
- **Where to put them:** `docs/demos/unfolded/art/heard/`, listed in `art/index.json` (format in [`art/README.md`](art/README.md)), with a `PROVENANCE.md`.
- **Swapping in:** the loader already swaps them in. Run with `?art=art` once `index.json` lists them (that's also the default). `?art=art-standin` shows the tinted test set proving the route.

| Ticket | Asset | Exact spec | Notes |
| --- | --- | --- | --- |
| **H-00** | Canon sheets: **Ren** and **Ellis** | Front, profile facing left, profile facing right, three-quarter; one hands row each: open palm, lantern handle, folded paper held, folding | Locks identity before poses. Neutral grey card, even light. |
| **H-01** | Plate, night | Moon at (600,340); harbour wall top y 1180, x 760–2440; dark sea behind (static) | No people, no lantern, no front waves. At least 40% quiet sky. |
| **H-02** | Ellis × 8 poses | talk · low · brace · lift · close · open · fold · settle | Hip (1220,1192), seated, about 860 px tall. Head, glasses and coat identical across poses. *open* holds the route sheet unfolded; *close* hides it in one fist; *fold* is mid-fold. |
| **H-03** | Ren × 4 poses | hold (lantern) · speak (hand open, reaching) · setdown (arm lowered to the water) · sit | Hip (1980,1192), facing left. The lantern is a separate layer, not in the hand. |
| **H-04** | Objects | Lantern (lit, with glow as its own layer); lantern on water; the route sheet (open); Ellis's paper boat folded from that sheet | The boat must show the same pencil route, crease for crease |
| H-05 (optional) | Front waves × 3 bands × rough / settled | Bottom 30% | The code waves are fine. Only if painted ones are better. |

**Variants:** two takes of **brace** only. It carries the room.

**Acceptance:**
- registration within 2% against the template;
- reads at 200 px wide;
- hands right;
- no text;
- one warm practical light;
- the phone crop (the room sits in a 16:9 box) keeps both faces.

**Cost:** any generation that spends credits goes past Bob first.

## 4. A challenge, Robert: go further than the template

The templates show *where*; they're deliberately plain. Here's what I hope the paint does that code can't:

1. **Make the route sheet real.**
   - Print a route on thin paper, fold it into the boat by hand, and photograph each stage.
   - The boat in the room should be *that* paper, crease lines and all.
   - If that's practical, it's the single most powerful thing in the room.
2. **One contradiction per frame.** Ellis sits at the harbour, the one place Ellis's own route never reaches. Put that tension in the posture: turned towards the sea, holding a route that never gets there.
3. **One gesture that's only Ellis's.** For example, a thumb pressing the fold flat again and again. If the canon sheet finds it, I'll time the poses around it.
4. **Light as consequence.** The lantern held high lights faces; on the water, it lights the sea and leaves faces in shadow. If a plate or figure needs relighting for the *setdown* state, paint both, and I'll switch them on the beat.
5. **Less.** Two people, one paper, one light, and a lot of night. If a beautiful extra wants in, it belongs in a different room.

## 5. What happens when files land

1. I screen them in the playable scene: registration overlay, phone crop, reduced motion, both branches.
2. I post screenshots and candid notes in PR #1.
3. Bob approves.
4. `art/index.json` lists them, and the code-cut layer stays as the fallback.

Nothing is adopted on my say-so.
