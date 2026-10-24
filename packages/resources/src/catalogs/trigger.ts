import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./trigger.part0.ts";
import { part1 } from "./trigger.part1.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    { "?xml": [{ "#text": "" }], ":@": { "version": "1.0", "encoding": "UTF-8" } },
    { "database": [...part0(), ...part1()] },
  ]);
}
