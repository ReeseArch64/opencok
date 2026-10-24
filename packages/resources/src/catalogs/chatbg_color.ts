import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    { "#text": "﻿" },
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n\t\n" },
        { "ItemSpec": [], ":@": { "id": "1", "chatbg_id": "16", "color": "200:158:130" } },
        { "#text": "\n\t\n" },
        { "ItemSpec": [], ":@": { "id": "2", "chatbg_id": "17", "color": "244:217:153" } },
        { "#text": "\n\t\n" },
        { "ItemSpec": [], ":@": { "id": "3", "chatbg_id": "18", "color": "248:194:146" } },
        { "#text": "\n\t\n" },
        { "ItemSpec": [], ":@": { "id": "4", "chatbg_id": "19", "color": "171:187:217" } },
        { "#text": "\n\t\n" },
        { "ItemSpec": [], ":@": { "id": "5", "chatbg_id": "20", "color": "216:195:239" } },
        { "#text": "\n\t\t\n" },
      ],
    },
  ]);
}
