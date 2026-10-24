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
                "id": "brotherhood_treasure",
                "online": "all",
                "test": "all",
                "version": "2.0.1",
                "pf": "all",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "brotherhood_friend",
                "online": "all",
                "test": "all",
                "version": "2.0.1",
                "pf": "all",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "quest_ui",
                "online": "all",
                "test": "all",
                "version": "2.12.0",
                "pf": "all",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "function_on_luaUI" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
