// Superseded hub smoke test, kept as an entry point. The original clicked a removed "nod" preview drink
// and expected an unavailable story; all six drinks now play. It now runs the current journey suites
// that cover what it checked: lobby, every route, the machine turning to its folds, keyboard, phone
// sizes, and Back. Serve the repository first, then run it:
//   python3 -m http.server 8731 --bind 127.0.0.1
//   node hub/qa/browser.cjs            (or pass suites, e.g. node hub/qa/browser.cjs routes,history)
process.argv[2]=process.argv[2]||'routes,keyboard,mobile,history';
require('./journey.cjs');
