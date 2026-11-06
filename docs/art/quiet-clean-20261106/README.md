# The Quiet Minute: clean-plate candidates

Three newly generated full-frame PNG candidates, made 6 November 2026 from the existing [decision image](../../../anthology/episodes/standup/assets/reference-v1/02-turn-or-pass-decision.webp). **Review candidates only. No production adoption, merge, deployment or runtime changes.**

## Files

- [Take 1](quiet-clean-take-01.png): native **1672 × 941**.
- [Take 2](quiet-clean-take-02.png): native **1672 × 941**.
- [Take 3](quiet-clean-take-03.png): native **1672 × 941**, best measured integer-pixel alignment.
- [Comparison page](index.html): open locally, choose a take, and toggle the source image. Proportional fit at up to 1280px wide; no cropping.
- [Machine-readable provenance](provenance.json) and [registration measurements](qa/measurements.json).

Each take removes the round model platter, its entire miniature scene, and the rectangular paper-slips tray including the slips. The small foreground wooden token remains. No new props or text were observed.

## Acceptance results

**Native dimensions: pass for all delivered takes.** They are raw generated outputs, not resized repairs. Two additional generations had incorrect dimensions (1671 × 941 and 1602 × 981) and were excluded.

**Exact unchanged-pixel preservation: fail for all takes.** The tool subtly regenerated textures and details outside the removal regions. The source has not been composited back over these outputs. Do not treat any candidate as a mathematically locked inpaint or silently substitute it into production.

**Local registration diagnostic:** normalized cross-correlation over ten unchanged-detail patches (faces, glasses, hands, maps, token and window), with ±8px translation search:

- Take 1: largest best-match translation 1px; minimum correlation 0.89329.
- Take 2: largest best-match translation 1px; minimum correlation 0.90583.
- Take 3: best-match translation 0px in every tested patch; minimum correlation 0.88353.

Take 3 is the first candidate to screen for alignment. These measurements only test local integer-pixel translation and do not prove exact facial identity, nonrigid geometry, lighting or texture preservation. The detailed report includes every sampled region and pixel error.

**Source-scale visual inspection:** both removal regions read as continuous reddish wooden tabletop; no obvious remaining platter edge, tray edge, paper slip, miniature model, cast-shadow ghost or added object was seen. Camera composition, character poses, maps, pencil and foreground token are visually retained. Wood texture is regenerated and somewhat regularized; identity/light/wood are not pixel-identical. This is a visual assessment, not an automated proof of absence.

**1280px and phone-width rendered review: not completed.** Local Chromium failed before opening a page because the execution environment prohibited its process socket. A reviewed escalation did not resolve the runtime error. The available cloud browser rejected local file URLs. No browser screenshots were produced and neither viewport is marked passed. The comparison page and capture script are supplied for a working browser environment. There was no physical-device or in-game check.

## Recheck

From the repository root, with Pillow, NumPy and SciPy already available:

```sh
python docs/art/quiet-clean-20261106/qa/check-assets.py
```

In an environment with Playwright and working Chromium, the capture script attempts 1280px and 390px proportional asset screenshots. The executable path is currently `/usr/bin/chromium`; adapt only that path if the installed browser differs.

```sh
node docs/art/quiet-clean-20261106/qa/capture.cjs
```

The comparison page itself has no external network or package dependency. The generation prompt is not included in this public repository. Source attribution remains with the existing episode asset.

## Next acceptance gate

Screen all three in the actual game at 1280px and phone width, including a source/plate toggle and the intended animated foreground layers. If strict pixel lock is required, use a controlled masked-compositing workflow that restores untouched source pixels; these full-frame generated candidates alone do not satisfy that requirement. Keep the known-good source until a candidate is explicitly accepted.
