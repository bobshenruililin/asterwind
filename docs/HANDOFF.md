# Asterwind — working handoff

Updated 2 November 2026 (Asia/Hong_Kong). This is the starting point for Bob and the next contributor. It records the approved direction, actual implementation and remaining work; it is not a new design brief.

## Canonical project and current build

- Private authoring repository: [bobshenruililin/asterwind](https://github.com/bobshenruililin/asterwind).
- Runtime reviewed for this handoff: `main` at `b754094c872284dcbab35ebaeb4a4bfa60309617`. The handoff commit changes documentation only.
- Deployment preparation: `pages-runtime` at `fee571e87fb3dc8bd4ce7c4f32dd9b4a57ce7783`.
- Its root contains exactly the 17 files from the reviewed `main/app/` tree, with matching Git blob hashes. Runtime tree: `55ff824eae28f06fbe8941d5fa85ed1bacb9dc77`; total file bytes: 8,078,139.
- At this check the repository is private and GitHub reports `has_pages: false`. No public Asterwind URL or successful Pages deployment has been verified.
- Use current GitHub main for further work. Earlier desktop collage, animatic and paper-stage trials, and the older transfer ZIP, are comparison material rather than the current deployable source.

## What Bob has chosen

Asterwind is a floating-academy leadership conversation. The accepted direction is tactile paper theatre: warm, crafted miniature scenery, cut-paper surfaces, expressive fictional adult students and a restrained teal/mustard/cream palette. The whole viewport is the stage. Choices and captions belong to the paper scene; readable words remain editable, accessible HTML. Kalam Regular/Bold and its OFL license are included.

Prioritize an intuitive, impressive player experience: one focal beat at a time, few clear actions, an immediate visible response to a choice and deliberate pacing. Avoid dashboard panels, meters, decorative clutter, moral scores and automatic selection. Preserve keyboard access, pause, replay and reduced motion. The current art uses fictional faces; no Asterwind teammate photographs have been supplied.

The actual media are still images with authored camera and paper motion. Characters are not independently rigged or performing generated acting. Video is optional. The retained castle is an image reference, not a newly built or bundled editable 3D castle.

## What currently plays

The arrival screen offers two routes:

1. **Begin a five-minute conversation:** Q5 Weak Slides, with the explicitly adapted A/C pair. The route is context → choice → acknowledgement → possible consequence → hypothetical change → reflection → closing. After closing, Q3 is optional; replay, arrival and all-nine exploration are available.
2. **Explore all nine:** nine situations, each with all four original workbook response options, source feedback and proposed consequences. This route is untimed.

Q5 source facts remain: the presentation is **three days away**, worth **30% of the grade**, and the player could redo the weak slides in **one hour tonight**. The short route offers **Redo tonight** versus **Review together**, using the marking criteria and tomorrow's checkpoint. The full route also includes restating standards and sending specific changes with a deadline.

The later **three hours** beat is explicitly a hypothetical change to the presentation deadline. It does not replace the original three-day dilemma or change the one-hour redo estimate. It asks the group whether they would keep, change or combine approaches; it does not collect another scored choice or calculate a different ending. Each initial choice has its own acknowledgement and possible consequence before the common reflection. Taking over can be defensible under tighter pressure.

Five minutes is a facilitation target including discussion, not a measured runtime. The active route and current suggested timings are in [README](../README.md) and `app/app.js`. The older planning budgets in `app/scenarios.js` metadata remain design notes and do not drive the current route; reconcile them if revising the facilitation plan.

## Source and file map

The repository already contains the runnable app, all nine original PNG reference stills, smaller runtime images, castle reference, fonts/license, optional production prompts, content provenance, QA scripts and captured evidence. See the [repository map](../README.md#repository-map).

- `app/scenarios.js` holds nine scenarios, 36 source option texts, workbook feedback, source-cell references and clearly labelled proposed staging.
- `app/app.js` controls route, interaction, storage, camera motion and optional clips; `app/index.html` and `app/style.css` define accessible controls and styling.
- [Asset provenance](ASSET-PROVENANCE.md) identifies **Leadership Quiz Revised.xlsx**, its hash and the inherited Amanda/Hannah attribution. The original workbook is deliberately not included. Full workbook re-audits require the original file; do not reconstruct or invent absent cells.
- [Asset manifest](asset-manifest.json) records 22 file hashes. Q5 runtime PNG exactly matches its approved production reference.
- [Clip slots](CLIP-SLOTS.md), `production/MiniMax_video_prompts.txt` and `production/video-manifest.json` are preparation only. No scenario video has been generated. MiniMax is the intentional current handoff; the earlier Higgsfield spelling correction did not replace that plan. No paid generations, subscription, account or credential changes are authorized.
- Q3 and Q6 art is illustrative; accessible source facts take precedence over depicted details.

Open `app/index.html` with adjacent assets intact, or serve `app/` using an existing static server. There is no runtime build, backend, login or API key. Progress is local to that browser. For a single-file version, an existing Node installation can run `node scripts/standalone.cjs`; newly added video is not embedded by that builder.

## Video handoff and first optional test

Existing Google Drive materials were read and verified for this handoff:

- [Asterwind Video Production folder](https://drive.google.com/drive/folders/1vMlttb9MzBLN-OXRCQze0mJP8A7v5Lwf).
- [Asterwind Video Production Guide](https://docs.google.com/document/d/1_NVT1-Xtwb14PgNMoVNoUyfGEfmuP7pFy8D4uzN6iRU/edit), a native Google Doc in that folder. Its current guide matches the still-first, Q5-first production plan. Links do not imply public sharing; permissions were not changed.

The contemplated **total video budget is HK$100–200, preferably less**. This is a planning limit, not authorization to buy a plan, credits or a generation. Check the selected model's actual live cost and available credits before any proposed purchase.

The first optional proof uses `Q5-Weak-Slides.png` in MiniMax Design, targeting 6 seconds (or the nearest supported duration between 5 and 8). Use the complete Q5 prompt in the guide: one small glance from the laptop toward the groupmate, with a locked composition. Review the whole clip for identity, hands, paper material and unchanged source facts before considering other scenes. Keep the existing still if the result is unsuitable. Bob can supply the accepted clip; Codex integrates it through the existing clip slot and tests the fallback, pause and reduced-motion behavior. No video is needed for the teammate demo.

## Verification and honest limits

[QA.md](../qa/QA.md) distinguishes earlier real-browser checks from isolated logic tests. Recorded coverage includes all 36 source branches, image mapping, replay, repeated clicks, neutral skip, keyboard, pause, reduced motion, history/resume and representative desktop/mobile-sized browser frames. The 1 November revision additionally exercised the guided Q5 route through its ending and replay.

This handoff pass freshly checked repository visibility, branches, runtime paths/blob parity, source code and documentation. It did **not** repeat the browser playthrough. No physical-device session, screen-reader session, measured classroom rehearsal, verified public Asterwind deployment or actual rendered-video test is recorded. Literal network-disabled/file-protocol execution was not verified by the cloud browser.

Useful existing checks:
```sh
node qa/state-tests.cjs
node scripts/verify-repo.cjs
```
These are logic/integrity checks, not a replacement for browser testing. The optional browser script requires an already available browser and Playwright; do not install dependencies just to play.

## Deployment decision and privacy boundary

Bob approved a **public playable website** while keeping the authoring repository **private**. This includes runtime HTML/JavaScript/CSS, playable scenario text, runtime art and fonts/license. It does not include production prompts, original workbook, internal notes, private authoring history or changing source visibility.

Two possible GitHub Pages paths:

1. **Publish directly from the private repository**, if Bob's GitHub plan supports it. Eligibility is still unknown. At [Settings → Pages](https://github.com/bobshenruililin/asterwind/settings/pages), an eligible account can select **Source: Deploy from a branch**, then **Branch: pages-runtime**, **folder: /(root)** and Save.
2. **A separate public runtime export**, matching Jamie's arrangement, if Bob approves creating one (suggested name `asterwind-site`). The working repository remains private. Create fresh public history from an explicit runtime file allowlist. Do not mirror the private repository or push the existing deployment branch: **pages-runtime has private main ancestry**, although its current tree contains only runtime files.

Jamie was checked on 2 November: `jamie-crossing-lives` is private; `jamie-crossing-lives-site` is a separate public repository with Pages enabled. Its [README](https://github.com/bobshenruililin/jamie-crossing-lives-site/blob/main/README.md) describes it as an audience-facing export. The latest [successful Pages run](https://github.com/bobshenruililin/jamie-crossing-lives-site/actions/runs/41268715633) is from that public repository's main branch at `f9a4fe2f48cc778ca4d572203270f0bd6b30b6f5`. This does not establish private-repository Pages eligibility. [GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) permits Pages on public repositories with Free, and on private repositories with eligible paid plans.

The connected GitHub tools can read/write repository files and Git objects, but expose no Pages-setting action. The earlier native Chrome control could not reliably retain its window target; this was a tooling limitation, not proof of user interference or plan ineligibility. The local gh session previously failed authentication; do not retry it or change credentials. No access denial is being treated as permission.

After publishing, verify the signed-out URL, current runtime version, loading/assets, guided Q5 through hypothetical and ending, one full-mode scene, keyboard/replay and laptop/portrait layouts. Reconfirm source privacy. Only then describe the public demo as ready. There is currently no automatic deployment or runtime-branch synchronization.

## How Bob and Codex work together next

Bob gives feedback directly on the player experience: the exact beat, what felt unclear or slow, and what he wanted to happen. Screenshots or brief recordings are helpful when available, but are not required. Codex checks current main, makes a bounded reversible change, validates the affected flow and returns a playable revision with a short account of what changed.

Keep this document and README current when a design decision, route, deployment or limitation changes. Record checks beside the change; use commit links so another contributor can resume without the original chat. New paid services or a new public export repository need Bob's specific approval; routine private implementation work is already authorized.

Next priorities are to resolve hosting, complete a signed-out demo rehearsal and collect teammate feedback. Tune pacing, framing and clarity from that feedback before adding systems or commissioning video.
