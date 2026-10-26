import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from page_runtime import document_with_runtime,refresh_lifecycle
class PageRuntime(unittest.TestCase):
 def test_same_bootstrap_in_fresh_and_existing_page(self):
  original='<html><head></head><body><main>Keep CAD</main><script type="module" src="./viewer.js"></script></body></html>'
  fresh=document_with_runtime(original)
  self.assertIn('viewer-entry-hint',fresh)
  self.assertEqual(refresh_lifecycle(fresh),fresh)
  self.assertIn('<main>Keep CAD</main>',fresh)
  self.assertIn('window.__jomulViewerLifecycle.ready()',fresh)
  with self.assertRaises(ValueError):refresh_lifecycle(original)
if __name__=='__main__':unittest.main()
