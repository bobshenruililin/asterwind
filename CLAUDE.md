# Asterwind: Claude project entrypoint

## Current production direction — 8 November 2026

For the Pear-quality production pass, read [the ambition and release handoff](docs/AMBITION-HANDOFF-2026-11-08.md) and [the current project state](docs/HANDOFF-CURRENT.md) before using historical implementation notes. This is the current creative target; the older layout-only scope below is historical for that pass. Preserve the durable technical, editorial, and access constraints. Verify actual skill availability, current source, and the release process.

Read [AGENTS.md](AGENTS.md) first. It is the canonical film-first design guidance; do not replace it with a generic web-app aesthetic.

For Opus frontend work, read [the current handoff](docs/OPUS-HANDOFF.md). It distinguishes the six-story anthology from the preserved nine-scenario source app and corrects older single-film descriptions.

Use the repository skill at [.claude/skills/asterwind-frontend/SKILL.md](.claude/skills/asterwind-frontend/SKILL.md) for implementation and review. In a compatible Claude Code session, invoke `/asterwind-frontend`; otherwise read it as ordinary Markdown. A repository file does not establish that a particular chat, model, browser or GitHub connection has access.

## Essential workflow, even without skill discovery

- Check the current remote head and local changes. Read the relevant README and controller, inspect the current screen, and choose a bounded visual improvement before editing.
- Preserve the six routes and allowed outcomes in `anthology/registry.json`, the separate nine-scenario `app/`, exactly one untimed two-action choice per film, and automatic setup/consequences. The optional six-fold coda never gates a story; either valid ending releases a fold.
- Preserve actual-ending completion, live-frame/session validation, saved progress, storage fallback and teardown on Return/Back/retry. Keep keyboard/focus, usable touch targets, captions, pause/replay and reduced motion.
- Use the existing static stack and local art. Do not rewrite stories or consent/agency, regenerate approved art, or introduce a framework/network dependency for a layout pass.
- Rebuild in order: `python3 film/build.py`, `python3 anthology/build-all.py`, then `python3 hub/build.py`. Run the affected Node/Python checks listed in the handoff and review both outcomes in a permitted browser, at desktop and narrow portrait sizes. Check the offline export too.
- Name the exact tested SHA and separate source tests from rendered QA. The baseline `hub/qa/browser.cjs` has a stale `nod` preview selector; update its coverage before relying on it. If browser access is blocked, report the limitation without bypassing it.
- Send the work back as a draft PR with screenshots, test results and a specific review question. Keep discussion and asset requests in that PR. GitHub communication does not establish automatic monitoring or receipt.

Work on a feature branch. Keep `main`, `pages-runtime`, story contracts, source attribution and existing saves intact. No merge, deployment, visibility change, paid generation, credential setup or permission expansion is granted by these instructions.

Return work through a draft GitHub PR with the [review template](docs/FRONTEND-REVIEW-TEMPLATE.md). Request missing art through the [asset template](docs/ASSET-REQUEST-TEMPLATE.md), with a playable fallback while it is pending.
