# The Empty Square

Original fictional Dead Pixel Tonic episode about inclusive design and agency. Q8-inspired structural inclusion, not a direct workbook adaptation or a teammate-authored scenario.

Jo is a visiting student designer who uses a wheelchair. A high control panel excludes her comfortable independent operation. Both player actions support her operating the same exhibit herself: pause and lower its adjustable supported console, or connect a smaller duplicate panel immediately. Jo welcomes either and evaluates it for herself, not all disabled people. The first changes the shared arrangement with interruption; the second enables immediate access while retaining a difference in tactile experience. Her boundary about future testing is explicit and is not consent.

**Lived-experience accessibility review remains needed; this fictional script does not establish accessibility adequacy.** No heroic rescue/pity, no inaccessible player-input imitation, no access-versus-exclusion morality choice.

## Build and test

`python anthology/episodes/pixel/build.py` builds `anthology/dist/pixel.html`. `node anthology/episodes/pixel/test-square.cjs` tests both outcomes, agency/boundary lines, one untimed decision, pause/replay, invalid/duplicate input, completion/session messaging, hidden tab, fallback/raster controller and viewport bounds.

Protocol `anthology-v1`, id `pixel`, outcomes `lower`, `connect`. Setup43s, lower29.5s, connect31s. Captions and speaker labels provide all essential dialogue; keyboard controls/focus/reduced motion/pause are available. Generated plates are still-image camera/dissolve animatics, not natural character animation. No recorded dialogue yet.

## Review boundaries

All four generated plates were inspected. The blank square remains cream; no visible tile-light change is claimed. Node tests are not real browser rendering QA. Browser-policy denial respected, no workaround attempted. User testing and lived-experience review remain necessary.
