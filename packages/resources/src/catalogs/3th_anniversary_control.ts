import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

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
          "ItemSpec": [],
          ":@": {
            "id": "9055501",
            "start": "2017-09-04-02-00",
            "end": "2017-09-07-02-00",
            "name": "122031",
            "score_reward": "100;250080|200;250081|300;250082|500;250083|800;250084",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9055502",
            "start": "2017-09-07-02-00",
            "end": "2017-09-12-02-00",
            "name": "122031",
            "score_reward": "100;250085|200;250086|300;250087|500;250088|800;250089",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9055503",
            "start": "2017-09-20-02-00",
            "end": "2017-09-20-02-00",
            "name": "122031",
            "score_reward": "100;250090|200;250091|300;250092|500;250093|800;250094",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "9055504",
            "start": "2017-09-20-02-00",
            "end": "2017-10-03-02-00",
            "name": "122031",
            "score_reward": "100;250095|200;250096|300;250097|500;250098|800;250099",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
