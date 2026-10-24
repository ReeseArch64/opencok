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
            "id": "9021001",
            "compentime": "1",
            "lost": "40",
            "cdtime": "10",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021002",
            "compentime": "2",
            "lost": "40",
            "cdtime": "10",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021003",
            "compentime": "3",
            "lost": "40",
            "cdtime": "20",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021004",
            "compentime": "4",
            "lost": "40",
            "cdtime": "30",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021005",
            "compentime": "5",
            "lost": "40",
            "cdtime": "60",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021006",
            "compentime": "6",
            "lost": "40",
            "cdtime": "120",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021007",
            "compentime": "7",
            "lost": "40",
            "cdtime": "180",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021008",
            "compentime": "8",
            "lost": "40",
            "cdtime": "240",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9021009",
            "compentime": "9",
            "lost": "40",
            "cdtime": "360",
            "rate_num": "50",
            "rate_res": "50",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
