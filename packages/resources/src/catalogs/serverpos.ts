import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./serverpos.part0.ts";
import { part1 } from "./serverpos.part1.ts";
import { part2 } from "./serverpos.part2.ts";
import { part3 } from "./serverpos.part3.ts";
import { part4 } from "./serverpos.part4.ts";
import { part5 } from "./serverpos.part5.ts";
import { part6 } from "./serverpos.part6.ts";
import { part7 } from "./serverpos.part7.ts";
import { part8 } from "./serverpos.part8.ts";
import { part9 } from "./serverpos.part9.ts";
import { part10 } from "./serverpos.part10.ts";
import { part11 } from "./serverpos.part11.ts";
import { part12 } from "./serverpos.part12.ts";
import { part13 } from "./serverpos.part13.ts";
import { part14 } from "./serverpos.part14.ts";
import { part15 } from "./serverpos.part15.ts";
import { part16 } from "./serverpos.part16.ts";
import { part17 } from "./serverpos.part17.ts";
import { part18 } from "./serverpos.part18.ts";
import { part19 } from "./serverpos.part19.ts";
import { part20 } from "./serverpos.part20.ts";
import { part21 } from "./serverpos.part21.ts";
import { part22 } from "./serverpos.part22.ts";
import { part23 } from "./serverpos.part23.ts";
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
            ...part12(),
            ...part13(),
            ...part14(),
            ...part15(),
            ...part16(),
            ...part17(),
            ...part18(),
            ...part19(),
            ...part20(),
            ...part21(),
            ...part22(),
            ...part23(),
          ],
          ":@": { "id": "serverpos" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
