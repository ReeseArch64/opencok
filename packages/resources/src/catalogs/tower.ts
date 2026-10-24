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
          ":@": {
            "id": "2945000",
            "type": "0",
            "army_limit": "6",
            "num_attack": "2",
            "time": "600",
            "id_status": "501000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "2945001",
            "type": "1",
            "army_limit": "5",
            "num_attack": "3",
            "time": "600",
            "id_status": "501010",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "2945002",
            "type": "2",
            "army_limit": "4",
            "num_attack": "4",
            "time": "600",
            "para": "5",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945003", "type": "3", "time": "200", "id_status": "501020" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945004", "type": "3", "time": "200", "id_status": "501021" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945005", "type": "3", "time": "200", "id_status": "501044" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945006", "type": "3", "time": "200", "id_status": "501030" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945007", "type": "3", "time": "200", "id_status": "501031" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945008", "type": "3", "time": "200", "id_status": "501032" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945009", "type": "3", "time": "200", "id_status": "501033" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945010", "type": "3", "time": "200", "id_status": "501034" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945011", "type": "3", "time": "200", "id_status": "501035" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "2945012", "type": "3", "time": "200", "id_status": "501036" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
