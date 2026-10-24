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
          ":@": { "id": "89850", "level": "1", "gold_num": "500", "repay_per": "110;130" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89851", "level": "2", "gold_num": "1000", "repay_per": "110;130" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89852", "level": "3", "gold_num": "3000", "repay_per": "110;130" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89853", "level": "4", "gold_num": "5000", "repay_per": "110;130" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
