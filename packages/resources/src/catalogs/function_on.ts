import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./function_on.part0.ts";
import { part1 } from "./function_on.part1.ts";
import { part2 } from "./function_on.part2.ts";
import { part3 } from "./function_on.part3.ts";
import { part4 } from "./function_on.part4.ts";
import { part5 } from "./function_on.part5.ts";
import { part6 } from "./function_on.part6.ts";
import { part7 } from "./function_on.part7.ts";
import { part8 } from "./function_on.part8.ts";
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
            ...part8(),
          ],
          ":@": { "id": "function_on" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
