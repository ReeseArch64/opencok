import type { BuildingLevelDefinition } from "@opencok/contracts/building";
export const building404000: readonly BuildingLevelDefinition[] = [
  {
    id: 404000,
    buildingId: 404000,
    level: 0,
    starLevel: 0,
    costs: {
      wood: 900n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 50,
    experience: 36,
    maxInstances: 1,
    starEnabled: true,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 3,
      },
    ],
  },
  {
    id: 404001,
    buildingId: 404000,
    level: 1,
    starLevel: 0,
    costs: {
      wood: 1260n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 162,
    demolitionSeconds: 25,
    experience: 61,
    power: 7,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 2,
      },
    ],
    effects: {
      protectedFood: 300000,
    },
    clientParameters: [
      {
        value: "300000",
      },
      {
        value: "12500",
      },
      {
        value: "50000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404002,
    buildingId: 404000,
    level: 2,
    starLevel: 0,
    costs: {
      wood: 1760n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 423,
    demolitionSeconds: 81,
    experience: 110,
    power: 18,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 3,
      },
    ],
    effects: {
      protectedFood: 350000,
    },
    clientParameters: [
      {
        value: "350000",
      },
      {
        value: "14500",
      },
      {
        value: "58300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404003,
    buildingId: 404000,
    level: 3,
    starLevel: 0,
    costs: {
      wood: 2650n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 804,
    demolitionSeconds: 211,
    experience: 210,
    power: 38,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 4,
      },
    ],
    effects: {
      protectedFood: 400000,
    },
    clientParameters: [
      {
        value: "400000",
      },
      {
        value: "16600",
      },
      {
        value: "66600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404004,
    buildingId: 404000,
    level: 4,
    starLevel: 0,
    costs: {
      wood: 4230n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 1930,
    demolitionSeconds: 402,
    experience: 420,
    power: 73,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 5,
      },
    ],
    effects: {
      protectedFood: 450000,
    },
    clientParameters: [
      {
        value: "450000",
      },
      {
        value: "18700",
      },
      {
        value: "75000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404005,
    buildingId: 404000,
    level: 5,
    starLevel: 0,
    costs: {
      wood: 7620n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 4168,
    demolitionSeconds: 965,
    experience: 756,
    power: 139,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 6,
      },
    ],
    effects: {
      protectedFood: 500000,
    },
    clientParameters: [
      {
        value: "500000",
      },
      {
        value: "20800",
      },
      {
        value: "83300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404006,
    buildingId: 404000,
    level: 6,
    starLevel: 0,
    costs: {
      wood: 14500n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 8003,
    demolitionSeconds: 2084,
    experience: 1209,
    power: 251,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 7,
      },
    ],
    effects: {
      protectedFood: 550000,
    },
    clientParameters: [
      {
        value: "550000",
      },
      {
        value: "22900",
      },
      {
        value: "91600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404007,
    buildingId: 404000,
    level: 7,
    starLevel: 0,
    costs: {
      wood: 29000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 13445,
    demolitionSeconds: 4001,
    experience: 1693,
    power: 421,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 8,
      },
    ],
    effects: {
      protectedFood: 600000,
    },
    clientParameters: [
      {
        value: "600000",
      },
      {
        value: "25000",
      },
      {
        value: "100000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404008,
    buildingId: 404000,
    level: 8,
    starLevel: 0,
    costs: {
      wood: 57900n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 16259,
    demolitionSeconds: 6722,
    experience: 2032,
    power: 652,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 9,
      },
    ],
    effects: {
      protectedFood: 650000,
    },
    clientParameters: [
      {
        value: "650000",
      },
      {
        value: "27000",
      },
      {
        value: "108300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404009,
    buildingId: 404000,
    level: 9,
    starLevel: 0,
    costs: {
      wood: 116000n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 19511,
    demolitionSeconds: 8129,
    experience: 2438,
    power: 923,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 10,
      },
    ],
    effects: {
      protectedFood: 700000,
    },
    clientParameters: [
      {
        value: "700000",
      },
      {
        value: "29100",
      },
      {
        value: "116600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404010,
    buildingId: 404000,
    level: 10,
    starLevel: 0,
    costs: {
      wood: 143000n,
      stone: 0n,
      iron: 14900n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 23414,
    demolitionSeconds: 9755,
    experience: 2926,
    power: 1243,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 11,
      },
    ],
    effects: {
      protectedFood: 750000,
    },
    clientParameters: [
      {
        value: "750000",
      },
      {
        value: "31200",
      },
      {
        value: "125000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404011,
    buildingId: 404000,
    level: 11,
    starLevel: 0,
    costs: {
      wood: 285000n,
      stone: 0n,
      iron: 29700n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 29267,
    demolitionSeconds: 11707,
    experience: 3658,
    power: 1620,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 12,
      },
    ],
    effects: {
      protectedFood: 800000,
    },
    clientParameters: [
      {
        value: "800000",
      },
      {
        value: "33300",
      },
      {
        value: "133300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404012,
    buildingId: 404000,
    level: 12,
    starLevel: 0,
    costs: {
      wood: 542000n,
      stone: 0n,
      iron: 56400n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 36584,
    demolitionSeconds: 14633,
    experience: 4572,
    power: 2081,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 13,
      },
    ],
    effects: {
      protectedFood: 850000,
    },
    clientParameters: [
      {
        value: "850000",
      },
      {
        value: "35400",
      },
      {
        value: "141600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404013,
    buildingId: 404000,
    level: 13,
    starLevel: 0,
    costs: {
      wood: 975000n,
      stone: 0n,
      iron: 102000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 45730,
    demolitionSeconds: 18292,
    experience: 5716,
    power: 2644,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 14,
      },
    ],
    effects: {
      protectedFood: 900000,
    },
    clientParameters: [
      {
        value: "900000",
      },
      {
        value: "37500",
      },
      {
        value: "150000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404014,
    buildingId: 404000,
    level: 14,
    starLevel: 0,
    costs: {
      wood: 1460000n,
      stone: 0n,
      iron: 152000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 57162,
    demolitionSeconds: 22865,
    experience: 7145,
    power: 3331,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 15,
      },
    ],
    effects: {
      protectedFood: 950000,
    },
    clientParameters: [
      {
        value: "950000",
      },
      {
        value: "39500",
      },
      {
        value: "158300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404015,
    buildingId: 404000,
    level: 15,
    starLevel: 0,
    costs: {
      wood: 1660000n,
      stone: 26000n,
      iron: 173000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 71452,
    demolitionSeconds: 28581,
    experience: 8931,
    power: 4172,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 16,
      },
    ],
    effects: {
      protectedFood: 1000000,
    },
    clientParameters: [
      {
        value: "1000000",
      },
      {
        value: "41600",
      },
      {
        value: "166600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404016,
    buildingId: 404000,
    level: 16,
    starLevel: 0,
    costs: {
      wood: 2330000n,
      stone: 36400n,
      iron: 243000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 89316,
    demolitionSeconds: 35726,
    experience: 11164,
    power: 5199,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 17,
      },
    ],
    effects: {
      protectedFood: 1050000,
    },
    clientParameters: [
      {
        value: "1050000",
      },
      {
        value: "43700",
      },
      {
        value: "175000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404017,
    buildingId: 404000,
    level: 17,
    starLevel: 0,
    costs: {
      wood: 3030000n,
      stone: 47300n,
      iron: 315000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 111644,
    demolitionSeconds: 44658,
    experience: 13955,
    power: 6454,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 18,
      },
    ],
    effects: {
      protectedFood: 1060000,
    },
    clientParameters: [
      {
        value: "1060000",
      },
      {
        value: "44100",
      },
      {
        value: "176600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404018,
    buildingId: 404000,
    level: 18,
    starLevel: 0,
    costs: {
      wood: 3940000n,
      stone: 61500n,
      iron: 410000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 139556,
    demolitionSeconds: 55822,
    experience: 17444,
    power: 7988,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 19,
      },
    ],
    effects: {
      protectedFood: 1070000,
    },
    clientParameters: [
      {
        value: "1070000",
      },
      {
        value: "44500",
      },
      {
        value: "178300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404019,
    buildingId: 404000,
    level: 19,
    starLevel: 0,
    costs: {
      wood: 5120000n,
      stone: 80000n,
      iron: 533000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 174444,
    demolitionSeconds: 69778,
    experience: 21805,
    power: 9863,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 20,
      },
    ],
    effects: {
      protectedFood: 1080000,
    },
    clientParameters: [
      {
        value: "1080000",
      },
      {
        value: "45000",
      },
      {
        value: "180000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404020,
    buildingId: 404000,
    level: 20,
    starLevel: 0,
    costs: {
      wood: 6650000n,
      stone: 104000n,
      iron: 693000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 200611,
    demolitionSeconds: 87222,
    experience: 25076,
    power: 12153,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 21,
      },
    ],
    effects: {
      protectedFood: 1090000,
    },
    clientParameters: [
      {
        value: "1090000",
      },
      {
        value: "45400",
      },
      {
        value: "181600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404021,
    buildingId: 404000,
    level: 21,
    starLevel: 0,
    costs: {
      wood: 8650000n,
      stone: 135000n,
      iron: 901000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 230703,
    demolitionSeconds: 100305,
    experience: 28837,
    power: 14750,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 22,
      },
    ],
    effects: {
      protectedFood: 1100000,
    },
    clientParameters: [
      {
        value: "1100000",
      },
      {
        value: "45800",
      },
      {
        value: "183300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404022,
    buildingId: 404000,
    level: 22,
    starLevel: 0,
    costs: {
      wood: 11200000n,
      stone: 176000n,
      iron: 1170000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 265308,
    demolitionSeconds: 115351,
    experience: 33163,
    power: 17696,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 23,
      },
    ],
    effects: {
      protectedFood: 1110000,
    },
    clientParameters: [
      {
        value: "1110000",
      },
      {
        value: "46200",
      },
      {
        value: "185000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404023,
    buildingId: 404000,
    level: 23,
    starLevel: 0,
    costs: {
      wood: 14600000n,
      stone: 228000n,
      iron: 1520000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 305104,
    demolitionSeconds: 132654,
    experience: 38138,
    power: 21036,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 24,
      },
    ],
    effects: {
      protectedFood: 1120000,
    },
    clientParameters: [
      {
        value: "1120000",
      },
      {
        value: "46600",
      },
      {
        value: "186600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404024,
    buildingId: 404000,
    level: 24,
    starLevel: 0,
    costs: {
      wood: 19000000n,
      stone: 297000n,
      iron: 1980000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 350870,
    demolitionSeconds: 152552,
    experience: 43858,
    power: 24824,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 25,
      },
    ],
    effects: {
      protectedFood: 1130000,
    },
    clientParameters: [
      {
        value: "1130000",
      },
      {
        value: "47000",
      },
      {
        value: "188300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404025,
    buildingId: 404000,
    level: 25,
    starLevel: 0,
    costs: {
      wood: 24700000n,
      stone: 386000n,
      iron: 2570000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 403501,
    demolitionSeconds: 175435,
    experience: 50437,
    power: 29119,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 26,
      },
    ],
    effects: {
      protectedFood: 1140000,
    },
    clientParameters: [
      {
        value: "1140000",
      },
      {
        value: "47500",
      },
      {
        value: "190000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404026,
    buildingId: 404000,
    level: 26,
    starLevel: 0,
    costs: {
      wood: 32100000n,
      stone: 502000n,
      iron: 3340000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 464026,
    demolitionSeconds: 201750,
    experience: 58003,
    power: 33990,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 27,
      },
    ],
    effects: {
      protectedFood: 1150000,
    },
    clientParameters: [
      {
        value: "1150000",
      },
      {
        value: "47900",
      },
      {
        value: "191600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404027,
    buildingId: 404000,
    level: 27,
    starLevel: 0,
    costs: {
      wood: 41700000n,
      stone: 652000n,
      iron: 4350000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 533630,
    demolitionSeconds: 232013,
    experience: 66703,
    power: 39513,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 28,
      },
    ],
    effects: {
      protectedFood: 1160000,
    },
    clientParameters: [
      {
        value: "1160000",
      },
      {
        value: "48300",
      },
      {
        value: "193300",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404028,
    buildingId: 404000,
    level: 28,
    starLevel: 0,
    costs: {
      wood: 54300000n,
      stone: 848000n,
      iron: 5650000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 613674,
    demolitionSeconds: 266815,
    experience: 76709,
    power: 45777,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 29,
      },
    ],
    effects: {
      protectedFood: 1170000,
    },
    clientParameters: [
      {
        value: "1170000",
      },
      {
        value: "48700",
      },
      {
        value: "195000",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404029,
    buildingId: 404000,
    level: 29,
    starLevel: 0,
    costs: {
      wood: 70500000n,
      stone: 1100000n,
      iron: 7350000n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 705725,
    demolitionSeconds: 306837,
    experience: 88215,
    power: 52880,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 400000,
        level: 30,
      },
    ],
    effects: {
      protectedFood: 1180000,
    },
    clientParameters: [
      {
        value: "1180000",
      },
      {
        value: "49100",
      },
      {
        value: "196600",
      },
      null,
      null,
      null,
    ],
  },
  {
    id: 404030,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 60934,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1190000,
        },
        {
          progress: 10,
          value: 1195000,
        },
        {
          progress: 20,
          value: 1200000,
        },
        {
          progress: 30,
          value: 1205000,
        },
        {
          progress: 40,
          value: 1210000,
        },
        {
          progress: 50,
          value: 1215000,
        },
        {
          progress: 60,
          value: 1220000,
        },
        {
          progress: 70,
          value: 1225000,
        },
        {
          progress: 80,
          value: 1230000,
        },
        {
          progress: 90,
          value: 1235000,
        },
        {
          progress: 100,
          value: 1240000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1190000|10;1195000|20;1200000|30;1205000|40;1210000|50;1215000|60;1220000|70;1225000|80;1230000|90;1235000|100;1240000",
        steps: [
          {
            progress: 0,
            value: "1190000",
          },
          {
            progress: 10,
            value: "1195000",
          },
          {
            progress: 20,
            value: "1200000",
          },
          {
            progress: 30,
            value: "1205000",
          },
          {
            progress: 40,
            value: "1210000",
          },
          {
            progress: 50,
            value: "1215000",
          },
          {
            progress: 60,
            value: "1220000",
          },
          {
            progress: 70,
            value: "1225000",
          },
          {
            progress: 80,
            value: "1230000",
          },
          {
            progress: 90,
            value: "1235000",
          },
          {
            progress: 100,
            value: "1240000",
          },
        ],
      },
      {
        value:
          "0;49500|10;49700|20;49900|30;50100|40;50300|50;50500|60;50700|70;50900|80;51100|90;51300|100;51500",
        steps: [
          {
            progress: 0,
            value: "49500",
          },
          {
            progress: 10,
            value: "49700",
          },
          {
            progress: 20,
            value: "49900",
          },
          {
            progress: 30,
            value: "50100",
          },
          {
            progress: 40,
            value: "50300",
          },
          {
            progress: 50,
            value: "50500",
          },
          {
            progress: 60,
            value: "50700",
          },
          {
            progress: 70,
            value: "50900",
          },
          {
            progress: 80,
            value: "51100",
          },
          {
            progress: 90,
            value: "51300",
          },
          {
            progress: 100,
            value: "51500",
          },
        ],
      },
      {
        value:
          "0;198300|10;199100|20;199900|30;200700|40;201500|50;202300|60;203100|70;203900|80;204700|90;205500|100;206300",
        steps: [
          {
            progress: 0,
            value: "198300",
          },
          {
            progress: 10,
            value: "199100",
          },
          {
            progress: 20,
            value: "199900",
          },
          {
            progress: 30,
            value: "200700",
          },
          {
            progress: 40,
            value: "201500",
          },
          {
            progress: 50,
            value: "202300",
          },
          {
            progress: 60,
            value: "203100",
          },
          {
            progress: 70,
            value: "203900",
          },
          {
            progress: 80,
            value: "204700",
          },
          {
            progress: 90,
            value: "205500",
          },
          {
            progress: 100,
            value: "206300",
          },
        ],
      },
      null,
      {
        value:
          "0;0_0_0|10;1_5000_20000|20;1_10000_40000|30;1_15000_60000|40;1_20000_80000|50;1_25000_100000|60;1_30000_120000|70;1_35000_140000|80;1_40000_160000|90;1_45000_180000|100;2_50000_200000",
        steps: [
          {
            progress: 0,
            value: "0_0_0",
          },
          {
            progress: 10,
            value: "1_5000_20000",
          },
          {
            progress: 20,
            value: "1_10000_40000",
          },
          {
            progress: 30,
            value: "1_15000_60000",
          },
          {
            progress: 40,
            value: "1_20000_80000",
          },
          {
            progress: 50,
            value: "1_25000_100000",
          },
          {
            progress: 60,
            value: "1_30000_120000",
          },
          {
            progress: 70,
            value: "1_35000_140000",
          },
          {
            progress: 80,
            value: "1_40000_160000",
          },
          {
            progress: 90,
            value: "1_45000_180000",
          },
          {
            progress: 100,
            value: "2_50000_200000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 38520,
        },
        {
          progress: 20,
          value: 38520,
        },
        {
          progress: 30,
          value: 38520,
        },
        {
          progress: 40,
          value: 38520,
        },
        {
          progress: 50,
          value: 38520,
        },
        {
          progress: 60,
          value: 38520,
        },
        {
          progress: 70,
          value: 38520,
        },
        {
          progress: 80,
          value: 38520,
        },
        {
          progress: 90,
          value: 38520,
        },
        {
          progress: 100,
          value: 38520,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 11467,
        },
        {
          progress: 20,
          value: 11467,
        },
        {
          progress: 30,
          value: 11467,
        },
        {
          progress: 40,
          value: 11467,
        },
        {
          progress: 50,
          value: 11467,
        },
        {
          progress: 60,
          value: 11467,
        },
        {
          progress: 70,
          value: 11467,
        },
        {
          progress: 80,
          value: 11467,
        },
        {
          progress: 90,
          value: 11467,
        },
        {
          progress: 100,
          value: 11467,
        },
      ],
      power: [
        {
          progress: 10,
          value: 61665,
        },
        {
          progress: 20,
          value: 62396,
        },
        {
          progress: 30,
          value: 63127,
        },
        {
          progress: 40,
          value: 63858,
        },
        {
          progress: 50,
          value: 64589,
        },
        {
          progress: 60,
          value: 65320,
        },
        {
          progress: 70,
          value: 66051,
        },
        {
          progress: 80,
          value: 66782,
        },
        {
          progress: 90,
          value: 67513,
        },
        {
          progress: 100,
          value: 68244,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1960000n,
            stone: 30833n,
            iron: 205000n,
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
              quantity: 50n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 50n,
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
    id: 404031,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 68244,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1240000,
        },
        {
          progress: 10,
          value: 1245000,
        },
        {
          progress: 20,
          value: 1250000,
        },
        {
          progress: 30,
          value: 1255000,
        },
        {
          progress: 40,
          value: 1260000,
        },
        {
          progress: 50,
          value: 1265000,
        },
        {
          progress: 60,
          value: 1270000,
        },
        {
          progress: 70,
          value: 1275000,
        },
        {
          progress: 80,
          value: 1280000,
        },
        {
          progress: 90,
          value: 1285000,
        },
        {
          progress: 100,
          value: 1290000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1240000|10;1245000|20;1250000|30;1255000|40;1260000|50;1265000|60;1270000|70;1275000|80;1280000|90;1285000|100;1290000",
        steps: [
          {
            progress: 0,
            value: "1240000",
          },
          {
            progress: 10,
            value: "1245000",
          },
          {
            progress: 20,
            value: "1250000",
          },
          {
            progress: 30,
            value: "1255000",
          },
          {
            progress: 40,
            value: "1260000",
          },
          {
            progress: 50,
            value: "1265000",
          },
          {
            progress: 60,
            value: "1270000",
          },
          {
            progress: 70,
            value: "1275000",
          },
          {
            progress: 80,
            value: "1280000",
          },
          {
            progress: 90,
            value: "1285000",
          },
          {
            progress: 100,
            value: "1290000",
          },
        ],
      },
      {
        value:
          "0;51500|10;51700|20;51900|30;52100|40;52300|50;52500|60;52700|70;52900|80;53100|90;53300|100;53500",
        steps: [
          {
            progress: 0,
            value: "51500",
          },
          {
            progress: 10,
            value: "51700",
          },
          {
            progress: 20,
            value: "51900",
          },
          {
            progress: 30,
            value: "52100",
          },
          {
            progress: 40,
            value: "52300",
          },
          {
            progress: 50,
            value: "52500",
          },
          {
            progress: 60,
            value: "52700",
          },
          {
            progress: 70,
            value: "52900",
          },
          {
            progress: 80,
            value: "53100",
          },
          {
            progress: 90,
            value: "53300",
          },
          {
            progress: 100,
            value: "53500",
          },
        ],
      },
      {
        value:
          "0;206300|10;207100|20;207900|30;208700|40;209500|50;210300|60;211100|70;211900|80;212700|90;213500|100;214300",
        steps: [
          {
            progress: 0,
            value: "206300",
          },
          {
            progress: 10,
            value: "207100",
          },
          {
            progress: 20,
            value: "207900",
          },
          {
            progress: 30,
            value: "208700",
          },
          {
            progress: 40,
            value: "209500",
          },
          {
            progress: 50,
            value: "210300",
          },
          {
            progress: 60,
            value: "211100",
          },
          {
            progress: 70,
            value: "211900",
          },
          {
            progress: 80,
            value: "212700",
          },
          {
            progress: 90,
            value: "213500",
          },
          {
            progress: 100,
            value: "214300",
          },
        ],
      },
      null,
      {
        value:
          "0;2_50000_200000|10;2_55000_220000|20;2_60000_240000|30;2_65000_260000|40;2_70000_280000|50;2_75000_300000|60;2_80000_320000|70;2_85000_340000|80;2_90000_360000|90;2_95000_380000|100;3_100000_400000",
        steps: [
          {
            progress: 0,
            value: "2_50000_200000",
          },
          {
            progress: 10,
            value: "2_55000_220000",
          },
          {
            progress: 20,
            value: "2_60000_240000",
          },
          {
            progress: 30,
            value: "2_65000_260000",
          },
          {
            progress: 40,
            value: "2_70000_280000",
          },
          {
            progress: 50,
            value: "2_75000_300000",
          },
          {
            progress: 60,
            value: "2_80000_320000",
          },
          {
            progress: 70,
            value: "2_85000_340000",
          },
          {
            progress: 80,
            value: "2_90000_360000",
          },
          {
            progress: 90,
            value: "2_95000_380000",
          },
          {
            progress: 100,
            value: "3_100000_400000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 101104,
        },
        {
          progress: 20,
          value: 101104,
        },
        {
          progress: 30,
          value: 101104,
        },
        {
          progress: 40,
          value: 101104,
        },
        {
          progress: 50,
          value: 101104,
        },
        {
          progress: 60,
          value: 101104,
        },
        {
          progress: 70,
          value: 101104,
        },
        {
          progress: 80,
          value: 101104,
        },
        {
          progress: 90,
          value: 101104,
        },
        {
          progress: 100,
          value: 101104,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 14114,
        },
        {
          progress: 20,
          value: 14114,
        },
        {
          progress: 30,
          value: 14114,
        },
        {
          progress: 40,
          value: 14114,
        },
        {
          progress: 50,
          value: 14114,
        },
        {
          progress: 60,
          value: 14114,
        },
        {
          progress: 70,
          value: 14114,
        },
        {
          progress: 80,
          value: 14114,
        },
        {
          progress: 90,
          value: 14114,
        },
        {
          progress: 100,
          value: 14114,
        },
      ],
      power: [
        {
          progress: 10,
          value: 68975,
        },
        {
          progress: 20,
          value: 69706,
        },
        {
          progress: 30,
          value: 70437,
        },
        {
          progress: 40,
          value: 71168,
        },
        {
          progress: 50,
          value: 71899,
        },
        {
          progress: 60,
          value: 72630,
        },
        {
          progress: 70,
          value: 73361,
        },
        {
          progress: 80,
          value: 74092,
        },
        {
          progress: 90,
          value: 74823,
        },
        {
          progress: 100,
          value: 75554,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3230000n,
            stone: 50416n,
            iron: 336666n,
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
              quantity: 90n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 90n,
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
    id: 404032,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 75554,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1290000,
        },
        {
          progress: 10,
          value: 1295000,
        },
        {
          progress: 20,
          value: 1300000,
        },
        {
          progress: 30,
          value: 1305000,
        },
        {
          progress: 40,
          value: 1310000,
        },
        {
          progress: 50,
          value: 1315000,
        },
        {
          progress: 60,
          value: 1320000,
        },
        {
          progress: 70,
          value: 1325000,
        },
        {
          progress: 80,
          value: 1330000,
        },
        {
          progress: 90,
          value: 1335000,
        },
        {
          progress: 100,
          value: 1340000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1290000|10;1295000|20;1300000|30;1305000|40;1310000|50;1315000|60;1320000|70;1325000|80;1330000|90;1335000|100;1340000",
        steps: [
          {
            progress: 0,
            value: "1290000",
          },
          {
            progress: 10,
            value: "1295000",
          },
          {
            progress: 20,
            value: "1300000",
          },
          {
            progress: 30,
            value: "1305000",
          },
          {
            progress: 40,
            value: "1310000",
          },
          {
            progress: 50,
            value: "1315000",
          },
          {
            progress: 60,
            value: "1320000",
          },
          {
            progress: 70,
            value: "1325000",
          },
          {
            progress: 80,
            value: "1330000",
          },
          {
            progress: 90,
            value: "1335000",
          },
          {
            progress: 100,
            value: "1340000",
          },
        ],
      },
      {
        value:
          "0;53500|10;53700|20;53900|30;54100|40;54300|50;54500|60;54700|70;54900|80;55100|90;55300|100;55500",
        steps: [
          {
            progress: 0,
            value: "53500",
          },
          {
            progress: 10,
            value: "53700",
          },
          {
            progress: 20,
            value: "53900",
          },
          {
            progress: 30,
            value: "54100",
          },
          {
            progress: 40,
            value: "54300",
          },
          {
            progress: 50,
            value: "54500",
          },
          {
            progress: 60,
            value: "54700",
          },
          {
            progress: 70,
            value: "54900",
          },
          {
            progress: 80,
            value: "55100",
          },
          {
            progress: 90,
            value: "55300",
          },
          {
            progress: 100,
            value: "55500",
          },
        ],
      },
      {
        value:
          "0;214300|10;215100|20;215900|30;216700|40;217500|50;218300|60;219100|70;219900|80;220700|90;221500|100;222300",
        steps: [
          {
            progress: 0,
            value: "214300",
          },
          {
            progress: 10,
            value: "215100",
          },
          {
            progress: 20,
            value: "215900",
          },
          {
            progress: 30,
            value: "216700",
          },
          {
            progress: 40,
            value: "217500",
          },
          {
            progress: 50,
            value: "218300",
          },
          {
            progress: 60,
            value: "219100",
          },
          {
            progress: 70,
            value: "219900",
          },
          {
            progress: 80,
            value: "220700",
          },
          {
            progress: 90,
            value: "221500",
          },
          {
            progress: 100,
            value: "222300",
          },
        ],
      },
      null,
      {
        value:
          "0;3_100000_400000|10;3_105000_420000|20;3_110000_440000|30;3_115000_460000|40;3_120000_480000|50;3_125000_500000|60;3_130000_520000|70;3_135000_540000|80;3_140000_560000|90;3_145000_580000|100;4_150000_600000",
        steps: [
          {
            progress: 0,
            value: "3_100000_400000",
          },
          {
            progress: 10,
            value: "3_105000_420000",
          },
          {
            progress: 20,
            value: "3_110000_440000",
          },
          {
            progress: 30,
            value: "3_115000_460000",
          },
          {
            progress: 40,
            value: "3_120000_480000",
          },
          {
            progress: 50,
            value: "3_125000_500000",
          },
          {
            progress: 60,
            value: "3_130000_520000",
          },
          {
            progress: 70,
            value: "3_135000_540000",
          },
          {
            progress: 80,
            value: "3_140000_560000",
          },
          {
            progress: 90,
            value: "3_145000_580000",
          },
          {
            progress: 100,
            value: "4_150000_600000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 148285,
        },
        {
          progress: 20,
          value: 148285,
        },
        {
          progress: 30,
          value: 148285,
        },
        {
          progress: 40,
          value: 148285,
        },
        {
          progress: 50,
          value: 148285,
        },
        {
          progress: 60,
          value: 148285,
        },
        {
          progress: 70,
          value: 148285,
        },
        {
          progress: 80,
          value: 148285,
        },
        {
          progress: 90,
          value: 148285,
        },
        {
          progress: 100,
          value: 148285,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 16760,
        },
        {
          progress: 20,
          value: 16760,
        },
        {
          progress: 30,
          value: 16760,
        },
        {
          progress: 40,
          value: 16760,
        },
        {
          progress: 50,
          value: 16760,
        },
        {
          progress: 60,
          value: 16760,
        },
        {
          progress: 70,
          value: 16760,
        },
        {
          progress: 80,
          value: 16760,
        },
        {
          progress: 90,
          value: 16760,
        },
        {
          progress: 100,
          value: 16760,
        },
      ],
      power: [
        {
          progress: 10,
          value: 76285,
        },
        {
          progress: 20,
          value: 77016,
        },
        {
          progress: 30,
          value: 77747,
        },
        {
          progress: 40,
          value: 78478,
        },
        {
          progress: 50,
          value: 79209,
        },
        {
          progress: 60,
          value: 79940,
        },
        {
          progress: 70,
          value: 80671,
        },
        {
          progress: 80,
          value: 81402,
        },
        {
          progress: 90,
          value: 82133,
        },
        {
          progress: 100,
          value: 82864,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 5870000n,
            stone: 91666n,
            iron: 611666n,
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
              quantity: 175n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 175n,
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
    id: 404033,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 82864,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1340000,
        },
        {
          progress: 10,
          value: 1345000,
        },
        {
          progress: 20,
          value: 1350000,
        },
        {
          progress: 30,
          value: 1355000,
        },
        {
          progress: 40,
          value: 1360000,
        },
        {
          progress: 50,
          value: 1365000,
        },
        {
          progress: 60,
          value: 1370000,
        },
        {
          progress: 70,
          value: 1375000,
        },
        {
          progress: 80,
          value: 1380000,
        },
        {
          progress: 90,
          value: 1385000,
        },
        {
          progress: 100,
          value: 1390000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1340000|10;1345000|20;1350000|30;1355000|40;1360000|50;1365000|60;1370000|70;1375000|80;1380000|90;1385000|100;1390000",
        steps: [
          {
            progress: 0,
            value: "1340000",
          },
          {
            progress: 10,
            value: "1345000",
          },
          {
            progress: 20,
            value: "1350000",
          },
          {
            progress: 30,
            value: "1355000",
          },
          {
            progress: 40,
            value: "1360000",
          },
          {
            progress: 50,
            value: "1365000",
          },
          {
            progress: 60,
            value: "1370000",
          },
          {
            progress: 70,
            value: "1375000",
          },
          {
            progress: 80,
            value: "1380000",
          },
          {
            progress: 90,
            value: "1385000",
          },
          {
            progress: 100,
            value: "1390000",
          },
        ],
      },
      {
        value:
          "0;55500|10;55700|20;55900|30;56100|40;56300|50;56500|60;56700|70;56900|80;57100|90;57300|100;57500",
        steps: [
          {
            progress: 0,
            value: "55500",
          },
          {
            progress: 10,
            value: "55700",
          },
          {
            progress: 20,
            value: "55900",
          },
          {
            progress: 30,
            value: "56100",
          },
          {
            progress: 40,
            value: "56300",
          },
          {
            progress: 50,
            value: "56500",
          },
          {
            progress: 60,
            value: "56700",
          },
          {
            progress: 70,
            value: "56900",
          },
          {
            progress: 80,
            value: "57100",
          },
          {
            progress: 90,
            value: "57300",
          },
          {
            progress: 100,
            value: "57500",
          },
        ],
      },
      {
        value:
          "0;222300|10;223100|20;223900|30;224700|40;225500|50;226300|60;227100|70;227900|80;228700|90;229500|100;230300",
        steps: [
          {
            progress: 0,
            value: "222300",
          },
          {
            progress: 10,
            value: "223100",
          },
          {
            progress: 20,
            value: "223900",
          },
          {
            progress: 30,
            value: "224700",
          },
          {
            progress: 40,
            value: "225500",
          },
          {
            progress: 50,
            value: "226300",
          },
          {
            progress: 60,
            value: "227100",
          },
          {
            progress: 70,
            value: "227900",
          },
          {
            progress: 80,
            value: "228700",
          },
          {
            progress: 90,
            value: "229500",
          },
          {
            progress: 100,
            value: "230300",
          },
        ],
      },
      null,
      {
        value:
          "0;4_150000_600000|10;4_152500_610000|20;4_155000_620000|30;4_157500_630000|40;4_160000_640000|50;4_162500_650000|60;4_165000_660000|70;4_167500_670000|80;4_170000_680000|90;4_172500_690000|100;5_175000_700000",
        steps: [
          {
            progress: 0,
            value: "4_150000_600000",
          },
          {
            progress: 10,
            value: "4_152500_610000",
          },
          {
            progress: 20,
            value: "4_155000_620000",
          },
          {
            progress: 30,
            value: "4_157500_630000",
          },
          {
            progress: 40,
            value: "4_160000_640000",
          },
          {
            progress: 50,
            value: "4_162500_650000",
          },
          {
            progress: 60,
            value: "4_165000_660000",
          },
          {
            progress: 70,
            value: "4_167500_670000",
          },
          {
            progress: 80,
            value: "4_170000_680000",
          },
          {
            progress: 90,
            value: "4_172500_690000",
          },
          {
            progress: 100,
            value: "5_175000_700000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 243611,
        },
        {
          progress: 20,
          value: 243611,
        },
        {
          progress: 30,
          value: 243611,
        },
        {
          progress: 40,
          value: 243611,
        },
        {
          progress: 50,
          value: 243611,
        },
        {
          progress: 60,
          value: 243611,
        },
        {
          progress: 70,
          value: 243611,
        },
        {
          progress: 80,
          value: 243611,
        },
        {
          progress: 90,
          value: 243611,
        },
        {
          progress: 100,
          value: 243611,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 19407,
        },
        {
          progress: 20,
          value: 19407,
        },
        {
          progress: 30,
          value: 19407,
        },
        {
          progress: 40,
          value: 19407,
        },
        {
          progress: 50,
          value: 19407,
        },
        {
          progress: 60,
          value: 19407,
        },
        {
          progress: 70,
          value: 19407,
        },
        {
          progress: 80,
          value: 19407,
        },
        {
          progress: 90,
          value: 19407,
        },
        {
          progress: 100,
          value: 19407,
        },
      ],
      power: [
        {
          progress: 10,
          value: 83595,
        },
        {
          progress: 20,
          value: 84326,
        },
        {
          progress: 30,
          value: 85057,
        },
        {
          progress: 40,
          value: 85788,
        },
        {
          progress: 50,
          value: 86519,
        },
        {
          progress: 60,
          value: 87250,
        },
        {
          progress: 70,
          value: 87981,
        },
        {
          progress: 80,
          value: 88712,
        },
        {
          progress: 90,
          value: 89443,
        },
        {
          progress: 100,
          value: 90174,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 8900000n,
            stone: 139166n,
            iron: 928333n,
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
              quantity: 320n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 320n,
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
    id: 404034,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 90174,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1390000,
        },
        {
          progress: 10,
          value: 1395000,
        },
        {
          progress: 20,
          value: 1400000,
        },
        {
          progress: 30,
          value: 1405000,
        },
        {
          progress: 40,
          value: 1410000,
        },
        {
          progress: 50,
          value: 1415000,
        },
        {
          progress: 60,
          value: 1420000,
        },
        {
          progress: 70,
          value: 1425000,
        },
        {
          progress: 80,
          value: 1430000,
        },
        {
          progress: 90,
          value: 1435000,
        },
        {
          progress: 100,
          value: 1440000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1390000|10;1395000|20;1400000|30;1405000|40;1410000|50;1415000|60;1420000|70;1425000|80;1430000|90;1435000|100;1440000",
        steps: [
          {
            progress: 0,
            value: "1390000",
          },
          {
            progress: 10,
            value: "1395000",
          },
          {
            progress: 20,
            value: "1400000",
          },
          {
            progress: 30,
            value: "1405000",
          },
          {
            progress: 40,
            value: "1410000",
          },
          {
            progress: 50,
            value: "1415000",
          },
          {
            progress: 60,
            value: "1420000",
          },
          {
            progress: 70,
            value: "1425000",
          },
          {
            progress: 80,
            value: "1430000",
          },
          {
            progress: 90,
            value: "1435000",
          },
          {
            progress: 100,
            value: "1440000",
          },
        ],
      },
      {
        value:
          "0;57500|10;57700|20;57900|30;58100|40;58300|50;58500|60;58700|70;58900|80;59100|90;59300|100;59500",
        steps: [
          {
            progress: 0,
            value: "57500",
          },
          {
            progress: 10,
            value: "57700",
          },
          {
            progress: 20,
            value: "57900",
          },
          {
            progress: 30,
            value: "58100",
          },
          {
            progress: 40,
            value: "58300",
          },
          {
            progress: 50,
            value: "58500",
          },
          {
            progress: 60,
            value: "58700",
          },
          {
            progress: 70,
            value: "58900",
          },
          {
            progress: 80,
            value: "59100",
          },
          {
            progress: 90,
            value: "59300",
          },
          {
            progress: 100,
            value: "59500",
          },
        ],
      },
      {
        value:
          "0;230300|10;231100|20;231900|30;232700|40;233500|50;234300|60;235100|70;235900|80;236700|90;237500|100;238300",
        steps: [
          {
            progress: 0,
            value: "230300",
          },
          {
            progress: 10,
            value: "231100",
          },
          {
            progress: 20,
            value: "231900",
          },
          {
            progress: 30,
            value: "232700",
          },
          {
            progress: 40,
            value: "233500",
          },
          {
            progress: 50,
            value: "234300",
          },
          {
            progress: 60,
            value: "235100",
          },
          {
            progress: 70,
            value: "235900",
          },
          {
            progress: 80,
            value: "236700",
          },
          {
            progress: 90,
            value: "237500",
          },
          {
            progress: 100,
            value: "238300",
          },
        ],
      },
      null,
      {
        value:
          "0;5_175000_700000|10;5_177500_710000|20;5_180000_720000|30;5_182500_730000|40;5_185000_740000|50;5_187500_750000|60;5_190000_760000|70;5_192500_770000|80;5_195000_780000|90;5_197500_790000|100;6_200000_800000",
        steps: [
          {
            progress: 0,
            value: "5_175000_700000",
          },
          {
            progress: 10,
            value: "5_177500_710000",
          },
          {
            progress: 20,
            value: "5_180000_720000",
          },
          {
            progress: 30,
            value: "5_182500_730000",
          },
          {
            progress: 40,
            value: "5_185000_740000",
          },
          {
            progress: 50,
            value: "5_187500_750000",
          },
          {
            progress: 60,
            value: "5_190000_760000",
          },
          {
            progress: 70,
            value: "5_192500_770000",
          },
          {
            progress: 80,
            value: "5_195000_780000",
          },
          {
            progress: 90,
            value: "5_197500_790000",
          },
          {
            progress: 100,
            value: "6_200000_800000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 277312,
        },
        {
          progress: 20,
          value: 277312,
        },
        {
          progress: 30,
          value: 277312,
        },
        {
          progress: 40,
          value: 277312,
        },
        {
          progress: 50,
          value: 277312,
        },
        {
          progress: 60,
          value: 277312,
        },
        {
          progress: 70,
          value: 277312,
        },
        {
          progress: 80,
          value: 277312,
        },
        {
          progress: 90,
          value: 277312,
        },
        {
          progress: 100,
          value: 277312,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 22053,
        },
        {
          progress: 20,
          value: 22053,
        },
        {
          progress: 30,
          value: 22053,
        },
        {
          progress: 40,
          value: 22053,
        },
        {
          progress: 50,
          value: 22053,
        },
        {
          progress: 60,
          value: 22053,
        },
        {
          progress: 70,
          value: 22053,
        },
        {
          progress: 80,
          value: 22053,
        },
        {
          progress: 90,
          value: 22053,
        },
        {
          progress: 100,
          value: 22053,
        },
      ],
      power: [
        {
          progress: 10,
          value: 90905,
        },
        {
          progress: 20,
          value: 91636,
        },
        {
          progress: 30,
          value: 92367,
        },
        {
          progress: 40,
          value: 93098,
        },
        {
          progress: 50,
          value: 93829,
        },
        {
          progress: 60,
          value: 94560,
        },
        {
          progress: 70,
          value: 95291,
        },
        {
          progress: 80,
          value: 96022,
        },
        {
          progress: 90,
          value: 96753,
        },
        {
          progress: 100,
          value: 97484,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 10960000n,
            stone: 171250n,
            iron: 1141666n,
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
              quantity: 450n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 450n,
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
    id: 404035,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 97484,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1440000,
        },
        {
          progress: 10,
          value: 1445000,
        },
        {
          progress: 20,
          value: 1450000,
        },
        {
          progress: 30,
          value: 1455000,
        },
        {
          progress: 40,
          value: 1460000,
        },
        {
          progress: 50,
          value: 1465000,
        },
        {
          progress: 60,
          value: 1470000,
        },
        {
          progress: 70,
          value: 1475000,
        },
        {
          progress: 80,
          value: 1480000,
        },
        {
          progress: 90,
          value: 1485000,
        },
        {
          progress: 100,
          value: 1490000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1440000|10;1445000|20;1450000|30;1455000|40;1460000|50;1465000|60;1470000|70;1475000|80;1480000|90;1485000|100;1490000",
        steps: [
          {
            progress: 0,
            value: "1440000",
          },
          {
            progress: 10,
            value: "1445000",
          },
          {
            progress: 20,
            value: "1450000",
          },
          {
            progress: 30,
            value: "1455000",
          },
          {
            progress: 40,
            value: "1460000",
          },
          {
            progress: 50,
            value: "1465000",
          },
          {
            progress: 60,
            value: "1470000",
          },
          {
            progress: 70,
            value: "1475000",
          },
          {
            progress: 80,
            value: "1480000",
          },
          {
            progress: 90,
            value: "1485000",
          },
          {
            progress: 100,
            value: "1490000",
          },
        ],
      },
      {
        value:
          "0;59500|10;59700|20;59900|30;60100|40;60300|50;60500|60;60700|70;60900|80;61100|90;61300|100;61500",
        steps: [
          {
            progress: 0,
            value: "59500",
          },
          {
            progress: 10,
            value: "59700",
          },
          {
            progress: 20,
            value: "59900",
          },
          {
            progress: 30,
            value: "60100",
          },
          {
            progress: 40,
            value: "60300",
          },
          {
            progress: 50,
            value: "60500",
          },
          {
            progress: 60,
            value: "60700",
          },
          {
            progress: 70,
            value: "60900",
          },
          {
            progress: 80,
            value: "61100",
          },
          {
            progress: 90,
            value: "61300",
          },
          {
            progress: 100,
            value: "61500",
          },
        ],
      },
      {
        value:
          "0;238300|10;239100|20;239900|30;240700|40;241500|50;242300|60;243100|70;243900|80;244700|90;245500|100;246300",
        steps: [
          {
            progress: 0,
            value: "238300",
          },
          {
            progress: 10,
            value: "239100",
          },
          {
            progress: 20,
            value: "239900",
          },
          {
            progress: 30,
            value: "240700",
          },
          {
            progress: 40,
            value: "241500",
          },
          {
            progress: 50,
            value: "242300",
          },
          {
            progress: 60,
            value: "243100",
          },
          {
            progress: 70,
            value: "243900",
          },
          {
            progress: 80,
            value: "244700",
          },
          {
            progress: 90,
            value: "245500",
          },
          {
            progress: 100,
            value: "246300",
          },
        ],
      },
      null,
      {
        value:
          "0;6_200000_800000|10;6_202500_810000|20;6_205000_820000|30;6_207500_830000|40;6_210000_840000|50;6_212500_850000|60;6_215000_860000|70;6_217500_870000|80;6_220000_880000|90;6_222500_890000|100;7_225000_900000",
        steps: [
          {
            progress: 0,
            value: "6_200000_800000",
          },
          {
            progress: 10,
            value: "6_202500_810000",
          },
          {
            progress: 20,
            value: "6_205000_820000",
          },
          {
            progress: 30,
            value: "6_207500_830000",
          },
          {
            progress: 40,
            value: "6_210000_840000",
          },
          {
            progress: 50,
            value: "6_212500_850000",
          },
          {
            progress: 60,
            value: "6_215000_860000",
          },
          {
            progress: 70,
            value: "6_217500_870000",
          },
          {
            progress: 80,
            value: "6_220000_880000",
          },
          {
            progress: 90,
            value: "6_222500_890000",
          },
          {
            progress: 100,
            value: "7_225000_900000",
          },
        ],
      },
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 2368800,
        },
        {
          progress: 20,
          value: 3079440,
        },
        {
          progress: 30,
          value: 4003272,
        },
        {
          progress: 40,
          value: 5211360,
        },
        {
          progress: 50,
          value: 6774768,
        },
        {
          progress: 60,
          value: 8788248,
        },
        {
          progress: 70,
          value: 11441304,
        },
        {
          progress: 80,
          value: 14852376,
        },
        {
          progress: 90,
          value: 19329408,
        },
        {
          progress: 100,
          value: 21262348,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 24700,
        },
        {
          progress: 20,
          value: 24700,
        },
        {
          progress: 30,
          value: 24700,
        },
        {
          progress: 40,
          value: 24700,
        },
        {
          progress: 50,
          value: 24700,
        },
        {
          progress: 60,
          value: 24700,
        },
        {
          progress: 70,
          value: 24700,
        },
        {
          progress: 80,
          value: 24700,
        },
        {
          progress: 90,
          value: 24700,
        },
        {
          progress: 100,
          value: 24700,
        },
      ],
      power: [
        {
          progress: 10,
          value: 98215,
        },
        {
          progress: 20,
          value: 98946,
        },
        {
          progress: 30,
          value: 99677,
        },
        {
          progress: 40,
          value: 100408,
        },
        {
          progress: 50,
          value: 101139,
        },
        {
          progress: 60,
          value: 101870,
        },
        {
          progress: 70,
          value: 102601,
        },
        {
          progress: 80,
          value: 103332,
        },
        {
          progress: 90,
          value: 104063,
        },
        {
          progress: 100,
          value: 104794,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 40702979n,
            stone: 1356765n,
            iron: 7055183n,
            food: 32562383n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 52913873n,
            stone: 1763795n,
            iron: 9171738n,
            food: 42331098n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 68788035n,
            stone: 2292934n,
            iron: 11923259n,
            food: 55030428n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 89546554n,
            stone: 2984885n,
            iron: 15521402n,
            food: 71637243n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 116410520n,
            stone: 3880350n,
            iron: 20177823n,
            food: 93128416n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 151008053n,
            stone: 5033601n,
            iron: 26174729n,
            food: 120806442n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 196595390n,
            stone: 6553179n,
            iron: 34076534n,
            food: 157276312n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 255207680n,
            stone: 8506922n,
            iron: 44235997n,
            food: 204166144n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 332136311n,
            stone: 11071210n,
            iron: 57570293n,
            food: 265709049n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 365349942n,
            stone: 12178331n,
            iron: 63327323n,
            food: 292279953n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 711n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 924n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 1201n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 1564n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 2033n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 2637n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 3434n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 4457n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 5801n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 6381n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 429006,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 404036,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 104794,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1490000,
        },
        {
          progress: 10,
          value: 1495000,
        },
        {
          progress: 20,
          value: 1500000,
        },
        {
          progress: 30,
          value: 1505000,
        },
        {
          progress: 40,
          value: 1510000,
        },
        {
          progress: 50,
          value: 1515000,
        },
        {
          progress: 60,
          value: 1520000,
        },
        {
          progress: 70,
          value: 1525000,
        },
        {
          progress: 80,
          value: 1530000,
        },
        {
          progress: 90,
          value: 1535000,
        },
        {
          progress: 100,
          value: 1540000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1490000|10;1495000|20;1500000|30;1505000|40;1510000|50;1515000|60;1520000|70;1525000|80;1530000|90;1535000|100;1540000",
        steps: [
          {
            progress: 0,
            value: "1490000",
          },
          {
            progress: 10,
            value: "1495000",
          },
          {
            progress: 20,
            value: "1500000",
          },
          {
            progress: 30,
            value: "1505000",
          },
          {
            progress: 40,
            value: "1510000",
          },
          {
            progress: 50,
            value: "1515000",
          },
          {
            progress: 60,
            value: "1520000",
          },
          {
            progress: 70,
            value: "1525000",
          },
          {
            progress: 80,
            value: "1530000",
          },
          {
            progress: 90,
            value: "1535000",
          },
          {
            progress: 100,
            value: "1540000",
          },
        ],
      },
      {
        value:
          "0;61500|10;61700|20;61900|30;62100|40;62300|50;62500|60;62700|70;62900|80;63100|90;63300|100;63500",
        steps: [
          {
            progress: 0,
            value: "61500",
          },
          {
            progress: 10,
            value: "61700",
          },
          {
            progress: 20,
            value: "61900",
          },
          {
            progress: 30,
            value: "62100",
          },
          {
            progress: 40,
            value: "62300",
          },
          {
            progress: 50,
            value: "62500",
          },
          {
            progress: 60,
            value: "62700",
          },
          {
            progress: 70,
            value: "62900",
          },
          {
            progress: 80,
            value: "63100",
          },
          {
            progress: 90,
            value: "63300",
          },
          {
            progress: 100,
            value: "63500",
          },
        ],
      },
      {
        value:
          "0;246300|10;247100|20;247900|30;248700|40;249500|50;250300|60;251100|70;251900|80;252700|90;253500|100;254300",
        steps: [
          {
            progress: 0,
            value: "246300",
          },
          {
            progress: 10,
            value: "247100",
          },
          {
            progress: 20,
            value: "247900",
          },
          {
            progress: 30,
            value: "248700",
          },
          {
            progress: 40,
            value: "249500",
          },
          {
            progress: 50,
            value: "250300",
          },
          {
            progress: 60,
            value: "251100",
          },
          {
            progress: 70,
            value: "251900",
          },
          {
            progress: 80,
            value: "252700",
          },
          {
            progress: 90,
            value: "253500",
          },
          {
            progress: 100,
            value: "254300",
          },
        ],
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 50080,
        },
        {
          progress: 20,
          value: 50080,
        },
        {
          progress: 30,
          value: 50080,
        },
        {
          progress: 40,
          value: 50080,
        },
        {
          progress: 50,
          value: 50080,
        },
        {
          progress: 60,
          value: 50080,
        },
        {
          progress: 70,
          value: 50080,
        },
        {
          progress: 80,
          value: 50080,
        },
        {
          progress: 90,
          value: 50080,
        },
        {
          progress: 100,
          value: 50080,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 27346,
        },
        {
          progress: 20,
          value: 27346,
        },
        {
          progress: 30,
          value: 27346,
        },
        {
          progress: 40,
          value: 27346,
        },
        {
          progress: 50,
          value: 27346,
        },
        {
          progress: 60,
          value: 27346,
        },
        {
          progress: 70,
          value: 27346,
        },
        {
          progress: 80,
          value: 27346,
        },
        {
          progress: 90,
          value: 27346,
        },
        {
          progress: 100,
          value: 27346,
        },
      ],
      power: [
        {
          progress: 10,
          value: 105525,
        },
        {
          progress: 20,
          value: 106256,
        },
        {
          progress: 30,
          value: 106987,
        },
        {
          progress: 40,
          value: 107718,
        },
        {
          progress: 50,
          value: 108449,
        },
        {
          progress: 60,
          value: 109180,
        },
        {
          progress: 70,
          value: 109911,
        },
        {
          progress: 80,
          value: 110642,
        },
        {
          progress: 90,
          value: 111373,
        },
        {
          progress: 100,
          value: 112104,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3130000n,
            stone: 49166n,
            iron: 326666n,
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
              quantity: 110n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 110n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 429007,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 404037,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 112104,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1090000,
        },
        {
          progress: 10,
          value: 1095000,
        },
        {
          progress: 20,
          value: 1100000,
        },
        {
          progress: 30,
          value: 1105000,
        },
        {
          progress: 40,
          value: 1110000,
        },
        {
          progress: 50,
          value: 1115000,
        },
        {
          progress: 60,
          value: 1120000,
        },
        {
          progress: 70,
          value: 1125000,
        },
        {
          progress: 80,
          value: 1130000,
        },
        {
          progress: 90,
          value: 1135000,
        },
        {
          progress: 100,
          value: 1140000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1090000|10;1095000|20;1100000|30;1105000|40;1110000|50;1115000|60;1120000|70;1125000|80;1130000|90;1135000|100;1140000",
        steps: [
          {
            progress: 0,
            value: "1090000",
          },
          {
            progress: 10,
            value: "1095000",
          },
          {
            progress: 20,
            value: "1100000",
          },
          {
            progress: 30,
            value: "1105000",
          },
          {
            progress: 40,
            value: "1110000",
          },
          {
            progress: 50,
            value: "1115000",
          },
          {
            progress: 60,
            value: "1120000",
          },
          {
            progress: 70,
            value: "1125000",
          },
          {
            progress: 80,
            value: "1130000",
          },
          {
            progress: 90,
            value: "1135000",
          },
          {
            progress: 100,
            value: "1140000",
          },
        ],
      },
      {
        value:
          "0;44800|10;45000|20;45200|30;45400|40;45600|50;45800|60;46000|70;46200|80;46400|90;46600|100;46800",
        steps: [
          {
            progress: 0,
            value: "44800",
          },
          {
            progress: 10,
            value: "45000",
          },
          {
            progress: 20,
            value: "45200",
          },
          {
            progress: 30,
            value: "45400",
          },
          {
            progress: 40,
            value: "45600",
          },
          {
            progress: 50,
            value: "45800",
          },
          {
            progress: 60,
            value: "46000",
          },
          {
            progress: 70,
            value: "46200",
          },
          {
            progress: 80,
            value: "46400",
          },
          {
            progress: 90,
            value: "46600",
          },
          {
            progress: 100,
            value: "46800",
          },
        ],
      },
      {
        value:
          "0;179300|10;180100|20;180900|30;181700|40;182500|50;183300|60;184100|70;184900|80;185700|90;186500|100;187300",
        steps: [
          {
            progress: 0,
            value: "179300",
          },
          {
            progress: 10,
            value: "180100",
          },
          {
            progress: 20,
            value: "180900",
          },
          {
            progress: 30,
            value: "181700",
          },
          {
            progress: 40,
            value: "182500",
          },
          {
            progress: 50,
            value: "183300",
          },
          {
            progress: 60,
            value: "184100",
          },
          {
            progress: 70,
            value: "184900",
          },
          {
            progress: 80,
            value: "185700",
          },
          {
            progress: 90,
            value: "186500",
          },
          {
            progress: 100,
            value: "187300",
          },
        ],
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 52000,
        },
        {
          progress: 20,
          value: 52000,
        },
        {
          progress: 30,
          value: 52000,
        },
        {
          progress: 40,
          value: 52000,
        },
        {
          progress: 50,
          value: 52000,
        },
        {
          progress: 60,
          value: 52000,
        },
        {
          progress: 70,
          value: 52000,
        },
        {
          progress: 80,
          value: 52000,
        },
        {
          progress: 90,
          value: 52000,
        },
        {
          progress: 100,
          value: 52000,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 29993,
        },
        {
          progress: 20,
          value: 29993,
        },
        {
          progress: 30,
          value: 29993,
        },
        {
          progress: 40,
          value: 29993,
        },
        {
          progress: 50,
          value: 29993,
        },
        {
          progress: 60,
          value: 29993,
        },
        {
          progress: 70,
          value: 29993,
        },
        {
          progress: 80,
          value: 29993,
        },
        {
          progress: 90,
          value: 29993,
        },
        {
          progress: 100,
          value: 29993,
        },
      ],
      power: [
        {
          progress: 10,
          value: 112835,
        },
        {
          progress: 20,
          value: 113566,
        },
        {
          progress: 30,
          value: 114297,
        },
        {
          progress: 40,
          value: 115028,
        },
        {
          progress: 50,
          value: 115759,
        },
        {
          progress: 60,
          value: 116490,
        },
        {
          progress: 70,
          value: 117221,
        },
        {
          progress: 80,
          value: 117952,
        },
        {
          progress: 90,
          value: 118683,
        },
        {
          progress: 100,
          value: 119414,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3330000n,
            stone: 52083n,
            iron: 346666n,
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
              quantity: 120n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 120n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 429008,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 404038,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 119414,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1140000,
        },
        {
          progress: 10,
          value: 1145000,
        },
        {
          progress: 20,
          value: 1150000,
        },
        {
          progress: 30,
          value: 1155000,
        },
        {
          progress: 40,
          value: 1160000,
        },
        {
          progress: 50,
          value: 1165000,
        },
        {
          progress: 60,
          value: 1170000,
        },
        {
          progress: 70,
          value: 1175000,
        },
        {
          progress: 80,
          value: 1180000,
        },
        {
          progress: 90,
          value: 1185000,
        },
        {
          progress: 100,
          value: 1190000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1140000|10;1145000|20;1150000|30;1155000|40;1160000|50;1165000|60;1170000|70;1175000|80;1180000|90;1185000|100;1190000",
        steps: [
          {
            progress: 0,
            value: "1140000",
          },
          {
            progress: 10,
            value: "1145000",
          },
          {
            progress: 20,
            value: "1150000",
          },
          {
            progress: 30,
            value: "1155000",
          },
          {
            progress: 40,
            value: "1160000",
          },
          {
            progress: 50,
            value: "1165000",
          },
          {
            progress: 60,
            value: "1170000",
          },
          {
            progress: 70,
            value: "1175000",
          },
          {
            progress: 80,
            value: "1180000",
          },
          {
            progress: 90,
            value: "1185000",
          },
          {
            progress: 100,
            value: "1190000",
          },
        ],
      },
      {
        value:
          "0;46800|10;47000|20;47200|30;47400|40;47600|50;47800|60;48000|70;48200|80;48400|90;48600|100;48800",
        steps: [
          {
            progress: 0,
            value: "46800",
          },
          {
            progress: 10,
            value: "47000",
          },
          {
            progress: 20,
            value: "47200",
          },
          {
            progress: 30,
            value: "47400",
          },
          {
            progress: 40,
            value: "47600",
          },
          {
            progress: 50,
            value: "47800",
          },
          {
            progress: 60,
            value: "48000",
          },
          {
            progress: 70,
            value: "48200",
          },
          {
            progress: 80,
            value: "48400",
          },
          {
            progress: 90,
            value: "48600",
          },
          {
            progress: 100,
            value: "48800",
          },
        ],
      },
      {
        value:
          "0;187300|10;188100|20;188900|30;189700|40;190500|50;191300|60;192100|70;192900|80;193700|90;194500|100;195300",
        steps: [
          {
            progress: 0,
            value: "187300",
          },
          {
            progress: 10,
            value: "188100",
          },
          {
            progress: 20,
            value: "188900",
          },
          {
            progress: 30,
            value: "189700",
          },
          {
            progress: 40,
            value: "190500",
          },
          {
            progress: 50,
            value: "191300",
          },
          {
            progress: 60,
            value: "192100",
          },
          {
            progress: 70,
            value: "192900",
          },
          {
            progress: 80,
            value: "193700",
          },
          {
            progress: 90,
            value: "194500",
          },
          {
            progress: 100,
            value: "195300",
          },
        ],
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 53930,
        },
        {
          progress: 20,
          value: 53930,
        },
        {
          progress: 30,
          value: 53930,
        },
        {
          progress: 40,
          value: 53930,
        },
        {
          progress: 50,
          value: 53930,
        },
        {
          progress: 60,
          value: 53930,
        },
        {
          progress: 70,
          value: 53930,
        },
        {
          progress: 80,
          value: 53930,
        },
        {
          progress: 90,
          value: 53930,
        },
        {
          progress: 100,
          value: 53930,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 32639,
        },
        {
          progress: 20,
          value: 32639,
        },
        {
          progress: 30,
          value: 32639,
        },
        {
          progress: 40,
          value: 32639,
        },
        {
          progress: 50,
          value: 32639,
        },
        {
          progress: 60,
          value: 32639,
        },
        {
          progress: 70,
          value: 32639,
        },
        {
          progress: 80,
          value: 32639,
        },
        {
          progress: 90,
          value: 32639,
        },
        {
          progress: 100,
          value: 32639,
        },
      ],
      power: [
        {
          progress: 10,
          value: 120145,
        },
        {
          progress: 20,
          value: 120876,
        },
        {
          progress: 30,
          value: 121607,
        },
        {
          progress: 40,
          value: 122338,
        },
        {
          progress: 50,
          value: 123069,
        },
        {
          progress: 60,
          value: 123800,
        },
        {
          progress: 70,
          value: 124531,
        },
        {
          progress: 80,
          value: 125262,
        },
        {
          progress: 90,
          value: 125993,
        },
        {
          progress: 100,
          value: 126724,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3520000n,
            stone: 55000n,
            iron: 366666n,
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
              quantity: 130n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 130n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 429009,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 404039,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 126724,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1190000,
        },
        {
          progress: 10,
          value: 1195000,
        },
        {
          progress: 20,
          value: 1200000,
        },
        {
          progress: 30,
          value: 1205000,
        },
        {
          progress: 40,
          value: 1210000,
        },
        {
          progress: 50,
          value: 1215000,
        },
        {
          progress: 60,
          value: 1220000,
        },
        {
          progress: 70,
          value: 1225000,
        },
        {
          progress: 80,
          value: 1230000,
        },
        {
          progress: 90,
          value: 1235000,
        },
        {
          progress: 100,
          value: 1240000,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1190000|10;1195000|20;1200000|30;1205000|40;1210000|50;1215000|60;1220000|70;1225000|80;1230000|90;1235000|100;1240000",
        steps: [
          {
            progress: 0,
            value: "1190000",
          },
          {
            progress: 10,
            value: "1195000",
          },
          {
            progress: 20,
            value: "1200000",
          },
          {
            progress: 30,
            value: "1205000",
          },
          {
            progress: 40,
            value: "1210000",
          },
          {
            progress: 50,
            value: "1215000",
          },
          {
            progress: 60,
            value: "1220000",
          },
          {
            progress: 70,
            value: "1225000",
          },
          {
            progress: 80,
            value: "1230000",
          },
          {
            progress: 90,
            value: "1235000",
          },
          {
            progress: 100,
            value: "1240000",
          },
        ],
      },
      {
        value:
          "0;48800|10;49000|20;49200|30;49400|40;49600|50;49800|60;50000|70;50200|80;50400|90;50600|100;50800",
        steps: [
          {
            progress: 0,
            value: "48800",
          },
          {
            progress: 10,
            value: "49000",
          },
          {
            progress: 20,
            value: "49200",
          },
          {
            progress: 30,
            value: "49400",
          },
          {
            progress: 40,
            value: "49600",
          },
          {
            progress: 50,
            value: "49800",
          },
          {
            progress: 60,
            value: "50000",
          },
          {
            progress: 70,
            value: "50200",
          },
          {
            progress: 80,
            value: "50400",
          },
          {
            progress: 90,
            value: "50600",
          },
          {
            progress: 100,
            value: "50800",
          },
        ],
      },
      {
        value:
          "0;195300|10;196100|20;196900|30;197700|40;198500|50;199300|60;200100|70;200900|80;201700|90;202500|100;203300",
        steps: [
          {
            progress: 0,
            value: "195300",
          },
          {
            progress: 10,
            value: "196100",
          },
          {
            progress: 20,
            value: "196900",
          },
          {
            progress: 30,
            value: "197700",
          },
          {
            progress: 40,
            value: "198500",
          },
          {
            progress: 50,
            value: "199300",
          },
          {
            progress: 60,
            value: "200100",
          },
          {
            progress: 70,
            value: "200900",
          },
          {
            progress: 80,
            value: "201700",
          },
          {
            progress: 90,
            value: "202500",
          },
          {
            progress: 100,
            value: "203300",
          },
        ],
      },
      null,
      null,
      null,
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 55850,
        },
        {
          progress: 20,
          value: 55850,
        },
        {
          progress: 30,
          value: 55850,
        },
        {
          progress: 40,
          value: 55850,
        },
        {
          progress: 50,
          value: 55850,
        },
        {
          progress: 60,
          value: 55850,
        },
        {
          progress: 70,
          value: 55850,
        },
        {
          progress: 80,
          value: 55850,
        },
        {
          progress: 90,
          value: 55850,
        },
        {
          progress: 100,
          value: 55850,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 35286,
        },
        {
          progress: 20,
          value: 35286,
        },
        {
          progress: 30,
          value: 35286,
        },
        {
          progress: 40,
          value: 35286,
        },
        {
          progress: 50,
          value: 35286,
        },
        {
          progress: 60,
          value: 35286,
        },
        {
          progress: 70,
          value: 35286,
        },
        {
          progress: 80,
          value: 35286,
        },
        {
          progress: 90,
          value: 35286,
        },
        {
          progress: 100,
          value: 35286,
        },
      ],
      power: [
        {
          progress: 10,
          value: 127455,
        },
        {
          progress: 20,
          value: 128186,
        },
        {
          progress: 30,
          value: 128917,
        },
        {
          progress: 40,
          value: 129648,
        },
        {
          progress: 50,
          value: 130379,
        },
        {
          progress: 60,
          value: 131110,
        },
        {
          progress: 70,
          value: 131841,
        },
        {
          progress: 80,
          value: 132572,
        },
        {
          progress: 90,
          value: 133303,
        },
        {
          progress: 100,
          value: 134034,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
            food: 0n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 3720000n,
            stone: 58333n,
            iron: 388333n,
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
              quantity: 140n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 140n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 429010,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 404040,
    buildingId: 404000,
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
    demolitionSeconds: 352862,
    experience: 0,
    power: 134034,
    maxInstances: 1,
    effectSteps: {
      protectedFood: [
        {
          progress: 0,
          value: 1240000,
        },
        {
          progress: 10,
          value: 1116000,
        },
        {
          progress: 20,
          value: 992000,
        },
        {
          progress: 30,
          value: 868000,
        },
        {
          progress: 40,
          value: 744000,
        },
        {
          progress: 50,
          value: 620000,
        },
        {
          progress: 60,
          value: 496000,
        },
        {
          progress: 70,
          value: 372000,
        },
        {
          progress: 80,
          value: 248000,
        },
        {
          progress: 90,
          value: 124000,
        },
        {
          progress: 100,
          value: 0,
        },
      ],
    },
    clientParameters: [
      {
        value:
          "0;1240000|10;1116000|20;992000|30;868000|40;744000|50;620000|60;496000|70;372000|80;248000|90;124000|100;0",
        steps: [
          {
            progress: 0,
            value: "1240000",
          },
          {
            progress: 10,
            value: "1116000",
          },
          {
            progress: 20,
            value: "992000",
          },
          {
            progress: 30,
            value: "868000",
          },
          {
            progress: 40,
            value: "744000",
          },
          {
            progress: 50,
            value: "620000",
          },
          {
            progress: 60,
            value: "496000",
          },
          {
            progress: 70,
            value: "372000",
          },
          {
            progress: 80,
            value: "248000",
          },
          {
            progress: 90,
            value: "124000",
          },
          {
            progress: 100,
            value: "0",
          },
        ],
      },
      {
        value:
          "0;50800|10;45720|20;40640|30;35560|40;30480|50;25400|60;20320|70;15240|80;10160|90;5080|100;0",
        steps: [
          {
            progress: 0,
            value: "50800",
          },
          {
            progress: 10,
            value: "45720",
          },
          {
            progress: 20,
            value: "40640",
          },
          {
            progress: 30,
            value: "35560",
          },
          {
            progress: 40,
            value: "30480",
          },
          {
            progress: 50,
            value: "25400",
          },
          {
            progress: 60,
            value: "20320",
          },
          {
            progress: 70,
            value: "15240",
          },
          {
            progress: 80,
            value: "10160",
          },
          {
            progress: 90,
            value: "5080",
          },
          {
            progress: 100,
            value: "0",
          },
        ],
      },
      {
        value:
          "0;203300|10;182970|20;162640|30;142310|40;121980|50;101650|60;81320|70;60990|80;40660|90;20330|100;0",
        steps: [
          {
            progress: 0,
            value: "203300",
          },
          {
            progress: 10,
            value: "182970",
          },
          {
            progress: 20,
            value: "162640",
          },
          {
            progress: 30,
            value: "142310",
          },
          {
            progress: 40,
            value: "121980",
          },
          {
            progress: 50,
            value: "101650",
          },
          {
            progress: 60,
            value: "81320",
          },
          {
            progress: 70,
            value: "60990",
          },
          {
            progress: 80,
            value: "40660",
          },
          {
            progress: 90,
            value: "20330",
          },
          {
            progress: 100,
            value: "0",
          },
        ],
      },
      null,
      null,
      null,
    ],
  },
];
