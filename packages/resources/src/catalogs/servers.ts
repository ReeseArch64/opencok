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
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": {
                "id": "1",
                "name": "kingdom#1",
                "ip": "192.168.1.104",
                "port": "9933",
                "zone": "COK1",
                "recommend": "true",
                "hot": "true",
                "new": "true",
                "test": "false",
                "open_time": "2023-09-20 10:30:00",
                "inner_ip": "gameserver",
                "db_ip": "database",
                "db_name": "cokdb1",
              },
            },
            { "#text": "\n\n\t" },
          ],
          ":@": { "id": "1" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
