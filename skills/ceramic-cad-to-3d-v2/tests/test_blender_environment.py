"""Installation integrity gates independent of a populated host Docker cache."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import blender_environment as env

class BlenderInstall(unittest.TestCase):
    def test_missing_and_modified_binary_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            with patch.object(env,'SKILL',root):
                with self.assertRaisesRegex(ValueError,'Blender missing'):env.verify()
                (root/'assets').mkdir();(root/'assets/selected-surface.json').write_text(json.dumps({'distribution':{'sha256':'a'*64},'systemPackages':[]}))
                binary=root/'.tools/blender/blender';binary.parent.mkdir(parents=True);binary.write_bytes(b'original')
                (binary.parent/'installation.json').write_text(json.dumps({'archiveSha256':'a'*64,'files':{'blender':env.digest(binary)}}))
                system=root/'.tools/system';system.mkdir();(system/'installation.json').write_text(json.dumps({'packages':[],'files':{}}))
                self.assertEqual(env.verify(),'a'*64)
                binary.write_bytes(b'changed')
                with self.assertRaisesRegex(ValueError,'installation drift'):env.verify()

if __name__=='__main__':unittest.main()
