"""Encoder/schema tests use synthetic bytes, not decodable-video QA."""
import importlib.util, tempfile, unittest, json
from pathlib import Path
spec=importlib.util.spec_from_file_location('hub_build',Path(__file__).with_name('build.py'))
build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
class MediaBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        (self.root/'assets').mkdir();(self.root/'assets/poster.webp').write_bytes(b'RIFF fixture only')
        (self.root/'assets/bridge.mp4').write_bytes(b'\x00\x00\x00\x18ftyp fixture only')
        self.manifest={'schemaVersion':1,'transition':{'kind':'video','src':'assets/bridge.mp4','mime':'video/mp4','audio':'silent','stallTimeoutMs':3000,'maxPlaybackMs':30000},'fallback':{'kind':'still','src':'assets/poster.webp','mime':'image/webp'}}
    def tearDown(self): self.temp.cleanup()
    def test_exact_mime(self):
        build.validate_manifest(self.root,self.manifest);encoded=build.encoded_manifest(self.root,self.manifest)
        self.assertTrue(encoded['transition']['src'].startswith('data:video/mp4;base64,'));self.assertTrue(encoded['fallback']['src'].startswith('data:image/webp;base64,'))
    def test_mismatch(self):
        self.manifest['transition']['mime']='video/webm'
        with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_missing(self):
        self.manifest['transition']['src']='assets/missing.mp4'
        with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_escape(self):
        self.manifest['transition']['src']='../outside.mp4'
        with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_sound_rejected(self):
        self.manifest['transition']['audio']='enabled'
        with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_watchdog_bounds(self):
        for value in (0,True,100000):
            self.manifest['transition']['maxPlaybackMs']=value
            with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_fallback_must_be_still(self):
        self.manifest['fallback']=self.manifest['transition'].copy()
        with self.assertRaises(ValueError): build.validate_manifest(self.root,self.manifest)
    def test_script_escaping(self): self.assertNotIn('</script>',build.dump({'text':'</script>'}))
if __name__=='__main__': unittest.main()
