import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "43",
            "name": "effsound",
            "checksize": "1024",
            "iosmd5": "b78f42942a63f9b481cf4af28af76bb3",
            "androidmd5": "b78f42942a63f9b481cf4af28af76bb3",
            "version": "1.0.1",
          },
        },
        { "#text": "\n\n" },
      ],
    },
  ]);
}
