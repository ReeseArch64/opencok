import type { MonarchDefinition } from "../types/monarch.ts";

export const records: readonly MonarchDefinition[] = [
    {
        "id": 20203001,
        "type": 1,
        "serverId": 8810,
        "gameServers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        "condition": "1;30-36",
        "buffEffect": [1010, 1030],
        "buffNum": [30, 40],
        "burnSpeed": [100, 200, 300, 400, 500],
        "burnTime": 600,
        "rewardMail": [12294, 12295, 12296],
        "awardRewardMail": [12312, 12313],
        "awardNum": [4, 5],
        "superarmyItem": "1-3;0|4-5;300",
        "superarmyItemGoods": 200020,
        "palaceValue": 50000000,
    },
];
