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
            "id": "7502500",
            "pay": "0.99",
            "range": "10-15;90|17-20;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "20-25;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "1",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "7502501",
            "pay": "4.99",
            "range": "50-75;90|75-100;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "85-120;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "5",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "7502502",
            "pay": "9.99",
            "range": "100-150;90|130-200;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "180-230;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "10",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "7502503",
            "pay": "19.99",
            "range": "200-300;90|250-350;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "330-400;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "7502504",
            "pay": "49.99",
            "range": "500-750;90|700-850;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "800-1000;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "50",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "7502505",
            "pay": "99.99",
            "range": "1000-1500;90|1450-1600;1",
            "times": "5-10;90|7-12;10",
            "lucky_range": "1500-2000;1",
            "lucky_times": "10-15;100",
            "lucky_rate": "100",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
