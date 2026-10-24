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
            { "ItemSpec": [], ":@": { "id": "9012501", "Type": "20", "call_activity": "0" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012510", "Type": "31", "call_activity": "57159" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012511", "Type": "34", "call_activity": "57133" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012512", "Type": "6", "call_activity": "57161" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012513", "Type": "6", "call_activity": "571861" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012514", "Type": "6", "call_activity": "57189" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012515", "Type": "6", "call_activity": "57190" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012516", "Type": "6", "call_activity": "57199" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012517", "Type": "6", "call_activity": "57188" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012518", "Type": "6", "call_activity": "57195" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012519", "Type": "6", "call_activity": "57175" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "9012521", "Type": "6", "call_activity": "57208" } },
            { "#text": "\n\t" },
            { "ItemSpec": [], ":@": { "id": "9012557", "Type": "31", "call_activity": "57568" } },
            { "#text": "\n\t\n\t" },
            { "ItemSpec": [], ":@": { "id": "9012574", "Type": "31", "call_activity": "57628" } },
            { "#text": "\n\t\n  " },
          ],
          ":@": { "id": "activity_page" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
