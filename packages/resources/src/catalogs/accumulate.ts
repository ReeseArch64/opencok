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
        { "Itemspec": [], ":@": { "id": "46650", "Node": "200", "Gift": "239041" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46651", "Node": "1000", "Gift": "239042" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46652", "Node": "3000", "Gift": "239043" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46653", "Node": "6500", "Gift": "239044" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46654", "Node": "16500", "Gift": "239045" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46655", "Node": "42000", "Gift": "239046" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46656", "Node": "80000", "Gift": "239047" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46657", "Node": "200000", "Gift": "239048" } },
        { "#text": "\n  " },
        { "Itemspec": [], ":@": { "id": "46658", "Node": "1000000", "Gift": "239049" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
