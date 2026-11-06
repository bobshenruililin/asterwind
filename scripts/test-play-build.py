"""Synthetic packaging regressions; these do not claim image decoding or playback QA."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from play_assets import ENTRYPOINTS, verify_play

spec = importlib.util.spec_from_file_location('play_build', Path(__file__).with_name('build-play.py'))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class PlayBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for name in ENTRYPOINTS:
            self.put(name, '<!doctype html><html><title>Fixture</title></html>')
        for name in ('Kalam-Regular.ttf', 'Kalam-Bold.ttf', 'OFL.txt'):
            self.put('app/assets/fonts/' + name, 'fixture')
        for name in ('seam-night-sketch.mp3', 'seam-dawn-sketch.mp3', 'PROVENANCE.md'):
            self.put('docs/demos/sound-board/music/' + name, 'fixture')
        self.put('anthology/progress.js', '// fixture')
        self.art = 'docs/demos/unfolded/art/'
        self.put(self.art + 'index.json', {'rooms': {}})
        self.put('docs/demos/unfolded/sound/manifest.json', {'cues': {}, 'music': {}})
        self.put('docs/demos/unfolded/voices/index.json', {'sets': {}})

    def tearDown(self):
        self.temp.cleanup()

    def put(self, name, value):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value) if isinstance(value, dict) else value, encoding='utf-8')
        return path

    def heard(self, filename='ellis-brace.png'):
        self.put(self.art + 'index.json', {'rooms': {'heard': {
            'plate': {'night': 'plate-night.png'},
            'figures': {'ellis': {'brace': filename}}}}})
        self.put(self.art + 'heard/plate-night.png', 'synthetic PNG fixture')

    def test_png_layers_survive_folder_and_zip(self):
        self.heard()
        original = self.put(self.art + 'heard/ellis-brace.png', 'synthetic transparent fixture')
        out, archive = build.build(self.root)
        self.assertEqual((out / self.art / 'heard/ellis-brace.png').read_bytes(), original.read_bytes())
        with zipfile.ZipFile(archive) as bundle:
            self.assertEqual(bundle.read('asterwind-play/' + self.art + 'heard/ellis-brace.png'), original.read_bytes())
        self.assertGreater(verify_play(out), 0)

    def test_object_layers_and_split_wall_survive_folder_and_zip(self):
        self.put(self.art + 'index.json', {'rooms': {'heard': {
            'plate': {'night': {'src': 'sky.png'}},
            'scenery': {'wall': {'src': 'wall.png'}},
            'figures': {'ellis': {'brace': {'src': 'poses/brace.png', 'owns': ['route']}}}}}})
        for filename in ('sky.png', 'wall.png', 'poses/brace.png'):
            self.put(self.art + 'heard/' + filename, 'synthetic ' + filename)
        out, archive = build.build(self.root)
        with zipfile.ZipFile(archive) as bundle:
            for filename in ('sky.png', 'wall.png', 'poses/brace.png'):
                relative = self.art + 'heard/' + filename
                self.assertEqual((out / relative).read_bytes(), (self.root / relative).read_bytes())
                self.assertEqual(bundle.read('asterwind-play/' + relative), (self.root / relative).read_bytes())

    def test_missing_wall_and_object_pose_fail_before_zip(self):
        for layers in ({'scenery': {'wall': 'missing.png'}},
                       {'figures': {'ellis': {'brace': {'src': 'missing.png', 'owns': ['route']}}}}):
            self.put(self.art + 'index.json', {'rooms': {'heard': layers}})
            with self.assertRaisesRegex(ValueError, 'missing.png'):
                build.build(self.root)

    def test_candidate_art_is_preserved_and_checked(self):
        candidate = 'docs/demos/unfolded/art-candidate-b/'
        self.put(candidate + 'index.json', {'rooms': {'heard': {'scenery': {'wall': 'wall.png'}}}})
        self.put(candidate + 'heard/wall.png', 'candidate fixture')
        out, _ = build.build(self.root)
        self.assertTrue((out / candidate / 'heard/wall.png').is_file())
        (self.root / candidate / 'heard/wall.png').unlink()
        with self.assertRaisesRegex(ValueError, 'wall.png'):
            build.build(self.root)

    def test_art_object_cannot_bypass_local_path_validation(self):
        self.heard({'src': 'https://example.com/remote.png', 'owns': ['route']})
        with self.assertRaisesRegex(ValueError, 'invalid local art path'):
            build.build(self.root)

    def test_source_review_and_standin_assets_stay_excluded(self):
        for folder in ('art-brief', 'art-standin', 'review', 'qa', 'source', 'incoming'):
            self.put('docs/demos/unfolded/' + folder + '/private.png', 'not runtime')
        self.put('docs/demos/unfolded/art/heard/PROVENANCE.md', 'attribution')
        out, _ = build.build(self.root)
        self.assertFalse(list(out.rglob('private.png')))
        self.assertTrue((out / self.art / 'heard/PROVENANCE.md').is_file())

    def test_missing_declared_art_fails_before_zip(self):
        self.heard()
        with self.assertRaisesRegex(ValueError, 'ellis-brace.png.*missing'):
            build.build(self.root)
        self.assertFalse((self.root / 'dist/asterwind-play.zip').exists())

    def test_missing_css_asset_is_caught(self):
        self.put('hub/index.html', '<style>body { background: url("missing.png"); }</style>')
        with self.assertRaisesRegex(ValueError, 'missing.png'):
            build.build(self.root)

    def test_fragment_and_data_urls_are_valid(self):
        self.put('hub/index.html', '<svg><use href="#a"/></svg><img src="data:image/png;base64,AA=="><style>g { filter:url(#a) }</style>')
        build.build(self.root)

    def test_local_url_queries_are_valid(self):
        self.put('hub/index.html', '<script src="../anthology/progress.js?v=2#ready"></script>')
        build.build(self.root)

    def test_escaping_asset_path_is_rejected(self):
        self.heard('../../../../../../../../outside.png')
        with self.assertRaisesRegex(ValueError, 'escapes playable folder'):
            build.build(self.root)

    def test_remote_runtime_asset_is_rejected(self):
        self.put('hub/index.html', '<img src="https://example.com/remote.png">')
        with self.assertRaisesRegex(ValueError, 'must be a local relative asset'):
            build.build(self.root)

    def test_voice_manifest_is_checked(self):
        self.put('docs/demos/unfolded/voices/index.json', {'sets': {'team': {
            'dir': 'team', 'cues': {'heard-01': 'heard-01.mp3'}}}})
        with self.assertRaisesRegex(ValueError, 'heard-01.mp3'):
            build.build(self.root)

    def test_sound_and_music_manifests_are_checked(self):
        self.put('docs/demos/unfolded/sound/manifest.json', {
            'cues': {'fold': {'file': 'fold.mp3'}}, 'music': {'night': 'night.mp3'}})
        with self.assertRaisesRegex(ValueError, 'fold.mp3'):
            build.build(self.root)

    def test_film_asset_contract_is_checked(self):
        self.put('film/data.js', 'window.SEAM_DATA={"ASSETS":{"cover":"assets/gone.webp"},"VOICES":{}};')
        with self.assertRaisesRegex(ValueError, 'gone.webp'):
            build.build(self.root)

    def test_episode_plate_is_checked(self):
        self.put('anthology/episodes/standup/art-manifest.json', {
            'plates': {'master': {'src': 'assets/gone.webp'}}})
        with self.assertRaisesRegex(ValueError, 'gone.webp'):
            build.build(self.root)

    def test_dispenser_art_is_checked_relative_to_hub(self):
        self.put('hub/art/manifest.js', "window.ASTERWIND_ART={face:{src:'art/machine/cabinet.png'}};")
        with self.assertRaisesRegex(ValueError, 'cabinet.png'):
            build.build(self.root)
        self.put('hub/art/machine/cabinet.png', 'fixture')
        build.build(self.root)

    def test_silent_video_bridge_is_checked(self):
        self.put('hub/bridge-manifest.json', {
            'fallback': {'src': 'assets/poster.webp'}, 'transition': {'src': 'assets/intro.mp4'}})
        self.put('hub/assets/poster.webp', 'fixture')
        with self.assertRaisesRegex(ValueError, 'intro.mp4'):
            build.build(self.root)


if __name__ == '__main__':
    unittest.main()
