# Voice provenance (temporary, synthetic)

Approved lines from `film/story.json`, rendered locally on 5 November 2026, then trimmed and loudness-normalised with FFmpeg. These are synthetic timing guides, not performances.

- `kokoro-a/`, `kokoro-b/`: Kokoro-82M v1.0 (hexgrad), Apache-2.0, run from the ONNX export (onnx-community/Kokoro-82M-v1.0-ONNX, quantized) with kokoro-onnx 0.6.1.
  - A is bf_emma (Mara), bm_lewis (Julian) and bm_george (Ren).
  - B is af_heart, am_michael and am_adam.
- `piper/`: Piper 1.8 (rhasspy).
  - Mara is en_GB-cori-high (dataset public domain).
  - Julian and Ren are en_US-libritts_r-medium speakers 14 and 51 (CC BY 4.0; credit LibriTTS-R).
- Excluded on licence grounds: Piper voices under NC, SA or the Blizzard licence (ryan, hfc_*, semaine, lessac, northern_english_male).
