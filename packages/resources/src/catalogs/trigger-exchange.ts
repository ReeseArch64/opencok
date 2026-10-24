import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./trigger-exchange.part0.ts";
import { part1 } from "./trigger-exchange.part1.ts";
import { part2 } from "./trigger-exchange.part2.ts";
import { part3 } from "./trigger-exchange.part3.ts";
import { part4 } from "./trigger-exchange.part4.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    { "?xml": [{ "#text": "" }], ":@": { "version": "1.0", "encoding": "UTF-8" } },
    { "database": [...part0(), ...part1(), ...part2(), ...part3(), ...part4()] },
  ]);
}
