import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./function_on9.17.0.part0.ts";
import { part1 } from "./function_on9.17.0.part1.ts";
import { part2 } from "./function_on9.17.0.part2.ts";
import { part3 } from "./function_on9.17.0.part3.ts";
import { part4 } from "./function_on9.17.0.part4.ts";
import { part5 } from "./function_on9.17.0.part5.ts";
import { part6 } from "./function_on9.17.0.part6.ts";
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
          ],
          ":@": { "id": "function_on" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
