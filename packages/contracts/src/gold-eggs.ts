import type { Row } from "./rows";

export interface GoldEggsPeriod
{
    start: bigint;
    end: bigint;
}

export interface GoldEggsStanding
{
    uid: string;
    kingdomId: number;
    score: bigint;
    createdAt: bigint;
    name: string;
    pic: string;
    picVer: number;
    picfraId: number;
}

export interface GoldEggsPrize
{
    first: number;
    last: number;
    reward: string;
}

export interface GoldEggsCalendar extends GoldEggsPeriod
{
    kingdomId: number;
    admitted: boolean;
    global: boolean;
    localLimit: number;
    globalLimit: number;
    localPrizes: readonly GoldEggsPrize[];
    globalPrizes: readonly GoldEggsPrize[];
    localTemplate: string;
    globalTemplate: string;
}

export interface GoldEggsBoard extends GoldEggsPeriod
{
    finalizedAt: bigint;
    rows: readonly GoldEggsStanding[];
}

export interface GoldEggsAward
{
    rank: number;
    reward: string;
    template: string;
}

export interface GoldEggsReader
{
    prepare(calendar: GoldEggsCalendar): Promise<Row | undefined>;
    ranking(period: GoldEggsPeriod): Promise<readonly GoldEggsStanding[]>;
    award(period: GoldEggsPeriod, global: boolean): Promise<GoldEggsAward | undefined>;
}

export interface GoldEggsWrite
{
    record?: Row;
    period?: GoldEggsPeriod;
    award?: { period: GoldEggsPeriod; global: boolean; };
}

export interface GoldEggsRanks
{
    live(period: GoldEggsPeriod): Promise<readonly GoldEggsStanding[]>;
    final(period: GoldEggsPeriod): Promise<readonly GoldEggsStanding[] | undefined>;
}

export interface GoldEggsRuntimeStore
{
    advance(calendar: GoldEggsCalendar | undefined, now: bigint): Promise<void>;
    periods(): Promise<readonly GoldEggsCalendar[]>;
    finalizeGlobal(
        period: GoldEggsPeriod,
        rows: readonly GoldEggsStanding[],
        now: bigint,
    ): Promise<void>;
    pending(): Promise<readonly { owner: string; period: GoldEggsPeriod; global: boolean; }[]>;
}

export interface GoldEggsCell
{
    id: string;
    type: number;
    smashed: boolean;
}
