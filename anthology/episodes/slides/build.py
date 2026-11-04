"""Build the Missing Name review file from source artwork and script, with exact embedded MIME."""
from pathlib import Path
import json,base64,re
ROOT=Path(__file__).resolve().parents[2]
EP=ROOT/'episodes/slides'
def dump(value):return json.dumps(value,ensure_ascii=False).replace('</','<\\/')
def encode_art(manifest):
 if manifest.get('schemaVersion')!=1:raise ValueError('Unsupported art schema')
 result=json.loads(json.dumps(manifest))
 for plate in result['plates'].values():
  path=(EP/plate['src']).resolve()
  if not path.is_relative_to(EP.resolve()) or path.suffix!='.webp' or not path.is_file():raise ValueError('Missing or invalid local artwork')
  plate['src']='data:image/webp;base64,'+base64.b64encode(path.read_bytes()).decode()
 return result

def main():
 story=json.loads((EP/'story.json').read_text());art=json.loads((EP/'art-manifest.json').read_text())
 data='window.NAME_STORY='+dump(story)+';';art_data='window.NAME_ART='+dump(art)+';'
 (EP/'story-data.js').write_text(data);(EP/'art-data.js').write_text(art_data)
 page=(EP/'index.html').read_text()
 # The SVG is a single editable source, refreshed into the hosted and offline documents.
 page=re.sub(r'(<div id="vector-fallback">).*?(</svg>\s*</div>)',lambda m:m[1]+(EP/'scene.svg').read_text()+'</div>',page,flags=re.S)
 (EP/'index.html').write_text(page)
 page=page.replace('<link rel="stylesheet" href="scene.css">','<style>'+(EP/'scene.css').read_text()+'</style>')
 scripts={'story-data.js':data,'art-data.js':'window.NAME_ART='+dump(encode_art(art))+';'}
 for name in ['layout.js','timeline.js','scene.js']:scripts[name]=(EP/name).read_text()
 for name,content in scripts.items():page=page.replace('<script src="'+name+'"></script>','<script>'+content.replace('</script','<\\/script')+'</script>')
 (ROOT/'dist').mkdir(exist_ok=True);(ROOT/'dist/slides.html').write_text(page)
 print('Built',ROOT/'dist/slides.html')
if __name__=='__main__':main()
