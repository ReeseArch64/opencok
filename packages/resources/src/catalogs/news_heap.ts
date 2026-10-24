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
          "Itemspec": [],
          ":@": { "id": "9012001", "type": "1", "pay_node": "500", "pay_reward": "239163" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012002", "type": "1", "pay_node": "1000", "pay_reward": "239164" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012003", "type": "1", "pay_node": "2000", "pay_reward": "239165" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012004", "type": "1", "pay_node": "4000", "pay_reward": "239166" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012005", "type": "1", "pay_node": "8000", "pay_reward": "239167" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012006", "type": "1", "pay_node": "15000", "pay_reward": "239168" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012007", "type": "1", "pay_node": "25000", "pay_reward": "239169" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012008", "type": "1", "pay_node": "50000", "pay_reward": "239170" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012009", "type": "1", "pay_node": "100000", "pay_reward": "239171" },
        },
        { "#text": "\n  " },
        {
          "Itemspec": [],
          ":@": { "id": "9012010", "type": "1", "pay_node": "200000", "pay_reward": "239172" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
