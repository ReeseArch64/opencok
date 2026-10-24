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
        { "ItemSpec": [], ":@": { "id": "46500", "day": "1", "reward": "250723" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46501", "day": "2", "reward": "250724" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46502", "day": "3", "reward": "250725" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46503", "day": "4", "reward": "250726" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46504", "day": "5", "reward": "250727" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46505", "day": "6", "reward": "250728" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "46506", "day": "7", "reward": "250729" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
