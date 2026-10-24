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
          ":@": { "id": "53400", "item_id": "200004", "value": "500", "rank": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53401", "item_id": "200414", "value": "2500", "rank": "2" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53402", "item_id": "200416", "value": "2500", "rank": "3" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53403", "item_id": "200220", "value": "6000", "rank": "4" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53404", "item_id": "200221", "value": "10000", "rank": "5" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53405", "item_id": "200450", "value": "15000", "rank": "6" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53406", "item_id": "200426", "value": "2000", "rank": "7" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53407", "item_id": "200410", "value": "5000", "rank": "8" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53408", "item_id": "200101", "value": "500", "rank": "9" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53409", "item_id": "200427", "value": "6000", "rank": "10" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53410", "item_id": "200001", "value": "5000", "rank": "11" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "53411", "item_id": "200002", "value": "40000", "rank": "12" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
