import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n " },
        {
          "Group": [
            { "#text": "\n\t  " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "1492001",
                "type": "1",
                "dialog": "221013",
                "sign": "2",
                "percent": "1",
              },
            },
            { "#text": "\n\t  " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "1492002",
                "type": "2",
                "dialog": "221011",
                "sign": "2",
                "percent": "1",
              },
            },
            { "#text": "\n\t  " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "1492003",
                "type": "3",
                "dialog": "221012",
                "sign": "1",
                "percent": "1",
              },
            },
            { "#text": "\n\t  " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "1492004",
                "type": "4",
                "dialog": "221010",
                "sign": "1",
                "percent": "1",
              },
            },
            { "#text": "\n   " },
          ],
          ":@": { "id": "drawRandom" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
