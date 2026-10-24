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
        { "ItemSpec": [], ":@": { "id": "8000", "army": "350000" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "8001", "army": "350001" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "8002", "army": "350002" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
