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
                "id": "89680",
                "tittle": "169877",
                "rate_show": "169879;0|169880;0|169881;9|169882;10|169883;21|169884;60",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "89681",
                "tittle": "169878",
                "rate_show": "169879;24|169880;20|169881;20|169882;20|169883;16|169884;0",
              },
            },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "general_draw_rate" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
