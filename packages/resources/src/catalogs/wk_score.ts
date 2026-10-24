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
        { "ItemSpec": [], ":@": { "id": "800000", "level": "1", "score": "2" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800001", "level": "2", "score": "3" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800002", "level": "3", "score": "4" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800003", "level": "4", "score": "5" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800004", "level": "5", "score": "6" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800005", "level": "6", "score": "7" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800006", "level": "7", "score": "8" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800007", "level": "8", "score": "9" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800008", "level": "9", "score": "10" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "800009", "level": "10", "score": "11" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
