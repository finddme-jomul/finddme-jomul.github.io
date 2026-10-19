"""Exercise the common photo generator; optionally retain browser fixtures."""
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import photos


def generate(root):
    root.mkdir(parents=True, exist_ok=True)
    records = []
    for i, size in enumerate([(600, 900), (1000, 500), (700, 700)]):
        p = root / f'source-{i}.png'
        Image.new('RGB', size, [(125, 65, 42), (42, 95, 140), (80, 130, 90)][i]).save(p)
        records.append({'source': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
                        'role': 'actual' if i == 0 else 'process',
                        'status': 'user-confirmed-final-fired' if i == 0 else 'user-confirmed-process',
                        'alt': f'Synthetic gallery test {i}'})
    for count in range(4):
        data = records[:count]
        if count == 3:
            data = {'photos': data, 'layout': {'mode': 'scatter', 'seed': 'dialog-regression'}}
        source = root / f'photos-{count}.json'
        source.write_text(json.dumps(data))
        with patch.object(photos, 'ROOT', root):
            photos.build_gallery(source, root / f'gallery-{count}')


class Presentation(unittest.TestCase):
    def test_generated_components_and_omission(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            generate(root)
            self.assertEqual((root/'gallery-0/gallery.html').read_text(), '')
            self.assertFalse((root/'gallery-0/gallery.js').exists())
            for count in (1, 2, 3):
                out = root/f'gallery-{count}'
                self.assertEqual(len(list((out/'assets').glob('*.webp'))), count)
                self.assertNotIn('__PHOTO_BORDER__', (out/'gallery.css').read_text())
                self.assertEqual((out/'gallery.js').read_bytes(), (photos.PROFILE.parent/'gallery/gallery.js').read_bytes())
                self.assertIn('photo-zoom-scroll', (out/'gallery.html').read_text())


if __name__ == '__main__':
    if os.environ.get('CERAMIC_GALLERY_FIXTURES'):
        generate(Path(os.environ['CERAMIC_GALLERY_FIXTURES']))
    unittest.main()
