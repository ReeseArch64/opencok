import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "4906000",
                "name": "164321",
                "add_friendship": "1",
                "cd_time": "14400",
                "friendship_limit": "0",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "4906001",
                "name": "164322",
                "add_friendship": "2",
                "cd_time": "28800",
                "friendship_limit": "0",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "4906002",
                "name": "164323",
                "add_friendship": "5",
                "cd_time": "86400",
                "friendship_limit": "30",
              },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "4906003",
                "name": "164324",
                "add_friendship": "10",
                "cd_time": "172800",
                "friendship_limit": "50",
              },
            },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "dragon_communicate" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
