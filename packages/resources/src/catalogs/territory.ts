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
          ":@": { "id": "6001", "condition1": "1", "condition2": "50", "towermunber_add": "4" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6002",
            "condition1": "50",
            "condition2": "5000000",
            "towermunber_add": "3",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6003",
            "condition1": "60",
            "condition2": "10000000",
            "towermunber_add": "2",
            "condition3": "40",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6004",
            "condition1": "70",
            "condition2": "20000000",
            "towermunber_add": "1",
            "condition3": "60",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6005",
            "condition1": "80",
            "condition2": "25000000",
            "towermunber_add": "1",
            "condition3": "80",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
