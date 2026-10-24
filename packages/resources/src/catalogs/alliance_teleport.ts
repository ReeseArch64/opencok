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
          ":@": { "id": "46600", "name": "chat", "type": "1", "para1": "3", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46601", "name": "depot", "type": "2", "para1": "2", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46602", "name": "tower", "type": "2", "para1": "2", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "46603",
            "name": "hospital",
            "type": "3",
            "para1": "2",
            "function_on": "1",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46604", "name": "donate", "type": "4", "para1": "1", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46605", "name": "monster", "type": "5", "para1": "3", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "46606",
            "name": "resources",
            "type": "6",
            "para1": "20",
            "function_on": "1",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46607", "name": "science", "type": "7", "para1": "0", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "46608",
            "name": "lordname",
            "type": "8",
            "para1": "0",
            "function_on": "1",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "46609", "name": "time", "type": "0", "para1": "7200", "function_on": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "46610",
            "name": "blacksmith",
            "type": "2",
            "para1": "1",
            "function_on": "1",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
