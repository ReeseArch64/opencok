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
              "Itemspec": [],
              ":@": {
                "id": "218100",
                "type": "1",
                "condition": "1;10",
                "gold": "1000",
                "time": "7",
                "interest": "100;100;150;150;200;250;300",
                "on_sale": "1",
                "start_mail": "11839",
                "end_mai": "11840",
                "note_mail": "11841",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "exchange" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
