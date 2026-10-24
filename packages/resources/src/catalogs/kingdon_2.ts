import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n    " },
        {
          "Group": [
            { "#text": "\n       " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "2",
                "name": "kingdom#2",
                "ip": "games.csmod.xyz",
                "port": "9933",
                "zone": "COK2",
                "recommend": "true",
                "hot": "true",
                "new": "true",
                "test": "false",
                "open_time": "2014-7-30 10:30:00",
                "inner_ip": "127.0.0.1",
                "db_ip": "127.0.0.1",
                "db_name": "cokdb2",
                "serverType": "0",
              },
            },
            { "#text": "\n\t\t\n\t" },
          ],
          ":@": { "id": "1" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
