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
                "id": "8100",
                "rate_exp": "100",
                "total_time": "2",
                "spending": "500",
                "suddenly": "50",
                "entry_time": "0",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8101",
                "rate_exp": "200",
                "total_time": "2",
                "spending": "500",
                "suddenly": "50",
                "entry_time": "0",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8102",
                "rate_exp": "400",
                "total_time": "2",
                "spending": "500",
                "suddenly": "50",
                "entry_time": "0",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8103",
                "rate_exp": "800",
                "total_time": "2",
                "spending": "500",
                "suddenly": "50",
                "entry_time": "0",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "8104",
                "rate_exp": "1600",
                "total_time": "2",
                "spending": "500",
                "suddenly": "50",
                "entry_time": "72",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "train" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
