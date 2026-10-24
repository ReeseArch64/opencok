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
        { "ItemSpec": [], ":@": { "id": "218300", "reward": "248485", "score": "100" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "218301", "reward": "248486", "score": "300" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "218302", "reward": "248487", "score": "500" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
