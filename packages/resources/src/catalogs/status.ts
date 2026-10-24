import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./status.part0.ts";
import { part1 } from "./status.part1.ts";
import { part2 } from "./status.part2.ts";
import { part3 } from "./status.part3.ts";
import { part4 } from "./status.part4.ts";
import { part5 } from "./status.part5.ts";
import { part6 } from "./status.part6.ts";
import { part7 } from "./status.part7.ts";
import { part8 } from "./status.part8.ts";
import { part9 } from "./status.part9.ts";
import { part10 } from "./status.part10.ts";
import { part11 } from "./status.part11.ts";
import { part12 } from "./status.part12.ts";
import { part13 } from "./status.part13.ts";
import { part14 } from "./status.part14.ts";
import { part15 } from "./status.part15.ts";
import { part16 } from "./status.part16.ts";
import { part17 } from "./status.part17.ts";
import { part18 } from "./status.part18.ts";
import { part19 } from "./status.part19.ts";
import { part20 } from "./status.part20.ts";
import { part21 } from "./status.part21.ts";
import { part22 } from "./status.part22.ts";
import { part23 } from "./status.part23.ts";
import { part24 } from "./status.part24.ts";
import { part25 } from "./status.part25.ts";
import { part26 } from "./status.part26.ts";
import { part27 } from "./status.part27.ts";
import { part28 } from "./status.part28.ts";
import { part29 } from "./status.part29.ts";
import { part30 } from "./status.part30.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
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
        ...part16(),
        ...part17(),
        ...part18(),
        ...part19(),
        ...part20(),
        ...part21(),
        ...part22(),
        ...part23(),
        ...part24(),
        ...part25(),
        ...part26(),
        ...part27(),
        ...part28(),
        ...part29(),
        ...part30(),
      ],
      ":@": { "KSOProductBuildVer": "2052-10.1.0.6207" },
    },
  ]);
}
