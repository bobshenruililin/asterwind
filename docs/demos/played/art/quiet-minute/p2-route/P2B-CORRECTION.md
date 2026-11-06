# P2b v2: Ellis's alternative route

6 November 2026. This correction supersedes the **route content** in `P2b-route-open.png`. Use `P2b-route-open-corrected.png` as K1's end frame. **P2a-route-closed.png is unchanged.** The old P2b is retained only as provenance, not as the approved story route.

## Direction and provenance

Source request: [Opus's P2b v2 direction](https://github.com/bobshenruililin/asterwind/pull/1#issuecomment-6686690345), relayed by the parent under the owner's production request. The original two-gate-to-harbour drawing was Theo's route, not Ellis's. Ellis's route starts at the courtyard and loses the harbour.

Tool: built-in image generation. Edit target: the existing `P2b-route-open.png` from `ea6e1728aeaecd0bc4584ffa6a5e8075103b0ff9`. One edit take, selected by Robert as a candidate for Opus/Bob review. No Kling generation or spending. No code or runtime integration changed.

Output: `P2b-route-open-corrected.png`, native 1672 × 941 RGB PNG, 2,632,674 bytes. SHA-256: `73cbcbd0da9bd03e75a74885ea9f9d69a037e415a09940e9f0a324f32de8037b`.

## Visual check

The corrected frame has one small courtyard arch on the left. One different path crosses the center fold, passes small bench/tree pencil symbols, and ends at a plain dot in open ground lower-right. Three faint waves sit farther right with an obvious blank-paper gap; the route does not reach the harbour. Original P2a hash remains `d27ab696b10ba00b06861e6131bf196b6690c682f76017d6205949a6d451aa32`.

The hands, sleeves, pencil and sheet outline remain visually aligned. **The generator still redraws texture outside the graphite; this is not a pixel-exact masked edit.** Compared with old P2b, mean absolute RGB differences are 8.66/255 for the left-hand crop, 9.67/255 for the right-hand crop, 10.61/255 for the pencil crop, and 6.80/255 on the lower table. These are simple measurements, not a perceptual pass threshold. Check texture shimmer and the hand/fold motion in the actual K1 output. P2a's earlier right-hand grip caveat remains.

## Exact prompt

Use case: precise-object-edit. Asset: Asterwind The Quiet Minute K1 P2b OPEN route end frame, corrected route drawing only.
Edit the supplied existing P2b image. Preserve its EXACT 1672×941 canvas, fixed camera, composition, both paper hands, plum sleeves, finger shapes and positions, cream sheet and vertical center fold, paper edges, shadows, yellow-orange pencil, warm wooden table and all lighting. This is a surgical graphite-drawing correction, not a new composition. Change only the graphite marks on the paper.
Replace the present two-gate route drawing with Ellis's alternative route:
1. Exactly ONE small simple courtyard arch line-drawing on the LEFT panel, near the existing upper-left arch location. A modest single arch, not a grand ornate gateway. Remove the second arch completely.
2. From the single courtyard arch, draw ONE fine pencilled route curving rightward across the central fold and passing small, understated line-drawn bench and tree marks around the middle of the sheet. Bench mark near the lower-middle-left of the route; tree mark farther to the right, just above the route. These are tiny two-dimensional graphite map symbols, not new physical props.
3. The line ends at a small solid graphite dot on open blank ground in the lower RIGHT part of the paper, around x=1080,y=715. Leave unmistakable empty cream paper around that terminal dot.
4. Farther RIGHT, near the paper's right edge around x=1210–1290, keep three very faint short wave lines. The route and its endpoint MUST NOT reach, touch or connect to those waves. Leave a clearly visible gap of blank paper between the endpoint and the waves: this different route does not reach the harbour.
The emotional beat is an alternative route through a quieter, less picturesque space. One courtyard arch, one crossing route, a bench and a tree as pencil marks, one terminal dot in open ground. No other gates, no new creases, no words, letters or numbers. Do not redraw anything outside the graphite marks. Keep original paper fibers visible where old marks are removed. Single image, no labels, no montage.
