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
            "id": "9054001",
            "openday": "1;4",
            "bossid": "9053501;9053502;9053503;9053504;9053513",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9054002",
            "openday": "2;5",
            "bossid": "9053505;9053506;9053507;9053508;9053514",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9054003",
            "openday": "3;6",
            "bossid": "9053509;9053510;9053511;9053512;9053515",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
