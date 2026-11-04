# The Missing Name

Original fictional Slide Deck Bitters episode about recognition and authorship. Not an adaptation of Q5 (which concerns coaching weak slides with three days available), and not an allegation about actual teammates.

Asha's field map drives a polished presentation but her attribution is buried. She explicitly agrees to either opening approach. The player chooses one action: move the microphone so Asha introduces her fieldwork, or show the notebook and publicly credit her while keeping the planned pitch. Both repair attribution. The first foregrounds her own framing at the cost of a decorative model reveal; the second keeps the planned arc and invites her to answer a later question, which she accepts.

## Build and test

`python anthology/episodes/slides/build.py` writes a standalone offline `anthology/dist/slides.html`. `node anthology/episodes/slides/test-name.cjs` exercises both branches, consent and public attribution, one untimed decision, pause, duplicate input, replay, completion and session messaging, hidden tabs, raster/fallback loading, and layout bounds.

Protocol `anthology-v1`; id `slides`; outcomes `microphone`, `notebook`. Setup42s; microphone36.5s; notebook36s. Choice holds indefinitely. Captions, speaker labels, keyboard buttons, focus, pause, reduced motion. Generated plates are still-image camera/dissolve animatics, not character animation. No natural dialogue audio yet.

## Verification boundary

Art inspected separately. Node controller tests are not browser rendering QA. No browser policy workaround attempted. Actual responsive playthrough still needs an approved review route.

## Performance and agency revision

Both actions now begin with a silent 1.5-second physical response: microphone pickup or turning the notebook easel. Microphone introduction/handoff shows Asha voluntarily reaching but not speaking; her authored fieldwork follows. Notebook credit shows the lead attributing her work, the model still closed. A separate listening plate carries the later model reveal, audience question and Kit's invitation. Asha's answering outcome appears only at her explicit acceptance. This holds in portrait as well as wide composition without hiding early speech by cropping.

Five inspected generated performance plates added; existing originals and outcomes retained. Nine images preload together, with tested fallback on failure of a newly added frame. Held cuts retain mild material/pose drift; this is not continuous stop-motion or recorded voice performance. Setup42s, microphone38s, notebook37.5s plus untimed choice. One choice, consent baseline and named attribution remain unchanged. Assembled browser playback remains unverified.
