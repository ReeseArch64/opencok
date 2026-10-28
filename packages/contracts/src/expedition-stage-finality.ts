import type { Row } from "./rows";
import type { ExpeditionPublishedScore } from "./expedition-score-publication";

export interface ExpeditionStagePeriod
{
    periodId: string;
    stage: number;
    kingdomId: number;
    opponent: number;
    startTime: bigint;
    endTime: bigint;
    activityEnd: bigint;
}

export interface ExpeditionStageRealm
{
    candidates(now: bigint): Promise<readonly ExpeditionStagePeriod[]>;
    seal(period: ExpeditionStagePeriod, now: bigint): Promise<Row | undefined>;
    page(closure: Row): Promise<readonly ExpeditionPublishedScore[]>;
    advance(closure: Row, cursor: string, processed: bigint): Promise<void>;
    reset(closure: Row): Promise<void>;
    completed(closure: Row): Promise<void>;
    finished(closure: Row, winner: number, now: bigint): Promise<void>;
}

export interface ExpeditionStageRegistry
{
    verify(period: ExpeditionStagePeriod): Promise<boolean>;
    begin(period: ExpeditionStagePeriod, closure: Row, now: bigint): Promise<void>;
    append(
        period: ExpeditionStagePeriod,
        closure: Row,
        rows: readonly ExpeditionPublishedScore[],
        now: bigint,
    ): Promise<void>;
    complete(period: ExpeditionStagePeriod, closure: Row, now: bigint): Promise<boolean>;
    finalize(period: ExpeditionStagePeriod, now: bigint): Promise<number | undefined>;
}
