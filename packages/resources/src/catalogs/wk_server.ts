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
        { "ItemSpec": [], ":@": { "id": "1", "value": "1", "time": "1" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "2", "value": "2", "time": "2" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "3", "value": "3", "time": "3" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "4", "value": "4", "time": "4" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5", "value": "5", "time": "5" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "6", "value": "6", "time": "6" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "7", "value": "7", "time": "7" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "8", "value": "8", "time": "8" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9", "value": "9", "time": "9" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "10", "value": "10", "time": "10" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "11", "value": "11", "time": "11" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "12", "value": "12", "time": "12" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
