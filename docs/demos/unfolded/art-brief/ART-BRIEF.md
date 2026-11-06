# Art brief: Leadership, unfolded

For GPT (or any illustrator), via Bob. The game is fully playable now with art I cut in code. This brief asks for painted art that **replaces it piece by piece without changing the staging**. The [templates](templates/) show every composition and state; please match them.

## The one rule: less

The earlier concept images were beautiful and too full. Every frame said ten things, so none of them landed. Each room here is **one idea**:

- **At most two people, one symbolic object, one light** and the set. No crowds, no cityscapes, no extra props, no ornament the beat doesn't need.
- **At least 40% of the frame is quiet paper:** sky, wall, sea, empty floor.
- **Silhouettes that read at thumbnail size:** you should be able to tell who is doing what in a 200 px wide image.
- **One warm practical light per night room** (about 2700 K lantern) against an indigo night. The hilltop is soft dawn.
- **No text, letters, numbers or logos** anywhere. All words are typeset by the code.

## Style (same for every image)

Handmade cut-paper theatre, photographed:
- matte card and tissue with visible fibre;
- hand-cut edges with tiny irregularities;
- two or three tones per piece, with a thin lighter rim where a cut edge catches light;
- soft drop shadows between layers, so there's real depth between 3–5 flat planes, like a toy theatre;
- a straight-on, proscenium camera; no wide-angle distortion and no dramatic perspective.

Faces are simple: profile, one eye, the shape of the nose and mouth. Feeling is carried by **posture, hands and light**, not detailed expressions.

**Palette:**

| Element | Colours |
| --- | --- |
| Night | `#0f1124`–`#2a2f55` |
| Paper cream | `#efe3c8` |
| Lantern | `#ffd890` / `#f4a94e` |
| Sea | `#2c4f6c`–`#4a809c` |
| Wood | `#6b4a32` |
| Dawn | `#a9c3d8` → `#f6e2c2` |

**Recurring "you":**
- the same violet coat (`#4d4466`), dark short hair, gender-ambiguous, in the listener and maker rooms;
- grey hair (`#c9c3bd`) as the mentor and the keeper, the same person later in life.

**Style prompt to prepend to every request:**
> Handmade cut-paper theatre diorama, photographed straight-on. Matte card and tissue with visible paper fibre, hand-cut edges, two or three tones per piece, thin light rim on cut edges, soft drop shadows between 3–5 flat layers. Minimal composition with large quiet areas of plain paper. One warm lantern light against deep indigo night. Simple profile faces; emotion through posture and hands. No text, no letters, no logos, no crowds, no cityscape, no clutter.

**Negative prompt:** busy background, many people, city, ornate details, text, watermark, photorealistic skin, 3D render, glossy plastic, lens flare, dramatic perspective.

## Deliverables and format

- **Canvas:** 3200×1800 PNG, 16:9. The templates are 1600×900, so **double every coordinate** below.
- **Plates:** the room's set and light **with no people and no moving objects**, one per light state listed.
- **Figures:** each character as a **transparent PNG cutout, on the full canvas, standing or sitting exactly at the anchor**, one image per pose listed. The code swaps poses on the beat (replacement animation, about 6 per second). Keep the head and coat identical across a character's poses.
- **Objects:** each moving object as its own transparent PNG on the full canvas, one per state.
- **Naming and placement:**
  - name files `room-layer-state.png`, e.g. `heard-plate-night.png`, `heard-wen-talk.png` or `heard-lantern-water.png`;
  - put each room's files in `docs/demos/unfolded/art/<room>/`;
  - add a `PROVENANCE.md` per room: tool, date, the prompt used, and who curated it.

I'll wire in a loader that uses painted layers wherever they exist and falls back to the code-cut art wherever they don't. Then I'll screen each layer for registration, crop on a phone and reduced motion before anything is adopted.

## Rooms

Coordinates are in template pixels (1600×900).

### heard: The Listening Tide

**Feeling:** someone finally saying the thing out loud. The sea is her worry. It doesn't have to calm.

