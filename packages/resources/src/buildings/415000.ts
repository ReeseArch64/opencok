import type { BuildingLevelDefinition } from "@opencok/contracts/building";

export const building415000: readonly BuildingLevelDefinition[] = [
  {
    id: 415000,
    buildingId: 415000,
    level: 0,
    starLevel: 0,
    costs: {
      wood: 100n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 3,
    experience: 5,
    maxInstances: 10,
    starEnabled: true,
    effects: {
      productionResourceId: 3,
    },
  },
  {
    id: 415001,
    buildingId: 415000,
    level: 1,
    starLevel: 0,
    costs: {
      wood: 140n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 150,
    demolitionSeconds: 1,
    experience: 8,
    power: 1,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
      productionPerHour: 120,
      productionCapacity: 1200,
    },
    clientParameters: [
      null,
      null,
      {
        value: "2",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415002,
    buildingId: 415000,
    level: 2,
    starLevel: 0,
    costs: {
      wood: 196n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 270,
    demolitionSeconds: 75,
    experience: 15,
    power: 2,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
      productionPerHour: 240,
      productionCapacity: 2400,
    },
    clientParameters: [
      null,
      null,
      {
        value: "4",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415003,
    buildingId: 415000,
    level: 3,
    starLevel: 0,
    costs: {
      wood: 294n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 380,
    demolitionSeconds: 135,
    experience: 29,
    power: 3,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
      productionPerHour: 366,
      productionCapacity: 3660,
    },
    clientParameters: [
      null,
      null,
      {
        value: "6",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415004,
    buildingId: 415000,
    level: 4,
    starLevel: 0,
    costs: {
      wood: 470n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 480,
    demolitionSeconds: 190,
    experience: 58,
    power: 4,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
      productionPerHour: 498,
      productionCapacity: 4980,
    },
    clientParameters: [
      null,
      null,
      {
        value: "8",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415005,
    buildingId: 415000,
    level: 5,
    starLevel: 0,
    costs: {
      wood: 847n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 620,
    demolitionSeconds: 240,
    experience: 104,
    power: 5,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 6,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 636,
      productionCapacity: 6360,
    },
    clientParameters: [
      null,
      null,
      {
        value: "10",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415006,
    buildingId: 415000,
    level: 6,
    starLevel: 0,
    costs: {
      wood: 1610n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 1018,
    demolitionSeconds: 310,
    experience: 167,
    power: 6,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 7,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 780,
      productionCapacity: 7800,
    },
    clientParameters: [
      null,
      null,
      {
        value: "12",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415007,
    buildingId: 415000,
    level: 7,
    starLevel: 0,
    costs: {
      wood: 3220n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 1594,
    demolitionSeconds: 509,
    experience: 234,
    power: 8,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 8,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 930,
      productionCapacity: 9300,
    },
    clientParameters: [
      null,
      null,
      {
        value: "14",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415008,
    buildingId: 415000,
    level: 8,
    starLevel: 0,
    costs: {
      wood: 6440n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 1935,
    demolitionSeconds: 797,
    experience: 281,
    power: 12,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 9,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1086,
      productionCapacity: 10860,
    },
    clientParameters: [
      null,
      null,
      {
        value: "16",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415009,
    buildingId: 415000,
    level: 9,
    starLevel: 0,
    costs: {
      wood: 12900n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 2701,
    demolitionSeconds: 967,
    experience: 337,
    power: 17,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 10,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1248,
      productionCapacity: 12480,
    },
    clientParameters: [
      null,
      null,
      {
        value: "18",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415010,
    buildingId: 415000,
    level: 10,
    starLevel: 0,
    costs: {
      wood: 25700n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 3241,
    demolitionSeconds: 1350,
    experience: 405,
    power: 24,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 11,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1416,
      productionCapacity: 14160,
    },
    clientParameters: [
      null,
      null,
      {
        value: "20",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415011,
    buildingId: 415000,
    level: 11,
    starLevel: 0,
    costs: {
      wood: 51500n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 4051,
    demolitionSeconds: 1620,
    experience: 506,
    power: 31,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 12,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1590,
      productionCapacity: 15900,
    },
    clientParameters: [
      null,
      null,
      {
        value: "22",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415012,
    buildingId: 415000,
    level: 12,
    starLevel: 0,
    costs: {
      wood: 97800n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 5063,
    demolitionSeconds: 2025,
    experience: 632,
    power: 40,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 13,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1770,
      productionCapacity: 17700,
    },
    clientParameters: [
      null,
      null,
      {
        value: "24",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415013,
    buildingId: 415000,
    level: 13,
    starLevel: 0,
    costs: {
      wood: 176000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 6329,
    demolitionSeconds: 2531,
    experience: 791,
    power: 51,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 14,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 1956,
      productionCapacity: 19560,
    },
    clientParameters: [
      null,
      null,
      {
        value: "26",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415014,
    buildingId: 415000,
    level: 14,
    starLevel: 0,
    costs: {
      wood: 264000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 7912,
    demolitionSeconds: 3164,
    experience: 988,
    power: 64,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 15,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 2148,
      productionCapacity: 21480,
    },
    clientParameters: [
      null,
      null,
      {
        value: "28",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415015,
    buildingId: 415000,
    level: 15,
    starLevel: 0,
    costs: {
      wood: 370000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 9890,
    demolitionSeconds: 3956,
    experience: 1236,
    power: 80,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 16,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 2346,
      productionCapacity: 23460,
    },
    clientParameters: [
      null,
      null,
      {
        value: "30",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415016,
    buildingId: 415000,
    level: 16,
    starLevel: 0,
    costs: {
      wood: 518000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 12362,
    demolitionSeconds: 4945,
    experience: 1545,
    power: 100,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 17,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 2550,
      productionCapacity: 25500,
    },
    clientParameters: [
      null,
      null,
      {
        value: "32",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415017,
    buildingId: 415000,
    level: 17,
    starLevel: 0,
    costs: {
      wood: 673000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 15453,
    demolitionSeconds: 6181,
    experience: 1931,
    power: 125,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 18,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 2760,
      productionCapacity: 27600,
    },
    clientParameters: [
      null,
      null,
      {
        value: "34",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415018,
    buildingId: 415000,
    level: 18,
    starLevel: 0,
    costs: {
      wood: 875000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 19316,
    demolitionSeconds: 7726,
    experience: 2414,
    power: 154,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 19,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 2976,
      productionCapacity: 29760,
    },
    clientParameters: [
      null,
      null,
      {
        value: "36",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415019,
    buildingId: 415000,
    level: 19,
    starLevel: 0,
    costs: {
      wood: 1140000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 24145,
    demolitionSeconds: 9658,
    experience: 3018,
    power: 191,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 20,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 3198,
      productionCapacity: 31980,
    },
    clientParameters: [
      null,
      null,
      {
        value: "38",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415020,
    buildingId: 415000,
    level: 20,
    starLevel: 0,
    costs: {
      wood: 1480000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 27766,
    demolitionSeconds: 12072,
    experience: 3470,
    power: 235,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 21,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 3426,
      productionCapacity: 34260,
    },
    clientParameters: [
      null,
      null,
      {
        value: "40",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415021,
    buildingId: 415000,
    level: 21,
    starLevel: 0,
    costs: {
      wood: 1920000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 31931,
    demolitionSeconds: 13883,
    experience: 3991,
    power: 285,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 22,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 3660,
      productionCapacity: 36600,
    },
    clientParameters: [
      null,
      null,
      {
        value: "42",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415022,
    buildingId: 415000,
    level: 22,
    starLevel: 0,
    costs: {
      wood: 2500000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 36721,
    demolitionSeconds: 15965,
    experience: 4590,
    power: 356,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 23,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 3900,
      productionCapacity: 39000,
    },
    clientParameters: [
      null,
      null,
      {
        value: "44",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415023,
    buildingId: 415000,
    level: 23,
    starLevel: 0,
    costs: {
      wood: 3250000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 42229,
    demolitionSeconds: 18360,
    experience: 5278,
    power: 566,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 24,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 4146,
      productionCapacity: 41460,
    },
    clientParameters: [
      null,
      null,
      {
        value: "46",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415024,
    buildingId: 415000,
    level: 24,
    starLevel: 0,
    costs: {
      wood: 4220000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 48563,
    demolitionSeconds: 21114,
    experience: 6070,
    power: 1159,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 25,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 4398,
      productionCapacity: 43980,
    },
    clientParameters: [
      null,
      null,
      {
        value: "48",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415025,
    buildingId: 415000,
    level: 25,
    starLevel: 0,
    costs: {
      wood: 5490000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 55848,
    demolitionSeconds: 24281,
    experience: 6980,
    power: 1963,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 26,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 4656,
      productionCapacity: 46560,
    },
    clientParameters: [
      null,
      null,
      {
        value: "50",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415026,
    buildingId: 415000,
    level: 26,
    starLevel: 0,
    costs: {
      wood: 7140000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 64225,
    demolitionSeconds: 27924,
    experience: 8028,
    power: 3375,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 27,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 4920,
      productionCapacity: 49200,
    },
    clientParameters: [
      null,
      null,
      {
        value: "52",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415027,
    buildingId: 415000,
    level: 27,
    starLevel: 0,
    costs: {
      wood: 9280000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 73859,
    demolitionSeconds: 32112,
    experience: 9232,
    power: 4834,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 28,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 5190,
      productionCapacity: 51900,
    },
    clientParameters: [
      null,
      null,
      {
        value: "54",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415028,
    buildingId: 415000,
    level: 28,
    starLevel: 0,
    costs: {
      wood: 12100000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 84938,
    demolitionSeconds: 36929,
    experience: 10617,
    power: 6335,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 29,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 5466,
      productionCapacity: 54660,
    },
    clientParameters: [
      null,
      null,
      {
        value: "56",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415029,
    buildingId: 415000,
    level: 29,
    starLevel: 0,
    costs: {
      wood: 15700000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 97678,
    demolitionSeconds: 42469,
    experience: 12209,
    power: 7319,
    maxInstances: 10,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 30,
      },
    ],
    effects: {
      productionResourceId: 3,
      productionPerHour: 5748,
      productionCapacity: 57480,
    },
    clientParameters: [
      null,
      null,
      {
        value: "58",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 415030,
    buildingId: 415000,
    level: 30,
    starLevel: 0,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 8433,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 6036,
        },
        {
          progress: 10,
          value: 6186,
        },
        {
          progress: 20,
          value: 6336,
        },
        {
          progress: 30,
          value: 6486,
        },
        {
          progress: 40,
          value: 6636,
        },
        {
          progress: 50,
          value: 6786,
        },
        {
          progress: 60,
          value: 6936,
        },
        {
          progress: 70,
          value: 7086,
        },
        {
          progress: 80,
          value: 7236,
        },
        {
          progress: 90,
          value: 7386,
        },
        {
          progress: 100,
          value: 7536,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 60360,
        },
        {
          progress: 10,
          value: 61860,
        },
        {
          progress: 20,
          value: 63360,
        },
        {
          progress: 30,
          value: 64860,
        },
        {
          progress: 40,
          value: 66360,
        },
        {
          progress: 50,
          value: 67860,
        },
        {
          progress: 60,
          value: 69360,
        },
        {
          progress: 70,
          value: 70860,
        },
        {
          progress: 80,
          value: 72360,
        },
        {
          progress: 90,
          value: 73860,
        },
        {
          progress: 100,
          value: 75360,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "60",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 13500,
        },
        {
          progress: 20,
          value: 13500,
        },
        {
          progress: 30,
          value: 13500,
        },
        {
          progress: 40,
          value: 13500,
        },
        {
          progress: 50,
          value: 13500,
        },
        {
          progress: 60,
          value: 13500,
        },
        {
          progress: 70,
          value: 13500,
        },
        {
          progress: 80,
          value: 13500,
        },
        {
          progress: 90,
          value: 13500,
        },
        {
          progress: 100,
          value: 13500,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 1587,
        },
        {
          progress: 20,
          value: 1587,
        },
        {
          progress: 30,
          value: 1587,
        },
        {
          progress: 40,
          value: 1587,
        },
        {
          progress: 50,
          value: 1587,
        },
        {
          progress: 60,
          value: 1587,
        },
        {
          progress: 70,
          value: 1587,
        },
        {
          progress: 80,
          value: 1587,
        },
        {
          progress: 90,
          value: 1587,
        },
        {
          progress: 100,
          value: 1587,
        },
      ],
      power: [
        {
          progress: 10,
          value: 8534,
        },
        {
          progress: 20,
          value: 8635,
        },
        {
          progress: 30,
          value: 8736,
        },
        {
          progress: 40,
          value: 8837,
        },
        {
          progress: 50,
          value: 8938,
        },
        {
          progress: 60,
          value: 9039,
        },
        {
          progress: 70,
          value: 9140,
        },
        {
          progress: 80,
          value: 9241,
        },
        {
          progress: 90,
          value: 9342,
        },
        {
          progress: 100,
          value: 9443,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 760000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 5n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400001,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415031,
    buildingId: 415000,
    level: 30,
    starLevel: 1,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 9443,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 7536,
        },
        {
          progress: 10,
          value: 7696,
        },
        {
          progress: 20,
          value: 7857,
        },
        {
          progress: 30,
          value: 8018,
        },
        {
          progress: 40,
          value: 8179,
        },
        {
          progress: 50,
          value: 8340,
        },
        {
          progress: 60,
          value: 8500,
        },
        {
          progress: 70,
          value: 8661,
        },
        {
          progress: 80,
          value: 8822,
        },
        {
          progress: 90,
          value: 8983,
        },
        {
          progress: 100,
          value: 9144,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 75360,
        },
        {
          progress: 10,
          value: 76968,
        },
        {
          progress: 20,
          value: 78576,
        },
        {
          progress: 30,
          value: 80184,
        },
        {
          progress: 40,
          value: 81792,
        },
        {
          progress: 50,
          value: 83400,
        },
        {
          progress: 60,
          value: 85008,
        },
        {
          progress: 70,
          value: 86616,
        },
        {
          progress: 80,
          value: 88224,
        },
        {
          progress: 90,
          value: 89832,
        },
        {
          progress: 100,
          value: 91440,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "62",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 35438,
        },
        {
          progress: 20,
          value: 35438,
        },
        {
          progress: 30,
          value: 35438,
        },
        {
          progress: 40,
          value: 35438,
        },
        {
          progress: 50,
          value: 35438,
        },
        {
          progress: 60,
          value: 35438,
        },
        {
          progress: 70,
          value: 35438,
        },
        {
          progress: 80,
          value: 35438,
        },
        {
          progress: 90,
          value: 35438,
        },
        {
          progress: 100,
          value: 35438,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 1953,
        },
        {
          progress: 20,
          value: 1953,
        },
        {
          progress: 30,
          value: 1953,
        },
        {
          progress: 40,
          value: 1953,
        },
        {
          progress: 50,
          value: 1953,
        },
        {
          progress: 60,
          value: 1953,
        },
        {
          progress: 70,
          value: 1953,
        },
        {
          progress: 80,
          value: 1953,
        },
        {
          progress: 90,
          value: 1953,
        },
        {
          progress: 100,
          value: 1953,
        },
      ],
      power: [
        {
          progress: 10,
          value: 9544,
        },
        {
          progress: 20,
          value: 9645,
        },
        {
          progress: 30,
          value: 9746,
        },
        {
          progress: 40,
          value: 9847,
        },
        {
          progress: 50,
          value: 9948,
        },
        {
          progress: 60,
          value: 10049,
        },
        {
          progress: 70,
          value: 10150,
        },
        {
          progress: 80,
          value: 10251,
        },
        {
          progress: 90,
          value: 10352,
        },
        {
          progress: 100,
          value: 10453,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1240000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 9n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400002,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415032,
    buildingId: 415000,
    level: 30,
    starLevel: 2,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 10453,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 9144,
        },
        {
          progress: 10,
          value: 9316,
        },
        {
          progress: 20,
          value: 9488,
        },
        {
          progress: 30,
          value: 9661,
        },
        {
          progress: 40,
          value: 9833,
        },
        {
          progress: 50,
          value: 10006,
        },
        {
          progress: 60,
          value: 10178,
        },
        {
          progress: 70,
          value: 10350,
        },
        {
          progress: 80,
          value: 10523,
        },
        {
          progress: 90,
          value: 10695,
        },
        {
          progress: 100,
          value: 10868,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 91440,
        },
        {
          progress: 10,
          value: 93164,
        },
        {
          progress: 20,
          value: 94888,
        },
        {
          progress: 30,
          value: 96612,
        },
        {
          progress: 40,
          value: 98336,
        },
        {
          progress: 50,
          value: 100060,
        },
        {
          progress: 60,
          value: 101784,
        },
        {
          progress: 70,
          value: 103508,
        },
        {
          progress: 80,
          value: 105232,
        },
        {
          progress: 90,
          value: 106956,
        },
        {
          progress: 100,
          value: 108680,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "64",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 51975,
        },
        {
          progress: 20,
          value: 51975,
        },
        {
          progress: 30,
          value: 51975,
        },
        {
          progress: 40,
          value: 51975,
        },
        {
          progress: 50,
          value: 51975,
        },
        {
          progress: 60,
          value: 51975,
        },
        {
          progress: 70,
          value: 51975,
        },
        {
          progress: 80,
          value: 51975,
        },
        {
          progress: 90,
          value: 51975,
        },
        {
          progress: 100,
          value: 51975,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 2319,
        },
        {
          progress: 20,
          value: 2319,
        },
        {
          progress: 30,
          value: 2319,
        },
        {
          progress: 40,
          value: 2319,
        },
        {
          progress: 50,
          value: 2319,
        },
        {
          progress: 60,
          value: 2319,
        },
        {
          progress: 70,
          value: 2319,
        },
        {
          progress: 80,
          value: 2319,
        },
        {
          progress: 90,
          value: 2319,
        },
        {
          progress: 100,
          value: 2319,
        },
      ],
      power: [
        {
          progress: 10,
          value: 10554,
        },
        {
          progress: 20,
          value: 10655,
        },
        {
          progress: 30,
          value: 10756,
        },
        {
          progress: 40,
          value: 10857,
        },
        {
          progress: 50,
          value: 10958,
        },
        {
          progress: 60,
          value: 11059,
        },
        {
          progress: 70,
          value: 11160,
        },
        {
          progress: 80,
          value: 11261,
        },
        {
          progress: 90,
          value: 11362,
        },
        {
          progress: 100,
          value: 11463,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 2260000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 18n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400003,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415033,
    buildingId: 415000,
    level: 30,
    starLevel: 3,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 11463,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 10868,
        },
        {
          progress: 10,
          value: 11052,
        },
        {
          progress: 20,
          value: 11237,
        },
        {
          progress: 30,
          value: 11422,
        },
        {
          progress: 40,
          value: 11607,
        },
        {
          progress: 50,
          value: 11792,
        },
        {
          progress: 60,
          value: 11976,
        },
        {
          progress: 70,
          value: 12161,
        },
        {
          progress: 80,
          value: 12346,
        },
        {
          progress: 90,
          value: 12531,
        },
        {
          progress: 100,
          value: 12716,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 108680,
        },
        {
          progress: 10,
          value: 110528,
        },
        {
          progress: 20,
          value: 112376,
        },
        {
          progress: 30,
          value: 114224,
        },
        {
          progress: 40,
          value: 116072,
        },
        {
          progress: 50,
          value: 117920,
        },
        {
          progress: 60,
          value: 119768,
        },
        {
          progress: 70,
          value: 121616,
        },
        {
          progress: 80,
          value: 123464,
        },
        {
          progress: 90,
          value: 125312,
        },
        {
          progress: 100,
          value: 127160,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "66",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 85388,
        },
        {
          progress: 20,
          value: 85388,
        },
        {
          progress: 30,
          value: 85388,
        },
        {
          progress: 40,
          value: 85388,
        },
        {
          progress: 50,
          value: 85388,
        },
        {
          progress: 60,
          value: 85388,
        },
        {
          progress: 70,
          value: 85388,
        },
        {
          progress: 80,
          value: 85388,
        },
        {
          progress: 90,
          value: 85388,
        },
        {
          progress: 100,
          value: 85388,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 2685,
        },
        {
          progress: 20,
          value: 2685,
        },
        {
          progress: 30,
          value: 2685,
        },
        {
          progress: 40,
          value: 2685,
        },
        {
          progress: 50,
          value: 2685,
        },
        {
          progress: 60,
          value: 2685,
        },
        {
          progress: 70,
          value: 2685,
        },
        {
          progress: 80,
          value: 2685,
        },
        {
          progress: 90,
          value: 2685,
        },
        {
          progress: 100,
          value: 2685,
        },
      ],
      power: [
        {
          progress: 10,
          value: 11564,
        },
        {
          progress: 20,
          value: 11665,
        },
        {
          progress: 30,
          value: 11766,
        },
        {
          progress: 40,
          value: 11867,
        },
        {
          progress: 50,
          value: 11968,
        },
        {
          progress: 60,
          value: 12069,
        },
        {
          progress: 70,
          value: 12170,
        },
        {
          progress: 80,
          value: 12271,
        },
        {
          progress: 90,
          value: 12372,
        },
        {
          progress: 100,
          value: 12473,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3420000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 32n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400004,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415034,
    buildingId: 415000,
    level: 30,
    starLevel: 4,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 12473,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 12716,
        },
        {
          progress: 10,
          value: 12914,
        },
        {
          progress: 20,
          value: 13112,
        },
        {
          progress: 30,
          value: 13310,
        },
        {
          progress: 40,
          value: 13508,
        },
        {
          progress: 50,
          value: 13706,
        },
        {
          progress: 60,
          value: 13904,
        },
        {
          progress: 70,
          value: 14102,
        },
        {
          progress: 80,
          value: 14300,
        },
        {
          progress: 90,
          value: 14498,
        },
        {
          progress: 100,
          value: 14696,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 127160,
        },
        {
          progress: 10,
          value: 129140,
        },
        {
          progress: 20,
          value: 131120,
        },
        {
          progress: 30,
          value: 133100,
        },
        {
          progress: 40,
          value: 135080,
        },
        {
          progress: 50,
          value: 137060,
        },
        {
          progress: 60,
          value: 139040,
        },
        {
          progress: 70,
          value: 141020,
        },
        {
          progress: 80,
          value: 143000,
        },
        {
          progress: 90,
          value: 144980,
        },
        {
          progress: 100,
          value: 146960,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "68",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 97200,
        },
        {
          progress: 20,
          value: 97200,
        },
        {
          progress: 30,
          value: 97200,
        },
        {
          progress: 40,
          value: 97200,
        },
        {
          progress: 50,
          value: 97200,
        },
        {
          progress: 60,
          value: 97200,
        },
        {
          progress: 70,
          value: 97200,
        },
        {
          progress: 80,
          value: 97200,
        },
        {
          progress: 90,
          value: 97200,
        },
        {
          progress: 100,
          value: 97200,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 3052,
        },
        {
          progress: 20,
          value: 3052,
        },
        {
          progress: 30,
          value: 3052,
        },
        {
          progress: 40,
          value: 3052,
        },
        {
          progress: 50,
          value: 3052,
        },
        {
          progress: 60,
          value: 3052,
        },
        {
          progress: 70,
          value: 3052,
        },
        {
          progress: 80,
          value: 3052,
        },
        {
          progress: 90,
          value: 3052,
        },
        {
          progress: 100,
          value: 3052,
        },
      ],
      power: [
        {
          progress: 10,
          value: 12574,
        },
        {
          progress: 20,
          value: 12675,
        },
        {
          progress: 30,
          value: 12776,
        },
        {
          progress: 40,
          value: 12877,
        },
        {
          progress: 50,
          value: 12978,
        },
        {
          progress: 60,
          value: 13079,
        },
        {
          progress: 70,
          value: 13180,
        },
        {
          progress: 80,
          value: 13281,
        },
        {
          progress: 90,
          value: 13382,
        },
        {
          progress: 100,
          value: 13483,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 4210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 45n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400005,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415035,
    buildingId: 415000,
    level: 30,
    starLevel: 5,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 13483,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 14696,
        },
        {
          progress: 10,
          value: 14908,
        },
        {
          progress: 20,
          value: 15120,
        },
        {
          progress: 30,
          value: 15332,
        },
        {
          progress: 40,
          value: 15544,
        },
        {
          progress: 50,
          value: 15756,
        },
        {
          progress: 60,
          value: 15968,
        },
        {
          progress: 70,
          value: 16180,
        },
        {
          progress: 80,
          value: 16392,
        },
        {
          progress: 90,
          value: 16604,
        },
        {
          progress: 100,
          value: 16816,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 146960,
        },
        {
          progress: 10,
          value: 149080,
        },
        {
          progress: 20,
          value: 151200,
        },
        {
          progress: 30,
          value: 153320,
        },
        {
          progress: 40,
          value: 155440,
        },
        {
          progress: 50,
          value: 157560,
        },
        {
          progress: 60,
          value: 159680,
        },
        {
          progress: 70,
          value: 161800,
        },
        {
          progress: 80,
          value: 163920,
        },
        {
          progress: 90,
          value: 166040,
        },
        {
          progress: 100,
          value: 168160,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "70",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 525600,
        },
        {
          progress: 20,
          value: 683280,
        },
        {
          progress: 30,
          value: 888264,
        },
        {
          progress: 40,
          value: 1156320,
        },
        {
          progress: 50,
          value: 1503216,
        },
        {
          progress: 60,
          value: 1949976,
        },
        {
          progress: 70,
          value: 2538648,
        },
        {
          progress: 80,
          value: 3295512,
        },
        {
          progress: 90,
          value: 4288896,
        },
        {
          progress: 100,
          value: 4717785,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 3418,
        },
        {
          progress: 20,
          value: 3418,
        },
        {
          progress: 30,
          value: 3418,
        },
        {
          progress: 40,
          value: 3418,
        },
        {
          progress: 50,
          value: 3418,
        },
        {
          progress: 60,
          value: 3418,
        },
        {
          progress: 70,
          value: 3418,
        },
        {
          progress: 80,
          value: 3418,
        },
        {
          progress: 90,
          value: 3418,
        },
        {
          progress: 100,
          value: 3418,
        },
      ],
      power: [
        {
          progress: 10,
          value: 13584,
        },
        {
          progress: 20,
          value: 13685,
        },
        {
          progress: 30,
          value: 13786,
        },
        {
          progress: 40,
          value: 13887,
        },
        {
          progress: 50,
          value: 13988,
        },
        {
          progress: 60,
          value: 14089,
        },
        {
          progress: 70,
          value: 14190,
        },
        {
          progress: 80,
          value: 14291,
        },
        {
          progress: 90,
          value: 14392,
        },
        {
          progress: 100,
          value: 14493,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 10884029n,
            stone: 226750n,
            iron: 1179103n,
            food: 9523525n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 14149237n,
            stone: 294775n,
            iron: 1532834n,
            food: 12380582n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 18394009n,
            stone: 383208n,
            iron: 1992684n,
            food: 16094757n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 23944863n,
            stone: 498851n,
            iron: 2594026n,
            food: 20951755n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 31128322n,
            stone: 648506n,
            iron: 3372234n,
            food: 27237282n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 40379747n,
            stone: 841244n,
            iron: 4374472n,
            food: 35332279n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 52569860n,
            stone: 1095205n,
            iron: 5695068n,
            food: 45998627n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 68242861n,
            stone: 1421726n,
            iron: 7392976n,
            food: 59712504n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 88813676n,
            stone: 1850284n,
            iron: 9621481n,
            food: 77711967n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 97695044n,
            stone: 2035313n,
            iron: 10583629n,
            food: 85483163n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 158n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 205n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 267n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 347n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 451n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 586n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 763n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 990n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 1289n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 1418n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400006,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415036,
    buildingId: 415000,
    level: 30,
    starLevel: 6,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 14493,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 16816,
        },
        {
          progress: 10,
          value: 17042,
        },
        {
          progress: 20,
          value: 17269,
        },
        {
          progress: 30,
          value: 17496,
        },
        {
          progress: 40,
          value: 17723,
        },
        {
          progress: 50,
          value: 17950,
        },
        {
          progress: 60,
          value: 18176,
        },
        {
          progress: 70,
          value: 18403,
        },
        {
          progress: 80,
          value: 18630,
        },
        {
          progress: 90,
          value: 18857,
        },
        {
          progress: 100,
          value: 19084,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 168160,
        },
        {
          progress: 10,
          value: 170428,
        },
        {
          progress: 20,
          value: 172696,
        },
        {
          progress: 30,
          value: 174964,
        },
        {
          progress: 40,
          value: 177232,
        },
        {
          progress: 50,
          value: 179500,
        },
        {
          progress: 60,
          value: 181768,
        },
        {
          progress: 70,
          value: 184036,
        },
        {
          progress: 80,
          value: 186304,
        },
        {
          progress: 90,
          value: 188572,
        },
        {
          progress: 100,
          value: 190840,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "72",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 17550,
        },
        {
          progress: 20,
          value: 17550,
        },
        {
          progress: 30,
          value: 17550,
        },
        {
          progress: 40,
          value: 17550,
        },
        {
          progress: 50,
          value: 17550,
        },
        {
          progress: 60,
          value: 17550,
        },
        {
          progress: 70,
          value: 17550,
        },
        {
          progress: 80,
          value: 17550,
        },
        {
          progress: 90,
          value: 17550,
        },
        {
          progress: 100,
          value: 17550,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 3784,
        },
        {
          progress: 20,
          value: 3784,
        },
        {
          progress: 30,
          value: 3784,
        },
        {
          progress: 40,
          value: 3784,
        },
        {
          progress: 50,
          value: 3784,
        },
        {
          progress: 60,
          value: 3784,
        },
        {
          progress: 70,
          value: 3784,
        },
        {
          progress: 80,
          value: 3784,
        },
        {
          progress: 90,
          value: 3784,
        },
        {
          progress: 100,
          value: 3784,
        },
      ],
      power: [
        {
          progress: 10,
          value: 14594,
        },
        {
          progress: 20,
          value: 14695,
        },
        {
          progress: 30,
          value: 14796,
        },
        {
          progress: 40,
          value: 14897,
        },
        {
          progress: 50,
          value: 14998,
        },
        {
          progress: 60,
          value: 15099,
        },
        {
          progress: 70,
          value: 15200,
        },
        {
          progress: 80,
          value: 15301,
        },
        {
          progress: 90,
          value: 15402,
        },
        {
          progress: 100,
          value: 15503,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1210000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 11n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400007,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415037,
    buildingId: 415000,
    level: 30,
    starLevel: 7,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 15503,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 19084,
        },
        {
          progress: 10,
          value: 19326,
        },
        {
          progress: 20,
          value: 19568,
        },
        {
          progress: 30,
          value: 19811,
        },
        {
          progress: 40,
          value: 20053,
        },
        {
          progress: 50,
          value: 20296,
        },
        {
          progress: 60,
          value: 20538,
        },
        {
          progress: 70,
          value: 20780,
        },
        {
          progress: 80,
          value: 21023,
        },
        {
          progress: 90,
          value: 21265,
        },
        {
          progress: 100,
          value: 21508,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 190840,
        },
        {
          progress: 10,
          value: 193264,
        },
        {
          progress: 20,
          value: 195688,
        },
        {
          progress: 30,
          value: 198112,
        },
        {
          progress: 40,
          value: 200536,
        },
        {
          progress: 50,
          value: 202960,
        },
        {
          progress: 60,
          value: 205384,
        },
        {
          progress: 70,
          value: 207808,
        },
        {
          progress: 80,
          value: 210232,
        },
        {
          progress: 90,
          value: 212656,
        },
        {
          progress: 100,
          value: 215080,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "74",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 18230,
        },
        {
          progress: 20,
          value: 18230,
        },
        {
          progress: 30,
          value: 18230,
        },
        {
          progress: 40,
          value: 18230,
        },
        {
          progress: 50,
          value: 18230,
        },
        {
          progress: 60,
          value: 18230,
        },
        {
          progress: 70,
          value: 18230,
        },
        {
          progress: 80,
          value: 18230,
        },
        {
          progress: 90,
          value: 18230,
        },
        {
          progress: 100,
          value: 18230,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 4151,
        },
        {
          progress: 20,
          value: 4151,
        },
        {
          progress: 30,
          value: 4151,
        },
        {
          progress: 40,
          value: 4151,
        },
        {
          progress: 50,
          value: 4151,
        },
        {
          progress: 60,
          value: 4151,
        },
        {
          progress: 70,
          value: 4151,
        },
        {
          progress: 80,
          value: 4151,
        },
        {
          progress: 90,
          value: 4151,
        },
        {
          progress: 100,
          value: 4151,
        },
      ],
      power: [
        {
          progress: 10,
          value: 15604,
        },
        {
          progress: 20,
          value: 15705,
        },
        {
          progress: 30,
          value: 15806,
        },
        {
          progress: 40,
          value: 15907,
        },
        {
          progress: 50,
          value: 16008,
        },
        {
          progress: 60,
          value: 16109,
        },
        {
          progress: 70,
          value: 16210,
        },
        {
          progress: 80,
          value: 16311,
        },
        {
          progress: 90,
          value: 16412,
        },
        {
          progress: 100,
          value: 16513,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1280000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 12n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400008,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415038,
    buildingId: 415000,
    level: 30,
    starLevel: 8,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 16513,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 21508,
        },
        {
          progress: 10,
          value: 21766,
        },
        {
          progress: 20,
          value: 22025,
        },
        {
          progress: 30,
          value: 22284,
        },
        {
          progress: 40,
          value: 22543,
        },
        {
          progress: 50,
          value: 22802,
        },
        {
          progress: 60,
          value: 23060,
        },
        {
          progress: 70,
          value: 23319,
        },
        {
          progress: 80,
          value: 23578,
        },
        {
          progress: 90,
          value: 23837,
        },
        {
          progress: 100,
          value: 24096,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 215080,
        },
        {
          progress: 10,
          value: 217668,
        },
        {
          progress: 20,
          value: 220256,
        },
        {
          progress: 30,
          value: 222844,
        },
        {
          progress: 40,
          value: 225432,
        },
        {
          progress: 50,
          value: 228020,
        },
        {
          progress: 60,
          value: 230608,
        },
        {
          progress: 70,
          value: 233196,
        },
        {
          progress: 80,
          value: 235784,
        },
        {
          progress: 90,
          value: 238372,
        },
        {
          progress: 100,
          value: 240960,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "76",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 18900,
        },
        {
          progress: 20,
          value: 18900,
        },
        {
          progress: 30,
          value: 18900,
        },
        {
          progress: 40,
          value: 18900,
        },
        {
          progress: 50,
          value: 18900,
        },
        {
          progress: 60,
          value: 18900,
        },
        {
          progress: 70,
          value: 18900,
        },
        {
          progress: 80,
          value: 18900,
        },
        {
          progress: 90,
          value: 18900,
        },
        {
          progress: 100,
          value: 18900,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 4517,
        },
        {
          progress: 20,
          value: 4517,
        },
        {
          progress: 30,
          value: 4517,
        },
        {
          progress: 40,
          value: 4517,
        },
        {
          progress: 50,
          value: 4517,
        },
        {
          progress: 60,
          value: 4517,
        },
        {
          progress: 70,
          value: 4517,
        },
        {
          progress: 80,
          value: 4517,
        },
        {
          progress: 90,
          value: 4517,
        },
        {
          progress: 100,
          value: 4517,
        },
      ],
      power: [
        {
          progress: 10,
          value: 16614,
        },
        {
          progress: 20,
          value: 16715,
        },
        {
          progress: 30,
          value: 16816,
        },
        {
          progress: 40,
          value: 16917,
        },
        {
          progress: 50,
          value: 17018,
        },
        {
          progress: 60,
          value: 17119,
        },
        {
          progress: 70,
          value: 17220,
        },
        {
          progress: 80,
          value: 17321,
        },
        {
          progress: 90,
          value: 17422,
        },
        {
          progress: 100,
          value: 17523,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1360000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 13n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400009,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415039,
    buildingId: 415000,
    level: 30,
    starLevel: 9,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 17523,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 24096,
        },
        {
          progress: 10,
          value: 24372,
        },
        {
          progress: 20,
          value: 24648,
        },
        {
          progress: 30,
          value: 24924,
        },
        {
          progress: 40,
          value: 25200,
        },
        {
          progress: 50,
          value: 25476,
        },
        {
          progress: 60,
          value: 25752,
        },
        {
          progress: 70,
          value: 26028,
        },
        {
          progress: 80,
          value: 26304,
        },
        {
          progress: 90,
          value: 26580,
        },
        {
          progress: 100,
          value: 26856,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 240960,
        },
        {
          progress: 10,
          value: 243720,
        },
        {
          progress: 20,
          value: 246480,
        },
        {
          progress: 30,
          value: 249240,
        },
        {
          progress: 40,
          value: 252000,
        },
        {
          progress: 50,
          value: 254760,
        },
        {
          progress: 60,
          value: 257520,
        },
        {
          progress: 70,
          value: 260280,
        },
        {
          progress: 80,
          value: 263040,
        },
        {
          progress: 90,
          value: 265800,
        },
        {
          progress: 100,
          value: 268560,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "78",
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 19580,
        },
        {
          progress: 20,
          value: 19580,
        },
        {
          progress: 30,
          value: 19580,
        },
        {
          progress: 40,
          value: 19580,
        },
        {
          progress: 50,
          value: 19580,
        },
        {
          progress: 60,
          value: 19580,
        },
        {
          progress: 70,
          value: 19580,
        },
        {
          progress: 80,
          value: 19580,
        },
        {
          progress: 90,
          value: 19580,
        },
        {
          progress: 100,
          value: 19580,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 4883,
        },
        {
          progress: 20,
          value: 4883,
        },
        {
          progress: 30,
          value: 4883,
        },
        {
          progress: 40,
          value: 4883,
        },
        {
          progress: 50,
          value: 4883,
        },
        {
          progress: 60,
          value: 4883,
        },
        {
          progress: 70,
          value: 4883,
        },
        {
          progress: 80,
          value: 4883,
        },
        {
          progress: 90,
          value: 4883,
        },
        {
          progress: 100,
          value: 4883,
        },
      ],
      power: [
        {
          progress: 10,
          value: 17624,
        },
        {
          progress: 20,
          value: 17725,
        },
        {
          progress: 30,
          value: 17826,
        },
        {
          progress: 40,
          value: 17927,
        },
        {
          progress: 50,
          value: 18028,
        },
        {
          progress: 60,
          value: 18129,
        },
        {
          progress: 70,
          value: 18230,
        },
        {
          progress: 80,
          value: 18331,
        },
        {
          progress: 90,
          value: 18432,
        },
        {
          progress: 100,
          value: 18533,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1430000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 14n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 400010,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 415040,
    buildingId: 415000,
    level: 30,
    starLevel: 10,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 0,
    demolitionSeconds: 48839,
    experience: 0,
    power: 18533,
    maxInstances: 10,
    effects: {
      productionResourceId: 3,
    },
    effectSteps: {
      productionPerHour: [
        {
          progress: 0,
          value: 26856,
        },
        {
          progress: 10,
          value: 24170,
        },
        {
          progress: 20,
          value: 21484,
        },
        {
          progress: 30,
          value: 18799,
        },
        {
          progress: 40,
          value: 16113,
        },
        {
          progress: 50,
          value: 13428,
        },
        {
          progress: 60,
          value: 10742,
        },
        {
          progress: 70,
          value: 8056,
        },
        {
          progress: 80,
          value: 5371,
        },
        {
          progress: 90,
          value: 2685,
        },
        {
          progress: 100,
          value: 0,
        },
      ],
      productionCapacity: [
        {
          progress: 0,
          value: 268560,
        },
        {
          progress: 10,
          value: 241704,
        },
        {
          progress: 20,
          value: 214848,
        },
        {
          progress: 30,
          value: 187992,
        },
        {
          progress: 40,
          value: 161136,
        },
        {
          progress: 50,
          value: 134280,
        },
        {
          progress: 60,
          value: 107424,
        },
        {
          progress: 70,
          value: 80568,
        },
        {
          progress: 80,
          value: 53712,
        },
        {
          progress: 90,
          value: 26856,
        },
        {
          progress: 100,
          value: 0,
        },
      ],
    },
    clientParameters: [
      null,
      null,
      {
        value: "80",
      },
      null,
      null,
      null,
    ],
  },
];
