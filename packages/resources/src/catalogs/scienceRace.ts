import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";
import { part0 } from "./scienceRace.part0.ts";
import { part1 } from "./scienceRace.part1.ts";
import { part2 } from "./scienceRace.part2.ts";
import { part3 } from "./scienceRace.part3.ts";
import { part4 } from "./scienceRace.part4.ts";
import { part5 } from "./scienceRace.part5.ts";
import { part6 } from "./scienceRace.part6.ts";
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
          ],
          ":@": { "id": "scienceRace" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
