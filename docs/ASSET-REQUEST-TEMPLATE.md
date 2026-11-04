# Asset request for frontend work

Copy the form below into the implementation PR conversation. Use one request ID per coherent asset or tightly matched shot set. Link the code or screenshot showing why it is needed. Keep unrelated private context out of the request.

## Request

- **Request ID / status:** `ART-...` / requested, clarified, producing, delivered, accepted or declined
- **PR, branch and source commit:**
- **Episode / exact shot or UI state:**
- **Purpose:** What should the player see, understand or feel? What fails with the current asset?
- **Requested asset:** Still, matched pose set, transparent cutout, code-native SVG, silent clip, sound or other specific output
- **Existing references:** Repository paths and immutable commit links; identify the reference that controls character identity, set, camera and paper material
- **Must preserve:** Character identity, wardrobe, prop ownership, eye line, hands, accessibility/agency, lighting and established story facts
- **Action and chronology:** The exact physical action, what is visible before commitment and what may appear only after it; no outcome spoilers in choice/hover art
- **Composition:** Camera, framing, aspect ratio, target pixel dimensions, focal point, portrait/desktop crops, safe area for captions and semantic controls
- **Interaction:** Object or character being selected; expected hotspot bounds and needed stable hold frame
- **Technical delivery:** File format, transparency, duration/frame rate if relevant, maximum runtime size and proposed repository destination
- **Variants:** Which alternatives are genuinely needed and why; avoid speculative bulk generation
- **Fallback while pending:** Existing repository asset or SVG and how it remains playable
- **Acceptance checks:** Identity/material consistency, anatomy/hands, continuity, readable action, crop/hotspot fit and no embedded essential text
- **Dependencies / timing:** Whether this blocks the implementation or can follow independently
- **Cost / permissions:** State if generation would require spending, a new service or a new data disclosure. A request is not approval to do those things.

## Delivery response

- **Request ID and delivered status:**
- **Files and exact commit:** Source original, optimized runtime derivative and any updated manifest/provenance path
- **Production facts:** How it was made, source/rights information available, and limitations. Do not label a held still as continuous animation or synthetic timing audio as an acted performance.
- **Inspection:** What was actually viewed or played, including whole-clip review for video; accepted and rejected variants
- **Integration notes:** File size, dimensions, crop and intended beat mapping; fallback behavior
- **Open concern / decision needed:**

The frontend contributor acknowledges the delivered files in the PR, integrates a versioned derivative, tests the composed scene and records acceptance against the request ID. Delivery is not automatic visual approval. Do not remove prior originals or fallback art merely because a new variant exists.
