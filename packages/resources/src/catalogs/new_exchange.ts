import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./new_exchange.part0.ts";
import { part1 } from "./new_exchange.part1.ts";
import { part2 } from "./new_exchange.part2.ts";
import { part3 } from "./new_exchange.part3.ts";
import { part4 } from "./new_exchange.part4.ts";
import { part5 } from "./new_exchange.part5.ts";
import { part6 } from "./new_exchange.part6.ts";
import { part7 } from "./new_exchange.part7.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n" },
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
          ],
          ":@": { "id": "exchange" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
