"""Synthetic packaging regressions; these do not claim image decoding or playback QA."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from play_assets import ENTRYPOINTS, LAUNCH_TARGETS, PLAYED, PLAYED_EPISODES, PLAYED_FILMS, verify_play

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
        self.put(PLAYED + 'quiet.js', "const PL='../../../anthology/episodes/standup/assets/reference-v1/';"
                 "const PLATES={master:'quiet-master'};const V=['qm-01'];const sound='tap.mp3';")
        self.put('anthology/episodes/standup/assets/reference-v1/quiet-master.webp', 'quiet plate')
        self.put(PLAYED + 'plates/quiet-master-depth.webp', 'quiet depth')
        self.put(PLAYED + 'voices/qm-01.mp3', 'quiet voice')
        self.put('docs/demos/unfolded/sound/tap.mp3', 'paper sound')
        self.put(PLAYED + 'scene.js', "const OK=['slides','scope','pixel','ship','seam'];")
        for name in ('stage.js', 'support.js', 'pixel.js', 'responsive.css', 'story.js', 'story.css', 'clips.js'):
            self.put(PLAYED + name, '/* fixture */')
        for episode in PLAYED_EPISODES:
            self.put(f'anthology/episodes/{episode}/story.json', {'setup': [], 'branches': {}})
            self.put(f'anthology/episodes/{episode}/art-manifest.json', {'plates': {}})
            for layer in ('clean', 'over'):
                self.put(PLAYED + f'plates/{episode}/layers/{layer}.webp', 'layer')
        # played scripts, voice/sound manifests, The Seam's film story and The Quiet Minute's object layers
        for episode in (*PLAYED_EPISODES, *PLAYED_FILMS, 'standup'):
            self.put(PLAYED + f'scripts/{episode}.json', {})
        self.put(PLAYED + 'voices/v2/manifest.json', {})
        self.put(PLAYED + 'sound/manifest.json', {'files': []})
        self.put('film/story.json', {'setup': [], 'backup': [], 'repair': [], 'decision': {}})
        for layer in ('clean', 'platter', 'tray', 'occluder'):
            self.put(PLAYED + f'plates/qm-layers/{layer}.webp', 'layer')

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

    def played_scene(self, episode='scope'):
        self.put(f'anthology/episodes/{episode}/story.json', {
            'setup': [{'speaker': '', 'line': 'Silent beat'}, {'speaker': 'Ren', 'line': 'Setup'}],
            'branches': {'extend': [{'speaker': 'Bo', 'line': 'One way'}],
                         'return': [{'speaker': 'Ren', 'line': 'The other way'}]}})
        self.put(f'anthology/episodes/{episode}/art-manifest.json', {
            'plates': {'master': {'src': 'assets/runtime/performance-master.webp'}}})
        paths = [f'anthology/episodes/{episode}/assets/runtime/performance-master.webp',
                 PLAYED + f'plates/{episode}/performance-master-depth.webp',
                 *(PLAYED + f'voices/{episode}-{cue}.mp3'
                   for cue in ('setup-1', 'extend-0', 'return-0'))]
        for path in paths:
            self.put(path, 'synthetic ' + path)
        return paths

    def test_played_runtime_and_launches_survive_folder_and_zip(self):
        paths = self.played_scene()
        paths += [PLAYED + name for name in
                  ('index.html', 'pixel.html', 'scene.html', 'quiet.js', 'scene.js',
                   'pixel.js', 'stage.js', 'support.js', 'responsive.css',
                   'voices/qm-01.mp3', 'plates/quiet-master-depth.webp')]
        out, archive = build.build(self.root)
        manifest = json.loads((out / 'build-manifest.json').read_text())
        with zipfile.ZipFile(archive) as bundle:
            for path in paths:
                self.assertEqual((out / path).read_bytes(), (self.root / path).read_bytes())
                self.assertEqual(bundle.read('asterwind-play/' + path), (self.root / path).read_bytes())
                self.assertIn(path, manifest['sha256_16'])
            for launch, target in LAUNCH_TARGETS.items():
                text = (out / launch).read_text()
                self.assertIn('url=' + target, text)
                self.assertIn(f'href="{target}"', text)
                self.assertEqual(bundle.read('asterwind-play/' + launch), (out / launch).read_bytes())

    def test_missing_played_runtime_and_dynamic_assets_fail_before_zip(self):
        paths = self.played_scene()
        paths += [PLAYED + name for name in
                  ('scene.html', 'support.js', 'responsive.css', 'voices/qm-01.mp3',
                   'plates/quiet-master-depth.webp')]
        paths += ['anthology/episodes/standup/assets/reference-v1/quiet-master.webp',
                  'docs/demos/unfolded/sound/tap.mp3', 'anthology/episodes/scope/story.json']
        for path in paths:
            with self.subTest(path=path):
                original = (self.root / path).read_bytes()
                (self.root / path).unlink()
                try:
                    with self.assertRaisesRegex(ValueError, Path(path).name):
                        build.build(self.root)
                    self.assertFalse((self.root / 'dist/asterwind-play.zip').exists())
                finally:
                    (self.root / path).write_bytes(original)

    def test_new_spoken_beat_requires_matching_played_voice(self):
        self.played_scene()
        self.put('anthology/episodes/scope/story.json', {
            'setup': [{'speaker': 'Ren', 'line': 'New first line'}], 'branches': {}})
        with self.assertRaisesRegex(ValueError, 'scope-setup-0.mp3'):
            build.build(self.root)

    def test_changed_played_declarations_cannot_silently_skip_validation(self):
        for name, source in (('quiet.js', '// removed plate declarations'),
                             ('scene.js', "const OK=['new-episode'];")):
            with self.subTest(name=name):
                path = self.root / PLAYED / name
                original = path.read_text()
                path.write_text(source)
                try:
                    with self.assertRaisesRegex(ValueError, name):
                        build.build(self.root)
                finally:
                    path.write_text(original)

    def test_v2_launch_cannot_lose_its_query(self):
        out, _ = build.build(self.root)
        launch = out / 'v2.html'
        launch.write_text(launch.read_text().replace('?v=2', ''))
        with self.assertRaisesRegex(ValueError, 'v2.html: launch must redirect'):
            verify_play(out)

    def test_played_authoring_and_qa_stay_out_of_folder_and_zip(self):
        for path in ('make-depth.py', 'make-voices.py', 'make-film-voices.py',
                     'qa/night-v2.cjs', 'source/private.json', 'review/private.png'):
            self.put(PLAYED + path, 'not runtime')
        self.put(PLAYED + 'PROVENANCE.md', 'attribution')
        out, archive = build.build(self.root)
        with zipfile.ZipFile(archive) as bundle:
            for path in ('make-depth.py', 'make-voices.py', 'make-film-voices.py',
                         'qa/night-v2.cjs', 'source/private.json', 'review/private.png'):
                self.assertFalse((out / PLAYED / path).exists())
                self.assertNotIn('asterwind-play/' + PLAYED + path, bundle.namelist())
            self.assertIn('asterwind-play/' + PLAYED + 'PROVENANCE.md', bundle.namelist())

    def test_missing_dynamic_journey_route_is_caught(self):
        self.put('docs/demos/unfolded/index.html',
                 "<script>const film='docs/demos/played/gone.html?ep=scope';</script>")
        with self.assertRaisesRegex(ValueError, 'played/gone.html'):
            build.build(self.root)

    def test_missing_local_fallback_link_is_caught(self):
        self.put(PLAYED + 'index.html', '<a href="missing.html">Original film</a>')
        with self.assertRaisesRegex(ValueError, 'missing.html'):
            build.build(self.root)

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
