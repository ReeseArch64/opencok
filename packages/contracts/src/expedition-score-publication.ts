import type { Row } from "./rows";

export interface ExpeditionScoreCursor
{
    periodId: string;
    stage: number;
    member: string;
}

export interface ExpeditionPublishedScore
{
    periodId: string;
    stage: number;
    member: string;
    kingdomId: number;
    opponent: number;
    allianceId: string;
    score: number;
    metadata: string | null;
    endTime: bigint;
}

export interface ExpeditionScoreVersion
{
    kingdomId: number;
    ownerEpoch: bigint;
    sequence: bigint;
}

export interface ExpeditionScoreSource
{
    page(
        cursor: ExpeditionScoreCursor | undefined,
        now: bigint,
    ): Promise<readonly ExpeditionPublishedScore[]>;
    clock(): Promise<Row | undefined>;
}

export interface ExpeditionScoreProjection
{
    write(rows: readonly ExpeditionPublishedScore[], now: bigint): Promise<ExpeditionScoreVersion>;
}

export interface ExpeditionLiveView
{
    periodId: string;
    stage: number;
    kingdomId: number;
    opponent: number;
    member: string;
    allianceId: string;
    startTime: bigint;
    endTime: bigint;
}

export interface ExpeditionLiveTotals
{
    rank: number;
    allianceScore: number;
    ownScore: number;
    otherScore: number;
}

export interface ExpeditionLiveSource
{
    owned(owner: string, now: bigint): Promise<ExpeditionLiveView | undefined>;
    shared(view: ExpeditionLiveView): Promise<ExpeditionLiveTotals | undefined>;
}

export interface ExpeditionDiscoveryPublication
{
    key: string;
    value: string;
    ownerEpoch: string;
    sequence: string;
    expiresAt: string;
}
