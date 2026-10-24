import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "  \n\t" },
        {
          "ItemSpec": [],
          ":@": {
            "id": "11001015",
            "suit_effect": "2-2910#4-774#6-756#8-68#10-69",
            "suit_value": "2-6.5536#4-6.5536#6-655.36#8-13.1072#10-13.1072",
            "suit_dialog": "2-111715#4-111714#6-138518#8-103447#10-103446",
            "suit_value_type": "2-0#4-0#6-0#8-1#10-1",
            "suit_value_sign": "2-2#4-2#6-2#8-1#10-1",
          },
        },
        { "#text": "\n \n\n\n" },
      ],
    },
  ]);
}
