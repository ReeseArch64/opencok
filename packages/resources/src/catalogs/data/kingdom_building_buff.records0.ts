import type { KingdomBuildingBuffDefinition } from "../types/kingdom_building_buff.ts";

export const records: readonly KingdomBuildingBuffDefinition[] = [
  {
    "id": 517000,
    "type": 1,
    "base": [62, 10],
    "cdTimeOnce": 300,
    "donateOnce": [
      [21, 20000],
      [22, 10000],
    ],
    "cost": [
      [21, 2000000],
      [22, 1000000],
    ],
  },
  { "id": 517001, "type": 1 },
  { "id": 517002, "type": 1 },
  {
    "id": 517100,
    "type": 2,
    "active": 1,
    "base": [855, 100],
    "cdTimeOnce": 300,
    "cdTimeLimit": 3000,
    "donateOnce": [
      [21, 20000],
      [22, 10000],
    ],
    "cost": [
      [21, 1000000],
      [22, 500000],
    ],
    "right": [216000, 216001, 216002, 216003, 216004, 216005, 216006, 216007, 216008],
    "premise": 2,
    "icon": "science_def_a_6",
    "title": 190533,
    "description": 190534,
  },
  {
    "id": 517150,
    "type": 2,
    "active": 2,
    "icon": "science_mil_a_2",
    "title": 190535,
    "description": 190536,
  },
  {
    "id": 517200,
    "type": 3,
    "active": 1,
    "base": [854, 100],
    "cdTimeOnce": 300,
    "cdTimeLimit": 3000,
    "donateOnce": [
      [21, 20000],
      [22, 10000],
    ],
    "cost": [
      [21, 1000000],
      [22, 500000],
    ],
    "right": [216000, 216001, 216002, 216003, 216004, 216005, 216006, 216007, 216008],
    "premise": 1,
    "icon": "science_dev_a_2",
    "title": 190537,
    "description": 190538,
  },
  {
    "id": 517250,
    "type": 3,
    "active": 2,
    "icon": "science_dev_a_7",
    "title": 190539,
    "description": 190540,
  },
];
