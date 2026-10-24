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
          ":@": { "id": "89700", "type": "1", "level": "1", "point": "1000", "item": "239301" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89701", "type": "1", "level": "2", "point": "2000", "item": "239302" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89702", "type": "1", "level": "3", "point": "5000", "item": "239303" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89703", "type": "1", "level": "4", "point": "10000", "item": "239304" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89704", "type": "1", "level": "5", "point": "15000", "item": "239305" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89705", "type": "1", "level": "6", "point": "30000", "item": "239306" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89706", "type": "1", "level": "7", "point": "80000", "item": "239307" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89707", "type": "1", "level": "8", "point": "150000", "item": "239308" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89708", "type": "1", "level": "9", "point": "300000", "item": "239309" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89709", "type": "1", "level": "10", "point": "500000", "item": "239310" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89710", "type": "1", "level": "11", "point": "1000000", "item": "239311" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89711", "type": "1", "level": "12", "point": "4000000", "item": "239312" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "89712", "type": "1", "level": "13", "point": "6000000", "item": "239313" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
