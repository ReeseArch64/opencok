import type { BuildingLevelDefinition } from "@opencok/contracts/building";

export const building401000: readonly BuildingLevelDefinition[] = [
    {
        id: 401000,
        buildingId: 401000,
        level: 0,
        starLevel: 0,
        costs: {
            wood: 715n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 41,
        experience: 19,
        maxInstances: 1,
        starEnabled: true,
        requiredBuildings: [
            {
                buildingId: 400000,
                level: 9,
            },
        ],
    },
    {
        id: 401001,
        buildingId: 401000,
        level: 1,
        starLevel: 0,
        costs: {
            wood: 1000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 132,
        demolitionSeconds: 20,
        experience: 33,
        power: 5,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 2,
            },
        ],
        clientParameters: [
            {
                value: "5000",
            },
            {
                value: "45",
            },
            {
                value: "50",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401002,
        buildingId: 401000,
        level: 2,
        starLevel: 0,
        costs: {
            wood: 1400n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 344,
        demolitionSeconds: 66,
        experience: 60,
        power: 15,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 3,
            },
        ],
        clientParameters: [
            {
                value: "9000",
            },
            {
                value: "44",
            },
            {
                value: "65",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401003,
        buildingId: 401000,
        level: 3,
        starLevel: 0,
        costs: {
            wood: 2100n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 654,
        demolitionSeconds: 172,
        experience: 115,
        power: 31,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 4,
            },
        ],
        clientParameters: [
            {
                value: "13000",
            },
            {
                value: "43",
            },
            {
                value: "80",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401004,
        buildingId: 401000,
        level: 4,
        starLevel: 0,
        costs: {
            wood: 3360n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 1569,
        demolitionSeconds: 327,
        experience: 230,
        power: 60,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 5,
            },
        ],
        clientParameters: [
            {
                value: "17000",
            },
            {
                value: "42",
            },
            {
                value: "95",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401005,
        buildingId: 401000,
        level: 5,
        starLevel: 0,
        costs: {
            wood: 6050n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 3388,
        demolitionSeconds: 784,
        experience: 414,
        power: 113,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 6,
            },
        ],
        clientParameters: [
            {
                value: "21000",
            },
            {
                value: "41",
            },
            {
                value: "110",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401006,
        buildingId: 401000,
        level: 6,
        starLevel: 0,
        costs: {
            wood: 11500n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 6505,
        demolitionSeconds: 1694,
        experience: 663,
        power: 204,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 7,
            },
        ],
        clientParameters: [
            {
                value: "25000",
            },
            {
                value: "40",
            },
            {
                value: "125",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401007,
        buildingId: 401000,
        level: 7,
        starLevel: 0,
        costs: {
            wood: 23000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 10929,
        demolitionSeconds: 3252,
        experience: 929,
        power: 342,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 8,
            },
        ],
        clientParameters: [
            {
                value: "29000",
            },
            {
                value: "39",
            },
            {
                value: "140",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401008,
        buildingId: 401000,
        level: 8,
        starLevel: 0,
        costs: {
            wood: 46000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 13217,
        demolitionSeconds: 5464,
        experience: 1114,
        power: 529,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 9,
            },
        ],
        clientParameters: [
            {
                value: "33000",
            },
            {
                value: "38",
            },
            {
                value: "155",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401009,
        buildingId: 401000,
        level: 9,
        starLevel: 0,
        costs: {
            wood: 92000n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 15860,
        demolitionSeconds: 6608,
        experience: 1337,
        power: 750,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 10,
            },
        ],
        clientParameters: [
            {
                value: "37000",
            },
            {
                value: "37",
            },
            {
                value: "170",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401010,
        buildingId: 401000,
        level: 10,
        starLevel: 0,
        costs: {
            wood: 100000n,
            stone: 0n,
            iron: 13900n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 19032,
        demolitionSeconds: 7930,
        experience: 1605,
        power: 1010,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 11,
            },
        ],
        clientParameters: [
            {
                value: "41000",
            },
            {
                value: "36",
            },
            {
                value: "185",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401011,
        buildingId: 401000,
        level: 11,
        starLevel: 0,
        costs: {
            wood: 201000n,
            stone: 0n,
            iron: 27900n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 23790,
        demolitionSeconds: 9516,
        experience: 2006,
        power: 1317,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 12,
            },
        ],
        clientParameters: [
            {
                value: "45000",
            },
            {
                value: "35",
            },
            {
                value: "200",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401012,
        buildingId: 401000,
        level: 12,
        starLevel: 0,
        costs: {
            wood: 381000n,
            stone: 0n,
            iron: 53000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 29738,
        demolitionSeconds: 11895,
        experience: 2508,
        power: 1691,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 13,
            },
        ],
        clientParameters: [
            {
                value: "49000",
            },
            {
                value: "34",
            },
            {
                value: "215",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401013,
        buildingId: 401000,
        level: 13,
        starLevel: 0,
        costs: {
            wood: 687000n,
            stone: 0n,
            iron: 95400n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 37172,
        demolitionSeconds: 14869,
        experience: 3135,
        power: 2149,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 14,
            },
        ],
        clientParameters: [
            {
                value: "54000",
            },
            {
                value: "33",
            },
            {
                value: "230",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401014,
        buildingId: 401000,
        level: 14,
        starLevel: 0,
        costs: {
            wood: 1030000n,
            stone: 0n,
            iron: 143000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 46465,
        demolitionSeconds: 18586,
        experience: 3919,
        power: 2708,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 15,
            },
        ],
        clientParameters: [
            {
                value: "59000",
            },
            {
                value: "32",
            },
            {
                value: "245",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401015,
        buildingId: 401000,
        level: 15,
        starLevel: 0,
        costs: {
            wood: 1130000n,
            stone: 23600n,
            iron: 157000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 58082,
        demolitionSeconds: 23232,
        experience: 4899,
        power: 3391,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 16,
            },
        ],
        clientParameters: [
            {
                value: "64000",
            },
            {
                value: "31",
            },
            {
                value: "260",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401016,
        buildingId: 401000,
        level: 16,
        starLevel: 0,
        costs: {
            wood: 1590000n,
            stone: 33000n,
            iron: 220000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 72602,
        demolitionSeconds: 29041,
        experience: 6123,
        power: 4226,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 17,
            },
        ],
        clientParameters: [
            {
                value: "69000",
            },
            {
                value: "30",
            },
            {
                value: "275",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401017,
        buildingId: 401000,
        level: 17,
        starLevel: 0,
        costs: {
            wood: 2060000n,
            stone: 43000n,
            iron: 286000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 90753,
        demolitionSeconds: 36301,
        experience: 7654,
        power: 5246,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 18,
            },
        ],
        clientParameters: [
            {
                value: "74000",
            },
            {
                value: "29",
            },
            {
                value: "290",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401018,
        buildingId: 401000,
        level: 18,
        starLevel: 0,
        costs: {
            wood: 2680000n,
            stone: 55800n,
            iron: 372000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 113441,
        demolitionSeconds: 45376,
        experience: 9568,
        power: 6493,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 19,
            },
        ],
        clientParameters: [
            {
                value: "79000",
            },
            {
                value: "28",
            },
            {
                value: "305",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401019,
        buildingId: 401000,
        level: 19,
        starLevel: 0,
        costs: {
            wood: 3480000n,
            stone: 72600n,
            iron: 484000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 141801,
        demolitionSeconds: 56720,
        experience: 11960,
        power: 8017,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 20,
            },
        ],
        clientParameters: [
            {
                value: "84000",
            },
            {
                value: "27",
            },
            {
                value: "320",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401020,
        buildingId: 401000,
        level: 20,
        starLevel: 0,
        costs: {
            wood: 4530000n,
            stone: 94400n,
            iron: 629000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 163071,
        demolitionSeconds: 70900,
        experience: 13754,
        power: 9879,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 21,
            },
        ],
        clientParameters: [
            {
                value: "89000",
            },
            {
                value: "26",
            },
            {
                value: "335",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401021,
        buildingId: 401000,
        level: 21,
        starLevel: 0,
        costs: {
            wood: 5890000n,
            stone: 123000n,
            iron: 818000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 187532,
        demolitionSeconds: 81535,
        experience: 15817,
        power: 11990,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 22,
            },
        ],
        clientParameters: [
            {
                value: "94000",
            },
            {
                value: "25",
            },
            {
                value: "350",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401022,
        buildingId: 401000,
        level: 22,
        starLevel: 0,
        costs: {
            wood: 7660000n,
            stone: 160000n,
            iron: 1060000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 215662,
        demolitionSeconds: 93766,
        experience: 18190,
        power: 14384,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 23,
            },
        ],
        clientParameters: [
            {
                value: "99000",
            },
            {
                value: "24",
            },
            {
                value: "365",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401023,
        buildingId: 401000,
        level: 23,
        starLevel: 0,
        costs: {
            wood: 9950000n,
            stone: 207000n,
            iron: 1380000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 248011,
        demolitionSeconds: 107831,
        experience: 20919,
        power: 17099,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 24,
            },
        ],
        clientParameters: [
            {
                value: "104000",
            },
            {
                value: "23",
            },
            {
                value: "380",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401024,
        buildingId: 401000,
        level: 24,
        starLevel: 0,
        costs: {
            wood: 12900000n,
            stone: 270000n,
            iron: 1800000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 285213,
        demolitionSeconds: 124005,
        experience: 24057,
        power: 20178,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 25,
            },
        ],
        clientParameters: [
            {
                value: "109000",
            },
            {
                value: "22",
            },
            {
                value: "395",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401025,
        buildingId: 401000,
        level: 25,
        starLevel: 0,
        costs: {
            wood: 16800000n,
            stone: 350000n,
            iron: 2340000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 327994,
        demolitionSeconds: 142606,
        experience: 27665,
        power: 23670,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 26,
            },
        ],
        clientParameters: [
            {
                value: "114000",
            },
            {
                value: "21",
            },
            {
                value: "410",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401026,
        buildingId: 401000,
        level: 26,
        starLevel: 0,
        costs: {
            wood: 21900000n,
            stone: 456000n,
            iron: 3040000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 377194,
        demolitionSeconds: 163997,
        experience: 31815,
        power: 27629,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 27,
            },
        ],
        clientParameters: [
            {
                value: "119000",
            },
            {
                value: "19",
            },
            {
                value: "425",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401027,
        buildingId: 401000,
        level: 27,
        starLevel: 0,
        costs: {
            wood: 28400000n,
            stone: 592000n,
            iron: 3950000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 433773,
        demolitionSeconds: 188597,
        experience: 36587,
        power: 32119,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 28,
            },
        ],
        clientParameters: [
            {
                value: "125000",
            },
            {
                value: "17",
            },
            {
                value: "440",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401028,
        buildingId: 401000,
        level: 28,
        starLevel: 0,
        costs: {
            wood: 37000000n,
            stone: 770000n,
            iron: 5130000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 498838,
        demolitionSeconds: 216886,
        experience: 42075,
        power: 37210,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 29,
            },
        ],
        clientParameters: [
            {
                value: "132000",
            },
            {
                value: "15",
            },
            {
                value: "455",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401029,
        buildingId: 401000,
        level: 29,
        starLevel: 0,
        costs: {
            wood: 48000000n,
            stone: 1000000n,
            iron: 6670000n,
            food: 0n,
            silver: 0n,
        },
        constructionSeconds: 573664,
        demolitionSeconds: 249419,
        experience: 48387,
        power: 42984,
        maxInstances: 1,
        requiredBuildings: [
            {
                buildingId: 402000,
                level: 30,
            },
        ],
        clientParameters: [
            {
                value: "140000",
            },
            {
                value: "13",
            },
            {
                value: "470",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
    },
    {
        id: 401030,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 49532,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;150000|10;167000|20;184000|30;201000|40;218000|50;235000|60;252000|70;269000|80;286000|90;303000|100;320000",
                steps: [
                    {
                        progress: 0,
                        value: "150000",
                    },
                    {
                        progress: 10,
                        value: "167000",
                    },
                    {
                        progress: 20,
                        value: "184000",
                    },
                    {
                        progress: 30,
                        value: "201000",
                    },
                    {
                        progress: 40,
                        value: "218000",
                    },
                    {
                        progress: 50,
                        value: "235000",
                    },
                    {
                        progress: 60,
                        value: "252000",
                    },
                    {
                        progress: 70,
                        value: "269000",
                    },
                    {
                        progress: 80,
                        value: "286000",
                    },
                    {
                        progress: 90,
                        value: "303000",
                    },
                    {
                        progress: 100,
                        value: "320000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "-1",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 23750,
                },
                {
                    progress: 20,
                    value: 23750,
                },
                {
                    progress: 30,
                    value: 23750,
                },
                {
                    progress: 40,
                    value: 23750,
                },
                {
                    progress: 50,
                    value: 23750,
                },
                {
                    progress: 60,
                    value: 23750,
                },
                {
                    progress: 70,
                    value: 23750,
                },
                {
                    progress: 80,
                    value: 23750,
                },
                {
                    progress: 90,
                    value: 23750,
                },
                {
                    progress: 100,
                    value: 23750,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 6290,
                },
                {
                    progress: 20,
                    value: 6290,
                },
                {
                    progress: 30,
                    value: 6290,
                },
                {
                    progress: 40,
                    value: 6290,
                },
                {
                    progress: 50,
                    value: 6290,
                },
                {
                    progress: 60,
                    value: 6290,
                },
                {
                    progress: 70,
                    value: 6290,
                },
                {
                    progress: 80,
                    value: 6290,
                },
                {
                    progress: 90,
                    value: 6290,
                },
                {
                    progress: 100,
                    value: 6290,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 50126,
                },
                {
                    progress: 20,
                    value: 50720,
                },
                {
                    progress: 30,
                    value: 51314,
                },
                {
                    progress: 40,
                    value: 51908,
                },
                {
                    progress: 50,
                    value: 52502,
                },
                {
                    progress: 60,
                    value: 53096,
                },
                {
                    progress: 70,
                    value: 53690,
                },
                {
                    progress: 80,
                    value: 54284,
                },
                {
                    progress: 90,
                    value: 54878,
                },
                {
                    progress: 100,
                    value: 55472,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 1410000n,
                        stone: 29583n,
                        iron: 196666n,
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
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 25n,
                        },
                    ],
                },
            ],
            requiredBuildings: [
                {
                    progress: 10,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            levelId: 402001,
                            quantity: 1,
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 401031,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 55472,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;320000|10;322000|20;324000|30;326000|40;328000|50;330000|60;332000|70;334000|80;336000|90;338000|100;340000",
                steps: [
                    {
                        progress: 0,
                        value: "320000",
                    },
                    {
                        progress: 10,
                        value: "322000",
                    },
                    {
                        progress: 20,
                        value: "324000",
                    },
                    {
                        progress: 30,
                        value: "326000",
                    },
                    {
                        progress: 40,
                        value: "328000",
                    },
                    {
                        progress: 50,
                        value: "330000",
                    },
                    {
                        progress: 60,
                        value: "332000",
                    },
                    {
                        progress: 70,
                        value: "334000",
                    },
                    {
                        progress: 80,
                        value: "336000",
                    },
                    {
                        progress: 90,
                        value: "338000",
                    },
                    {
                        progress: 100,
                        value: "340000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 62335,
                },
                {
                    progress: 20,
                    value: 62335,
                },
                {
                    progress: 30,
                    value: 62335,
                },
                {
                    progress: 40,
                    value: 62335,
                },
                {
                    progress: 50,
                    value: 62335,
                },
                {
                    progress: 60,
                    value: 62335,
                },
                {
                    progress: 70,
                    value: 62335,
                },
                {
                    progress: 80,
                    value: 62335,
                },
                {
                    progress: 90,
                    value: 62335,
                },
                {
                    progress: 100,
                    value: 62335,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 7741,
                },
                {
                    progress: 20,
                    value: 7741,
                },
                {
                    progress: 30,
                    value: 7741,
                },
                {
                    progress: 40,
                    value: 7741,
                },
                {
                    progress: 50,
                    value: 7741,
                },
                {
                    progress: 60,
                    value: 7741,
                },
                {
                    progress: 70,
                    value: 7741,
                },
                {
                    progress: 80,
                    value: 7741,
                },
                {
                    progress: 90,
                    value: 7741,
                },
                {
                    progress: 100,
                    value: 7741,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 56066,
                },
                {
                    progress: 20,
                    value: 56660,
                },
                {
                    progress: 30,
                    value: 57254,
                },
                {
                    progress: 40,
                    value: 57848,
                },
                {
                    progress: 50,
                    value: 58442,
                },
                {
                    progress: 60,
                    value: 59036,
                },
                {
                    progress: 70,
                    value: 59630,
                },
                {
                    progress: 80,
                    value: 60224,
                },
                {
                    progress: 90,
                    value: 60818,
                },
                {
                    progress: 100,
                    value: 61412,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 2330000n,
                        stone: 48750n,
                        iron: 323333n,
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
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 42n,
                        },
                    ],
                },
            ],
            requiredBuildings: [
                {
                    progress: 10,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            levelId: 402002,
                            quantity: 1,
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 401032,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 61412,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;340000|10;342200|20;344400|30;346600|40;348800|50;351000|60;353200|70;355400|80;357600|90;359800|100;362000",
                steps: [
                    {
                        progress: 0,
                        value: "340000",
                    },
                    {
                        progress: 10,
                        value: "342200",
                    },
                    {
                        progress: 20,
                        value: "344400",
                    },
                    {
                        progress: 30,
                        value: "346600",
                    },
                    {
                        progress: 40,
                        value: "348800",
                    },
                    {
                        progress: 50,
                        value: "351000",
                    },
                    {
                        progress: 60,
                        value: "353200",
                    },
                    {
                        progress: 70,
                        value: "355400",
                    },
                    {
                        progress: 80,
                        value: "357600",
                    },
                    {
                        progress: 90,
                        value: "359800",
                    },
                    {
                        progress: 100,
                        value: "362000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 91425,
                },
                {
                    progress: 20,
                    value: 91425,
                },
                {
                    progress: 30,
                    value: 91425,
                },
                {
                    progress: 40,
                    value: 91425,
                },
                {
                    progress: 50,
                    value: 91425,
                },
                {
                    progress: 60,
                    value: 91425,
                },
                {
                    progress: 70,
                    value: 91425,
                },
                {
                    progress: 80,
                    value: 91425,
                },
                {
                    progress: 90,
                    value: 91425,
                },
                {
                    progress: 100,
                    value: 91425,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 9193,
                },
                {
                    progress: 20,
                    value: 9193,
                },
                {
                    progress: 30,
                    value: 9193,
                },
                {
                    progress: 40,
                    value: 9193,
                },
                {
                    progress: 50,
                    value: 9193,
                },
                {
                    progress: 60,
                    value: 9193,
                },
                {
                    progress: 70,
                    value: 9193,
                },
                {
                    progress: 80,
                    value: 9193,
                },
                {
                    progress: 90,
                    value: 9193,
                },
                {
                    progress: 100,
                    value: 9193,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 62006,
                },
                {
                    progress: 20,
                    value: 62600,
                },
                {
                    progress: 30,
                    value: 63194,
                },
                {
                    progress: 40,
                    value: 63788,
                },
                {
                    progress: 50,
                    value: 64382,
                },
                {
                    progress: 60,
                    value: 64976,
                },
                {
                    progress: 70,
                    value: 65570,
                },
                {
                    progress: 80,
                    value: 66164,
                },
                {
                    progress: 90,
                    value: 66758,
                },
                {
                    progress: 100,
                    value: 67352,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 4230000n,
                        stone: 88333n,
                        iron: 588333n,
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
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 78n,
                        },
                    ],
                },
            ],
            requiredBuildings: [
                {
                    progress: 10,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            levelId: 402003,
                            quantity: 1,
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 401033,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 67352,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;362000|10;364200|20;366400|30;368600|40;370800|50;373000|60;375200|70;377400|80;379600|90;381800|100;384000",
                steps: [
                    {
                        progress: 0,
                        value: "362000",
                    },
                    {
                        progress: 10,
                        value: "364200",
                    },
                    {
                        progress: 20,
                        value: "366400",
                    },
                    {
                        progress: 30,
                        value: "368600",
                    },
                    {
                        progress: 40,
                        value: "370800",
                    },
                    {
                        progress: 50,
                        value: "373000",
                    },
                    {
                        progress: 60,
                        value: "375200",
                    },
                    {
                        progress: 70,
                        value: "377400",
                    },
                    {
                        progress: 80,
                        value: "379600",
                    },
                    {
                        progress: 90,
                        value: "381800",
                    },
                    {
                        progress: 100,
                        value: "384000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 150197,
                },
                {
                    progress: 20,
                    value: 150197,
                },
                {
                    progress: 30,
                    value: 150197,
                },
                {
                    progress: 40,
                    value: 150197,
                },
                {
                    progress: 50,
                    value: 150197,
                },
                {
                    progress: 60,
                    value: 150197,
                },
                {
                    progress: 70,
                    value: 150197,
                },
                {
                    progress: 80,
                    value: 150197,
                },
                {
                    progress: 90,
                    value: 150197,
                },
                {
                    progress: 100,
                    value: 150197,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 10645,
                },
                {
                    progress: 20,
                    value: 10645,
                },
                {
                    progress: 30,
                    value: 10645,
                },
                {
                    progress: 40,
                    value: 10645,
                },
                {
                    progress: 50,
                    value: 10645,
                },
                {
                    progress: 60,
                    value: 10645,
                },
                {
                    progress: 70,
                    value: 10645,
                },
                {
                    progress: 80,
                    value: 10645,
                },
                {
                    progress: 90,
                    value: 10645,
                },
                {
                    progress: 100,
                    value: 10645,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 67946,
                },
                {
                    progress: 20,
                    value: 68540,
                },
                {
                    progress: 30,
                    value: 69134,
                },
                {
                    progress: 40,
                    value: 69728,
                },
                {
                    progress: 50,
                    value: 70322,
                },
                {
                    progress: 60,
                    value: 70916,
                },
                {
                    progress: 70,
                    value: 71510,
                },
                {
                    progress: 80,
                    value: 72104,
                },
                {
                    progress: 90,
                    value: 72698,
                },
                {
                    progress: 100,
                    value: 73292,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 6420000n,
                        stone: 133750n,
                        iron: 891666n,
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
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 136n,
                        },
                    ],
                },
            ],
            requiredBuildings: [
                {
                    progress: 10,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            levelId: 402004,
                            quantity: 1,
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 401034,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 73292,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;384000|10;386200|20;388400|30;390600|40;392800|50;395000|60;397200|70;399400|80;401600|90;403800|100;406000",
                steps: [
                    {
                        progress: 0,
                        value: "384000",
                    },
                    {
                        progress: 10,
                        value: "386200",
                    },
                    {
                        progress: 20,
                        value: "388400",
                    },
                    {
                        progress: 30,
                        value: "390600",
                    },
                    {
                        progress: 40,
                        value: "392800",
                    },
                    {
                        progress: 50,
                        value: "395000",
                    },
                    {
                        progress: 60,
                        value: "397200",
                    },
                    {
                        progress: 70,
                        value: "399400",
                    },
                    {
                        progress: 80,
                        value: "401600",
                    },
                    {
                        progress: 90,
                        value: "403800",
                    },
                    {
                        progress: 100,
                        value: "406000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 170975,
                },
                {
                    progress: 20,
                    value: 170975,
                },
                {
                    progress: 30,
                    value: 170975,
                },
                {
                    progress: 40,
                    value: 170975,
                },
                {
                    progress: 50,
                    value: 170975,
                },
                {
                    progress: 60,
                    value: 170975,
                },
                {
                    progress: 70,
                    value: 170975,
                },
                {
                    progress: 80,
                    value: 170975,
                },
                {
                    progress: 90,
                    value: 170975,
                },
                {
                    progress: 100,
                    value: 170975,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 12096,
                },
                {
                    progress: 20,
                    value: 12096,
                },
                {
                    progress: 30,
                    value: 12096,
                },
                {
                    progress: 40,
                    value: 12096,
                },
                {
                    progress: 50,
                    value: 12096,
                },
                {
                    progress: 60,
                    value: 12096,
                },
                {
                    progress: 70,
                    value: 12096,
                },
                {
                    progress: 80,
                    value: 12096,
                },
                {
                    progress: 90,
                    value: 12096,
                },
                {
                    progress: 100,
                    value: 12096,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 73886,
                },
                {
                    progress: 20,
                    value: 74480,
                },
                {
                    progress: 30,
                    value: 75074,
                },
                {
                    progress: 40,
                    value: 75668,
                },
                {
                    progress: 50,
                    value: 76262,
                },
                {
                    progress: 60,
                    value: 76856,
                },
                {
                    progress: 70,
                    value: 77450,
                },
                {
                    progress: 80,
                    value: 78044,
                },
                {
                    progress: 90,
                    value: 78638,
                },
                {
                    progress: 100,
                    value: 79232,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 7900000n,
                        stone: 164583n,
                        iron: 1096666n,
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
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 185n,
                        },
                    ],
                },
            ],
            requiredBuildings: [
                {
                    progress: 10,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            levelId: 402005,
                            quantity: 1,
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 401035,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 79232,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;406000|10;408200|20;410400|30;412600|40;414800|50;417000|60;419200|70;421400|80;423600|90;425800|100;428000",
                steps: [
                    {
                        progress: 0,
                        value: "406000",
                    },
                    {
                        progress: 10,
                        value: "408200",
                    },
                    {
                        progress: 20,
                        value: "410400",
                    },
                    {
                        progress: 30,
                        value: "412600",
                    },
                    {
                        progress: 40,
                        value: "414800",
                    },
                    {
                        progress: 50,
                        value: "417000",
                    },
                    {
                        progress: 60,
                        value: "419200",
                    },
                    {
                        progress: 70,
                        value: "421400",
                    },
                    {
                        progress: 80,
                        value: "423600",
                    },
                    {
                        progress: 90,
                        value: "425800",
                    },
                    {
                        progress: 100,
                        value: "428000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 1051200,
                },
                {
                    progress: 20,
                    value: 1366560,
                },
                {
                    progress: 30,
                    value: 1776528,
                },
                {
                    progress: 40,
                    value: 2312640,
                },
                {
                    progress: 50,
                    value: 3006432,
                },
                {
                    progress: 60,
                    value: 3899952,
                },
                {
                    progress: 70,
                    value: 5077296,
                },
                {
                    progress: 80,
                    value: 6591024,
                },
                {
                    progress: 90,
                    value: 8577792,
                },
                {
                    progress: 100,
                    value: 9435571,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 13548,
                },
                {
                    progress: 20,
                    value: 13548,
                },
                {
                    progress: 30,
                    value: 13548,
                },
                {
                    progress: 40,
                    value: 13548,
                },
                {
                    progress: 50,
                    value: 13548,
                },
                {
                    progress: 60,
                    value: 13548,
                },
                {
                    progress: 70,
                    value: 13548,
                },
                {
                    progress: 80,
                    value: 13548,
                },
                {
                    progress: 90,
                    value: 13548,
                },
                {
                    progress: 100,
                    value: 13548,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 79826,
                },
                {
                    progress: 20,
                    value: 80420,
                },
                {
                    progress: 30,
                    value: 81014,
                },
                {
                    progress: 40,
                    value: 81608,
                },
                {
                    progress: 50,
                    value: 82202,
                },
                {
                    progress: 60,
                    value: 82796,
                },
                {
                    progress: 70,
                    value: 83390,
                },
                {
                    progress: 80,
                    value: 83984,
                },
                {
                    progress: 90,
                    value: 84578,
                },
                {
                    progress: 100,
                    value: 85172,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 18090213n,
                        stone: 603007n,
                        iron: 3135636n,
                        food: 14472170n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 23517276n,
                        stone: 783909n,
                        iron: 4076328n,
                        food: 18813821n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 30572460n,
                        stone: 1019082n,
                        iron: 5299226n,
                        food: 24457968n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 39798468n,
                        stone: 1326615n,
                        iron: 6898401n,
                        food: 31838774n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 51738009n,
                        stone: 1724600n,
                        iron: 8967921n,
                        food: 41390407n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 67114690n,
                        stone: 2237156n,
                        iron: 11633212n,
                        food: 53691752n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 87375728n,
                        stone: 2912524n,
                        iron: 15145126n,
                        food: 69900583n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 113425635n,
                        stone: 3780854n,
                        iron: 19660443n,
                        food: 90740508n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 147616138n,
                        stone: 4920537n,
                        iron: 25586797n,
                        food: 118092910n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 162377752n,
                        stone: 5412591n,
                        iron: 28145477n,
                        food: 129902201n,
                    },
                },
            ],
            requiredItems: [
                {
                    progress: 10,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 316n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 410n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 534n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 695n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 903n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 1172n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 1526n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 1981n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 2578n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 2836n,
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
        id: 401036,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 85172,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;428000|10;430400|20;432800|30;435200|40;437600|50;440000|60;442400|70;444800|80;447200|90;449600|100;452000",
                steps: [
                    {
                        progress: 0,
                        value: "428000",
                    },
                    {
                        progress: 10,
                        value: "430400",
                    },
                    {
                        progress: 20,
                        value: "432800",
                    },
                    {
                        progress: 30,
                        value: "435200",
                    },
                    {
                        progress: 40,
                        value: "437600",
                    },
                    {
                        progress: 50,
                        value: "440000",
                    },
                    {
                        progress: 60,
                        value: "442400",
                    },
                    {
                        progress: 70,
                        value: "444800",
                    },
                    {
                        progress: 80,
                        value: "447200",
                    },
                    {
                        progress: 90,
                        value: "449600",
                    },
                    {
                        progress: 100,
                        value: "452000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 30880,
                },
                {
                    progress: 20,
                    value: 30880,
                },
                {
                    progress: 30,
                    value: 30880,
                },
                {
                    progress: 40,
                    value: 30880,
                },
                {
                    progress: 50,
                    value: 30880,
                },
                {
                    progress: 60,
                    value: 30880,
                },
                {
                    progress: 70,
                    value: 30880,
                },
                {
                    progress: 80,
                    value: 30880,
                },
                {
                    progress: 90,
                    value: 30880,
                },
                {
                    progress: 100,
                    value: 30880,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 14999,
                },
                {
                    progress: 20,
                    value: 14999,
                },
                {
                    progress: 30,
                    value: 14999,
                },
                {
                    progress: 40,
                    value: 14999,
                },
                {
                    progress: 50,
                    value: 14999,
                },
                {
                    progress: 60,
                    value: 14999,
                },
                {
                    progress: 70,
                    value: 14999,
                },
                {
                    progress: 80,
                    value: 14999,
                },
                {
                    progress: 90,
                    value: 14999,
                },
                {
                    progress: 100,
                    value: 14999,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 85766,
                },
                {
                    progress: 20,
                    value: 86360,
                },
                {
                    progress: 30,
                    value: 86954,
                },
                {
                    progress: 40,
                    value: 87548,
                },
                {
                    progress: 50,
                    value: 88142,
                },
                {
                    progress: 60,
                    value: 88736,
                },
                {
                    progress: 70,
                    value: 89330,
                },
                {
                    progress: 80,
                    value: 89924,
                },
                {
                    progress: 90,
                    value: 90518,
                },
                {
                    progress: 100,
                    value: 91112,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 2260000n,
                        stone: 47083n,
                        iron: 313333n,
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
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 43n,
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
        id: 401037,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 91112,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;452000|10;454400|20;456800|30;459200|40;461600|50;464000|60;466400|70;468800|80;471200|90;473600|100;476000",
                steps: [
                    {
                        progress: 0,
                        value: "452000",
                    },
                    {
                        progress: 10,
                        value: "454400",
                    },
                    {
                        progress: 20,
                        value: "456800",
                    },
                    {
                        progress: 30,
                        value: "459200",
                    },
                    {
                        progress: 40,
                        value: "461600",
                    },
                    {
                        progress: 50,
                        value: "464000",
                    },
                    {
                        progress: 60,
                        value: "466400",
                    },
                    {
                        progress: 70,
                        value: "468800",
                    },
                    {
                        progress: 80,
                        value: "471200",
                    },
                    {
                        progress: 90,
                        value: "473600",
                    },
                    {
                        progress: 100,
                        value: "476000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 32060,
                },
                {
                    progress: 20,
                    value: 32060,
                },
                {
                    progress: 30,
                    value: 32060,
                },
                {
                    progress: 40,
                    value: 32060,
                },
                {
                    progress: 50,
                    value: 32060,
                },
                {
                    progress: 60,
                    value: 32060,
                },
                {
                    progress: 70,
                    value: 32060,
                },
                {
                    progress: 80,
                    value: 32060,
                },
                {
                    progress: 90,
                    value: 32060,
                },
                {
                    progress: 100,
                    value: 32060,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 16451,
                },
                {
                    progress: 20,
                    value: 16451,
                },
                {
                    progress: 30,
                    value: 16451,
                },
                {
                    progress: 40,
                    value: 16451,
                },
                {
                    progress: 50,
                    value: 16451,
                },
                {
                    progress: 60,
                    value: 16451,
                },
                {
                    progress: 70,
                    value: 16451,
                },
                {
                    progress: 80,
                    value: 16451,
                },
                {
                    progress: 90,
                    value: 16451,
                },
                {
                    progress: 100,
                    value: 16451,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 91706,
                },
                {
                    progress: 20,
                    value: 92300,
                },
                {
                    progress: 30,
                    value: 92894,
                },
                {
                    progress: 40,
                    value: 93488,
                },
                {
                    progress: 50,
                    value: 94082,
                },
                {
                    progress: 60,
                    value: 94676,
                },
                {
                    progress: 70,
                    value: 95270,
                },
                {
                    progress: 80,
                    value: 95864,
                },
                {
                    progress: 90,
                    value: 96458,
                },
                {
                    progress: 100,
                    value: 97052,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 2400000n,
                        stone: 50000n,
                        iron: 333333n,
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
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 46n,
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
        id: 401038,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 97052,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;476000|10;478400|20;480800|30;483200|40;485600|50;488000|60;490400|70;492800|80;495200|90;497600|100;500000",
                steps: [
                    {
                        progress: 0,
                        value: "476000",
                    },
                    {
                        progress: 10,
                        value: "478400",
                    },
                    {
                        progress: 20,
                        value: "480800",
                    },
                    {
                        progress: 30,
                        value: "483200",
                    },
                    {
                        progress: 40,
                        value: "485600",
                    },
                    {
                        progress: 50,
                        value: "488000",
                    },
                    {
                        progress: 60,
                        value: "490400",
                    },
                    {
                        progress: 70,
                        value: "492800",
                    },
                    {
                        progress: 80,
                        value: "495200",
                    },
                    {
                        progress: 90,
                        value: "497600",
                    },
                    {
                        progress: 100,
                        value: "500000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 33250,
                },
                {
                    progress: 20,
                    value: 33250,
                },
                {
                    progress: 30,
                    value: 33250,
                },
                {
                    progress: 40,
                    value: 33250,
                },
                {
                    progress: 50,
                    value: 33250,
                },
                {
                    progress: 60,
                    value: 33250,
                },
                {
                    progress: 70,
                    value: 33250,
                },
                {
                    progress: 80,
                    value: 33250,
                },
                {
                    progress: 90,
                    value: 33250,
                },
                {
                    progress: 100,
                    value: 33250,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 17903,
                },
                {
                    progress: 20,
                    value: 17903,
                },
                {
                    progress: 30,
                    value: 17903,
                },
                {
                    progress: 40,
                    value: 17903,
                },
                {
                    progress: 50,
                    value: 17903,
                },
                {
                    progress: 60,
                    value: 17903,
                },
                {
                    progress: 70,
                    value: 17903,
                },
                {
                    progress: 80,
                    value: 17903,
                },
                {
                    progress: 90,
                    value: 17903,
                },
                {
                    progress: 100,
                    value: 17903,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 97646,
                },
                {
                    progress: 20,
                    value: 98240,
                },
                {
                    progress: 30,
                    value: 98834,
                },
                {
                    progress: 40,
                    value: 99428,
                },
                {
                    progress: 50,
                    value: 100022,
                },
                {
                    progress: 60,
                    value: 100616,
                },
                {
                    progress: 70,
                    value: 101210,
                },
                {
                    progress: 80,
                    value: 101804,
                },
                {
                    progress: 90,
                    value: 102398,
                },
                {
                    progress: 100,
                    value: 102992,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 2540000n,
                        stone: 52916n,
                        iron: 353333n,
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
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 49n,
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
        id: 401039,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 102992,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;500000|10;502400|20;504800|30;507200|40;509600|50;512000|60;514400|70;516800|80;519200|90;521600|100;524000",
                steps: [
                    {
                        progress: 0,
                        value: "500000",
                    },
                    {
                        progress: 10,
                        value: "502400",
                    },
                    {
                        progress: 20,
                        value: "504800",
                    },
                    {
                        progress: 30,
                        value: "507200",
                    },
                    {
                        progress: 40,
                        value: "509600",
                    },
                    {
                        progress: 50,
                        value: "512000",
                    },
                    {
                        progress: 60,
                        value: "514400",
                    },
                    {
                        progress: 70,
                        value: "516800",
                    },
                    {
                        progress: 80,
                        value: "519200",
                    },
                    {
                        progress: 90,
                        value: "521600",
                    },
                    {
                        progress: 100,
                        value: "524000",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
        upgrades: {
            constructionSeconds: [
                {
                    progress: 10,
                    value: 34440,
                },
                {
                    progress: 20,
                    value: 34440,
                },
                {
                    progress: 30,
                    value: 34440,
                },
                {
                    progress: 40,
                    value: 34440,
                },
                {
                    progress: 50,
                    value: 34440,
                },
                {
                    progress: 60,
                    value: 34440,
                },
                {
                    progress: 70,
                    value: 34440,
                },
                {
                    progress: 80,
                    value: 34440,
                },
                {
                    progress: 90,
                    value: 34440,
                },
                {
                    progress: 100,
                    value: 34440,
                },
            ],
            experience: [
                {
                    progress: 10,
                    value: 19354,
                },
                {
                    progress: 20,
                    value: 19354,
                },
                {
                    progress: 30,
                    value: 19354,
                },
                {
                    progress: 40,
                    value: 19354,
                },
                {
                    progress: 50,
                    value: 19354,
                },
                {
                    progress: 60,
                    value: 19354,
                },
                {
                    progress: 70,
                    value: 19354,
                },
                {
                    progress: 80,
                    value: 19354,
                },
                {
                    progress: 90,
                    value: 19354,
                },
                {
                    progress: 100,
                    value: 19354,
                },
            ],
            power: [
                {
                    progress: 10,
                    value: 103586,
                },
                {
                    progress: 20,
                    value: 104180,
                },
                {
                    progress: 30,
                    value: 104774,
                },
                {
                    progress: 40,
                    value: 105368,
                },
                {
                    progress: 50,
                    value: 105962,
                },
                {
                    progress: 60,
                    value: 106556,
                },
                {
                    progress: 70,
                    value: 107150,
                },
                {
                    progress: 80,
                    value: 107744,
                },
                {
                    progress: 90,
                    value: 108338,
                },
                {
                    progress: 100,
                    value: 108932,
                },
            ],
            costs: [
                {
                    progress: 10,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 20,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 30,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 40,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 50,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 60,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 70,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 80,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 90,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
                        food: 0n,
                    },
                },
                {
                    progress: 100,
                    value: {
                        wood: 2680000n,
                        stone: 55833n,
                        iron: 373333n,
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
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 20,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 30,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 40,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 50,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 60,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 70,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 80,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 90,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
                        },
                    ],
                },
                {
                    progress: 100,
                    value: [
                        {
                            itemId: 200065,
                            quantity: 52n,
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
        id: 401040,
        buildingId: 401000,
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
        demolitionSeconds: 286832,
        experience: 0,
        power: 108932,
        maxInstances: 1,
        clientParameters: [
            {
                value:
                    "0;524000|10;471600|20;419200|30;366800|40;314400|50;262001|60;209601|70;157201|80;104801|90;52401|100;2",
                steps: [
                    {
                        progress: 0,
                        value: "524000",
                    },
                    {
                        progress: 10,
                        value: "471600",
                    },
                    {
                        progress: 20,
                        value: "419200",
                    },
                    {
                        progress: 30,
                        value: "366800",
                    },
                    {
                        progress: 40,
                        value: "314400",
                    },
                    {
                        progress: 50,
                        value: "262001",
                    },
                    {
                        progress: 60,
                        value: "209601",
                    },
                    {
                        progress: 70,
                        value: "157201",
                    },
                    {
                        progress: 80,
                        value: "104801",
                    },
                    {
                        progress: 90,
                        value: "52401",
                    },
                    {
                        progress: 100,
                        value: "2",
                    },
                ],
            },
            {
                value: "10",
            },
            {
                value: "500",
            },
            {
                value: "0;3",
            },
            null,
            null,
        ],
    },
];
