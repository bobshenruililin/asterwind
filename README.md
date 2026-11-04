## Current film pilot: The Seam

The latest film-first work now lives in [`film/`](film/README.md). Open `film/index.html`, or build an offline HTML with `python3 film/build.py`. It preserves the delivered V5 story, 14 runtime frames, 28 optional timing voices, one untimed choice and two distinct consequences. The older nine-scenario source-grounded experience below remains intact in `app/`.

This is a playable illustrated animatic, not completed character animation. Read [fresh verification and limits](film/REPOSITORY-QA.md) before presenting. Authoring repository remains private; this integration does not publish a new site.

# Asterwind

A private, still-first paper theatre for leadership conversations: nine situations, 36 source-grounded responses, and small moments of reflection. The approved full-bleed paper stage, Kalam handwriting, sticker-note choices and corner controls are preserved.

Start with [the working handoff](docs/HANDOFF.md) for approved design decisions, the current demo route, deployment status and the next review loop.

## Play locally

Open **`app/index.html`** in a modern browser, keeping the adjacent `assets/` folder intact. No build, server, account, API key, paid model or network connection is required to play. If a file viewer shows source text, open the file in a full browser.

- **Begin a five-minute conversation:** Q5 with the explicitly adapted A/C two-choice structure, then a hypothetical change from three days to three hours and a closing reflection. Q3 is optional after the ending. Five minutes is a facilitation budget with discussion, not a measured runtime.
- **Explore all nine:** untimed; all four original response options in each scene.
- Tab/Enter and 1–4 select choices. Right arrow advances or reflects without choosing. R replays. Corner controls provide arrival, pause, next beat, replay and About.
- Progress stays in the browser's local storage when available. Nothing is sent. About includes reduced-motion and clear-progress controls.

### Facilitation guide (about five minutes)

Use these as discussion targets, not timers: arrival 15 seconds; context 35; choice 45; consequence 40; hypothetical pressure 50; reflection 85; closing 30. Advance manually. A solo click-through will be shorter; no timed rehearsal has established the duration.

## Repository map

| Path | Purpose |
| --- | --- |
| `app/` | Editable static HTML, CSS, JavaScript and delivery assets |
| `app/scenarios.js` | Nine situations, 36 exact source options, feedback, attribution and source-cell references |
| `production/reference-stills/` | All nine original approved PNG reference images |
| `production/MiniMax_video_prompts.txt` | Ready-to-copy optional video prompts; start with Q5 |
| `production/video-manifest.json` | Shot order, output filenames and fallback requirements |
| `docs/CLIP-SLOTS.md` | How to integrate reviewed, pre-rendered clips |
| `docs/ASSET-PROVENANCE.md` | Source, artwork and font provenance; rights limits |
| `docs/asset-manifest.json` | File sizes and SHA-256 hashes |
| `qa/` | Test scripts and captured browser evidence |

## Optional development

Node is needed only for development commands, not for playing:

```sh
node qa/state-tests.cjs
node scripts/verify-repo.cjs
node scripts/standalone.cjs
```

The final command writes a self-contained HTML file into ignored `deliverables/`.

Optional browser regression tests require an existing Playwright installation and Chromium:

```sh
BROWSER_EXECUTABLE=/path/to/chromium node qa/browser-qa.cjs
```

No runtime dependencies or credentials are required. The `pages-runtime` branch contains only the runtime files at its root and matches the current app; it is prepared for Pages but no public hosting or automatic deployment is configured. See the [deployment decision](docs/HANDOFF.md#deployment-decision-and-privacy-boundary).

## Media and content honesty

Characters are flat still images. Camera drift, paper reveals and clickable notes are authored interface animation—not AI character acting or a new 3D model. The castle is the retained reference image. No rendered scenario video exists yet. Stills remain the default and fallback; video is optional.

Consequences are proposed possibilities; workbook feedback is shown separately. This is a narrative adaptation, not the unchanged full assessment, a moral score or a validated leadership diagnosis. The original workbook recommends feedback after all nine answers; this exploration offers immediate reflection.

## Verification

The approved build was exercised in a real browser on 31 October 2026: all 36 branches, all nine image mappings, keyboard, replay, repeated clicks, neutral skip, pause, reduced motion, browser history, reload/resume, and representative desktop/portrait layouts. Evidence and limits are in `qa/QA.md`. Local preparation reruns syntax, source integrity and isolated state tests; it does not misrepresent earlier screenshots as a new device test.

## Private project and rights

The authoring repository must remain private. Bob has separately approved a public playable website containing the runtime app and its delivery assets. Production prompts, the source workbook, internal notes and private history are outside that publication scope. Creating a separate public export repository still needs specific approval; see the [handoff](docs/HANDOFF.md). Kalam carries its included SIL Open Font License. No new license is assigned to the remaining project material; see the provenance document.

