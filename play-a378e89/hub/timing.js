/* The After Hours timing contract: every staged beat of the corridor journey, in milliseconds.
   docs/AFTER-HOURS-CONTRACTS.md describes each beat and what delivered art or clips may replace;
   hub/test-contracts.cjs keeps that page and this table identical. Reduced motion collapses every
   beat to an immediate state change. Story entry, completion and teardown are not timed here. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AsterwindTiming=api})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const TIMING={
 wake:2600,
 coil:600,fall:600,flap:330,catch:980,tagSwing:1300,
 open:{cap:1150,tab:820,wax:900,swing:1000,crown:900,cork:1100},
 beat:420,reveal:1150,
 putBack:460,
 homecoming:{shrink:1050,fade:240,lightsUp:900,settle:450},
 roof:{fly:1000,land:500},clockHold:3600,
 sink:520,restock:900,turnFocus:700,
 finale:{tubeOff:700,lampOff:4200,sunrise:5200,glint:1800}
};
// Flattened "a.b" keys, for the contract test and tooling.
const flat=(o=TIMING,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'?flat(v,p+k+'.'):[[p+k,v]]);
return Object.freeze({...TIMING,flat});
});
