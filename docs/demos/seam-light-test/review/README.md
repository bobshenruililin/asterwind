# Review renders (rough demo)

Rendered from `docs/demos/seam-light-test/` at `ed436b2` with `render.cjs`: Chromium 153 headless, 1280×720, 24 fps, H.264 + AAC. These are review copies for the Creative Exchange, not delivered film. Every line is approved. Voices, where present, are the existing flite timing guides (`-tempvoice`); all other sound is synthesised in the page. Captions are burned in, and the director's shot notes are shown in the top-right corner.

| File | What it is | Length |
| --- | --- | --- |
| `light-test-repair.mp4` | Interactive light test, scripted: setup → light set on the original → hold → morning | 68.5 s |
| `light-test-backup.mp4` | The same, choosing the spare (the approved backup lines, causal problem visible on purpose) | 65.7 s |
| `cut-A-robert.mp4` / `-tempvoice` | Robert's *Hold it there*, as written | 23.2 s |
| `cut-B-opus.mp4` / `-tempvoice` | Opus's *Where the light goes* | 26.2 s |
| `*-sheet.jpg` | A frame every 2 s | — |

Audio was measured, not heard. Peak levels: -4.3 to -5.3 dBFS with voices, -12.6 to -17.2 dBFS without; no clipped samples. `SHA256SUMS` lists the files.
