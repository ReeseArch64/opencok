import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./del_exchange.part0.ts";
import { part1 } from "./del_exchange.part1.ts";
import { part2 } from "./del_exchange.part2.ts";
import { part3 } from "./del_exchange.part3.ts";
import { part4 } from "./del_exchange.part4.ts";
import { part5 } from "./del_exchange.part5.ts";
import { part6 } from "./del_exchange.part6.ts";
import { part7 } from "./del_exchange.part7.ts";
import { part8 } from "./del_exchange.part8.ts";
import { part9 } from "./del_exchange.part9.ts";
import { part10 } from "./del_exchange.part10.ts";
import { part11 } from "./del_exchange.part11.ts";
import { part12 } from "./del_exchange.part12.ts";
import { part13 } from "./del_exchange.part13.ts";
import { part14 } from "./del_exchange.part14.ts";
import { part15 } from "./del_exchange.part15.ts";
import { part16 } from "./del_exchange.part16.ts";
import { part17 } from "./del_exchange.part17.ts";
import { part18 } from "./del_exchange.part18.ts";
import { part19 } from "./del_exchange.part19.ts";
import { part20 } from "./del_exchange.part20.ts";
import { part21 } from "./del_exchange.part21.ts";
import { part22 } from "./del_exchange.part22.ts";
import { part23 } from "./del_exchange.part23.ts";
import { part24 } from "./del_exchange.part24.ts";
import { part25 } from "./del_exchange.part25.ts";
import { part26 } from "./del_exchange.part26.ts";
import { part27 } from "./del_exchange.part27.ts";
import { part28 } from "./del_exchange.part28.ts";
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
            ...part24(),
            ...part25(),
            ...part26(),
            ...part27(),
            ...part28(),
          ],
          ":@": { "id": "exchange" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
