"""Source/geometry contracts only, not computed browser layout."""
from html.parser import HTMLParser
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1] / 'docs/demos/played'
class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.stack=[]; self.ids={}; self.assets=[]; self.feed(html)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids[a['id']]={'parent':self.stack[-1][1] if self.stack else None,'attrs':a,'tag':tag}
        if tag in ('script','link'): self.assets.append(a.get('src') or a.get('href'))
        if tag not in ('meta','link','img','input','br','hr'): self.stack.append((tag,a.get('id')))
    def handle_endtag(self, tag):
        if self.stack and self.stack[-1][0]==tag:self.stack.pop()
class Layout(unittest.TestCase):
    def test_controller_geometry_owns_only_the_picture(self):
        for name in ('index','pixel','scene'):
            with self.subTest(name=name):
                t=Tree((ROOT/(name+'.html')).read_text())
                self.assertEqual(t.ids['frame']['parent'],'screen')
                self.assertEqual(t.ids['cv']['parent'],'frame')
                self.assertEqual(t.ids['start']['parent'],'frame')
                self.assertIn('disabled',t.ids['start']['attrs'])
                for id in ('cap','thought','end','chrome'):
                    self.assertEqual(t.ids[id]['parent'],'screen', id)
                for asset in t.assets:self.assertTrue((ROOT/asset).exists(),asset)
                self.assertIn('support.js',t.assets);self.assertIn('responsive.css',t.assets)
    def test_portrait_preserves_all_art_and_allows_flowing_text(self):
        css=(ROOT/'responsive.css').read_text()
        self.assertIn('height:56.25vw',css)
        self.assertIn('flex-direction:column',css)
        self.assertIn('html,body{overflow:auto',css)
        self.assertIn('#cap,#thought,#end{position:relative',css)
        self.assertIn('min-height:44px',css)
        for width in (320,375,390,430,768):
            height=width*9/16
            self.assertAlmostEqual(width/height,16/9)
            self.assertGreater(height,0)
    def test_reduced_motion_pixel_draw_uses_static_environment_time(self):
        js=(ROOT/'pixel.js').read_text()
        self.assertIn('function draw(){const t=reduced?0:S.t;',js)
        self.assertIn('at(.3,()=>blip(90,.18,.2))',js)
if __name__=='__main__':unittest.main()
