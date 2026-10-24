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
        { "ItemSpec": [], ":@": { "id": "20202001", "effect": "2143|2144|2145", "num": "12|3|5" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "20202002", "effect": "2146|2147", "num": "11|9" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "20202003", "effect": "2148|2149|2150", "num": "2|5|7" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
