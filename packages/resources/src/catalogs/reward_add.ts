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
            "id": "83001",
            "goods_id": "209861",
            "add": "100",
            "first_time": "2016-7-21-00-00",
            "circle": "604800",
            "duration": "86400",
            "activity_id": "57076",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
