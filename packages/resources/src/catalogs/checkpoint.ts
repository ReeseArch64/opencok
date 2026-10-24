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
          "Group": [
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "110000", "level": "1", "birth_point": "7,56" } },
            { "#text": "\n  " },
          ],
          ":@": { "id": "checkpoint" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
