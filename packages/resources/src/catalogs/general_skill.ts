import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./general_skill.part0.ts";
import { part1 } from "./general_skill.part1.ts";
import { part2 } from "./general_skill.part2.ts";
import { part3 } from "./general_skill.part3.ts";
import { part4 } from "./general_skill.part4.ts";
import { part5 } from "./general_skill.part5.ts";
import { part6 } from "./general_skill.part6.ts";
import { part7 } from "./general_skill.part7.ts";
import { part8 } from "./general_skill.part8.ts";
import { part9 } from "./general_skill.part9.ts";
import { part10 } from "./general_skill.part10.ts";
import { part11 } from "./general_skill.part11.ts";
import { part12 } from "./general_skill.part12.ts";
import { part13 } from "./general_skill.part13.ts";
import { part14 } from "./general_skill.part14.ts";
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
      ],
    },
  ]);
}
