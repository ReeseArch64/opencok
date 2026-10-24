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
        {
          "ItemSpec": [],
          ":@": { "id": "6900101", "rewards": "248707", "need_item": "211276", "need_num": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "6900102", "rewards": "248706", "need_item": "211276", "need_num": "3" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "6900103", "rewards": "248705", "need_item": "211276", "need_num": "5" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
