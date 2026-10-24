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
        { "ItemSpec": [], ":@": { "id": "108600", "level": "1", "win_num": "2" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108601", "level": "2", "win_num": "4" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108602", "level": "3", "win_num": "8" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108603", "level": "4", "win_num": "14" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108604", "level": "5", "win_num": "22" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108605", "level": "6", "win_num": "34" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "108606", "level": "7", "win_num": "100" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
