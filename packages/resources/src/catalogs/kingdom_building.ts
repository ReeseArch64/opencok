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
                "id": "516000",
                "type": "1",
                "building": "150000",
                "rally_max_troop": "5000000",
                "building_max_troop": "5000000",
                "build_speadup": "0",
                "destroy_speedup": "0",
                "buff": "517000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516001",
                "type": "1",
                "building": "150000",
                "rally_max_troop": "5000000",
                "building_max_troop": "5000000",
                "build_speadup": "0",
                "destroy_speedup": "0",
                "buff": "517000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516002",
                "type": "1",
                "building": "180000",
                "rally_max_troop": "5000000",
                "building_max_troop": "5000000",
                "build_speadup": "3",
                "destroy_speedup": "3",
                "buff": "517000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516100",
                "type": "2",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517100;517150",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516101",
                "type": "2",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517100;517150",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516102",
                "type": "2",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517100;517150",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516200",
                "type": "3",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517200;517250",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516201",
                "type": "3",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517200;517250",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "516202",
                "type": "3",
                "building_max_troop": "5000000",
                "conquest_point": "5",
                "buff": "517200;517250",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "kingdom_building" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
