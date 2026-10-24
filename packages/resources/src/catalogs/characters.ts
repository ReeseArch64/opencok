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
        { "ItemSpec": [], ":@": { "id": "44000", "name": "g044" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44001", "name": "g041" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44002", "name": "g024" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44003", "name": "g026" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44004", "name": "g015" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44005", "name": "g038" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44006", "name": "g008" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44007", "name": "g032" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44008", "name": "g012" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "44009", "name": "g007" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
