import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./dragon_talent.part0.ts";
import { part1 } from "./dragon_talent.part1.ts";
import { part2 } from "./dragon_talent.part2.ts";
import { part3 } from "./dragon_talent.part3.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    { "database": [...part0(), ...part1(), ...part2(), ...part3()] },
  ]);
}
