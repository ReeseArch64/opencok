import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./status - Copy.part0.ts";
import { part1 } from "./status - Copy.part1.ts";
import { part2 } from "./status - Copy.part2.ts";
import { part3 } from "./status - Copy.part3.ts";
import { part4 } from "./status - Copy.part4.ts";
import { part5 } from "./status - Copy.part5.ts";
import { part6 } from "./status - Copy.part6.ts";
import { part7 } from "./status - Copy.part7.ts";
import { part8 } from "./status - Copy.part8.ts";
import { part9 } from "./status - Copy.part9.ts";
import { part10 } from "./status - Copy.part10.ts";
import { part11 } from "./status - Copy.part11.ts";
import { part12 } from "./status - Copy.part12.ts";
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
      ],
      ":@": { "KSOProductBuildVer": "2052-10.1.0.6207" },
    },
  ]);
}
