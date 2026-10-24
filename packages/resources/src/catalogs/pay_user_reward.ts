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
        { "ItemSpec": [], ":@": { "id": "9021601", "time": "0", "reward": "249764" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021602", "time": "1", "reward": "249765" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021603", "time": "2", "reward": "249766" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021604", "time": "3", "reward": "249767" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021605", "time": "4", "reward": "249768" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021606", "time": "5", "reward": "249769" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "9021607", "time": "6", "reward": "249770" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
