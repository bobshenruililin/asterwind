# Quiet Minute: opt-in object-layer candidate

Open `docs/demos/played/index.html?layers=quiet-p0-review` over HTTP. This is a review audition, not the accepted source film. Without that query, the game loads only the unchanged reference plates. Failed registration keeps the original art.

## Sources

- `clean.png`: take 03 from repository commit `d94ba677fea17cbb177f7708e963cb607667adaf`, `docs/art/quiet-clean-20261106/quiet-clean-take-03.png`. Generated clean plate. Source worker measured no global translation, but pixels outside the edited region are **not identical**. SHA-256: `698477e62542cb20ad2ec28cc9f9c9e80e698a85700366815223297f2d1f52d9`.
- `platter-registered.png`: repository commit `0659672a4350b33332b4f8cfb55fb81b728594fd`, `anthology/episodes/standup/assets/source-layers-v1/platter-registered.png`. SHA-256: `d7e77137f6ea13d575113931c9a3d37e6001b58a0020e43f19eb07fabc2d35ef`.
- `tray-registered.png`: same source directory and commit. SHA-256: `4cc55c2a0721f2344662e8c888d2052d060f2543aa4e07245dec371fd7f325ef`.

Both object layers are manually traced alpha masks over the original decision plate, with exact retained source RGB, full-canvas 1672 × 941 registration and no invented object pixels. All three files are copied without modification. Original decision source SHA-256: `30749b7e877c461d5407f9537ecb26a2af2b9c097354fc8dd3d89acf123794f9`.

## Limits and review gate

The platter has transparent holes where foreground hands and Theo's reaching hand occlude it. Those arcs are not reconstructed. Contact shadows include the source tabletop colour and grain, not a physically isolated shadow. The clean plate also changes tabletop grain and small untouched-region details. Do not promote this set as a lossless replacement.

The audition deliberately caps platter rotation at 0.012 radians and tray movement at 0.018 × 0.006 plate fractions. Reduced motion keeps the objects still. The choice remains a tap, keyboard activation or ordinary drag, with the same untimed decision and original consequences. The small platter excursion is a registration test, not a convincing completed turn. Larger motion needs a reconstructed hidden arc and foreground occlusion layer, or a dedicated authored action cut.

No new image generation or paid video was used to assemble this set. The three source images have been visually inspected. Native Canvas compositing and source tests are not browser/device playback approval. Keep this set opt-in until art continuity, contact edges, shadows, perspective and motion have been screened in the live scene.
