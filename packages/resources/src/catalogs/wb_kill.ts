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
          ":@": {
            "id": "600001",
            "winning_streak": "1",
            "Bonus_points": "0",
            "shut_down": "0",
            "show": "0",
            "rob_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "600002",
            "winning_streak": "3",
            "Bonus_points": "1",
            "shut_down": "1",
            "show": "0",
            "rob_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "600003",
            "winning_streak": "5",
            "Bonus_points": "2",
            "shut_down": "2",
            "show": "0",
            "rob_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "600004",
            "winning_streak": "10",
            "Bonus_points": "5",
            "shut_down": "5",
            "show": "1",
            "rob_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "600005",
            "winning_streak": "30",
            "Bonus_points": "10",
            "shut_down": "10",
            "show": "1",
            "rob_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "600006",
            "winning_streak": "50",
            "Bonus_points": "30",
            "shut_down": "30",
            "show": "1",
            "rob_rate": "20",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
