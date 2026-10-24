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
        { "ItemSpec": [], ":@": { "id": "20012000", "rank": "1", "reward": "249860" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "20012001", "rank": "2", "reward": "249859" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
