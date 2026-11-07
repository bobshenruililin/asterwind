# Paper grain

`paper-grain.webp` — 512×512 RGBA WebP, 248100 bytes, SHA-256 `c507c39a8097e3a40fd055147eac014f2af243807218187c729fb492a7a181ef`.

- **Source:** `hub/assets/corridor.webp` (SHA-256 `7fb2484b…b010d5`, listed in `hub/asset-manifest.json`), the generated corridor plate described in `hub/README.md`; crop (1120, 40)–(1600, 520), a plain stretch of photographed wall.
- **Processing:** `make-textures.py` (reproducible): luminance, radius-5 high-pass (fibre only), mirror-tiled for seamlessness, stored as a transparent light/dark overlay (no blend mode needed), resized to 512 px.
- **Use:** grain on code-native layers (bottles, interior, shelves, cabinet side, chute flap) through `textures.paper` in `hub/art/manifest.js`. Delivered art does not receive it.
