/* Integration slots for delivered paper art (requests ART-AH-01…07 in docs/AFTER-HOURS-ASSET-REQUESTS.md).
   Every slot is null until an inspected derivative lands; null means the code-native placeholder is
   used. Paths are relative to hub/. Each slot is probed on its own and a slot that fails to load
   keeps its placeholder. Geometry and layer rules: hub/art/README.md. */
window.ASTERWIND_ART={
 schemaVersion:2,
 // ART-AH-01: three independent layers on the 1200×2000 machine template.
 //   face: cabinet front with transparent window and chute holes · interior: back wall, tube and
 //   shelves, no drinks · glass: 780×1112 window overlay (reflections, grime), mostly transparent.
 machine:{face:null,interior:null,glass:null,side:null},   // side: ART-AH-05, 600×2000
 // ART-AH-02: per drink, registered layers on the 960×2080 template. body: vessel and label with a
 // transparent cameo hole, mouth drawn open, no closure. parts: one cut-out per opening part, cropped
 // to its box (or {src,x,y,w,h}). opened: optional remnants after opening. empty: optional drained vessel.
 drinks:{
  seam:{body:null,opened:null,empty:null,parts:{cap:null,'seal-l':null,'seal-r':null}},
  standup:{body:null,opened:null,empty:null,parts:{tab:null}},
  slides:{body:null,opened:null,empty:null,parts:{wax:null}},
  scope:{body:null,opened:null,empty:null,parts:{stopper:null,bail:null}},
  pixel:{body:null,opened:null,empty:null,parts:{crown:null}},
  ship:{body:null,opened:null,empty:null,parts:{cork:null,string:null}}
 },
 // ART-AH-03a accepted as a candidate 5 Nov (registers 0,0 px with the night plate; provenance pending).
 corridor:{portrait:null,dawn:'art/corridor/corridor-dawn.webp',portraitDawn:null},
 hand:{back:null,front:null},                              // ART-AH-04 (optional, not wired)
 clips:{}                                                  // ART-AH-06: { seam: {src, mime, still} } once approved
};
