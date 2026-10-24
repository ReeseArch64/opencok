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
                "id": "57064",
                "k1": "IOS",
                "k2": "US",
                "k3": "2.0.13",
                "k5": "0",
                "k6": "20",
                "k7": "247251",
                "k8": "20",
                "k9": "1458403200000",
                "k10": "1459267200000",
                "k11": "cok",
                "k12": "mr",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "magic_rush" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
