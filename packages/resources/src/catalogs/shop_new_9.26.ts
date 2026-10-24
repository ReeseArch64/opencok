import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./shop_new_9.26.part0.ts";
import { part1 } from "./shop_new_9.26.part1.ts";
import { part2 } from "./shop_new_9.26.part2.ts";
import { part3 } from "./shop_new_9.26.part3.ts";
import { part4 } from "./shop_new_9.26.part4.ts";
import { part5 } from "./shop_new_9.26.part5.ts";
import { part6 } from "./shop_new_9.26.part6.ts";
import { part7 } from "./shop_new_9.26.part7.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        ...part0(),
        ...part1(),
        ...part2(),
        ...part3(),
        ...part4(),
        ...part5(),
        ...part6(),
        ...part7(),
      ],
    },
  ]);
}
