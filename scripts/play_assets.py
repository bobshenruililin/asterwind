"""Check the shareable folder's declared local assets, without a browser or network.

This is a packaging check, not visual, audio, or playback verification. It covers
markup/CSS URLs and the existing data-driven art, sound, voice and film contracts.
It deliberately does not evaluate arbitrary JavaScript or production provenance.
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import unquote, urlsplit

ENTRYPOINTS = (
    'docs/demos/unfolded/index.html', 'hub/index.html', 'film/index.html',
    *(f'anthology/episodes/{name}/index.html' for name in
      ('scope', 'standup', 'ship', 'slides', 'pixel')),
)
CSS_URL = re.compile(r'url\(\s*([\'"]?)(.*?)\1\s*\)', re.I)


class RuntimeMarkup(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
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

    def require(owner, url, base=None):
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
            styles.extend(parser.styles)
        for style in styles:
            for _, url in CSS_URL.findall(style):
                require(owner, url)

    # This matches artUrl(room, filename), including transparent PNG pose sets.
    art, data = read('docs/demos/unfolded/art/index.json')
    for room, layers in data.get('rooms', {}).items():
        for filename in layers.get('plate', {}).values():
            require(art, filename, art.parent / room)
        for poses in layers.get('figures', {}).values():
            for filename in poses.values():
                require(art, filename, art.parent / room)

    sound, data = read('docs/demos/unfolded/sound/manifest.json')
    for cue in data.get('cues', {}).values():
        require(sound, cue.get('file'))
    for filename in data.get('music', {}).values():
        require(sound, filename)
    voices, data = read('docs/demos/unfolded/voices/index.json')
    for voice_set in data.get('sets', {}).values():
        for filename in voice_set.get('cues', {}).values():
            require(voices, filename, voices.parent / voice_set.get('dir', ''))

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
