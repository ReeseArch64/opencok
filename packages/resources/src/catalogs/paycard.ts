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
        { "ItemSpec": [], ":@": { "id": "69000", "castle_lv": "1;10", "card_num": "3" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "69001", "castle_lv": "11;20", "card_num": "5" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "69002", "castle_lv": "21;30", "card_num": "7" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "69003", "castle_lv": "31;35", "card_num": "10" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
