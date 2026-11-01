import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    "cosmetics_importer", Path(__file__).resolve().parents[1] / "scripts/import-cosmetics.py"
)
IMPORTER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(IMPORTER)


class ImportCosmeticsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="opencok-www-cosmetics-test-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.app = self.root / "app"
        self.client = self.root / "client"
        self.server = self.root / "server"
        self.packages = self.root / "packages"
        for directory in [self.app / "src/data", self.client, self.server, self.packages / "art"]:
            directory.mkdir(parents=True)
        (self.app / "src/data/cosmetic-types.json").write_text('{"100":"Castelo","109":"Asas"}')
        (self.app / "src/data/catalog.json").write_text(json.dumps([
            {"id": "troop", "category": "tropas", "status": "soon"},
            {"id": "skin-1", "category": "skins", "status": "available"},
        ]))
        (self.client / "database.local.xml").write_text('''<database>
          <Group id="goods"><ItemSpec id="10" name="castle-name" icon="castle"/></Group>
          <Group id="lord_image"><ItemSpec id="50" name="g050"/></Group>
          <Group id="status">
            <ItemSpec id="1" type2="100" effectart="castle" itemId="10"/>
            <ItemSpec id="2" type2="100" effectart="castle" itemId="10"/>
            <ItemSpec id="3" type2="109" effectart="castle" itemId="10"/>
            <ItemSpec id="4" type2="100" effectart="missing"/>
            <ItemSpec id="5" type2="999" effectart="castle" itemId="10"/>
          </Group>
        </database>''')
        (self.server / "status.xml").write_text('''<database>
          <ItemSpec id="1" type2="100"/><ItemSpec id="2" type2="100"/>
          <ItemSpec id="3" type2="100"/><ItemSpec id="4" type2="100"/>
          <ItemSpec id="5" type2="999"/>
        </database>''')
        (self.server / "lord_image.xml").write_text(
            '<database><ItemSpec id="50" name="g050"/></database>'
        )
        (self.client / "text_pt.ini").write_text("castle-name=Fortaleza de teste\n")
        (self.packages / "art/castle.png").write_bytes(b"synthetic-static-image")
        (self.packages / "art/g050_bust.png").write_bytes(b"synthetic-static-image")
        (self.packages / "art/manifest.json").write_text(json.dumps({"entries": [
            {"name": "avatar_zhanshi_castle.png", "kind": "sprite", "url": "castle.png", "thumb": "castle.png"},
            {"name": "g050_bust.png", "kind": "sprite", "url": "g050_bust.png", "thumb": "g050_bust.png"},
        ]}))
        self.patcher = patch.multiple(
            IMPORTER, APP=self.app, ROOT=self.root, CLIENT=self.client,
            SERVER=self.server, PACKAGES=self.packages,
        )
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def import_catalog(self):
        with contextlib.redirect_stdout(io.StringIO()):
            IMPORTER.import_cosmetics()
        return json.loads((self.app / "src/data/catalog.json").read_text())

    def test_import_duration_variants_produce_one_skin(self):
        result = self.import_catalog()
        self.assertEqual([item["id"] for item in result if item["category"] == "skins"], ["skin-1"])

    def test_import_preserves_manually_enabled_status(self):
        result = self.import_catalog()
        skin = next(item for item in result if item["id"] == "skin-1")
        self.assertEqual(skin["status"], "available")
        self.assertEqual(skin["name"], "Fortaleza de teste")

    def test_import_skin_preserves_original_id(self):
        result = self.import_catalog()
        skin = next(item for item in result if item["id"] == "skin-1")
        self.assertEqual(skin["reference"], "1")

    def test_import_missing_translation_uses_art_code_as_name(self):
        (self.client / "text_pt.ini").write_text("")
        result = self.import_catalog()
        skin = next(item for item in result if item["id"] == "skin-1")
        self.assertEqual(skin["name"], "castle")

    def test_import_server_client_type_disagreement_excludes_item(self):
        result = self.import_catalog()
        self.assertNotIn("skin-3", [item["id"] for item in result])

    def test_import_missing_image_excludes_item(self):
        result = self.import_catalog()
        self.assertNotIn("skin-4", [item["id"] for item in result])

    def test_import_unknown_type_does_not_guess(self):
        result = self.import_catalog()
        self.assertNotIn("skin-5", [item["id"] for item in result])

    def test_import_new_lord_is_coming_soon(self):
        result = self.import_catalog()
        lord = next(item for item in result if item["id"] == "senhor-g050")
        self.assertEqual(lord["category"], "avatares")
        self.assertEqual(lord["sourceTable"], "lord_image")
        self.assertEqual(lord["status"], "soon")

    def test_import_preserves_other_collections(self):
        result = self.import_catalog()
        self.assertEqual(result[0], {"id": "troop", "category": "tropas", "status": "soon"})

    def test_import_repeated_run_preserves_result_and_read_only_sources(self):
        inputs = [self.client / "database.local.xml", self.server / "status.xml"]
        before = [path.read_bytes() for path in inputs]
        first = self.import_catalog()
        second = self.import_catalog()
        self.assertEqual(second, first)
        self.assertEqual([path.read_bytes() for path in inputs], before)


class SupplementalMergeTests(unittest.TestCase):
    def test_unmatched_supplement_preserves_route_and_available_status(self):
        existing = {"id": "skin-20", "category": "skins", "cosmeticType": 116, "artCode": "halo", "sourceClient": "bosmod", "status": "available"}
        self.assertEqual(IMPORTER.merge_cosmetics([existing], []), [existing])

    def test_matching_art_preserves_curated_route_name_and_publication(self):
        existing = {"id": "skin-20", "reference": "20", "category": "skins", "cosmeticType": 116, "artCode": "halo", "sourceClient": "bosmod", "name": "Nome confirmado", "status": "available"}
        incoming = {"id": "skin-21", "reference": "21", "category": "skins", "cosmeticType": 116, "artCode": "halo", "status": "soon"}
        self.assertEqual(IMPORTER.merge_cosmetics([existing], [incoming]), [existing])

    def test_matching_art_can_complete_missing_preview(self):
        existing = {"id": "skin-20", "category": "skins", "cosmeticType": 116, "artCode": "halo", "sourceClient": "bosmod", "source": None, "previewStatus": "missing", "status": "available"}
        incoming = {"id": "skin-21", "category": "skins", "cosmeticType": 116, "artCode": "halo", "source": "data/cdn/extracteds/halo.png", "status": "soon"}
        actual = IMPORTER.merge_cosmetics([existing], [incoming])
        self.assertEqual(actual[0]["source"], "data/cdn/extracteds/halo.png")
        self.assertEqual(actual[0]["previewStatus"], "ready")
        self.assertEqual(actual[0]["id"], "skin-20")
        self.assertEqual(actual[0]["status"], "available")

    def test_new_supplement_remains_unpublished(self):
        incoming = {"id": "skin-21", "category": "skins", "cosmeticType": 116, "artCode": "halo", "status": "soon"}
        self.assertEqual(IMPORTER.merge_cosmetics([], [incoming]), [incoming])


if __name__ == "__main__":
    unittest.main()
