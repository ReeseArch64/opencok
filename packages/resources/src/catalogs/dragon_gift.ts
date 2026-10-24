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
          "Group": [
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "35365001",
                "dragon_cfg": "760359;764116",
                "black_id": "760359",
                "blue_id": "764116",
                "add_pic": "blue_dragon_add001.png",
                "ver": "1",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "dragon_gift" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
