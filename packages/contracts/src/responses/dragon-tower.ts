import type { ResponseValue } from "./value";

export interface DragonTowerArmyResponse
{
    army: readonly { id: number; num: number; star: number; }[];
    deadarmy: readonly { id: number; num: number; star: number; }[];
    armyrevive: readonly { id: number; num: number; star: number; }[];
    armyrevivenum: number;
    armyrevivecd: bigint;
}

export interface DragonTowerUserResponse extends DragonTowerArmyResponse
{
    currentlayer: number;
    weeklymaxlayer: number;
    maxlayer: number;
    weeklyrevive: number;
    resettimes: number;
    dailyresettime: bigint;
    weeklyresettime: bigint;
    revivecost: number;
    generalid: string;
    dragon: string;
    score: number;
    rankmax: number;
    rankweekly: number;
    limitlayer: number;
    sharetimes: number;
}

export interface DragonTowerLayerResponse
{
    layer: number;
    layerindex: number;
    difficulty: number;
    monsters: string;
    buffs: string;
    buybuff: number;
    awards?: readonly ResponseValue[];
    awardstate: number;
    layerstate: number;
    fighttime: bigint;
}
