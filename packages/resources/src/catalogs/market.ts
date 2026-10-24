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
                "id": "8150",
                "type": "0",
                "pare": "0",
                "level_num": "500;800;1000;1300;1600;2000",
                "level_rate": "15;20;30;15;15;5",
                "total": "40000",
                "price_type": "0",
                "price": "800",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8151",
                "type": "0",
                "pare": "1",
                "level_num": "600;1000;1200;1500;1800;2200",
                "level_rate": "15;20;30;15;15;5",
                "total": "400000",
                "price_type": "0",
                "price": "800",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8152",
                "type": "0",
                "pare": "2",
                "level_num": "300;500;700;900;1100;1300",
                "level_rate": "15;20;30;15;15;5",
                "total": "20000",
                "price_type": "0",
                "price": "1000",
                "condition": "1",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8153",
                "type": "1",
                "pare": "200000",
                "level_num": "0;1;0;2;0;3",
                "level_rate": "0;25;0;50;0;25",
                "total": "20",
                "price_type": "0",
                "price": "800",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "Market" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