| Layer | What | Anchor / notes |
| --- | --- | --- |
| Plate, night | Moon high left (300,170); a low harbour wall across the centre (top at y 590, x 380–1220); calm dark sea behind and in front | Leave the space above the wall clear for the two figures |
| Wen (figure) | Seated on the wall facing right; teal coat, long dark hair. Poses: **talk** (hands open), **brace** (head down, shoulders up), **note** (holding a small folded paper), **fold** (folding it into a boat), **settle** | Hip at (610,596), about 430 px tall seated |
| You (figure) | Seated facing left, violet coat. Poses: **hold lantern**, **reach** (hand offered), **set down** (arm lowered to the water) | Hip at (990,596) |
| Waves | 3 bands of paper waves in front of the wall, each in **rough** and **settled** states | Bottom 30% of the frame |
| Objects | Lantern in hand and in the water (with glow); her small boat; her folded note | Lantern in water at (860,700) |

### shared: The Shared Roof

**Feeling:** a roof everyone shelters under, and the small decision of who holds the tool.

| Layer | What | Anchor / notes |
| --- | --- | --- |
| Plate, rain at night | A vast translucent paper roof arching across the top (apex underside about (800,260)), lit warm from below; a high wooden beam at y 560; a long table far below at y 770 with two lanterns and four small seated silhouettes | Quiet dark sky above the roof with rain |
| Plate, the next night | The same, with a second tear at (1230,330) | |
| Arun (figure) | Standing on the beam facing right; red work coat, wild dark hair. Poses: **offer clamp**, **reach up** (stitching), **wait** (looking up, arms down), **mend alone** | Feet at (716,520) |
| You (figure) | Standing facing left. Poses: **take clamp**, **stitch**, **hold the edge** | Feet at (900,520) |
| Objects | The tear (open), a **neat** seam and a **crooked** seam, the brass clamp | Tear at (800,240) |

### shield: What the Armour Keeps

**Feeling:** defensiveness protecting something tender. Only he opens it.

| Layer | What | Anchor / notes |
| --- | --- | --- |
| Plate, night | A quiet workshop wall; one window with a moon at (1180–1420,150–400); a bench at left; a floor lantern at (880,672) | Large calm wall area |
| Leo (figure, armoured) | Seated facing right, wrapped in angular slate-blue paper armour plates that close around him. Poses: **closed**, **bristle** (plates lifted slightly), **one plate open** (he lifts it himself, revealing a small glowing garden with a seedling in a pot inside his chest) | Hip at (600,640) |
| You (figure) | Seated facing left; rust coat, hair in a bun. Poses: **speak** (open palm, low, not touching), **sit quietly** | Hip at (1080,660) |
| Objects | A single green leaf on the bench | |

### help: The Hand That Opens

**Feeling:** trust that doesn't become absence.

| Layer | What | Anchor / notes |
| --- | --- | --- |
| Plate, dawn | A soft blue-to-peach sky, a low sun at (1340,560), one gentle green paper hill cresting around (900,595) | Two-thirds sky |
| Ivy (figure) | Standing at the crest facing right; ochre coat. Poses: **hold the wing**, **straining**, **steady**, **look back** | Feet at (960,756) |
| You, older (figure) | Standing facing right, grey hair. Poses: **three ribbons in hand**, **one ribbon**, **open hands** | Feet at (560,812) |
| Objects | A great translucent feathered paper wing (separate); three ribbons (red, ochre, blue); paper birds in 2 wing poses | Wing at about (980,380), rising to about (1020,150) |

### ship: The Lantern and the Horizon

**Feeling:** one light, or many lights each tended by someone.

| Layer | What | Anchor / notes |
| --- | --- | --- |
| Plate, night | Stars; the sea from y 540; a cream-and-red paper lighthouse at left (x 250–470) with a gallery at y 312; seven small hut shelters on stilts along the horizon (x 840–1464, y 520) | Unlit |
| Plate variant | The same with **all hut windows lit**, and one with **hut 4 flickering** (half lit) | |
| Keeper, older (figure) | On the gallery, grey hair. Poses: **raise the lantern**, **share the flame** (lantern tipped toward Sana), **lower the lantern** (tired) | Feet at about (330,405) |
| Sana (figure) | On the gallery facing left; teal coat. Poses: **empty lantern**, **lit lantern** | Feet at about (446,393) |
| Objects | A lighthouse beam (wedge of light); a small paper boat | |

## Ask for variants only where it helps

- **heard:** two versions of Wen's **brace** pose. It carries the room.
- **shield:** two armour designs, one more origami and one more like layered scales.
- **help:** two wing shapes.

**Everything else:** one good image beats ten options.

## What not to change

Keep the room order, the choices and the lines as they are. If an image suggests a better staging, paint it as an extra option and say why. Bob decides.
