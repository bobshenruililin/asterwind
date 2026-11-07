"""Check the shareable folder's declared local assets, without a browser or network.

This is a packaging check, not visual, audio, or playback verification. It covers
markup/CSS URLs and the existing data-driven art, sound, voice and film contracts,
including the played scenes' generated depth and spoken-line filenames.
It deliberately does not evaluate arbitrary JavaScript or production provenance.
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import unquote, urlsplit

LAUNCH_TARGETS = {
    'index.html': 'docs/demos/unfolded/?v=2',
    'v2.html': 'docs/demos/unfolded/?v=2',
    'legacy.html': 'docs/demos/unfolded/',
}
PLAYED = 'docs/demos/played/'
PLAYED_EPISODES = ('slides', 'scope', 'pixel', 'ship')
PLAYED_FILMS = ('seam',)  # played from film/story.json rather than an anthology episode
ENTRYPOINTS = (
    *LAUNCH_TARGETS,
    'docs/demos/unfolded/index.html', 'hub/index.html', 'film/index.html',
    *(PLAYED + name for name in ('index.html', 'pixel.html', 'scene.html')),
    *(f'anthology/episodes/{name}/index.html' for name in
      ('scope', 'standup', 'ship', 'slides', 'pixel')),
)
CSS_URL = re.compile(r'url\(\s*([\'"]?)(.*?)\1\s*\)', re.I)


class RuntimeMarkup(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.links = []
        self.redirects = []
        self.styles = []
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.in_style = tag == 'style' or self.in_style
        for name in ('src', 'poster'):
            if attrs.get(name):
                self.urls.append(attrs[name])
        if tag in ('image', 'use', 'script') or (
                tag == 'link' and attrs.get('rel', '').lower() in ('stylesheet', 'preload', 'icon')):
            for name in ('href', 'xlink:href'):
                if attrs.get(name):
                    self.urls.append(attrs[name])
        if attrs.get('style'):
            self.styles.append(attrs['style'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            match = re.search(r'\burl\s*=\s*(.+)', attrs.get('content', ''), re.I)
            if match:
                self.redirects.append(match[1].strip().strip('\'"'))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            self.styles.append(data)


def verify_play(root):
    root = Path(root).resolve()
    errors, checked = [], set()

    def require(owner, url, base=None, navigation=False):
        if not isinstance(url, str) or not url:
            errors.append(f'{owner.relative_to(root)}: empty or non-string asset path')
            return
        url = url.strip()
        if url.startswith(('#', 'data:', 'about:')):
            return
        parsed = urlsplit(url)
        label = f'{owner.relative_to(root)} -> {url}'
        if parsed.scheme or parsed.netloc or url.startswith('/'):
            errors.append(label + ' (must be a local relative asset)')
            return
        path = ((base or owner.parent) / unquote(parsed.path)).resolve()
        if navigation and path.is_dir():
            path = (path / 'index.html').resolve()
        if not path.is_relative_to(root):
            errors.append(label + ' (escapes playable folder)')
        elif not path.is_file():
            errors.append(label + ' (missing from playable folder)')
        else:
            checked.add(path)

    def read(relative):
        owner = root / relative
        require(root / 'index.html', relative, root)
        return owner, json.loads(owner.read_text(encoding='utf-8')) if owner.is_file() else {}

    for path in ENTRYPOINTS:
        require(root / 'index.html', path, root)
    for owner in root.rglob('*'):
        if owner.suffix.lower() not in ('.html', '.css', '.svg') or not owner.is_file():
            continue
        text = owner.read_text(encoding='utf-8')
        styles = [text] if owner.suffix == '.css' else []
        if owner.suffix != '.css':
            parser = RuntimeMarkup()
            parser.feed(text)
            for url in parser.urls:
                require(owner, url)
            for url in parser.links:
                # External documentation links are not runtime dependencies.
                if not urlsplit(url).scheme and not urlsplit(url).netloc:
                    require(owner, url, navigation=True)
            for url in parser.redirects:
                require(owner, url, navigation=True)
            launch = owner.relative_to(root).as_posix()
            if launch in LAUNCH_TARGETS:
                target = LAUNCH_TARGETS[launch]
                if target not in parser.redirects or target not in parser.links:
                    errors.append(f'{launch}: launch must redirect and link to {target}')
            styles.extend(parser.styles)
        for style in styles:
            for _, url in CSS_URL.findall(style):
                require(owner, url)

    # Validate every packaged opt-in art index, including candidate folders.
    # {src, owns} and string specifications have the same local-file contract.
    read('docs/demos/unfolded/art/index.json')
    def art_asset(owner, room, spec):
        src = spec.get('src') if isinstance(spec, dict) else spec
        if (not isinstance(room, str) or not re.fullmatch(r'[a-z][a-z0-9-]*', room)
                or not isinstance(src, str)
                or not re.fullmatch(r'[-a-zA-Z0-9_./]+\.(?:png|webp|jpe?g|avif)', src, re.I)
                or src.startswith('/') or any(p in ('', '.', '..') for p in src.split('/'))):
            errors.append(f'{owner.relative_to(root)} -> {src} (invalid local art path; escapes playable folder or unsupported URL)')
            return
        require(owner, src, owner.parent / room)

    for art in (root / 'docs/demos/unfolded').glob('*/index.json'):
        data = json.loads(art.read_text(encoding='utf-8'))
        if not isinstance(data, dict) or 'rooms' not in data:
            continue
        for room, layers in data.get('rooms', {}).items():
            for spec in layers.get('plate', {}).values():
                art_asset(art, room, spec)
            if 'wall' in layers.get('scenery', {}):
                art_asset(art, room, layers['scenery']['wall'])
            for poses in layers.get('figures', {}).values():
                for spec in poses.values():
                    art_asset(art, room, spec)

    sound, data = read('docs/demos/unfolded/sound/manifest.json')
    for cue in data.get('cues', {}).values():
        require(sound, cue.get('file'))
    for filename in data.get('music', {}).values():
        require(sound, filename)
    voices, data = read('docs/demos/unfolded/voices/index.json')
    for voice_set in data.get('sets', {}).values():
        for filename in voice_set.get('cues', {}).values():
            require(voices, filename, voices.parent / voice_set.get('dir', ''))

    # These paths are composed at runtime, so markup scanning cannot see them.
    # Read the small literal declarations without executing JavaScript. Fail
    # clearly if that source contract changes rather than silently losing QA.
    played_sources = {}
    for name in ('stage.js', 'support.js', 'responsive.css', 'quiet.js', 'pixel.js', 'scene.js', 'story.js', 'story.css', 'clips.js'):
        owner = root / PLAYED / name
        require(root / PLAYED / 'index.html', name)
        if owner.is_file():
            played_sources[name] = owner.read_text(encoding='utf-8')

    quiet = root / PLAYED / 'quiet.js'
    source = played_sources.get('quiet.js', '')
    base = re.search(r"\bconst\s+PL\s*=\s*['\"]([^'\"]+)['\"]", source)
    plates = re.search(r'\bconst\s+PLATES\s*=\s*\{([^}]+)\}', source)
    if not base or not plates:
        errors.append(f'{PLAYED}quiet.js: cannot verify PL/PLATES asset declarations')
    else:
        filenames = re.findall(r"\w+\s*:\s*['\"]([^'\"]+)['\"]", plates[1])
        if not filenames:
            errors.append(f'{PLAYED}quiet.js: no declared plates')
        for filename in filenames:
            require(quiet, base[1] + filename + '.webp')
            require(quiet, 'plates/' + filename + '-depth.webp')

    for name in ('quiet.js', 'pixel.js', 'scene.js'):
        owner = root / PLAYED / name
        source = played_sources.get(name, '')
        for cue in set(re.findall(r"['\"](qm-[a-z0-9-]+)['\"]", source)):
            require(owner, 'voices/' + cue + '.mp3')
        for filename in set(re.findall(r"['\"]([a-z0-9-]+\.mp3)['\"]", source)):
            require(owner, '../unfolded/sound/' + filename)
        # Startup-error fallback links must work in the exported folder too.
        for url in re.findall(r"['\"](\.\./[^'\"\n]+\.html)['\"]", source):
            require(owner, url, navigation=True)

    scene = root / PLAYED / 'scene.js'
    supported = re.search(r'\bOK\s*=\s*\[([^]]+)\]', played_sources.get('scene.js', ''))
    if (not supported or set(re.findall(r"['\"]([a-z-]+)['\"]", supported[1]))
            != set(PLAYED_EPISODES) | set(PLAYED_FILMS)):
        errors.append(f'{PLAYED}scene.js: supported episodes changed; update the asset contract')
    for episode in PLAYED_EPISODES:
        story, data = read(f'anthology/episodes/{episode}/story.json')
        parts = {'setup': data.get('setup', []), **data.get('branches', {})}
        for part, beats in parts.items():
            for index, beat in enumerate(beats):
                if beat.get('speaker'):
                    require(scene, f'voices/{episode}-{part}-{index}.mp3')
        art, data = read(f'anthology/episodes/{episode}/art-manifest.json')
        for plate in data.get('plates', {}).values():
            src = plate.get('src')
            require(art, src)
            if isinstance(src, str) and src:
                # Match scene.js's split('/').pop().replace(/\.\w+$/, '').
                stem = re.sub(r'\.\w+$', '', src.rsplit('/', 1)[-1])
                require(scene, f'plates/{episode}/{stem}-depth.webp')

    # The Seam, played: every plate its beats and pose frames use, and a depth map for each.
    story, data = read('film/story.json')
    used = {data.get('decision', {}).get('asset')}
    for part in ('setup', 'backup', 'repair'):
        for beat in data.get(part, []):
            used.add(beat.get('asset')); used.update(f.get('asset') for f in beat.get('frames', []))
    for asset in sorted(a for a in used if a and a != 'black'):
        require(story, f'assets/{asset}.webp')
        require(scene, f'plates/seam/{asset}-depth.webp')
    # Played scripts, their voices and recorded sound: only manifest-listed files are requested at runtime.
    for episode in (*PLAYED_EPISODES, *PLAYED_FILMS, 'standup'):
        require(scene, f'scripts/{episode}.json')
    for listing, folder in (('voices/v2/manifest.json', 'voices/v2'),):
        owner, data = read(PLAYED + listing)
        for files in data.values():
            for filename in files.values():
                require(owner, filename, root / PLAYED / folder)
    owner, data = read(PLAYED + 'sound/manifest.json')
    for name in data.get('files', []):
        require(owner, name + '.mp3')
    # Object layers for the decisions.
    for name in ('clean', 'platter', 'tray', 'occluder'):
        require(quiet, f'plates/qm-layers/{name}.webp')
    for episode in PLAYED_EPISODES:
        _, data = read(f'anthology/episodes/{episode}/story.json')
        for action in [a.get('id') for a in data.get('choice', {}).get('actions', [])] + ['clean', 'over']:
            require(scene, f'plates/{episode}/layers/{action}.webp')

    journey = root / 'docs/demos/unfolded/index.html'
    if journey.is_file():
        for url in re.findall(r"['\"]((?:anthology|film|docs)/[^'\"\n]+\.html(?:\?[^'\"\n]*)?)['\"]",
                              journey.read_text(encoding='utf-8')):
            require(journey, url, root, navigation=True)

    for owner in (root / 'anthology/episodes').glob('*/art-manifest.json'):
        for plate in json.loads(owner.read_text(encoding='utf-8')).get('plates', {}).values():
            require(owner, plate.get('src'))
    seam = root / 'film/data.js'
    if seam.is_file():
        data = json.loads(seam.read_text(encoding='utf-8').split('=', 1)[1].strip().removesuffix(';'))
        for filename in data.get('ASSETS', {}).values():
            require(seam, filename)
        for voice in data.get('VOICES', {}).values():
            require(seam, voice.get('src'))
    for relative, pattern in (
            ('hub/art/manifest.js', r'[\'"](art/[^\'"\n]+\.(?:webp|png|jpe?g|svg|mp4|webm))[\'"]'),
            ('hub/drinks.js', r'[\'"](\.\./[^\'"\n]+\.(?:webp|png|jpe?g))[\'"]')):
        owner = root / relative
        if owner.is_file():
            for filename in re.findall(pattern, owner.read_text(encoding='utf-8')):
                require(owner, filename, root / 'hub')
    bridge = root / 'hub/bridge-manifest.json'
    if bridge.is_file():
        data = json.loads(bridge.read_text(encoding='utf-8'))
        for key in ('fallback', 'transition'):
            require(bridge, data.get(key, {}).get('src'))

    if errors:
        raise ValueError('Playable asset verification failed:\n' + '\n'.join(sorted(set(errors))))
    return len(checked)


if __name__ == '__main__':
    import sys
    destination = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'dist/play'
    print(f'Playable asset references passed ({verify_play(destination)} local files checked).')
