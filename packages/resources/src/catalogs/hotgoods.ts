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
        { "Itemspec": [], ":@": { "id": "45000", "condition": "1;0", "order": "1000" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45001", "condition": "1;1", "order": "1001" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45002", "condition": "1;2", "order": "1002" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45003", "condition": "1;3", "order": "1003" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45004", "condition": "1;4", "order": "1004" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45005", "condition": "1;5", "order": "1005" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45006", "condition": "1;6", "order": "1006" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45050", "condition": "2;1", "order": "100" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "45051", "condition": "4;48006", "order": "101" } },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": {
            "id": "45007",
            "condition": "5;2014-12-22-00-00|6;2014-12-29-00-00",
            "order": "1",
          },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": {
            "id": "45008",
            "condition": "5;2014-12-22-00-00|6;2014-12-29-00-00|2;1",
            "order": "2",
          },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": {
            "id": "45009",
            "condition": "5;2014-12-22-00-00|6;2014-12-29-00-00|4;48006",
            "order": "3",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
