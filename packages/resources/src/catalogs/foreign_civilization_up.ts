import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./foreign_civilization_up.part0.ts";
import { part1 } from "./foreign_civilization_up.part1.ts";
import { part2 } from "./foreign_civilization_up.part2.ts";
import { part3 } from "./foreign_civilization_up.part3.ts";
import { part4 } from "./foreign_civilization_up.part4.ts";
import { part5 } from "./foreign_civilization_up.part5.ts";
import { part6 } from "./foreign_civilization_up.part6.ts";
import { part7 } from "./foreign_civilization_up.part7.ts";
import { part8 } from "./foreign_civilization_up.part8.ts";
import { part9 } from "./foreign_civilization_up.part9.ts";
import { part10 } from "./foreign_civilization_up.part10.ts";
import { part11 } from "./foreign_civilization_up.part11.ts";
import { part12 } from "./foreign_civilization_up.part12.ts";
import { part13 } from "./foreign_civilization_up.part13.ts";
import { part14 } from "./foreign_civilization_up.part14.ts";
import { part15 } from "./foreign_civilization_up.part15.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n\n" },
        {
          "Group": [
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
          ":@": { "id": "foreign_civilization_up" },
        },
        { "#text": "\n\n" },
      ],
    },
  ]);
}
