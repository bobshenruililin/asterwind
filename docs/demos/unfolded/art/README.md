# Painted layers: how they plug in

The game draws every room in code-cut paper. When painted layers exist, it uses them instead, layer by layer, and falls back to code everywhere else.

## The contract

`art/index.json` lists what exists. An empty list means "use code everywhere":

```json
{"rooms": {
  "heard": {
    "plate":   {"night": "heard-plate-night.png"},
    "figures": {
      "ellis": {"talk": "heard-ellis-talk.png", "low": "…", "brace": "…", "lift": "…", "close": "…", "open": "…", "fold": "…", "settle": "…"},
      "you":   {"hold": "…", "speak": "…", "setdown": "…", "sit": "…"}
    }
  }
}}
```

- **Files:** live in `art/<room>/` and are drawn on the full 1600×900 stage. Deliver at 3200×1800.
- **Plate:** replaces the sky, moon, back sea and wall.
- **Figures:** each figure switches image on the beat by pose name (replacement animation). The names are the ones in the room's script, e.g. `pose:{ellis:'brace'}`. A missing pose falls back to the figure's first image, and a missing figure falls back to the code-cut puppet.
- **Still code:** the lantern, waves, boat, bridge and the optional route sheet are drawn in code for now. Painted objects are the next step of the loader, once H-04 lands.
- **Picking a set:** `?art=<folder>` loads `<folder>/index.json` instead.
  - `?art=art-standin` loads the **stand-in** set: the code-cut room rendered to PNG and tinted, made by `qa/make-standins.cjs` and `qa/standin-treat.py`.
  - It exists to prove that delivered layers land in register. It isn't art and must never be adopted.

## Checking a delivery

```bash
node qa/make-standins.cjs /tmp/raw && python3 -I qa/standin-treat.py /tmp/raw art-standin
```

Then compare `?art=art` with the code-cut room at the same beat (`Game.enter('heard'); Game.toGate()`), in the browser, with an edge overlay. The pose template sheet is [`../art-brief/templates/heard-v2-poses.jpg`](../art-brief/templates/heard-v2-poses.jpg).
