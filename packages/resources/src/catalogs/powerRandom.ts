import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "1491001",
            "times": "1",
            "ran_1": "5000",
            "ran_2": "500",
            "ran_3": "100",
            "iron": "1",
            "time": "1",
          },
        },
        { "#text": "\n\t" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "1491002",
            "times": "2",
            "ran_1": "10000",
            "ran_2": "5000",
            "ran_3": "500",
            "iron": "5",
            "time": "1.2",
          },
        },
        { "#text": "\n\t" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "1491003",
            "times": "5",
            "ran_1": "10000",
            "ran_2": "10000",
            "ran_3": "10000",
            "iron": "100",
            "time": "1.5",
          },
        },
        { "#text": "\n\t" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "1491004",
            "times": "10",
            "ran_1": "10000",
            "ran_2": "10000",
            "ran_3": "10000",
            "iron": "125",
            "time": "1",
          },
        },
        { "#text": "\n\t\n" },
      ],
    },
  ]);
}
