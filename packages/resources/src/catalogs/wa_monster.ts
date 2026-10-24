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
        { "ItemSpec": [], ":@": { "id": "7300001", "monster": "900173", "randomRate": "50" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "7300002", "monster": "900174", "randomRate": "30" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "7300003", "monster": "900175", "randomRate": "30" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "7300004", "monster": "900176", "randomRate": "10" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "7300005", "monster": "900177", "randomRate": "5" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7300006", "monster": "900205", "type": "1", "randomRate": "10" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
