import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n    \n\t" },
        {
          "Group": [
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "1", "serverType": "0" } },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "1" },
        },
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "2", "serverType": "0" } },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "2" },
        },
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "3", "serverType": "0" } },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "3" },
        },
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "4", "serverType": "0" } },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "4" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
