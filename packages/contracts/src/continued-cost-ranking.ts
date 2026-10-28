import type { Row } from "./rows";

export interface CostRankingPeriod
{
    id: string;
    startTime: bigint;
    endTime: bigint;
    type: number;
    rewards: string;
    expectedRealms: readonly number[];
}

export interface CostRankingScore
{
    uid: string;
    score: bigint;
    paid: bigint;
    free: bigint;
    lastAt: bigint;
    metadata: string;
}

export interface CostRankingFacts
{
    ingest(now: bigint): Promise<number>;
    periods(cursor: string | undefined): Promise<readonly Row[]>;
    top(period: CostRankingPeriod): Promise<readonly CostRankingScore[]>;
}

export interface CostRankingRegistry
{
    register(period: CostRankingPeriod, now: bigint): Promise<CostRankingPeriod>;
    get(id: string): Promise<CostRankingPeriod | undefined>;
    write(period: CostRankingPeriod, rows: readonly CostRankingScore[], now: bigint): Promise<void>;
    board(id: string): Promise<readonly string[] | undefined>;
}

export type CostNicknameBalanceKey =
    | "gold"
    | "paidGold"
    | "paidSpecialGold"
    | "dmmGold"
    | "dmmPaidGold"
    | "dmmPaidSpecialGold";

export type CostNicknamePaymentDecoder = (
    record: { payment: string; responseGold: bigint | null; state: string; },
) => { kind: "item"; } | {
    kind: "gold";
    pendingEvent?: { id: string; type: string; payload: string; };
    before: Readonly<Record<CostNicknameBalanceKey, string>>;
    after: Readonly<Record<CostNicknameBalanceKey, string>>;
};
