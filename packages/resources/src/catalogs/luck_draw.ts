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
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85051", "type": "0", "reward": "248544", "rate": "100", "color": "1" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85052", "type": "0", "buff": "505574", "rate": "100", "color": "4" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85053", "type": "0", "buff": "505575", "rate": "100", "color": "2" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85054", "type": "0", "buff": "505576", "rate": "100", "color": "2" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85055", "type": "0", "buff": "505577", "rate": "100", "color": "4" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85056", "type": "0", "buff": "505578", "rate": "100", "color": "1" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85057", "type": "0", "buff": "505579", "rate": "100", "color": "3" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85058", "type": "0", "buff": "505580", "rate": "100", "color": "1" },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": { "id": "85059", "type": "0", "lucky_round": "1", "rate": "100", "color": "2" },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "luck_draw" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
