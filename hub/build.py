"""Offline hub export. Typed local media, exact MIME types, no external dependencies."""
from pathlib import Path
import json, base64, re
ROOT = Path(__file__).resolve().parent
MIMES = {'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.ttf':'font/ttf'}
def local_asset(root, src, mime):
    if not isinstance(src,str) or not src: raise ValueError('Media src must be a local relative path')
    path=(root/src).resolve()
    if Path(src).is_absolute() or not path.is_relative_to(root.resolve()): raise ValueError('Media must stay inside hub')
    if MIMES.get(path.suffix.lower()) != mime: raise ValueError('Media extension/MIME mismatch: '+src)
    if not path.is_file(): raise ValueError('Missing media: '+src)
    return path

def validate_manifest(root, manifest):
    if manifest.get('schemaVersion') != 1: raise ValueError('Unsupported bridge schema')
    for key in ('fallback','transition'):
        media=manifest.get(key,{})
        kind=media.get('kind'); mime=media.get('mime')
        if kind=='still':
            if mime not in ('image/webp','image/png','image/jpeg'): raise ValueError('Invalid still MIME')
        elif kind=='video' and key=='transition':
            if mime not in ('video/mp4','video/webm') or media.get('audio')!='silent': raise ValueError('Bridge video must be silent MP4/WebM')
            stall=media.get('stallTimeoutMs'); maximum=media.get('maxPlaybackMs')
            if type(stall) is not int or type(maximum) is not int or not 1000<=stall<=10000 or not stall<=maximum<=60000: raise ValueError('Invalid bridge watchdogs')
        else: raise ValueError('Invalid media kind or non-still fallback')
        local_asset(root,media.get('src'),mime)
    return manifest

def data_url(path,mime):
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()

def encoded_manifest(root,manifest):
    return {**manifest,**{key:{**manifest[key],'src':data_url(local_asset(root,manifest[key]['src'],manifest[key]['mime']),manifest[key]['mime'])} for key in ('fallback','transition')}}

def dump(value): return json.dumps(value,ensure_ascii=False).replace('</','<\\/')

def build(root=ROOT):
    manifest=validate_manifest(root,json.loads((root/'bridge-manifest.json').read_text()))
    (root/'bridge-data.js').write_text('window.ASTERWIND_BRIDGE='+dump(manifest)+';\n')
    film=(root.parent/'film/dist/index.html').read_text()
    page=(root/'index.html').read_text().replace('<link rel="stylesheet" href="hub.css">','<style>'+(root/'hub.css').read_text()+'</style>')
    page=page.replace('src="dispenser.svg"','src="'+data_url(root/'dispenser.svg','image/svg+xml')+'"')
    for asset in (root/'assets').glob('*'):
        mime=MIMES.get(asset.suffix.lower())
        if mime and mime.startswith('image/'):
            page=page.replace('src="assets/'+asset.name+'"','src="'+data_url(asset,mime)+'"')
    # Fonts and journey scripts. Cameo and delivered-art paths become exact data URLs.
    for name in ('Kalam-Regular.ttf','Kalam-Bold.ttf'):
        page=page.replace("url('../app/assets/fonts/"+name+"')","url('"+data_url(root.parent/'app/assets/fonts'/name,'font/ttf')+"')")
    drinks=(root/'drinks.js').read_text()
    for src in sorted(set(re.findall(r"'(\.\./[^']+\.webp)'",drinks))):
        drinks=drinks.replace("'"+src+"'","'"+data_url((root/src).resolve(),'image/webp')+"'")
    manifest_js=(root/'art/manifest.js').read_text()
    for src in sorted(set(re.findall(r"'(art/[^']+\.(?:webp|png|jpg|jpeg))'",manifest_js))):
        manifest_js=manifest_js.replace("'"+src+"'","'"+data_url(local_asset(root,src,MIMES[Path(src).suffix.lower()]),MIMES[Path(src).suffix.lower()])+"'")
    inline=lambda text:'<script>'+text.replace('</script','<\\/script')+'</script>'
    for name,text in (('drinks.js',drinks),('art.js',(root/'art.js').read_text()),('art/manifest.js',manifest_js),('sound.js',(root/'sound.js').read_text()),('journey.js',(root/'journey.js').read_text())):
        page=page.replace('<script src="'+name+'"></script>',inline(text))
    page=page.replace('<script src="mechanism.js"></script>','<script>'+(root/'mechanism.js').read_text()+'</script>')
    page=page.replace('<script src="legacy-seam.js"></script>','<script>'+(root/'legacy-seam.js').read_text()+'</script>')
    registry=json.loads((root.parent/'anthology/registry.json').read_text())
    (root/'registry-data.js').write_text('window.ASTERWIND_REGISTRY='+dump(registry)+';\n')
    episodes={}
    for entry in registry['episodes']:
        if entry.get('adapter')=='anthology-v1' and entry.get('status') in ('playable-prototype','existing-playable'):
            if not re.fullmatch(r'[a-z][a-z0-9-]*',entry['id']): raise ValueError('Invalid episode ID')
            episodes[entry['id']]=(root.parent/'anthology/dist'/ (entry['id']+'.html')).read_text()
    anthology_script='window.ASTERWIND_REGISTRY='+dump(registry)+';\nwindow.ASTERWIND_EPISODES='+dump(episodes)+';\n'+(root.parent/'anthology/progress.js').read_text()
    page=page.replace('<script src="registry-data.js"></script><script src="../anthology/progress.js"></script>','<script>'+anthology_script+'</script>')
    script='window.ASTERWIND_FILM='+dump(film)+';\nwindow.ASTERWIND_BRIDGE='+dump(encoded_manifest(root,manifest))+';\n'+(root/'bridge.js').read_text()+'\n'+(root/'hub.js').read_text()
    page=page.replace('<script src="bridge-data.js"></script><script src="bridge.js"></script><script src="hub.js"></script>','<script>'+script+'</script>')
    page=page.replace('<a href="../film/index.html">Open The Seam directly</a>.','Enable JavaScript in a full browser to play this offline preview.')
    (root/'dist').mkdir(exist_ok=True);(root/'dist/index.html').write_text(page)
    print('Built',root/'dist/index.html')
if __name__=='__main__': build()
