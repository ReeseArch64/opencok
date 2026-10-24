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
            "id": "9021901",
            "type": "1",
            "reward": "250158",
            "num": "1",
            "gold_count": "3000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021902",
            "type": "1",
            "reward": "250159",
            "num": "2",
            "gold_count": "3000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021903",
            "type": "1",
            "reward": "250160",
            "num": "3",
            "gold_count": "3000",
          },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021908", "type": "2", "reward": "250165", "num": "3" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
