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
            { "ItemSpec": [], ":@": { "id": "5531000", "type": "1" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "5531001", "type": "3" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "5531002", "type": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "5531003", "type": "4" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "5531004", "type": "5" } },
            { "#text": "\n\t\n  " },
          ],
          ":@": { "id": "civilization" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
