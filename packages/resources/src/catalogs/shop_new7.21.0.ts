import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./shop_new7.21.0.part0.ts";
import { part1 } from "./shop_new7.21.0.part1.ts";
import { part2 } from "./shop_new7.21.0.part2.ts";
import { part3 } from "./shop_new7.21.0.part3.ts";
import { part4 } from "./shop_new7.21.0.part4.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    { "database": [...part0(), ...part1(), ...part2(), ...part3(), ...part4()] },
  ]);
}
