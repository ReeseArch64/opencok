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
        {
          "ItemSpec": [],
          ":@": {
            "id": "20023000",
            "type": "2",
            "premise": "1",
            "time": "24",
            "number": "2",
            "action": "1",
            "function": "1",
            "dialog": "9440761",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "20023001",
            "type": "3",
            "premise": "2",
            "time": "24",
            "number": "1",
            "action": "1",
            "function": "1",
            "dialog": "9440762",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
