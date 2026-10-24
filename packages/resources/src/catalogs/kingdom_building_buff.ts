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
                "id": "517000",
                "type": "1",
                "base": "62;10",
                "cd_time_once": "300",
                "donate_once": "21;20000|22;10000",
                "cost": "21;2000000|22;1000000",
              },
            },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "517001", "type": "1" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "517002", "type": "1" } },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "517100",
                "type": "2",
                "active": "1",
                "base": "855;100",
                "cd_time_once": "300",
                "cd_time_limit": "3000",
                "donate_once": "21;20000|22;10000",
                "cost": "21;1000000|22;500000",
                "right": "216000;216001;216002;216003;216004;216005;216006;216007;216008",
                "premise": "2",
                "icon": "science_def_a_6",
                "title": "190533",
                "description": "190534",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "517150",
                "type": "2",
                "active": "2",
                "icon": "science_mil_a_2",
                "title": "190535",
                "description": "190536",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "517200",
                "type": "3",
                "active": "1",
                "base": "854;100",
                "cd_time_once": "300",
                "cd_time_limit": "3000",
                "donate_once": "21;20000|22;10000",
                "cost": "21;1000000|22;500000",
                "right": "216000;216001;216002;216003;216004;216005;216006;216007;216008",
                "premise": "1",
                "icon": "science_dev_a_2",
                "title": "190537",
                "description": "190538",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "517250",
                "type": "3",
                "active": "2",
                "icon": "science_dev_a_7",
                "title": "190539",
                "description": "190540",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "kingdom_building_buff" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
