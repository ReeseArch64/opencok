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
        { "ItemSpec": [], ":@": { "id": "2929801", "color": "1" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2929802", "color": "2", "rate": "170000", "system_rate": "150000" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2929803", "color": "3", "rate": "18800", "system_rate": "4900" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2929804", "color": "4", "rate": "1708", "system_rate": "140" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2929805", "color": "5", "rate": "109", "system_rate": "3" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
