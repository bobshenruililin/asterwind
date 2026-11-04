"""Build the original Scope episode into a dependency-free offline review file."""
from pathlib import Path
import json,base64
ROOT=Path(__file__).resolve().parent
EP=ROOT/'episodes/scope'
def main():
 story=json.loads((EP/'story.json').read_text())
 data='window.SCOPE_STORY='+json.dumps(story,ensure_ascii=False).replace('</','<\\/')+';'
 (EP/'story-data.js').write_text(data)
 page=(EP/'index.html').read_text()
 page=page.replace('<link rel="stylesheet" href="scene.css">','<style>'+(EP/'scene.css').read_text()+'</style>')
 page=page.replace('src="scene.svg"','src="data:image/svg+xml;base64,'+base64.b64encode((EP/'scene.svg').read_bytes()).decode()+'"')
 for name,content in [('story-data.js',data),('timeline.js',(EP/'timeline.js').read_text()),('scene.js',(EP/'scene.js').read_text())]:page=page.replace('<script src="'+name+'"></script>','<script>'+content.replace('</script','<\\/script')+'</script>')
 (ROOT/'dist').mkdir(exist_ok=True)
 (ROOT/'dist/scope.html').write_text(page)
 print('Built',ROOT/'dist/scope.html')
if __name__=='__main__':main()
