import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./princess_quest.part0.ts";
import { part1 } from "./princess_quest.part1.ts";
import { part2 } from "./princess_quest.part2.ts";
import { part3 } from "./princess_quest.part3.ts";
import { part4 } from "./princess_quest.part4.ts";
import { part5 } from "./princess_quest.part5.ts";
import { part6 } from "./princess_quest.part6.ts";
import { part7 } from "./princess_quest.part7.ts";
import { part8 } from "./princess_quest.part8.ts";
import { part9 } from "./princess_quest.part9.ts";
import { part10 } from "./princess_quest.part10.ts";
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
      ],
    },
  ]);
}
