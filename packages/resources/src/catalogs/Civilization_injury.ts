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
            "id": "5857001",
            "D_value_s": "-500",
            "D_value_e": "-1000",
            "D_value_1per": "100",
            "Cumulants": "-10",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857002",
            "D_value_s": "0",
            "D_value_e": "-500",
            "D_value_1per": "50",
            "Cumulants": "0",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857003",
            "D_value_s": "0",
            "D_value_e": "75",
            "D_value_1per": "15",
            "Cumulants": "0",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857004",
            "D_value_s": "75",
            "D_value_e": "200",
            "D_value_1per": "25",
            "Cumulants": "5",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857005",
            "D_value_s": "200",
            "D_value_e": "450",
            "D_value_1per": "50",
            "Cumulants": "10",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857006",
            "D_value_s": "450",
            "D_value_e": "950",
            "D_value_1per": "100",
            "Cumulants": "15",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857007",
            "D_value_s": "950",
            "D_value_e": "1700",
            "D_value_1per": "150",
            "Cumulants": "20",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857008",
            "D_value_s": "1700",
            "D_value_e": "2700",
            "D_value_1per": "200",
            "Cumulants": "25",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857009",
            "D_value_s": "2700",
            "D_value_e": "4200",
            "D_value_1per": "300",
            "Cumulants": "30",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857010",
            "D_value_s": "4200",
            "D_value_e": "6200",
            "D_value_1per": "400",
            "Cumulants": "35",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857011",
            "D_value_s": "6200",
            "D_value_e": "8700",
            "D_value_1per": "500",
            "Cumulants": "40",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857012",
            "D_value_s": "8700",
            "D_value_e": "11700",
            "D_value_1per": "600",
            "Cumulants": "45",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "5857013",
            "D_value_s": "11700",
            "D_value_e": "15200",
            "D_value_1per": "700",
            "Cumulants": "50",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
