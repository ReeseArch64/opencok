import type { BuildingLevelDefinition } from "@opencok/contracts/building";

export const building400000: readonly BuildingLevelDefinition[] = [
  {
    id: 400000,
    buildingId: 400000,
    level: 0,
    starLevel: 0,
    costs: {
      wood: 2000n,
      stone: 0n,
      iron: 0n,
      food: 2000n,
      silver: 0n,
    },
    constructionSeconds: 100,
    experience: 138,
    maxInstances: 1,
    starEnabled: true,
  },
  {
    id: 400001,
    buildingId: 400000,
    level: 1,
    starLevel: 0,
    costs: {
      wood: 2800n,
      stone: 0n,
      iron: 0n,
      food: 2800n,
      silver: 0n,
    },
    constructionSeconds: 3,
    demolitionSeconds: 1,
    experience: 0,
    power: 27,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 1,
      },
    ],
    clientParameters: [
      {
        value: "3000;11000",
      },
      {
        value: "1",
      },
      null,
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400002,
    buildingId: 400000,
    level: 2,
    starLevel: 0,
    costs: {
      wood: 3920n,
      stone: 0n,
      iron: 0n,
      food: 3920n,
      silver: 0n,
    },
    constructionSeconds: 600,
    demolitionSeconds: 300,
    experience: 423,
    power: 72,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 2,
      },
    ],
    clientParameters: [
      {
        value: "5000;11000",
      },
      {
        value: "1",
      },
      null,
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400003,
    buildingId: 400000,
    level: 3,
    starLevel: 0,
    costs: {
      wood: 5880n,
      stone: 0n,
      iron: 0n,
      food: 5880n,
      silver: 0n,
    },
    constructionSeconds: 2400,
    demolitionSeconds: 1200,
    experience: 804,
    power: 147,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 3,
      },
      {
        buildingId: 413000,
        level: 3,
      },
    ],
    clientParameters: [
      {
        value: "7100;11000",
      },
      null,
      {
        value: "404000;424000",
      },
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400004,
    buildingId: 400000,
    level: 4,
    starLevel: 0,
    costs: {
      wood: 9410n,
      stone: 0n,
      iron: 0n,
      food: 9410n,
      silver: 0n,
    },
    constructionSeconds: 4800,
    demolitionSeconds: 2400,
    experience: 1608,
    power: 282,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 4,
      },
      {
        buildingId: 415000,
        level: 4,
      },
    ],
    clientParameters: [
      {
        value: "9300;11000",
      },
      null,
      {
        value: "425000;411000",
      },
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400005,
    buildingId: 400000,
    level: 5,
    starLevel: 0,
    costs: {
      wood: 16900n,
      stone: 0n,
      iron: 0n,
      food: 16900n,
      silver: 0n,
    },
    constructionSeconds: 9600,
    demolitionSeconds: 4800,
    experience: 2894,
    power: 534,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 5,
      },
      {
        buildingId: 404000,
        level: 5,
      },
    ],
    clientParameters: [
      {
        value: "10000;11000",
      },
      null,
      {
        value: "416000;426000",
      },
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400006,
    buildingId: 400000,
    level: 6,
    starLevel: 0,
    costs: {
      wood: 32200n,
      stone: 0n,
      iron: 0n,
      food: 32200n,
      silver: 0n,
    },
    constructionSeconds: 23157,
    demolitionSeconds: 11578,
    experience: 4631,
    power: 961,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 6,
      },
    ],
    clientParameters: [
      {
        value: "11200;11000",
      },
      null,
      {
        value: "402000;401000",
      },
      {
        value: "239100",
      },
      {
        value: "0;0;0;0",
      },
      {
        value: "0;0;0;0",
      },
    ],
  },
  {
    id: 400007,
    buildingId: 400000,
    level: 7,
    starLevel: 0,
    costs: {
      wood: 64400n,
      stone: 0n,
      iron: 0n,
      food: 64400n,
      silver: 0n,
    },
    constructionSeconds: 37052,
    demolitionSeconds: 18526,
    experience: 6484,
    power: 1613,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 7,
      },
      {
        buildingId: 403000,
        level: 7,
      },
    ],
    clientParameters: [
      {
        value: "13200;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "3600;0;0;3600",
      },
      {
        value: "3600;0;0;3600",
      },
    ],
  },
  {
    id: 400008,
    buildingId: 400000,
    level: 8,
    starLevel: 0,
    costs: {
      wood: 129000n,
      stone: 0n,
      iron: 0n,
      food: 129000n,
      silver: 0n,
    },
    constructionSeconds: 51873,
    demolitionSeconds: 25936,
    experience: 7780,
    power: 2496,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 8,
      },
      {
        buildingId: 410000,
        level: 8,
      },
    ],
    clientParameters: [
      {
        value: "15280;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "10800;0;0;10800",
      },
      {
        value: "10800;0;0;10800",
      },
    ],
  },
  {
    id: 400009,
    buildingId: 400000,
    level: 9,
    starLevel: 0,
    costs: {
      wood: 257000n,
      stone: 0n,
      iron: 0n,
      food: 257000n,
      silver: 0n,
    },
    constructionSeconds: 62247,
    demolitionSeconds: 31123,
    experience: 9337,
    power: 3536,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 9,
      },
      {
        buildingId: 404000,
        level: 9,
      },
    ],
    clientParameters: [
      {
        value: "17440;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "18000;0;0;18000",
      },
      {
        value: "18000;0;0;18000",
      },
    ],
  },
  {
    id: 400010,
    buildingId: 400000,
    level: 10,
    starLevel: 0,
    costs: {
      wood: 400000n,
      stone: 0n,
      iron: 38100n,
      food: 400000n,
      silver: 0n,
    },
    constructionSeconds: 74696,
    demolitionSeconds: 37348,
    experience: 11204,
    power: 4761,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 10,
      },
      {
        buildingId: 411000,
        level: 10,
      },
    ],
    clientParameters: [
      {
        value: "19680;11000",
      },
      null,
      {
        value: "414000",
      },
      {
        value: "239100",
      },
      {
        value: "25200;0;0;25200",
      },
      {
        value: "25200;0;0;25200",
      },
    ],
  },
  {
    id: 400011,
    buildingId: 400000,
    level: 11,
    starLevel: 0,
    costs: {
      wood: 801000n,
      stone: 0n,
      iron: 76300n,
      food: 801000n,
      silver: 0n,
    },
    constructionSeconds: 89636,
    demolitionSeconds: 44818,
    experience: 14005,
    power: 6204,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 11,
      },
      {
        buildingId: 426000,
        level: 11,
      },
    ],
    clientParameters: [
      {
        value: "22000;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "32400;0;0;32400",
      },
      {
        value: "32400;0;0;32400",
      },
    ],
  },
  {
    id: 400012,
    buildingId: 400000,
    level: 12,
    starLevel: 0,
    costs: {
      wood: 1520000n,
      stone: 0n,
      iron: 145000n,
      food: 1520000n,
      silver: 0n,
    },
    constructionSeconds: 112045,
    demolitionSeconds: 56022,
    experience: 17506,
    power: 7967,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 12,
      },
    ],
    clientParameters: [
      {
        value: "24400;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "39600;0;0;39600",
      },
      {
        value: "39600;0;0;39600",
      },
    ],
  },
  {
    id: 400013,
    buildingId: 400000,
    level: 13,
    starLevel: 0,
    costs: {
      wood: 2740000n,
      stone: 0n,
      iron: 261000n,
      food: 2740000n,
      silver: 0n,
    },
    constructionSeconds: 140056,
    demolitionSeconds: 70028,
    experience: 21883,
    power: 10122,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 13,
      },
      {
        buildingId: 425000,
        level: 13,
      },
    ],
    clientParameters: [
      {
        value: "26880;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400014,
    buildingId: 400000,
    level: 14,
    starLevel: 0,
    costs: {
      wood: 4110000n,
      stone: 0n,
      iron: 391000n,
      food: 4110000n,
      silver: 0n,
    },
    constructionSeconds: 175070,
    demolitionSeconds: 87535,
    experience: 27354,
    power: 12755,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 14,
      },
      {
        buildingId: 416000,
        level: 14,
      },
    ],
    clientParameters: [
      {
        value: "29440;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400015,
    buildingId: 400000,
    level: 15,
    starLevel: 0,
    costs: {
      wood: 5450000n,
      stone: 32400n,
      iron: 519000n,
      food: 5450000n,
      silver: 0n,
    },
    constructionSeconds: 218837,
    demolitionSeconds: 109418,
    experience: 34193,
    power: 15973,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 15,
      },
      {
        buildingId: 412000,
        level: 15,
      },
    ],
    clientParameters: [
      {
        value: "32080;11000",
      },
      null,
      {
        value: "412000",
      },
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400016,
    buildingId: 400000,
    level: 16,
    starLevel: 0,
    costs: {
      wood: 7630000n,
      stone: 45400n,
      iron: 726000n,
      food: 7630000n,
      silver: 0n,
    },
    constructionSeconds: 273547,
    demolitionSeconds: 136773,
    experience: 42741,
    power: 19906,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 16,
      },
      {
        buildingId: 414000,
        level: 16,
      },
    ],
    clientParameters: [
      {
        value: "32625;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400017,
    buildingId: 400000,
    level: 17,
    starLevel: 0,
    costs: {
      wood: 9920000n,
      stone: 59000n,
      iron: 944000n,
      food: 9920000n,
      silver: 0n,
    },
    constructionSeconds: 341933,
    demolitionSeconds: 170966,
    experience: 53427,
    power: 24711,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 17,
      },
    ],
    clientParameters: [
      {
        value: "35250;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400018,
    buildingId: 400000,
    level: 18,
    starLevel: 0,
    costs: {
      wood: 12900000n,
      stone: 76700n,
      iron: 1230000n,
      food: 12900000n,
      silver: 0n,
    },
    constructionSeconds: 427417,
    demolitionSeconds: 213708,
    experience: 66783,
    power: 30583,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 18,
      },
      {
        buildingId: 402000,
        level: 18,
      },
    ],
    clientParameters: [
      {
        value: "37950;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400019,
    buildingId: 400000,
    level: 19,
    starLevel: 0,
    costs: {
      wood: 16800000n,
      stone: 99800n,
      iron: 1600000n,
      food: 16800000n,
      silver: 0n,
    },
    constructionSeconds: 534271,
    demolitionSeconds: 267135,
    experience: 83479,
    power: 37759,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 19,
      },
    ],
    clientParameters: [
      {
        value: "40725;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400020,
    buildingId: 400000,
    level: 20,
    starLevel: 0,
    costs: {
      wood: 21800000n,
      stone: 130000n,
      iron: 2070000n,
      food: 21800000n,
      silver: 0n,
    },
    constructionSeconds: 667839,
    demolitionSeconds: 333919,
    experience: 96001,
    power: 46527,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 20,
      },
      {
        buildingId: 413000,
        level: 20,
      },
    ],
    clientParameters: [
      {
        value: "43575;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400021,
    buildingId: 400000,
    level: 21,
    starLevel: 0,
    costs: {
      wood: 28300000n,
      stone: 169000n,
      iron: 2700000n,
      food: 28300000n,
      silver: 0n,
    },
    constructionSeconds: 768014,
    demolitionSeconds: 384007,
    experience: 110402,
    power: 56471,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 21,
      },
    ],
    clientParameters: [
      {
        value: "43400;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400022,
    buildingId: 400000,
    level: 22,
    starLevel: 0,
    costs: {
      wood: 36800000n,
      stone: 219000n,
      iron: 3510000n,
      food: 36800000n,
      silver: 0n,
    },
    constructionSeconds: 883217,
    demolitionSeconds: 441608,
    experience: 126962,
    power: 67747,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 22,
      },
      {
        buildingId: 423000,
        level: 22,
      },
    ],
    clientParameters: [
      {
        value: "46200;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400023,
    buildingId: 400000,
    level: 23,
    starLevel: 0,
    costs: {
      wood: 47900000n,
      stone: 285000n,
      iron: 4560000n,
      food: 47900000n,
      silver: 0n,
    },
    constructionSeconds: 1015699,
    demolitionSeconds: 507849,
    experience: 146006,
    power: 80534,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 23,
      },
      {
        buildingId: 424000,
        level: 23,
      },
    ],
    clientParameters: [
      {
        value: "49070;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400024,
    buildingId: 400000,
    level: 24,
    starLevel: 0,
    costs: {
      wood: 62200000n,
      stone: 370000n,
      iron: 5930000n,
      food: 62200000n,
      silver: 0n,
    },
    constructionSeconds: 1168054,
    demolitionSeconds: 584027,
    experience: 167907,
    power: 95035,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 24,
      },
      {
        buildingId: 403000,
        level: 24,
      },
    ],
    clientParameters: [
      {
        value: "52010;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400025,
    buildingId: 400000,
    level: 25,
    starLevel: 0,
    costs: {
      wood: 80900000n,
      stone: 482000n,
      iron: 7700000n,
      food: 80900000n,
      silver: 0n,
    },
    constructionSeconds: 1343262,
    demolitionSeconds: 671631,
    experience: 193093,
    power: 111479,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 25,
      },
      {
        buildingId: 402000,
        level: 25,
      },
    ],
    clientParameters: [
      {
        value: "55020;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400026,
    buildingId: 400000,
    level: 26,
    starLevel: 0,
    costs: {
      wood: 105000000n,
      stone: 626000n,
      iron: 10000000n,
      food: 105000000n,
      silver: 0n,
    },
    constructionSeconds: 1544751,
    demolitionSeconds: 772375,
    experience: 222058,
    power: 130126,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 26,
      },
      {
        buildingId: 404000,
        level: 26,
      },
    ],
    clientParameters: [
      {
        value: "58100;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400027,
    buildingId: 400000,
    level: 27,
    starLevel: 0,
    costs: {
      wood: 137000000n,
      stone: 814000n,
      iron: 13000000n,
      food: 137000000n,
      silver: 0n,
    },
    constructionSeconds: 1776464,
    demolitionSeconds: 888232,
    experience: 255366,
    power: 151272,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 27,
      },
      {
        buildingId: 423000,
        level: 27,
      },
    ],
    clientParameters: [
      {
        value: "61250;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400028,
    buildingId: 400000,
    level: 28,
    starLevel: 0,
    costs: {
      wood: 178000000n,
      stone: 1060000n,
      iron: 16900000n,
      food: 178000000n,
      silver: 0n,
    },
    constructionSeconds: 2042934,
    demolitionSeconds: 1021467,
    experience: 293671,
    power: 175251,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 28,
      },
      {
        buildingId: 426000,
        level: 28,
      },
    ],
    clientParameters: [
      {
        value: "64470;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400029,
    buildingId: 400000,
    level: 29,
    starLevel: 0,
    costs: {
      wood: 231000000n,
      stone: 1380000n,
      iron: 22000000n,
      food: 231000000n,
      silver: 0n,
    },
    constructionSeconds: 2349374,
    demolitionSeconds: 1174687,
    experience: 337722,
    power: 202444,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 419000,
        level: 29,
      },
      {
        buildingId: 425000,
        level: 29,
      },
    ],
    clientParameters: [
      {
        value: "67760;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
  {
    id: 400030,
    buildingId: 400000,
    level: 30,
    starLevel: 0,
    costs: {
      wood: 0n,
      stone: 0n,
      iron: 0n,
      food: 0n,
      silver: 0n,
    },
    constructionSeconds: 2701780,
    demolitionSeconds: 1350890,
    experience: 0,
    power: 233280,
    maxInstances: 1,
    requiredBuildings: [
      {
        buildingId: 422000,
        level: 30,
      },
    ],
    clientParameters: [
      {
        value: "71120;11000",
      },
      null,
      null,
      {
        value: "239100",
      },
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 54000,
        },
        {
          progress: 20,
          value: 54000,
        },
        {
          progress: 30,
          value: 54000,
        },
        {
          progress: 40,
          value: 54000,
        },
        {
          progress: 50,
          value: 54000,
        },
        {
          progress: 60,
          value: 54000,
        },
        {
          progress: 70,
          value: 54000,
        },
        {
          progress: 80,
          value: 54000,
        },
        {
          progress: 90,
          value: 54000,
        },
        {
          progress: 100,
          value: 54000,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 43903,
        },
        {
          progress: 20,
          value: 43903,
        },
        {
          progress: 30,
          value: 43903,
        },
        {
          progress: 40,
          value: 43903,
        },
        {
          progress: 50,
          value: 43903,
        },
        {
          progress: 60,
          value: 43903,
        },
        {
          progress: 70,
          value: 43903,
        },
        {
          progress: 80,
          value: 43903,
        },
        {
          progress: 90,
          value: 43903,
        },
        {
          progress: 100,
          value: 43903,
        },
      ],
      power: [
        {
          progress: 10,
          value: 236079,
        },
        {
          progress: 20,
          value: 238878,
        },
        {
          progress: 30,
          value: 241677,
        },
        {
          progress: 40,
          value: 244476,
        },
        {
          progress: 50,
          value: 247275,
        },
        {
          progress: 60,
          value: 250074,
        },
        {
          progress: 70,
          value: 252873,
        },
        {
          progress: 80,
          value: 255672,
        },
        {
          progress: 90,
          value: 258471,
        },
        {
          progress: 100,
          value: 261270,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 4430000n,
            stone: 27000n,
            iron: 422000n,
            food: 4430000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 100n,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400031,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 261270,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 141750,
        },
        {
          progress: 20,
          value: 141750,
        },
        {
          progress: 30,
          value: 141750,
        },
        {
          progress: 40,
          value: 141750,
        },
        {
          progress: 50,
          value: 141750,
        },
        {
          progress: 60,
          value: 141750,
        },
        {
          progress: 70,
          value: 141750,
        },
        {
          progress: 80,
          value: 141750,
        },
        {
          progress: 90,
          value: 141750,
        },
        {
          progress: 100,
          value: 141750,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 54035,
        },
        {
          progress: 20,
          value: 54035,
        },
        {
          progress: 30,
          value: 54035,
        },
        {
          progress: 40,
          value: 54035,
        },
        {
          progress: 50,
          value: 54035,
        },
        {
          progress: 60,
          value: 54035,
        },
        {
          progress: 70,
          value: 54035,
        },
        {
          progress: 80,
          value: 54035,
        },
        {
          progress: 90,
          value: 54035,
        },
        {
          progress: 100,
          value: 54035,
        },
      ],
      power: [
        {
          progress: 10,
          value: 264069,
        },
        {
          progress: 20,
          value: 266868,
        },
        {
          progress: 30,
          value: 269667,
        },
        {
          progress: 40,
          value: 272466,
        },
        {
          progress: 50,
          value: 275265,
        },
        {
          progress: 60,
          value: 278064,
        },
        {
          progress: 70,
          value: 280863,
        },
        {
          progress: 80,
          value: 283662,
        },
        {
          progress: 90,
          value: 286461,
        },
        {
          progress: 100,
          value: 289260,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 7300000n,
            stone: 44000n,
            iron: 695000n,
            food: 7300000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 195n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422001,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400032,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 289260,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 207900,
        },
        {
          progress: 20,
          value: 207900,
        },
        {
          progress: 30,
          value: 207900,
        },
        {
          progress: 40,
          value: 207900,
        },
        {
          progress: 50,
          value: 207900,
        },
        {
          progress: 60,
          value: 207900,
        },
        {
          progress: 70,
          value: 207900,
        },
        {
          progress: 80,
          value: 207900,
        },
        {
          progress: 90,
          value: 207900,
        },
        {
          progress: 100,
          value: 207900,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 64167,
        },
        {
          progress: 20,
          value: 64167,
        },
        {
          progress: 30,
          value: 64167,
        },
        {
          progress: 40,
          value: 64167,
        },
        {
          progress: 50,
          value: 64167,
        },
        {
          progress: 60,
          value: 64167,
        },
        {
          progress: 70,
          value: 64167,
        },
        {
          progress: 80,
          value: 64167,
        },
        {
          progress: 90,
          value: 64167,
        },
        {
          progress: 100,
          value: 64167,
        },
      ],
      power: [
        {
          progress: 10,
          value: 292059,
        },
        {
          progress: 20,
          value: 294858,
        },
        {
          progress: 30,
          value: 297657,
        },
        {
          progress: 40,
          value: 300456,
        },
        {
          progress: 50,
          value: 303255,
        },
        {
          progress: 60,
          value: 306054,
        },
        {
          progress: 70,
          value: 308853,
        },
        {
          progress: 80,
          value: 311652,
        },
        {
          progress: 90,
          value: 314451,
        },
        {
          progress: 100,
          value: 317250,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 13270000n,
            stone: 79000n,
            iron: 1264000n,
            food: 13270000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 400n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422002,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400033,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 317250,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 341550,
        },
        {
          progress: 20,
          value: 341550,
        },
        {
          progress: 30,
          value: 341550,
        },
        {
          progress: 40,
          value: 341550,
        },
        {
          progress: 50,
          value: 341550,
        },
        {
          progress: 60,
          value: 341550,
        },
        {
          progress: 70,
          value: 341550,
        },
        {
          progress: 80,
          value: 341550,
        },
        {
          progress: 90,
          value: 341550,
        },
        {
          progress: 100,
          value: 341550,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 74298,
        },
        {
          progress: 20,
          value: 74298,
        },
        {
          progress: 30,
          value: 74298,
        },
        {
          progress: 40,
          value: 74298,
        },
        {
          progress: 50,
          value: 74298,
        },
        {
          progress: 60,
          value: 74298,
        },
        {
          progress: 70,
          value: 74298,
        },
        {
          progress: 80,
          value: 74298,
        },
        {
          progress: 90,
          value: 74298,
        },
        {
          progress: 100,
          value: 74298,
        },
      ],
      power: [
        {
          progress: 10,
          value: 320049,
        },
        {
          progress: 20,
          value: 322848,
        },
        {
          progress: 30,
          value: 325647,
        },
        {
          progress: 40,
          value: 328446,
        },
        {
          progress: 50,
          value: 331245,
        },
        {
          progress: 60,
          value: 334044,
        },
        {
          progress: 70,
          value: 336843,
        },
        {
          progress: 80,
          value: 339642,
        },
        {
          progress: 90,
          value: 342441,
        },
        {
          progress: 100,
          value: 345240,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 20120000n,
            stone: 120000n,
            iron: 1915000n,
            food: 20120000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 760n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422003,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400034,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 345240,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 388800,
        },
        {
          progress: 20,
          value: 388800,
        },
        {
          progress: 30,
          value: 388800,
        },
        {
          progress: 40,
          value: 388800,
        },
        {
          progress: 50,
          value: 388800,
        },
        {
          progress: 60,
          value: 388800,
        },
        {
          progress: 70,
          value: 388800,
        },
        {
          progress: 80,
          value: 388800,
        },
        {
          progress: 90,
          value: 388800,
        },
        {
          progress: 100,
          value: 388800,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 84430,
        },
        {
          progress: 20,
          value: 84430,
        },
        {
          progress: 30,
          value: 84430,
        },
        {
          progress: 40,
          value: 84430,
        },
        {
          progress: 50,
          value: 84430,
        },
        {
          progress: 60,
          value: 84430,
        },
        {
          progress: 70,
          value: 84430,
        },
        {
          progress: 80,
          value: 84430,
        },
        {
          progress: 90,
          value: 84430,
        },
        {
          progress: 100,
          value: 84430,
        },
      ],
      power: [
        {
          progress: 10,
          value: 348039,
        },
        {
          progress: 20,
          value: 350838,
        },
        {
          progress: 30,
          value: 353637,
        },
        {
          progress: 40,
          value: 356436,
        },
        {
          progress: 50,
          value: 359235,
        },
        {
          progress: 60,
          value: 362034,
        },
        {
          progress: 70,
          value: 364833,
        },
        {
          progress: 80,
          value: 367632,
        },
        {
          progress: 90,
          value: 370431,
        },
        {
          progress: 100,
          value: 373230,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 24760000n,
            stone: 148000n,
            iron: 2359000n,
            food: 24760000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 1100n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422004,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400035,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 373230,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 5792400,
        },
        {
          progress: 20,
          value: 7530120,
        },
        {
          progress: 30,
          value: 9789156,
        },
        {
          progress: 40,
          value: 12743280,
        },
        {
          progress: 50,
          value: 16566264,
        },
        {
          progress: 60,
          value: 21489804,
        },
        {
          progress: 70,
          value: 27977292,
        },
        {
          progress: 80,
          value: 36318348,
        },
        {
          progress: 90,
          value: 47265984,
        },
        {
          progress: 100,
          value: 51992582,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 94562,
        },
        {
          progress: 20,
          value: 94562,
        },
        {
          progress: 30,
          value: 94562,
        },
        {
          progress: 40,
          value: 94562,
        },
        {
          progress: 50,
          value: 94562,
        },
        {
          progress: 60,
          value: 94562,
        },
        {
          progress: 70,
          value: 94562,
        },
        {
          progress: 80,
          value: 94562,
        },
        {
          progress: 90,
          value: 94562,
        },
        {
          progress: 100,
          value: 94562,
        },
      ],
      power: [
        {
          progress: 10,
          value: 376029,
        },
        {
          progress: 20,
          value: 378828,
        },
        {
          progress: 30,
          value: 381627,
        },
        {
          progress: 40,
          value: 384426,
        },
        {
          progress: 50,
          value: 387225,
        },
        {
          progress: 60,
          value: 390024,
        },
        {
          progress: 70,
          value: 392823,
        },
        {
          progress: 80,
          value: 395622,
        },
        {
          progress: 90,
          value: 398421,
        },
        {
          progress: 100,
          value: 401220,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 112805823n,
            stone: 2968574n,
            iron: 13853346n,
            food: 94994377n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 146647570n,
            stone: 3859146n,
            iron: 18009350n,
            food: 123492691n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 190641841n,
            stone: 5016890n,
            iron: 23412156n,
            food: 160540498n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 248172811n,
            stone: 6530863n,
            iron: 30477362n,
            food: 208987630n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 322624655n,
            stone: 8490122n,
            iron: 39620571n,
            food: 271683920n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 418509605n,
            stone: 11013410n,
            iron: 51395916n,
            food: 352429141n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 544852127n,
            stone: 14338213n,
            iron: 66911664n,
            food: 458822844n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 707292513n,
            stone: 18612960n,
            iron: 86860484n,
            food: 595614748n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 920495519n,
            stone: 24223566n,
            iron: 113043309n,
            food: 775154122n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 1012545071n,
            stone: 26645922n,
            iron: 124347640n,
            food: 852669534n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 1738n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 2259n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 2937n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 3823n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 4970n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 6447n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 8394n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 10897n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 14182n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 15600n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422005,
              quantity: 1,
            },
            {
              levelId: 404005,
              quantity: 1,
            },
            {
              levelId: 401005,
              quantity: 1,
            },
          ],
        },
      ],
      unlockConditions: [
        {
          progress: 10,
          value: {
            code: 1,
            value: 600,
          },
        },
        {
          progress: 20,
          value: {
            code: 2,
            value: 2000000000,
          },
        },
        {
          progress: 30,
          value: {
            code: 3,
            value: 45,
          },
        },
        {
          progress: 40,
          value: {
            code: 4,
            value: 2000000,
          },
        },
        {
          progress: 50,
          value: {
            code: 5,
            value: 1,
          },
        },
        {
          progress: 60,
          value: {
            code: 6,
            value: 1500000,
          },
        },
        {
          progress: 70,
          value: {
            code: 7,
            value: 10000,
          },
        },
        {
          progress: 80,
          value: {
            code: 8,
            value: 700000,
          },
        },
        {
          progress: 90,
          value: {
            code: 9,
            value: 35000000,
          },
        },
        {
          progress: 100,
          value: {
            code: 10,
            value: 1,
          },
        },
      ],
      unlockPayment: [
        {
          progress: 10,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 20,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 30,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 40,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 50,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 60,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 70,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 80,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 90,
          value: {
            paymentId: 1,
            amount: 100000n,
          },
        },
        {
          progress: 100,
          value: {
            paymentId: 200065,
            amount: 100000n,
          },
        },
      ],
    },
  },
  {
    id: 400036,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 401220,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 70200,
        },
        {
          progress: 20,
          value: 70200,
        },
        {
          progress: 30,
          value: 70200,
        },
        {
          progress: 40,
          value: 70200,
        },
        {
          progress: 50,
          value: 70200,
        },
        {
          progress: 60,
          value: 70200,
        },
        {
          progress: 70,
          value: 70200,
        },
        {
          progress: 80,
          value: 70200,
        },
        {
          progress: 90,
          value: 70200,
        },
        {
          progress: 100,
          value: 70200,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 104693,
        },
        {
          progress: 20,
          value: 104693,
        },
        {
          progress: 30,
          value: 104693,
        },
        {
          progress: 40,
          value: 104693,
        },
        {
          progress: 50,
          value: 104693,
        },
        {
          progress: 60,
          value: 104693,
        },
        {
          progress: 70,
          value: 104693,
        },
        {
          progress: 80,
          value: 104693,
        },
        {
          progress: 90,
          value: 104693,
        },
        {
          progress: 100,
          value: 104693,
        },
      ],
      power: [
        {
          progress: 10,
          value: 404019,
        },
        {
          progress: 20,
          value: 406818,
        },
        {
          progress: 30,
          value: 409617,
        },
        {
          progress: 40,
          value: 412416,
        },
        {
          progress: 50,
          value: 415215,
        },
        {
          progress: 60,
          value: 418014,
        },
        {
          progress: 70,
          value: 420813,
        },
        {
          progress: 80,
          value: 423612,
        },
        {
          progress: 90,
          value: 426411,
        },
        {
          progress: 100,
          value: 429210,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 7080000n,
            stone: 43000n,
            iron: 674000n,
            food: 7080000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 280n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422006,
              quantity: 1,
            },
            {
              levelId: 404006,
              quantity: 1,
            },
            {
              levelId: 401006,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400037,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 429210,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 72900,
        },
        {
          progress: 20,
          value: 72900,
        },
        {
          progress: 30,
          value: 72900,
        },
        {
          progress: 40,
          value: 72900,
        },
        {
          progress: 50,
          value: 72900,
        },
        {
          progress: 60,
          value: 72900,
        },
        {
          progress: 70,
          value: 72900,
        },
        {
          progress: 80,
          value: 72900,
        },
        {
          progress: 90,
          value: 72900,
        },
        {
          progress: 100,
          value: 72900,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 114825,
        },
        {
          progress: 20,
          value: 114825,
        },
        {
          progress: 30,
          value: 114825,
        },
        {
          progress: 40,
          value: 114825,
        },
        {
          progress: 50,
          value: 114825,
        },
        {
          progress: 60,
          value: 114825,
        },
        {
          progress: 70,
          value: 114825,
        },
        {
          progress: 80,
          value: 114825,
        },
        {
          progress: 90,
          value: 114825,
        },
        {
          progress: 100,
          value: 114825,
        },
      ],
      power: [
        {
          progress: 10,
          value: 432009,
        },
        {
          progress: 20,
          value: 434808,
        },
        {
          progress: 30,
          value: 437607,
        },
        {
          progress: 40,
          value: 440406,
        },
        {
          progress: 50,
          value: 443205,
        },
        {
          progress: 60,
          value: 446004,
        },
        {
          progress: 70,
          value: 448803,
        },
        {
          progress: 80,
          value: 451602,
        },
        {
          progress: 90,
          value: 454401,
        },
        {
          progress: 100,
          value: 457200,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 7520000n,
            stone: 45000n,
            iron: 715000n,
            food: 7520000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 310n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422007,
              quantity: 1,
            },
            {
              levelId: 404007,
              quantity: 1,
            },
            {
              levelId: 401007,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400038,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 457200,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 75600,
        },
        {
          progress: 20,
          value: 75600,
        },
        {
          progress: 30,
          value: 75600,
        },
        {
          progress: 40,
          value: 75600,
        },
        {
          progress: 50,
          value: 75600,
        },
        {
          progress: 60,
          value: 75600,
        },
        {
          progress: 70,
          value: 75600,
        },
        {
          progress: 80,
          value: 75600,
        },
        {
          progress: 90,
          value: 75600,
        },
        {
          progress: 100,
          value: 75600,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 124957,
        },
        {
          progress: 20,
          value: 124957,
        },
        {
          progress: 30,
          value: 124957,
        },
        {
          progress: 40,
          value: 124957,
        },
        {
          progress: 50,
          value: 124957,
        },
        {
          progress: 60,
          value: 124957,
        },
        {
          progress: 70,
          value: 124957,
        },
        {
          progress: 80,
          value: 124957,
        },
        {
          progress: 90,
          value: 124957,
        },
        {
          progress: 100,
          value: 124957,
        },
      ],
      power: [
        {
          progress: 10,
          value: 459999,
        },
        {
          progress: 20,
          value: 462798,
        },
        {
          progress: 30,
          value: 465597,
        },
        {
          progress: 40,
          value: 468396,
        },
        {
          progress: 50,
          value: 471195,
        },
        {
          progress: 60,
          value: 473994,
        },
        {
          progress: 70,
          value: 476793,
        },
        {
          progress: 80,
          value: 479592,
        },
        {
          progress: 90,
          value: 482391,
        },
        {
          progress: 100,
          value: 485190,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 7960000n,
            stone: 48000n,
            iron: 759000n,
            food: 7960000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 340n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422008,
              quantity: 1,
            },
            {
              levelId: 404008,
              quantity: 1,
            },
            {
              levelId: 401008,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400039,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 485190,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
    upgrades: {
      constructionSeconds: [
        {
          progress: 10,
          value: 78300,
        },
        {
          progress: 20,
          value: 78300,
        },
        {
          progress: 30,
          value: 78300,
        },
        {
          progress: 40,
          value: 78300,
        },
        {
          progress: 50,
          value: 78300,
        },
        {
          progress: 60,
          value: 78300,
        },
        {
          progress: 70,
          value: 78300,
        },
        {
          progress: 80,
          value: 78300,
        },
        {
          progress: 90,
          value: 78300,
        },
        {
          progress: 100,
          value: 78300,
        },
      ],
      experience: [
        {
          progress: 10,
          value: 135088,
        },
        {
          progress: 20,
          value: 135088,
        },
        {
          progress: 30,
          value: 135088,
        },
        {
          progress: 40,
          value: 135088,
        },
        {
          progress: 50,
          value: 135088,
        },
        {
          progress: 60,
          value: 135088,
        },
        {
          progress: 70,
          value: 135088,
        },
        {
          progress: 80,
          value: 135088,
        },
        {
          progress: 90,
          value: 135088,
        },
        {
          progress: 100,
          value: 135088,
        },
      ],
      power: [
        {
          progress: 10,
          value: 487989,
        },
        {
          progress: 20,
          value: 490788,
        },
        {
          progress: 30,
          value: 493587,
        },
        {
          progress: 40,
          value: 496386,
        },
        {
          progress: 50,
          value: 499185,
        },
        {
          progress: 60,
          value: 501984,
        },
        {
          progress: 70,
          value: 504783,
        },
        {
          progress: 80,
          value: 507582,
        },
        {
          progress: 90,
          value: 510381,
        },
        {
          progress: 100,
          value: 513180,
        },
      ],
      costs: [
        {
          progress: 10,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 20,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 30,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 40,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 50,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 60,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 70,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 80,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 90,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
        {
          progress: 100,
          value: {
            wood: 8400000n,
            stone: 50000n,
            iron: 800000n,
            food: 8400000n,
          },
        },
      ],
      requiredItems: [
        {
          progress: 10,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              itemId: 200065,
              quantity: 370n,
            },
          ],
        },
      ],
      requiredBuildings: [
        {
          progress: 10,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 20,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 30,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 40,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 50,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 60,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 70,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 80,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 90,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
        {
          progress: 100,
          value: [
            {
              levelId: 422009,
              quantity: 1,
            },
            {
              levelId: 404009,
              quantity: 1,
            },
            {
              levelId: 401009,
              quantity: 1,
            },
          ],
        },
      ],
    },
  },
  {
    id: 400040,
    buildingId: 400000,
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
    demolitionSeconds: 1350890,
    experience: 0,
    power: 513180,
    maxInstances: 1,
    clientParameters: [
      null,
      null,
      null,
      null,
      {
        value: "43200;0;0;43200",
      },
      {
        value: "43200;0;0;43200",
      },
    ],
  },
];
