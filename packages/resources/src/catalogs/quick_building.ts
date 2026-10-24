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
          ":@": { "id": "5857101", "groupid": "1", "buildingid": "400000", "Targetlv": "30" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "5857102", "groupid": "1", "buildingid": "401000", "Targetlv": "30" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "5857103", "groupid": "1", "buildingid": "402000", "Targetlv": "30" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "5857104", "groupid": "1", "buildingid": "403000", "Targetlv": "30" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "5857105", "groupid": "1", "buildingid": "404000", "Targetlv": "30" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "5857106", "groupid": "1", "buildingid": "407000", "Targetlv": "30" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
