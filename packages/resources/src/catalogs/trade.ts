import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./trade.part0.ts";
import { part1 } from "./trade.part1.ts";
import { part2 } from "./trade.part2.ts";
import { part3 } from "./trade.part3.ts";
import { part4 } from "./trade.part4.ts";
import { part5 } from "./trade.part5.ts";
import { part6 } from "./trade.part6.ts";
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
      ],
    },
  ]);
}
