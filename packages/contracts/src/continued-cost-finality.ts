import type { CostRankingPeriod, CostRankingScore } from "./continued-cost-ranking";
import type { Row } from "./rows";

export interface CostRankingSeal
{
    periodId: string;
    snapshot: string;
    digest: string;
    scoreCount: number;
    phase: number;
    createdAt: bigint;
    finalizedAt: bigint;
}

export interface CostFinalityOwned
{
    seal(period: CostRankingPeriod, now: bigint): Promise<CostRankingSeal | undefined>;
    acknowledge(period: CostRankingPeriod, finalizedAt: bigint): Promise<void>;
}

export interface CostFinalityShared
{
    candidates(cursor: string | undefined, now: bigint): Promise<readonly CostRankingPeriod[]>;
    prove(period: CostRankingPeriod, seal: CostRankingSeal, now: bigint): Promise<void>;
    finalize(period: CostRankingPeriod, now: bigint): Promise<bigint | undefined>;
    standings(id: string): Promise<readonly Row[] | undefined>;
}

export interface CostRankingProof
{
    digest: string;
    scoreCount: number;
}

export type CostFrozenScore = Omit<CostRankingScore, "score" | "paid" | "free" | "lastAt"> & {
    score: string;
    paid: string;
    free: string;
    lastAt: string;
};
