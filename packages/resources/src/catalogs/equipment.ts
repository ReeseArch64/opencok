import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./equipment.part0.ts";
import { part1 } from "./equipment.part1.ts";
import { part2 } from "./equipment.part2.ts";
import { part3 } from "./equipment.part3.ts";
import { part4 } from "./equipment.part4.ts";
import { part5 } from "./equipment.part5.ts";
import { part6 } from "./equipment.part6.ts";
import { part7 } from "./equipment.part7.ts";
import { part8 } from "./equipment.part8.ts";
import { part9 } from "./equipment.part9.ts";
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
      ],
    },
  ]);
}
