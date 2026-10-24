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
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "200305", "count": "2000000000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200335", "count": "2000000000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200325", "count": "2000000000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200315", "count": "2000000000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200456", "count": "1000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200200", "count": "100000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "211508", "count": "2000000000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "211509", "count": "100000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "209604", "count": "50000" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "200009", "count": "2" } },
            { "#text": "\n   \n  " },
          ],
          ":@": { "id": "newbie_items" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
