"""Build a single offline hub + preserved Seam film. No external dependencies."""
from pathlib import Path
import json,base64
root=Path(__file__).resolve().parent
film=(root.parent/'film/dist/index.html').read_text()
page=(root/'index.html').read_text()
page=page.replace('<link rel="stylesheet" href="hub.css">','<style>'+(root/'hub.css').read_text()+'</style>')
svg='data:image/svg+xml;base64,'+base64.b64encode((root/'dispenser.svg').read_bytes()).decode()
page=page.replace('src="dispenser.svg"','src="'+svg+'"')
for asset in (root/'assets').glob('*'):
    encoded='data:image/webp;base64,'+base64.b64encode(asset.read_bytes()).decode()
    page=page.replace('src="assets/'+asset.name+'"','src="'+encoded+'"')
script='window.ASTERWIND_FILM='+json.dumps(film).replace('</','<\\/')+';\n'+(root/'hub.js').read_text()
page=page.replace('<script src="hub.js"></script>','<script>'+script+'</script>')
page=page.replace('<a href="../film/index.html">Open The Seam directly</a>.', 'Enable JavaScript in a full browser to play this offline preview.')
(root/'dist').mkdir(exist_ok=True)
(root/'dist/index.html').write_text(page)
print('Built',root/'dist/index.html')

