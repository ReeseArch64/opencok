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
          ":@": { "id": "9750", "rate": "100", "effect1": "3|2", "effect2": "4|2" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9751", "rate": "95", "effect1": "3|4", "effect2": "4|4" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9752", "rate": "90", "effect1": "3|6", "effect2": "4|6" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9753", "rate": "85", "effect1": "3|8", "effect2": "4|8" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9754", "rate": "80", "effect1": "3|10", "effect2": "4|10" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9755", "rate": "75", "effect1": "3|12", "effect2": "4|12" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9756", "rate": "70", "effect1": "3|14", "effect2": "4|14" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9757", "rate": "65", "effect1": "3|16", "effect2": "4|16" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9758", "rate": "60", "effect1": "3|18", "effect2": "4|18" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "9759", "rate": "55", "effect1": "3|20", "effect2": "4|20" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
