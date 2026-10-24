import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n   " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "20203001",
            "type": "1",
            "server_id": "8810",
            "game_servers": "1;2;3;4;5;6;7;8;9;10;11",
            "condition": "1;30-36",
            "buff_effect": "1010|1030",
            "buff_num": "30|40",
            "burn_speed": "100|200|300|400|500",
            "burn_time": "600",
            "reward_mail": "12294|12295|12296",
            "award_reward_mail": "12312|12313",
            "award_num": "4|5",
            "superarmy_item": "1-3;0|4-5;300",
            "superarmy_item_goods": "200020",
            "palace_value": "50000000",
          },
        },
        { "#text": "\n\n  \n" },
      ],
    },
  ]);
}
