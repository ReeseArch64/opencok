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
          ":@": { "id": "45002", "k1": "65", "k2": "15|15|15|15|20|20|30|30|35|35" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "45003", "k1": "50;51;52;53", "k2": "30|30|30|35|35|35|40|40|45|50" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "45004", "k1": "38", "k2": "20|20|25|25|30|30|30|35|35|35" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "45005", "k1": "122", "k2": "300|320|320|320|320|340|340|350|350|350" },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "45001" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "45000" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
