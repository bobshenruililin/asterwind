# HEARD: Ren and Ellis cast candidates A

6 November 2026. Robert to Opus and Bob.

**Exploratory references for review. Not approved canon, production art, or runtime sprites.** This handoff makes the exact existing candidate bytes available in the repository. It does not decide that Ren leads every room, replace Wen with Ellis, recast Wen as Nia, or adopt an asset.

## Open these first

- [Ren candidate](Asterwind-Heard-Ren-Cast-Candidate-A.png)
- [Ellis candidate](Asterwind-Heard-Ellis-Cast-Candidate-A.png)
- [Original ZIP](Asterwind-Heard-Ren-Ellis-Candidates-A.zip)
- [Provenance and byte checks](PROVENANCE.md)
- [Original review notes](Asterwind-Heard-Ren-Ellis-Review-Notes.txt)
- Original generation prompts: [Ren](Ren-prompt.txt) and [Ellis](Ellis-prompt.txt)

The ZIP's actual filename is **Asterwind-Heard-Ren-Ellis-Candidates-A.zip**, rather than the **Asterwind-Heard-Cast-Candidates-A.zip** name in the earlier request. The standalone PNGs are byte-identical to the PNGs inside it. No image was regenerated, resized, cropped, background-removed, or retouched for this transfer.

## What this answers

This is the first review pass toward **H-00**, in [Opus's CAST.md at 3b81078](https://github.com/bobshenruililin/asterwind/blob/3b81078d30e4ed5cc5eca830bddfa2c146779fb3/docs/demos/unfolded/CAST.md). Each board shows front, both profiles and a left-facing three-quarter figure, plus open-palm, handle-grip, paper-held and folding studies.

**Both PNGs are 1672 × 941, opaque RGB on neutral grey.** They are whole reference boards, not transparent 3200 × 1800 figure layers. Do not put them into `art/index.json` or claim they satisfy the registered pose, phone-crop, or in-scene lighting requirements.

## Caveats to keep visible during review

- **Ren's face is inferred.** The film controls the indigo sleeves and short dark hair, but mostly shows Ren from behind. This front face is a proposal, not verified film continuity. The board has no back view.
- **Ellis is a generated interpretation of the film's right-hand figure.** The glasses, short wavy hair, plum overshirt and grey shirt follow that reference. Charcoal trousers and brown shoes are provisional completions of a seated character whose lower body is not established there.
- **The folded-paper-held study is imperfect on both sheets.** It shows a partly open creased sheet, not the compact folded packet requested. Ellis's folding gesture does not yet establish a distinctive thumb-pressing signature.
- Hair, costume and proportions drift slightly between views. These are useful selection references, not mechanically registered rotations.
- The blank paper is not the actual route sheet or boat. No crease-for-crease route-to-boat continuity has been produced.
- H-01 through H-04 remain outstanding. These boards supply no night plate, registered pose set, lantern, route sheet or boat.

## Review request for Opus

Please inspect the actual PNGs beside [The Quiet Minute master](https://github.com/bobshenruililin/asterwind/blob/3b81078d30e4ed5cc5eca830bddfa2c146779fb3/anthology/episodes/standup/assets/reference-v1/01-quiet-minute-master.webp) and its [casting notes](https://github.com/bobshenruililin/asterwind/blob/3b81078d30e4ed5cc5eca830bddfa2c146779fb3/anthology/episodes/standup/assets/reference-v1/README.md), then return the smallest specific corrections needed before a pose batch:

1. Does the material construction and silhouette fit the film?
2. Which Ren facial or back-view decisions must remain unresolved?
3. Where do Ellis's glasses, hair, age impression or overshirt drift?
4. What should change in the paper-held and folding studies?

Post candid notes and, if useful, a labelled comparison in [PR #1](https://github.com/bobshenruililin/asterwind/pull/1). Any scene mock-up must remain clearly candidate-only. After the casting decision and reference selection, correct the hand state, add Ren's back view, and test one Ellis brace plus Ren hold/setdown against the [exact pose template](https://github.com/bobshenruililin/asterwind/blob/3b81078d30e4ed5cc5eca830bddfa2c146779fb3/docs/demos/unfolded/art-brief/templates/heard-v2-poses.jpg) before batching production layers.

## Transfer verification

- Both original PNGs opened successfully and were visually inspected.
- Dimensions, RGB mode and absence of alpha verified.
- ZIP integrity checked; both extracted PNG digests match the standalone originals.
- Original ZIP, PNGs, prompts and review-note bytes preserved.
- Only this new candidate directory is added. Runtime files, story text, registry, loader, art manifest, saves and deployment are unchanged.
- Runtime/build/browser checks were not run for this reference-only transfer. Registration, 200-pixel reading, phone crop, reduced motion and both-branch lighting are **not tested**.

The original review note is retained as a historical snapshot. Its statement that nothing had been uploaded to GitHub describes the time the pack was created; this handoff supersedes only that delivery status, not any creative approval.
