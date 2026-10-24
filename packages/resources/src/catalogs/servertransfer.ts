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
        { "ItemSpec": [], ":@": { "id": "6700001", "serverlist": "1;2" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "6700002", "serverlist": "8901;8902" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
