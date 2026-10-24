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
            "id": "2.1.0",
            "ios": "72fsxCB*(f1v=lR$",
            "android": "gw3#2NfklQ=R-w1v",
            "para": "baseActiveKey",
            "open": "1",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "2.1.1",
            "ios": "72fsxCB*(f1v=lR$",
            "android": "gw3#2NfklQ=R-w1v",
            "para": "baseActiveKey",
            "open": "1",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
