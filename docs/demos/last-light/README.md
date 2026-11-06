# The Last Light

An isolated Asterwind creative experiment. A storm, a keeper, a departing traveler, and one portable light. This is a new story/style audition, not an adopted replacement for the existing anthology or a canonical portrayal of its cast.

## Play

Open `index.html` in a current browser after unpacking the complete folder, or serve the repository with `python3 -m http.server 8000` and open `http://localhost:8000/docs/demos/last-light/`.

The player begins once, watches the boat arrive, then makes one consequential choice: carry the lantern to the shore or to the traveler. Dragging is optional; both destinations are semantic buttons supporting touch and keyboard. There is no timer, correct answer, score, precision gate, or required post-choice explanation.

Arrival takes 17 seconds; the consequence takes 43. Total authored runtime is 60 seconds plus the player's untimed decision, normally intended as a 60–90-second slice. That range is a design target, not measured playtest data.

- On shore: the light stays by the jetty and a visibly distinct fishing boat approaches it.
- With the traveler: the light moves into the departing boat and dwindles across the sea.
- Optional sound is synthesized locally. No account, API, network request, font service, runtime install, or storage permission is needed.
- Pause, replay, captions, reduced motion and keyboard alternatives are built in. Hidden tabs pause and require deliberate continuation.

## What this tests

This is a painterly direction selected for the experiment, not evidence that painterly art should beat pixel art or paper everywhere. Six generated production assets are already composed in the running scene. Rain, water highlights, wind, light reflections, boat movement, a two-pose departure, and the carried lantern are live, not an exported movie behind buttons.

The decision sits on the objects in the scene. The light's actual position, destination and reflection change with the action, and the ending changes what arrives or leaves. There is no vocabulary puzzle, intermediary reward object, or second decision before the consequence.

## Fair comparison with Opus's integrated build

Baseline: `claude/awesome-hypatia-6bf97q` at `42b5d965e005a2a49eec49851db8463850b179fa`. This branch was based on the separate tested release-polish stack `dee454616be9e2acacd0426ba35180a04ced8a1a`; it adds only this new demo directory.

The integrated build has a six-room route, multiple films, persistent progression, a fold/coda structure, and far broader narrative and accessibility work. This prototype has one scene and no progression or backend. It does not replace that work or prove superior overall quality.

The experiment deliberately tests three narrower improvements: coherent textured scene art rather than switching from code puppets to painted films; fewer interaction gates; and an object-level action with a visible consequence. Those are design claims requiring side-by-side play, not user preference findings.

Remaining creative limits: figures use painted key poses rather than full acting, the keeper's return is translated artwork rather than a walk cycle, the transition between boat views is a brief dissolve, and the sea's base wave texture is painted rather than fluid simulation. The story needs a real first-play comprehension test. Do not describe it as finished animation or award-ready.

## Verified and pending

Passed locally:

- `node docs/demos/last-light/qa/test.cjs`: 31 model and DOM-harness regression checks, including both endings, drag/button parity, repeat clicks, replay, pause, hidden tabs, modal focus boundaries, BFCache lifecycle, image-load failure and explicit sound enablement.
- Syntax checks for all JS.
- Six frames rendered using the actual production Canvas renderer via `qa/render.cjs`; visual inspection caught and corrected the lantern hand registration, a reversed traveling light, the illegible second-boat payoff, and a squashed sprite turn.
- `python3 docs/demos/last-light/build.py`: self-contained ZIP with byte-for-byte hashes and ZIP integrity validation.

Not run: actual browser interaction/layout, physical touch devices, screen readers, listening/audio quality, offline browser playback, or measured frame-rate/memory profiling. Chromium launch was blocked by the execution environment's OS socket permission, including an approved launch attempt for the preceding review. Source mocks and Canvas snapshots are not substitutes for these checks.

`qa/browser.cjs` is a fail-fast browser flow for a permitted host. Serve the repository, then run `node docs/demos/last-light/qa/browser.cjs http://localhost:8000/docs/demos/last-light/ /tmp/last-light-browser`. It has not been executed here. Optionally set `CHROMIUM_PATH` to an already installed browser.

This prototype is not linked into the existing journey, export script or main menu. It has no deployment and no PR. The separate ZIP is intentional so existing work remains untouched.

## Next editorial test

Play both versions without coaching. Ask what the lantern decision means before committing, then ask what visibly changed afterward. Watch whether people discover the destinations without dragging instructions. Review the scene at 390px before deciding on a broader art direction. If adopted, replace the keeper's slide with a short textured walk/turn cycle and test a restrained 3–4-second reaction shot; no video credits have been spent.
