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
          "Group": [
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027101",
                "task_dialog": "9461235",
                "task_dialog_num": "500",
                "index": "1",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027102",
                "task_dialog": "9461235",
                "task_dialog_num": "1000",
                "index": "2",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027103",
                "task_dialog": "9461235",
                "task_dialog_num": "2000",
                "index": "3",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027104",
                "task_dialog": "9461235",
                "task_dialog_num": "3000",
                "index": "4",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027105",
                "task_dialog": "9461235",
                "task_dialog_num": "5000",
                "index": "5",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027106",
                "task_dialog": "9461235",
                "task_dialog_num": "8000",
                "index": "6",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027107",
                "task_dialog": "9461235",
                "task_dialog_num": "12000",
                "index": "7",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027108",
                "task_dialog": "9461235",
                "task_dialog_num": "15000",
                "index": "8",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027109",
                "task_dialog": "9461235",
                "task_dialog_num": "18000",
                "index": "9",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "52027110",
                "task_dialog": "9461235",
                "task_dialog_num": "22000",
                "index": "10",
                "task_go_type": "1",
                "task_go": "440000",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "geo_treasure_task" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
