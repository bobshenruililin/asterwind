# Current handoff (keep this short and current)

Updated 6 November 2026 by Opus. Branch `claude/awesome-hypatia-6bf97q`, tested at `a291d81`.

## Play

Serve the repository root with `python3 -m http.server 8000`, then open one of these:

| What | URL | State |
| --- | --- | --- |
| **Draft reimagined night** | `/docs/demos/unfolded/?v=2` | New direction. Corridor → bottle → played scene → roof → dawn notebook. |
| Integrated night | `/docs/demos/unfolded/` | **Known good**; also tagged by commit `42b5d96` and later. |
| The Quiet Minute, played (bespoke) | `/docs/demos/played/` | The audition winner |
| Any film, played (generic) | `/docs/demos/played/scene.html?ep=slides` | Also `scope`, `pixel`, `ship` |
| Pixel audition | `/docs/demos/played/pixel.html` | Comparison only |
| Painterly audition (Astra) | branch `codex/last-light-prototype-20261106` | Comparison only |

**Shareable build:** `python3 scripts/build-play.py` writes `dist/play/` (static, 25 MB). Its root opens the draft night; the integrated night stays at `docs/demos/unfolded/`.

## Checks

- **Source checks (handoff list):** `node film/test-state.cjs`, the anthology and hub tests, `python3 hub/test-build.py`, `node scripts/verify-repo.cjs`.
- **Astra's checks:** `node docs/demos/unfolded/qa/audio-lifecycle.cjs`, `qa/art-layers.cjs`, `python3 scripts/test-play-build.py`, `python3 scripts/play_assets.py`.
- **Browser** (repo served on 8731):
  - `node docs/demos/unfolded/qa/night.cjs <base> <out>`
  - `qa/keyboard.cjs`
  - `qa/audio-browser.cjs <base>`
  - `node docs/demos/played/qa/films.cjs <base> <out> fast`
  - `qa/keyboard.cjs` (played)
  - `qa/night-v2.cjs` (played; exits non-zero on any failed step)

## Read

- `docs/DIRECTION-2026-11-06.md`: what we cut, the audition, the recommendation.
- `docs/ROBERT-PRODUCTION-BRIEF-2026-11-06.md`: P0 object layers and clean plates, P1 reactions, P2 looks, P3 dawn notebook.
- `docs/KLING-PLAN-2026-11-06.md`: one limited experiment, nothing spent.
- `docs/RELEASE-POLISH-REVIEW-2026-11-06.md` (Astra): its fixes are landed and browser-verified.

- `docs/VOICE-AUDITION-2026-11-06.md`: current voice-model research, rights/pricing checks, and a bounded HEARD audition against the team's recordings. Research only; no new audio or paid integration.

## Next, in order

1. Robert's P0 layers for The Quiet Minute, then give the stage real object layers (replacing region slides).
2. Puppet handles (acting) for the four generic films.
3. Convert The Seam: an adapter for `film/story.json`.
4. One optional look per film (P2).
5. Record our voices.
6. Lived-experience review for The Empty Square.
7. Playtest the draft night, then decide what `/play/` publishes.

## Open decisions for Bob

- **Publish `/play/`?** It would put `dist/play/` (built at `a291d81`; 335 files, 25.1 MB) on `pages-runtime` under `/play/`. The current Pages root stays unchanged. Details are in [the PR #1 summary](https://github.com/bobshenruililin/asterwind/pull/1#issuecomment-6685550805).
- **The Empty Square in a shared build:** share it with a line in the playtest note, or hide that bottle until the lived-experience review.
- **Kling experiment K1**: about 90 credits, after P2a and P2b exist.
