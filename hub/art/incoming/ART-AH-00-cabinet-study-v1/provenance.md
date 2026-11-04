# ART-AH-00: first cabinet material study

Delivered for the existing-study request in `docs/AFTER-HOURS-ASSET-REQUESTS.md`. This is a material and lighting study for registration review, not an accepted ART-AH-01 machine face.

## Partial delivery: original transfer outstanding

This review branch contains only the WebP derivative and this provenance file. The original PNG is preserved separately and is not present on GitHub. Its binary transfer did not complete; the expected Git blob was absent on the subsequent read-only check. ART-AH-00 therefore remains partially delivered, not fully compliant. The original checksum below allows a later unchanged-file transfer to be verified.

## Files and integrity

- Original PNG (**not included in this branch**): preserved byte-for-byte unchanged. RGBA PNG, **971 × 1619**, **2,070,662 bytes**. SHA-256: `f535262ee79054ee2d723ca55ba7259ac49cefa7e6aa62f411cc22e3ce0643e0`.
- `cabinet-study.webp`: review derivative, **971 × 1619**, **359,122 bytes**. SHA-256: `bde7dbd83618d279aca13638036b03b91b78b1b9c1e74a8d4b13c0df71da1fda`. Encoded with Pillow 13.0.0, WebP quality 90, method 6, exact enabled. No crop, resize, repaint or compositing. Decoded alpha is byte-identical to the original alpha; RGB uses lossy WebP compression.

## Generation source

- Tool: OpenAI `image_gen`; the precise underlying model version was not independently recorded for this delivery.
- Generation date in the source record: 5 November 2026, UTC+08:00. Delivery prepared 4 November 2026, UTC.
- Reference images, in order: `hub/assets/corridor.webp`, `hub/assets/studio-opening.webp`, `hub/art/templates/machine-guide.webp`. These were material/light references first and an approximate geometry reference third.
- This delivery reuses the requested existing study. No new generation or rejected variant is part of ART-AH-00.

### Original generation prompt

> Create a production concept for a handmade-paper theatrical game. Reference first and second images for physical material and warm amber / cool indigo light; third image is ONLY approximate cabinet layout, ignore its colored annotations and all words. A mature, quietly beautiful late-night vending machine front made from thick painted paperboard, muted aged sage, fibrous cut edges, layered card, folded seams, subtle rubbed brass fasteners; photographed miniature theater prop, matching reference. Straight-on orthographic front face, isolated transparent background. Large rectangular empty viewing opening taking most of left center, smaller pickup opening below, narrow right hand control zone, plain sign panel at top. No bottles, people, lettering, UI or neon. The openings transparent, for separate interactive layers. No excessive decorative ornament. This is a visual exploration; exact pixel registration will be checked later.

## What it tests and what remains

The study tests fibrous cut edges, visibly layered card, muted aged sage, amber light from the left and cool indigo fill from the right. The intention is to bring the dispenser closer to the photographed paper-miniature corridor and stories while leaving the viewing and pickup openings available for interactive layers.

The image was visually inspected. Original integrity, image dimensions and derivative alpha preservation were checked. It is **not** on the 1200 × 2000 machine template, and no claim of ±4 px registration, correct control positions or fully cleared template holes is made. The sign is intentionally blank; the six key colours and current production layout were not requirements of this earlier exploration.

Please use `hub/qa/align.html` to register this study and export review crops, then screen a candidate manifest at 1440 × 900 and 390 × 844 before acceptance. Registration, composed browser QA and any slicing remain pending. No production manifest, source code, story, main branch or deployment is changed by this delivery. The existing placeholders remain authoritative until a candidate passes review.
