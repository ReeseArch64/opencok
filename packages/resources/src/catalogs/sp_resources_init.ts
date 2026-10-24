import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./sp_resources_init.part0.ts";
import { part1 } from "./sp_resources_init.part1.ts";
import { part2 } from "./sp_resources_init.part2.ts";
import { part3 } from "./sp_resources_init.part3.ts";
import { part4 } from "./sp_resources_init.part4.ts";
import { part5 } from "./sp_resources_init.part5.ts";
import { part6 } from "./sp_resources_init.part6.ts";
import { part7 } from "./sp_resources_init.part7.ts";
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
          ],
          ":@": { "id": "sp_resources_init" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
