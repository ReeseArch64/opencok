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
        { "ItemSpec": [], ":@": { "id": "9050001", "reward": "249919;249920", "count": "1" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9050002", "reward": "250054;250055;250056", "count": "1" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
