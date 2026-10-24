import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n\t" },
        {
          "Group": [
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512000", "name": "164644", "effect": "481", "show": "1", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512001", "name": "164645", "effect": "482", "show": "1", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512002", "name": "164646", "effect": "483", "show": "1", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512003", "name": "164647", "effect": "484", "show": "1", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512004", "name": "164648", "effect": "485", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512005", "name": "164649", "effect": "486", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512006", "name": "164650", "effect": "487", "show": "0", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512007", "name": "164651", "effect": "488", "show": "0", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512008", "name": "164652", "effect": "489", "show": "0", "buff": "2" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512009", "name": "164653", "effect": "490", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512010", "name": "164654", "effect": "491", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512011", "name": "164655", "effect": "492", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512012", "name": "164656", "effect": "493", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t\t" },
            {
              "ItemSpec": [],
              ":@": { "id": "512013", "name": "164657", "effect": "494", "show": "0", "buff": "1" },
            },
            { "#text": "\n\t" },
          ],
          ":@": { "id": "dragon_detail" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
