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
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016001", "status_id": "509852" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016002", "status_id": "509853" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016003", "status_id": "509854" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016004", "status_id": "509855" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016005", "status_id": "509856" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "20016006", "status_id": "509857" } },
            { "#text": "\n" },
          ],
          ":@": { "id": "bestow_title" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
