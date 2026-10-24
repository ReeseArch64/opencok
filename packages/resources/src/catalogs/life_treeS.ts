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
              ":@": {
                "id": "980001",
                "buff": "505182;505183;505184",
                "skinExp": "0",
                "time": "10",
                "resouceType": "1",
                "resourceSkinExp": "4000",
                "goldSkinExp": "2",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "980002",
                "buff": "500990;500991;500993",
                "skinExp": "5000000",
                "time": "5",
                "resouceType": "1",
                "resourceSkinExp": "4000",
                "goldSkinExp": "2",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "life_treeS" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
