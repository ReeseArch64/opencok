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
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "2901998",
                "reward":
                  "1-1;252872|2-3;252873|4-10;252874|11-20;252875|21-50;252876|51-150;252877|151-500;252878|501-2000;252879|2001-5000;252880|5001-20000;252881|20001-100000;252882|100001-500000;252883|500001-5000000;252884|5000001-999999999;252885",
                "mail": "1-999999999;12634",
                "start_time": "2020-02-11",
                "end_time": "2050-03-11",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "2901999",
                "reward":
                  "1-1;252890|2-3;252891|4-10;252892|11-50;252893|51-150;252894|151-500;252895|501-1000;252896|1001-5000;252897|5001-999999;252898",
                "mail": "1-999999;12635",
                "start_time": "2020-02-11",
                "end_time": "2050-03-11",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "equipment_rank" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
