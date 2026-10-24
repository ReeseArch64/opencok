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
                "id": "9010001",
                "StartTime": "1",
                "LastTime": "1",
                "target_SetupTime": "8",
                "user_Type": "1",
                "activity_Type": "1;7|2;7",
                "reward_back": "9011028",
                "daily": "1|2|3|4|5|6|7",
                "reward_daily": "9011029|9011030|9011031|9011032|9011033|9011034|9011035",
                "castle_lv": "0",
                "pay_lv": "0",
                "lord_lv": "0",
                "lost_date": "0",
                "server": "0",
                "country": "0",
                "language": "0",
                "version": "0",
                "platform": "0",
                "popup": "1",
                "lost_condition": "31",
                "mail": "11810",
                "weight": "1",
                "pay_node": "0",
                "pay_reward": "0",
                "back_Type": "0",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "comeback" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
