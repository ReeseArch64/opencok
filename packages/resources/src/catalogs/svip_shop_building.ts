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
          ":@": { "id": "9021101", "level": "1", "exp": "46700", "next_exp": "46700" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9021102", "level": "2", "exp": "84000", "next_exp": "130700" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9021103", "level": "3", "exp": "142800", "next_exp": "273500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9021104", "level": "4", "exp": "242700", "next_exp": "516200" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9021105", "level": "5", "exp": "971000", "next_exp": "1487200" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9021106", "level": "6", "exp": "1553766", "next_exp": "3040966" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
