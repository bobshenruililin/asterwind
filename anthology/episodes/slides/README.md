# The Missing Name

Original fictional Slide Deck Bitters episode about recognition and authorship. Not an adaptation of Q5 (which concerns coaching weak slides with three days available), and not an allegation about actual teammates.

Asha's field map drives a polished presentation but her attribution is buried. She explicitly agrees to either opening approach. The player chooses one action: move the microphone so Asha introduces her fieldwork, or show the notebook and publicly credit her while keeping the planned pitch. Both repair attribution. The first foregrounds her own framing at the cost of a decorative model reveal; the second keeps the planned arc and invites her to answer a later question, which she accepts.

## Build and test

`python anthology/episodes/slides/build.py` writes a standalone offline `anthology/dist/slides.html`. `node anthology/episodes/slides/test-name.cjs` exercises both branches, consent and public attribution, one untimed decision, pause, duplicate input, replay, completion and session messaging, hidden tabs, raster/fallback loading, and layout bounds.

Protocol `anthology-v1`; id `slides`; outcomes `microphone`, `notebook`. Setup42s; microphone36.5s; notebook36s. Choice holds indefinitely. Captions, speaker labels, keyboard buttons, focus, pause, reduced motion. Generated plates are still-image camera/dissolve animatics, not character animation. No natural dialogue audio yet.

## Verification boundary

Art inspected separately. Node controller tests are not browser rendering QA. No browser policy workaround attempted. Actual responsive playthrough still needs an approved review route.
