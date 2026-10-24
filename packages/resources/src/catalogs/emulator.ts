import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46550", "name": "[MEmu]" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46551", "name": "[Droid4X]" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46552", "name": "[umEM]" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46553", "name": "[Liaoran]" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46554", "name": "3.4.67-qemu" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46555", "name": "3.10.30-android-x86-hd" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46556", "name": "3.4.0-qemu" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46557", "name": "3.18.8-android-x86" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46558", "name": "3.10.30-android-x86-hd" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
