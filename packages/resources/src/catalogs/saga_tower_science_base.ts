import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./saga_tower_science_base.part0.ts";
import { part1 } from "./saga_tower_science_base.part1.ts";
import { part2 } from "./saga_tower_science_base.part2.ts";
import { part3 } from "./saga_tower_science_base.part3.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    { "database": [...part0(), ...part1(), ...part2(), ...part3()] },
  ]);
}
