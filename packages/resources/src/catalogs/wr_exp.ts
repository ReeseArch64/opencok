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
          ":@": { "id": "20019001", "min": "1", "max": "1", "exp": "70", "reward": "239955" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019002", "min": "2", "max": "3", "exp": "65", "reward": "239956" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019003", "min": "4", "max": "10", "exp": "60", "reward": "239957" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019004", "min": "11", "max": "20", "exp": "55", "reward": "239958" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019005", "min": "21", "max": "40", "exp": "50", "reward": "239959" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019006", "min": "40", "max": "70", "exp": "45", "reward": "239960" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019007", "min": "71", "max": "110", "exp": "40", "reward": "239961" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "20019008", "min": "111", "max": "150", "exp": "35", "reward": "239962" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
