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
        { "ItemSpec": [], ":@": { "id": "20201001", "effect": "877|878|879", "num": "12|3|5" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "20201002", "effect": "1040|1050", "num": "11|9" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "20201003", "effect": "880|1020|1030", "num": "2|5|7" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
