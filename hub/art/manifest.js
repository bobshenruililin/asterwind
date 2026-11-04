/* Integration slots for delivered paper art (requests ART-AH-01…06 in hub/art/README.md).
   Every slot is null until an inspected derivative lands; null means the code-native placeholder
   is used. Paths are relative to hub/. A slot that fails to load falls back automatically. */
window.ASTERWIND_ART={
 schemaVersion:1,
 machine:{face:null,interior:null,side:null},            // ART-AH-01, ART-AH-05: e.g. 'art/machine/machine-face.webp'
 drinks:{                                                 // ART-AH-02: transparent cameo hole required
  seam:{sealed:null,open:null,empty:null},
  standup:{sealed:null,open:null,empty:null},
  slides:{sealed:null,open:null,empty:null},
  scope:{sealed:null,open:null,empty:null},
  pixel:{sealed:null,open:null,empty:null},
  ship:{sealed:null,open:null,empty:null}
 },
 corridor:{portrait:null,dawn:null,portraitDawn:null},    // ART-AH-03
 hand:{back:null,front:null},                             // ART-AH-04 (optional)
 clips:{}                                                 // ART-AH-06: { seam: {src, mime, still} } once approved
};
