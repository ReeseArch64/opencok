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
          "ItemSpec": [],
          ":@": {
            "id": "45500",
            "name": "com.hcg.dgm.gp",
            "md5": "a2ef1580a7f0bba6cc032c52b382e4f3",
            "pf": "market_global",
          },
        },
        { "#text": "\n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "45501",
            "name": "com.low.war.gp",
            "md5": "23ac7ebad4abec06a202293f7c05055e",
            "pf": "market_global",
          },
        },
        { "#text": "\n    \n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "45502",
            "name": "com.hcg.cok.gp",
            "md5": "9524b9f8f9dd4e21aeda2831279e61af|78a8b6cc16d40549588289cad60d494a",
            "pf": "market_global",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
