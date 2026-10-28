import type { Row } from "./rows";

export interface ContinuedCostTier
{
    level: number;
    point: bigint;
    reward: string;
    important: string;
}

export interface ContinuedCostPeriod
{
    start: bigint;
    end: bigint;
    type: number;
    face: string;
    tiers: readonly ContinuedCostTier[];
}

export interface ContinuedCostSpending extends ContinuedCostPeriod
{
    owner: string;
    at: bigint;
    amount: bigint;
    paid: bigint;
    free: bigint;
}

export interface ContinuedCostReader
{
    load(type: number, start: bigint): Promise<Row | undefined>;
}
