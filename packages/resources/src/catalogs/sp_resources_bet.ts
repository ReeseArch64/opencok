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
        { "ItemSpec": [], ":@": { "id": "6550001", "double": "1" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6550002",
            "double": "2",
            "rate": "100",
            "criticalrate": "0",
            "redouble": "1",
            "cost": "100",
            "sprate": "100",
            "spcriticalrate": "0",
            "spredouble": "1",
            "spcost": "100",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6550003",
            "double": "3",
            "rate": "100",
            "criticalrate": "0",
            "redouble": "1",
            "cost": "100",
            "sprate": "100",
            "spcriticalrate": "0",
            "spredouble": "1",
            "spcost": "200",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6550004",
            "double": "4",
            "rate": "100",
            "criticalrate": "0",
            "redouble": "1",
            "cost": "200",
            "sprate": "100",
            "spcriticalrate": "0",
            "spredouble": "1",
            "spcost": "200",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6550005",
            "double": "5",
            "rate": "100",
            "criticalrate": "0",
            "redouble": "1",
            "cost": "250",
            "sprate": "100",
            "spcriticalrate": "0",
            "spredouble": "1",
            "spcost": "300",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "6550006",
            "double": "6",
            "rate": "100",
            "criticalrate": "0",
            "redouble": "0",
            "cost": "300",
            "sprate": "100",
            "spcriticalrate": "0",
            "spredouble": "0",
            "spcost": "300",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
