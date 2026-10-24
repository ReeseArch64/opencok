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
        { "ItemSpec": [], ":@": { "id": "89800", "type": "1", "lv": "5", "reward": "249634" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "89801", "type": "1", "lv": "10", "reward": "249635" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "89802", "type": "1", "lv": "15", "reward": "249636" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "89803", "type": "1", "lv": "20", "reward": "249637" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
