# Checks and remaining review

## Passed

- Both original generated images were visually inspected. Both show a complete blank notebook spread, one-sided morning light, and quiet paper texture. B has the preferable landscape layout.
- Source PNG copies match the generated originals byte-for-byte.
- Both PNGs and both WebPs decode successfully. Dimensions are A 1672 × 941 and B 1671 × 941; each WebP retains its source dimensions.
- SHA-256 hashes and byte counts are recorded in `manifest.json`.
- `node scripts/verify-repo.cjs` passed: 9 scenarios, 36 options, 22 hashed assets, original Q5 match, syntax, portable paths, excluded files and token markers. This existing repository check does not exercise the new review page.
- JavaScript syntax checks pass for `qa-review.cjs` and the inline script in `review.html`.

## Browser review blocked

`qa-review.cjs` was prepared to check image loading, A/B switching, the separate text overlay, keyboard activation, and 390-pixel review-page overflow. It **did not run to completion**. The bundled Playwright Chromium was absent. The installed `/usr/bin/chromium` then failed before opening a page because this execution environment did not permit its process-singleton socket (`socket() failed: Operation not permitted`). An elevated retry had the same failure. No browser screenshot or passing browser result is claimed.

To rerun on a browser-capable machine, serve the repository root and run:

```sh
python3 -m http.server 8743
node docs/demos/played/art/dawn/collab/dawn-p3-20261106/qa-review.cjs http://127.0.0.1:8743
```

Set `CHROMIUM_PATH` if a non-default Chromium executable is required. A successful run creates `layout-proof-desktop.png`; that review screenshot includes an explicitly separate text proof and is not a clean production plate.

## Not yet done

No image has been integrated into the live notebook. Full-game browser testing, dawn transition testing, portrait page stacking, actual-device legibility, screen-reader review, and Bob/Opus approval remain. The package makes no claim that these checks passed.
