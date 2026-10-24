import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./dragon_new.part0.ts";
import { part1 } from "./dragon_new.part1.ts";
import { part2 } from "./dragon_new.part2.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
        { "Group": [...part0(), ...part1(), ...part2()], ":@": { "id": "dragon_new" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
