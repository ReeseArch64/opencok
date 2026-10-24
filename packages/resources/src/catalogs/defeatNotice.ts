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
        { "ItemSpec": [], ":@": { "id": "102000", "type": "0", "object": "1", "mp": "50" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102001", "type": "0", "object": "1", "effect": "10;100" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102002", "type": "0", "object": "10", "effect": "10;60" },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "102010", "type": "0", "object": "1", "mp": "50" } },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "102011", "type": "0", "object": "2", "effect": "10;80" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102012", "type": "0", "object": "12", "effect": "10;10" },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "102020", "type": "0", "object": "1", "mp": "50" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102021", "type": "0", "object": "22", "effect": "10;80" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102022", "type": "0", "object": "11", "effect": "10;80" },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "102030", "type": "0", "object": "1", "mp": "50" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102031", "type": "0", "object": "21", "effect": "10;80" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102032", "type": "0", "object": "3", "effect": "10;100" },
        },
        { "#text": "\n  " },
        { "ItemSpec": [], ":@": { "id": "102040", "type": "1", "object": "130", "mp": "50" } },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102041", "type": "1", "object": "130", "effect": "11;100" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "102042", "type": "1", "object": "113", "effect": "11;10" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
