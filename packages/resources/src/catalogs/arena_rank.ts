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
        { "ItemSpec": [], ":@": { "id": "5010100", "min": "0", "max": "500" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010101", "min": "501", "max": "1000" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010102", "min": "1002", "max": "1500" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010103", "min": "1503", "max": "2000" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010104", "min": "2004", "max": "2500" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010105", "min": "2505", "max": "3000" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "5010106", "min": "3006", "max": "3500" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
