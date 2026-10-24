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
          "Group": [
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "30000000", "range": "40;30;5", "num": "10", "build": "900877" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "30000001", "range": "40;270;5", "num": "10", "build": "900878" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "30000002", "range": "280;30;5", "num": "5", "build": "900879" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "30000003", "range": "260;260;5", "num": "5", "build": "900880" },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "br_resource_refresh" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
