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
            "id": "41000",
            "cost": "0",
            "white": "35",
            "green": "30",
            "blue": "25",
            "violet": "10",
            "safety1": "2",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41001",
            "cost": "50",
            "white": "35",
            "green": "30",
            "blue": "25",
            "violet": "10",
            "safety2": "100;2",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41002",
            "cost": "0",
            "white": "150",
            "green": "99",
            "blue": "45",
            "violet": "6",
            "safety1": "2",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41003",
            "cost": "100",
            "white": "135",
            "green": "90",
            "blue": "60",
            "violet": "15",
            "safety2": "100;2",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41004",
            "cost": "200",
            "white": "111",
            "green": "90",
            "blue": "75",
            "violet": "24",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41005",
            "cost": "400",
            "white": "96",
            "green": "75",
            "blue": "90",
            "violet": "39",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41006",
            "cost": "800",
            "white": "80",
            "green": "80",
            "blue": "80",
            "violet": "60",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "41007",
            "cost": "1600",
            "white": "48",
            "green": "48",
            "blue": "48",
            "violet": "156",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
