---
name: asterwind-frontend
description: Improve or review Asterwind's cinematic paper-theatre frontend while preserving its six story routes, progression, accessibility and offline exports. Use for hub or film presentation, interaction and responsive layout work.
---

# Asterwind frontend

Read the repository's [AGENTS.md](../../../AGENTS.md) and [Opus handoff](../../../docs/OPUS-HANDOFF.md), then the README and actual controller for the surface you will change. Resolve stale documentation against the current registry and source rather than silently discarding implemented features.

## Make one coherent visual improvement

- Compose a film, not a dashboard. Prefer staging, paper material, light, expressive images and clear action feedback over extra labels, cards or decorative controls.
- Keep exactly one untimed, consequential two-action choice inside each film. A drink selection is navigation; the optional six-fold coda is not a story gate or a moral score.
- Preserve all six registry IDs and allowed outcomes, live-frame/session validation, completion only at a real ending, storage fallback, and cleanup on Return/Back/retry. Inspect these contracts before changing their callers.
- Preserve semantic controls, meaningful accessible names, visible keyboard focus, practical touch targets, captions, pause/replay and reduced motion. Test hotspot alignment against the rendered image at narrow and wide sizes; formula tests alone cannot prove it.
- Keep original art and source attribution. Do not retime or rewrite dialogue, change consent/agency, add choices, or regenerate assets merely to accommodate a layout idea. Propose a story change separately when needed.
- Prefer the existing static HTML/CSS/JavaScript and local assets. Do not add a framework, remote font, runtime model call or dependency to solve a composition problem.

## Work and hand back

Record your base SHA and changed surface on a feature branch. First inspect the current screen, then implement a bounded visual pass and rerun the affected state/build checks from the handoff. Verify actual playback and both outcomes in a permitted browser when available. Report exactly what was passed, failed, blocked or not run.

If new art would materially improve the scene, use [the asset request](../../../docs/ASSET-REQUEST-TEMPLATE.md). Continue independent layout work with the existing fallback; do not invent access to image/video tools or claim that a request has been fulfilled.

Use [the review template](../../../docs/FRONTEND-REVIEW-TEMPLATE.md) in a draft PR. Include the exact tested SHA, screenshots, repeat/interruption coverage and remaining decisions. A PR comment is a durable message, not proof of receipt or an automatic monitoring subscription. Do not merge, deploy or expand permissions as part of this skill.
