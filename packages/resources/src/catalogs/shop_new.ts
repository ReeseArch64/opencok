import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./shop_new.part0.ts";
import { part1 } from "./shop_new.part1.ts";
import { part2 } from "./shop_new.part2.ts";
import { part3 } from "./shop_new.part3.ts";
import { part4 } from "./shop_new.part4.ts";
import { part5 } from "./shop_new.part5.ts";
import { part6 } from "./shop_new.part6.ts";
import { part7 } from "./shop_new.part7.ts";
import { part8 } from "./shop_new.part8.ts";
import { part9 } from "./shop_new.part9.ts";
import { part10 } from "./shop_new.part10.ts";
import { part11 } from "./shop_new.part11.ts";
import { part12 } from "./shop_new.part12.ts";
import { part13 } from "./shop_new.part13.ts";
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
        ...part8(),
        ...part9(),
        ...part10(),
        ...part11(),
        ...part12(),
        ...part13(),
      ],
    },
  ]);
}
