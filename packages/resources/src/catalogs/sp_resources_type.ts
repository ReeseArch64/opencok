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
              ":@": { "id": "523000", "type": "1", "ratio": "10000", "dialog": "160017" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523001", "type": "2", "ratio": "10000", "dialog": "104000" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523002", "type": "3", "ratio": "12000", "dialog": "111886" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523003", "type": "4", "ratio": "10000", "dialog": "160274" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523004", "type": "5", "ratio": "6000", "dialog": "190220" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523005", "type": "6", "ratio": "12000", "dialog": "190230" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523006", "type": "7", "ratio": "6000", "dialog": "111685" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523007", "type": "8", "ratio": "3000", "dialog": "190046" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523008", "type": "9", "ratio": "7000", "dialog": "190047" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523009", "type": "10", "ratio": "12000", "dialog": "190048" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523010", "type": "11", "ratio": "6000", "dialog": "190244" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "523011", "type": "12", "ratio": "6000", "dialog": "190245" },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "sp_resources_type" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
