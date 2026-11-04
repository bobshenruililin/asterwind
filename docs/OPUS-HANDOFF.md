# Opus frontend handoff

Prepared 4 November 2026 from repository `bobshenruililin/asterwind` at verified `main` commit [`d2037277a63cc56325dbed264d7b0c73635a2111`](https://github.com/bobshenruililin/asterwind/commit/d2037277a63cc56325dbed264d7b0c73635a2111). Recheck the remote head and your working tree before starting. This is an additive collaboration setup, not a frontend implementation or a new visual approval.

## Brief

Make Asterwind feel like a crafted, cinematic paper-theatre experience. Improve composition, responsive staging, tactile interaction, continuity and visual finish without losing the working stories. The whole viewport is the stage; choices belong to the people and objects in it. Keep the experience emotionally legible without turning it into a quiz, dashboard or explanation-heavy interface.

Start with [AGENTS.md](../AGENTS.md). Read the [creative direction](CREATIVE-DIRECTION-2026-11-03.md) for intent and [the earlier handoff](HANDOFF.md) for source attribution and publication boundaries. Both contain dated proposals and historical implementation facts. For the current anthology, inspect the registry, controllers and per-episode READMEs below. Do not revive older claims that only one drink plays or that the coda is merely decorative.

## What exists at the baseline

- [hub/](../hub/README.md): the six-drink dispenser, corridor/reveal, iframe lifecycle, Return, error recovery and history handling.
- [anthology/registry.json](../anthology/registry.json): the authoritative lineup and allowed outcomes. All six entries are playable review prototypes, not finished animated films.
- [film/](../film/README.md): The 3:00 AM Seam, the original legacy-adapter film. Local stills and optional synthetic timing cues; these are not acted voices.
- [anthology/episodes/](../anthology/episodes): five additional original fictional episodes with their own story, art, layout, timeline and controller files.
- [anthology/progress.js](../anthology/progress.js): versioned allowlisted ending completion, validated iframe source/session/episode messages and storage-failure fallback.
- [hub/MECHANISM.md](../hub/MECHANISM.md) and [hub/mechanism.js](../hub/mechanism.js): an optional six-fold alignment coda. Either valid ending releases that episode's fold. All six folds must be released and aligned for the table; watching both endings is not required.
- [app/](../app): preserved nine-scenario, 36-option source-grounded experience. It is separate from the six original-fiction films. Do not overwrite it during a frontend pass.

### Preserve this route and outcome contract

| ID | Drink / story | Allowed outcomes |
| --- | --- | --- |
| `seam` | 3:00 AM Cold Brew / The 3:00 AM Seam | `backup`, `repair` |
| `scope` | Scope Creep Fizz / One More Chair | `extend`, `return` |
| `slides` | Slide Deck Bitters / The Missing Name | `microphone`, `notebook` |
| `pixel` | Dead Pixel Tonic / The Empty Square | `lower`, `connect` |
| `standup` | Standup Seltzer / The Quiet Minute | `round`, `slips` |
| `ship` | Ship-It Ginger Ale / Before the Doors Open | `live`, `rehearsal` |

Keep one meaningful untimed choice per film, followed by automatic consequences. Opening a drink, making a choice, pausing or receiving a stale callback must never count as completion. Keep saves compatible and play possible when local storage is blocked. The coda remains optional and never blocks entry to a story.

## Responsibilities and working agreement

- **Opus frontend pass:** own composition, layout, affordances, motion restraint, accessible controls and browser evidence for a bounded surface. Propose broad architecture or story changes separately rather than treating them as necessary cleanup.
- **Art requests:** use [ASSET-REQUEST-TEMPLATE.md](ASSET-REQUEST-TEMPLATE.md) in the implementation PR. Robert can read the request through GitHub and coordinate a response when the relevant tools and permissions are available. Keep the existing art or vector fallback usable while a request is pending.
- **Review:** use [FRONTEND-REVIEW-TEMPLATE.md](FRONTEND-REVIEW-TEMPLATE.md). Put decisions, exact commits, screenshots and outstanding requests in the PR conversation, not only a private model chat. Do not invent an account to mention or assign.
- **Access:** this handoff does not connect Opus, grant repository access, launch a session or send a direct message. Use the repository only through the access actually available in the working environment. If GitHub writes are unavailable, return a patch and the intended PR text instead of claiming publication.

GitHub is the durable exchange point. Comments are read when the collaboration is resumed or checked; no real-time watcher, webhook, bot or automated reviewer is installed by this setup. A posted request is not proof that it was read or fulfilled.

## First implementation loop

1. Read the current remote head, branch status, relevant docs and actual code. Inspect the running hub and one story before proposing a redesign. Record the base SHA and any pre-existing dirty work; do not reset it.
2. Create a feature branch from the current baseline, carrying this documentation by cherry-pick or branch ancestry if needed. Keep changes separate from `main` and `pages-runtime`. Coordinate shared files such as the registry, hub controller and progression module explicitly in the PR.
3. Write a short visual plan: what should feel better, the surface you will change, and how you will recognize success. A useful first slice is the dispenser-to-film transition plus one representative story choice in portrait and desktop, before propagating a visual system to the other stories.
4. Implement the bounded pass using the existing static stack. Preserve source art, story timing, consent/agency, captions, attribution and the route/outcome contract. Immediate action feedback must precede the consequence and must not preview another character's reaction before choosing.
5. Run affected checks and rebuild exports. Review actual pixels and complete playback in a permitted browser. Iterate from screenshots and behavior, not only source inspection.
6. Open or update a **draft PR** with the review template. Request one clear decision or list concrete remaining issues. Review feedback should identify the exact file/beat and desired player outcome. Keep review corrections on that branch, rerun affected checks, and name the new tested SHA.

No merge, deployment, paid media generation, repository visibility change, new credential, permission expansion or tool installation is part of this handoff. Do not copy private chats, account details or secrets into repository comments or files. A source repository's current visibility does not establish permission to publish additional material.

## Local build and checks

The player has no runtime package install, backend, account, API key or network dependency. Development checks use existing Python 3 and Node. From the repository root:

```sh
python3 film/build.py
python3 anthology/build-all.py
python3 hub/build.py

node film/test-state.cjs
node anthology/test-anthology.cjs
node anthology/test-art.cjs
node anthology/episodes/standup/test-quiet.cjs
node anthology/episodes/ship/test-doors.cjs
node anthology/episodes/slides/test-name.cjs
node anthology/episodes/pixel/test-square.cjs

node hub/test-state.cjs
node hub/test-layout.cjs
node hub/test-mechanism.cjs
node hub/test-legacy-completion.cjs
node hub/test-bridge.cjs
python3 hub/test-build.py

node qa/state-tests.cjs
node scripts/verify-repo.cjs
```

Build order matters: `hub/build.py` embeds the film and anthology exports. `film/data.js` is generated; edit its sources instead. Keep large embedded `dist/` output out of commits unless the delivery task explicitly calls for it. Do not use an asset generation tool as an undocumented build dependency.

For modular local review, an existing Python installation can serve the repository with `python3 -m http.server 8000`; open `http://localhost:8000/hub/`. Also test the exported `hub/dist/index.html` as an offline file, with network unavailable, in a browser where this is permitted. Successful inlining checks alone do not prove offline playback.

### Browser coverage and known limitations

State and layout-formula tests are not rendered visual QA. Existing screenshots and prior test reports are historical evidence, not proof of a later commit.

At the baseline, `hub/qa/browser.cjs` is an **outdated smoke test**: it still tries `[data-id="nod"]` and expects an unavailable preview, although the lineup now has six playable stories. Update that test to the current registry if it is used for this frontend pass; do not report its historical route coverage as current. Existing browser scripts require an already available Playwright/browser setup. If the browser or a required permission is unavailable, report the exact limitation, continue independent source checks, and leave the rendered check pending.

Review desktop and narrow portrait (including 320px and 390px widths), keyboard-only play, visible focus, caption readability, reduced motion, actual pointer targets, both outcomes, rapid repeated activation, pause/resume, Return during transition, retry after failure, Back/Forward, reload, stale completion messages, blocked storage and completing all six coda folds. Confirm no hidden playback or audio after leaving a film. Check both loaded art and fallback behavior. Physical-device and screen-reader sessions must be named separately from browser emulation.

The Empty Square still needs lived-experience accessibility review. A technically working layout cannot satisfy that editorial review. None of the six films should be relabelled finished animation or the full anthology described as a measured five-minute experience.

## Skills supplied and optional tools

This branch adds a project-local, Markdown-only skill at [.claude/skills/asterwind-frontend/SKILL.md](../.claude/skills/asterwind-frontend/SKILL.md) and [CLAUDE.md](../CLAUDE.md). No executable plugin, hook, GitHub Action, package, secret or account configuration is added. No existing repository skills or Actions workflows were present at the baseline.

Claude Code supports project skills at `.claude/skills/<name>/SKILL.md` and direct `/skill-name` invocation. Support differs between local, web and cloud project sessions. Verify that `/asterwind-frontend` is available in the actual session; otherwise read the same Markdown directly. Essential invariants and the workflow are also in `CLAUDE.md`, so this setup does not depend on automatic skill discovery. See the [official skills documentation](https://code.claude.com/docs/en/skills) and [project-instruction documentation](https://code.claude.com/docs/en/memory).

If the current Claude environment already offers frontend design, browser verification or code-review skills, use the relevant ones alongside these project constraints. Do not assume a skill from another assistant's private environment is installed. No additional skill pack is required to start, and this handoff does not authorize installing an unreviewed pack or changing tool permissions.
