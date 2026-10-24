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
            "id": "170500",
            "min_level": "1",
            "max_level": "15",
            "weight": "10",
            "reward": "230130",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "170501",
            "min_level": "16",
            "max_level": "30",
            "weight": "10",
            "reward": "230131",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "170502",
            "min_level": "30",
            "max_level": "37",
            "weight": "10",
            "reward": "230132",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "170503",
            "min_level": "30",
            "max_level": "37",
            "weight": "10",
            "reward": "230131",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
