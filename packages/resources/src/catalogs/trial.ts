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
          ":@": { "id": "999000", "hp": "11", "sequence": "1", "reward": "245715" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999001", "hp": "22", "sequence": "2", "reward": "245716" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999002", "hp": "44", "sequence": "3", "reward": "245717" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999003", "hp": "66", "sequence": "4", "reward": "245718" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999004", "hp": "88", "sequence": "5", "reward": "245719" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999005", "hp": "121", "sequence": "6", "reward": "245720" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999006", "hp": "165", "sequence": "7", "reward": "245721" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "999007", "hp": "220", "sequence": "8", "reward": "245722" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
