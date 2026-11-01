# Optional rendered clips

All nine scenes currently use the verified stills. No clip is required.

1. Copy a reviewed H.264 MP4 into `app/assets/clips/q5-setup-v01.mp4` (create the clips folder).
2. In that scenario's `media` object in `app/scenarios.js`, add `"clip": "assets/clips/q5-setup-v01.mp4"`.
3. Keep the still. The video is muted, plays inline over the full-bleed illustration, and falls back to the still on unavailable/decode/autoplay error, end, or reduced-motion preference.
4. The setup plays once on arrival in the scene. HTML scenario, choice, feedback and controls remain separate. Pause controls both clip and camera drift. Do not burn readable case facts into video.
5. Recheck the complete scene in a real browser after replacement. The standalone builder embeds stills/fonts, NOT newly added video; keep the folder version for video delivery or extend the builder deliberately.

Runtime filenames: q1-setup-v01.mp4 through q9-setup-v01.mp4.

The accompanying film handoff is proposed production direction, not proof of generated clips. Do not claim character acting until the actual reviewed clips exist. Start with Q5 before committing to all nine. Q3 artwork is illustrative of troubleshooting, though the source starts with idle members; Q6 only shows part of the five-person group. Preserve source facts in accessible HTML.
