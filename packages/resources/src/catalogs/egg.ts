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
          "Group": [
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132500",
                "time": "3600",
                "cost": "150",
                "reward": "247235",
                "exp_finish": "10",
                "exp": "20",
                "full": "247241",
                "dark": "200603;200611;200626",
                "question_mark": "200301;200331;200603;200341;200604;200342;200343",
              },
            },
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132501",
                "time": "7200",
                "cost": "200",
                "reward": "247236",
                "exp_finish": "20",
                "exp": "40",
                "full": "247242",
                "dark": "200215;200364;200365",
                "question_mark": "200301;200331;200214;200201;200367",
              },
            },
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132502",
                "time": "21600",
                "cost": "400",
                "reward": "247237",
                "exp_finish": "60",
                "exp": "120",
                "full": "247243",
                "dark": "200302;200332;200201",
                "question_mark": "200604;200342;200207;200208;200215;200216;200204;200206",
              },
            },
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132503",
                "time": "28800",
                "cost": "800",
                "reward": "247238",
                "exp_finish": "90",
                "exp": "270",
                "full": "247244",
                "dark": "200351;200302;200303",
                "question_mark": "200301;200331;200390;200391;200350;200332;200333",
              },
            },
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132504",
                "time": "43200",
                "cost": "2000",
                "reward": "247239",
                "exp_finish": "120",
                "exp": "360",
                "full": "247245",
                "dark": "200391;200001;200351",
                "question_mark": "200302;200332;200350;200414;200416;200418;200370;200924;200026",
              },
            },
            { "#text": "\n    " },
            {
              "Itemspec": [],
              ":@": {
                "id": "132505",
                "time": "64800",
                "cost": "4000",
                "reward": "247240",
                "exp_finish": "150",
                "exp": "600",
                "full": "248253",
                "dark": "200391;200001;200450",
                "question_mark": "200303;200333;200351;200004;200221;200371;200428;200040;200002",
              },
            },
            { "#text": "\n  " },
          ],
          ":@": { "id": "egg" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
