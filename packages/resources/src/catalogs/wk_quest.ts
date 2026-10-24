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
          ":@": { "id": "218300", "type": "1", "reward": "20;2000|50;3000|100;5000" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "218301",
            "type": "2",
            "reward": "10000000;1000|20000000;2000|30000000;10000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "218302", "type": "3", "reward": "500;2000|2000;3000|5000;5000" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "218303",
            "type": "4",
            "reward": "30000000;2000|100000000;3000|200000000;5000",
          },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "218304", "type": "5", "rate": "20", "num": "1000" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
