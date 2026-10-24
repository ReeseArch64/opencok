import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./general_random_effect.part0.ts";
import { part1 } from "./general_random_effect.part1.ts";
import { part2 } from "./general_random_effect.part2.ts";
import { part3 } from "./general_random_effect.part3.ts";
import { part4 } from "./general_random_effect.part4.ts";
import { part5 } from "./general_random_effect.part5.ts";
import { part6 } from "./general_random_effect.part6.ts";
import { part7 } from "./general_random_effect.part7.ts";
import { part8 } from "./general_random_effect.part8.ts";
import { part9 } from "./general_random_effect.part9.ts";
import { part10 } from "./general_random_effect.part10.ts";
import { part11 } from "./general_random_effect.part11.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
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
          ],
          ":@": { "id": "general_random_effect" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
