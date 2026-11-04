# Incoming art (not wired)

Deliveries for the requests in [docs/AFTER-HOURS-ASSET-REQUESTS.md](../../../docs/AFTER-HOURS-ASSET-REQUESTS.md) land here, one folder per request ID (for example `ART-AH-00-cabinet-study-v1/`), with the original, any WebP derivative and a short `provenance.md`.

Nothing in this folder is referenced by the game. Files move to `hub/art/<group>/` and into `hub/art/manifest.js` only after registration (`hub/qa/align.html`) and browser screening (`ART_MANIFEST=… node hub/qa/journey.cjs art-candidate`). The offline build only embeds paths that the manifest names.
