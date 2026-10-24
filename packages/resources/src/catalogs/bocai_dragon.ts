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
              ":@": { "id": "85050", "type": "0", "reward": "248543", "rate": "100", "color": "5" },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "bocai_dragon" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
