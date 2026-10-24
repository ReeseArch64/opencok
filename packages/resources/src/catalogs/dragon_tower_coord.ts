import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "85000",
                "coord1": "0.32;0.64",
                "coord2": "0.51;0.63",
                "coord3": "0.73;0.66",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "85001",
                "coord1": "0.31;0.66",
                "coord2": "0.48;0.62",
                "coord3": "0.72;0.69",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "85002",
                "coord1": "0.25;0.6",
                "coord2": "0.48;0.66",
                "coord3": "0.73;0.63",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "85003",
                "coord1": "0.28;0.66",
                "coord2": "0.51;0.63",
                "coord3": "0.71;0.66",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "85004",
                "coord1": "0.29;0.6",
                "coord2": "0.51;0.66",
                "coord3": "0.72;0.63",
              },
            },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "dragon_tower_coord" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
