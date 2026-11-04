# Repository integration verification — 4 November 2026 UTC

Recovered the delivered V5 source bundle, preserved its story/art/audio/source, split player and data for maintainable editing, and replaced the environment-dependent Pillow builder with a standard-library-only deterministic export. Fixed reduced-motion camera framing: position now remains fixed as well as zoom. Predecode local images to reduce flashes. A missing current frame pauses playback with a recoverable explanation.

Passed fresh:
- Dependency-free split runtime and standalone build; 14 runtime frames and28 voice cues; all45 media files hashed.
- Both automatic outcomes, exactly-one branch commitment, untimed decision, replay, pause, hidden-tab pause.
- All28 voice texts match dialogue and fit authored timing windows.
- Explicit role, fellowship stakes and assembly deadline, voluntary rest and distinct endings.
- Caption safeguard, voice playback rejection fallback, modal focus/inert/pause/Escape restoration, choice and ending focus.

Browser test was prepared but did NOT execute: Chromium process socket initialization is prohibited in this execution environment, including the escalation attempt. No fresh screenshots, visual QA, physical-device, screen-reader or listening test are claimed. V5-QA.md is historical evidence from the delivered version, not verification of this integration. Run qa/browser.cjs in a browser-capable environment before release.

No public deployment, spending, new voice generation, repository visibility change or changes to original workbook runtime.

## Held-pose performance integration

Eight new authored pose images inspected together for lamp, table, sleeves, model and hand continuity. Fresh automated tests verify stable/slip/buckle order, untimed decision, correct reach/grasp or reach/brace after commit, pose pause and all frame times within shot boundaries. Both complete branches and all28 unchanged audio cues pass. Eight optimized art files added without replacing original art. No smooth animation or acted-voice claim. Fresh browser verification remains blocked by the environment noted above.
