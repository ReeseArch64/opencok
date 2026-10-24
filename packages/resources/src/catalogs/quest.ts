import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./quest.part0.ts";
import { part1 } from "./quest.part1.ts";
import { part2 } from "./quest.part2.ts";
import { part3 } from "./quest.part3.ts";
import { part4 } from "./quest.part4.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    { "database": [...part0(), ...part1(), ...part2(), ...part3(), ...part4()] },
  ]);
}
