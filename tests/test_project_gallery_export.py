import unittest,tempfile,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from project_gallery_export import preserve_host_gallery
class GalleryExport(unittest.TestCase):
 def test_dynamic_photos_survive_without_duplicate_generated_photos(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);old=root/'old';new=root/'new'
   for p in [old,new]:(p/'assets').mkdir(parents=True)
   markup='<section id="gallery"><div class="gallery-first"><img src="./assets/actual.webp"><img src="./assets/process.webp"></div></section>'
   (old/'index.html').write_text(markup)
   (new/'index.html').write_text('<head></head><section id="gallery"><img src="./assets/photo-9.webp"></section><footer></footer>')
   for name in ['actual.webp','process.webp','photo-1.jpg','photo-4.heic']:(old/'assets'/name).write_bytes(name.encode())
   (new/'assets/photo-9.webp').write_bytes(b'redundant')
   preserve_host_gallery(old,new,root)
   self.assertEqual((new/'index.html').read_text(),'<head></head>'+markup+'<footer></footer>')
   for name in ['actual.webp','process.webp','photo-1.jpg','photo-4.heic']:self.assertEqual((old/'assets'/name).read_bytes(),(new/'assets'/name).read_bytes())
   self.assertFalse((new/'assets/photo-9.webp').exists())
if __name__=='__main__':unittest.main()
