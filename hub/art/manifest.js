/* Integration slots for delivered paper art (requests ART-AH-01…07 in docs/AFTER-HOURS-ASSET-REQUESTS.md).
   Every slot is null until an inspected derivative lands; null means the code-native placeholder is
   used. Paths are relative to hub/. Each slot is probed on its own and a slot that fails to load
   keeps its placeholder. Geometry and layer rules: hub/art/README.md. */
window.ASTERWIND_ART={
 schemaVersion:2,
 // ART-AH-01: three independent layers on the 1200×2000 machine template.
 //   face: cabinet front with transparent window and chute holes · interior: back wall, tube and
 //   shelves, no drinks · glass: 780×1112 window overlay (reflections, grime), mostly transparent.
 // Interim face (5 Nov): ART-AH-00 study registered to the template (hub/art/machine/PROVENANCE.md),
 // pending ART-AH-01. Its geometry places the live controls; the plain sign gets hand-cut lettering.
 machine:{face:{src:'art/machine/machine-face-interim.webp',lettering:'AFTER HOURS',
  geometry:{keys:[930.2,473.3,89.4,115.7,109.8,142.1],knob:[1027.2,1338.7,101.4],chute:[132.3,1660.8,666.4,189.9],display:[96,332,1008,56],well:true,sign:[42,95,1118,227]}},
  interior:null,glass:null,side:null},   // side: ART-AH-05, 600×2000
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
 // Neutral paper grain derived from the corridor plate's wall (hub/art/textures/make-textures.py).
 textures:{paper:'art/textures/paper-grain.webp'},
 hand:{back:null,front:null},                              // ART-AH-04 (optional, not wired)
 clips:{}                                                  // ART-AH-06: { seam: {src, mime, still} } once approved
};
