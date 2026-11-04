"""Build a single offline hub + preserved Seam film. No external dependencies."""
from pathlib import Path
import json,base64
root=Path(__file__).resolve().parent
film=(root.parent/'film/dist/index.html').read_text()
page=(root/'index.html').read_text()
page=page.replace('<link rel="stylesheet" href="hub.css">','<style>'+(root/'hub.css').read_text()+'</style>')
svg='data:image/svg+xml;base64,'+base64.b64encode((root/'dispenser.svg').read_bytes()).decode()
page=page.replace('src="dispenser.svg"','src="'+svg+'"')
script='window.ASTERWIND_FILM='+json.dumps(film).replace('</','<\\/')+';\n'+(root/'hub.js').read_text()
page=page.replace('<script src="hub.js"></script>','<script>'+script+'</script>')
(root/'dist').mkdir(exist_ok=True)
(root/'dist/index.html').write_text(page)
print('Built',root/'dist/index.html')
