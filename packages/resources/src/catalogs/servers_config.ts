import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n" },
        {
          "ItemSpec": [],
          ":@": { "id": "castle_upgrade", "level": "30", "prestige": "6", "enabled": "1" },
        },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "auto_science", "enabled": "1" } },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "saga_science_max", "enabled": "1" } },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "foreign_science_max", "enabled": "0" } },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "auto_level", "enabled": "1", "level": "100" } },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "add_user_equip", "enabled": "1" } },
        { "#text": "\n" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "auto_hero",
            "enabled": "1",
            "unlockAll": "1",
            "maxLevel": "0",
            "maxStar": "1",
          },
        },
        { "#text": "\n" },
        {
          "ItemSpec": [],
          ":@": { "id": "auto_dragon", "enabled": "1", "unlockAll": "1", "maxLevel": "1" },
        },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "auto_civilization_science", "enabled": "1" } },
        { "#text": "\n" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "power_limit",
            "enabled": "1",
            "max_power": "5000000000",
            "gmBypass": "1",
            "rankingHideGm": "1",
          },
        },
        { "#text": "\n" },
        { "ItemSpec": [], ":@": { "id": "newbie_items", "enabled": "1" } },
        { "#text": "\n" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "global_rank",
            "attackPercent": "1",
            "attackWins": "1",
            "defenceWins": "1",
            "UnitHP": "1",
            "honorPoint": "1",
            "kill": "1",
            "militaryPoint": "1",
            "power": "1",
          },
        },
        { "#text": "\n   \n" },
      ],
    },
  ]);
}
