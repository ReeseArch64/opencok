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
            { "#text": "\n     \n\t" },
            { "ItemSpec": [], ":@": { "id": "10011305", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10011315", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10011325", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10011335", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10011345", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10011355", "strengthLevel": "10", "count": "2" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "1140705", "strengthLevel": "0", "count": "1" } },
            { "#text": "\n\t\n\t" },
            { "ItemSpec": [], ":@": { "id": "10010105", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10010115", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10010125", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10010135", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10010145", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "10010155", "strengthLevel": "10", "count": "5" } },
            { "#text": "\n\n \n  " },
          ],
          ":@": { "id": "add_user_equip" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
