import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./building.part0.ts";
import { part1 } from "./building.part1.ts";
import { part2 } from "./building.part2.ts";
import { part3 } from "./building.part3.ts";
import { part4 } from "./building.part4.ts";
import { part5 } from "./building.part5.ts";
import { part6 } from "./building.part6.ts";
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
