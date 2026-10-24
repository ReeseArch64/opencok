import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./science.part0.ts";
import { part1 } from "./science.part1.ts";
import { part2 } from "./science.part2.ts";
import { part3 } from "./science.part3.ts";
import { part4 } from "./science.part4.ts";
import { part5 } from "./science.part5.ts";
import { part6 } from "./science.part6.ts";
import { part7 } from "./science.part7.ts";
import { part8 } from "./science.part8.ts";
import { part9 } from "./science.part9.ts";
import { part10 } from "./science.part10.ts";
import { part11 } from "./science.part11.ts";
import { part12 } from "./science.part12.ts";
import { part13 } from "./science.part13.ts";
import { part14 } from "./science.part14.ts";
import { part15 } from "./science.part15.ts";
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
        ...part14(),
        ...part15(),
      ],
    },
  ]);
}
