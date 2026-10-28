import type { Row } from "@opencok/contracts/rows";

export interface HeroRankCursor
{
    actId: string;
    member: string;
}

export interface HeroRankSourceRow
{
    event: Row;
    score: Row;
    metadata: string | null;
}

export interface HeroRankScore
{
    rankKey: string;
    member: string;
    kingdomId: number;
    actId: string;
    eventId: string;
    type: number;
    level: number;
    endTime: bigint;
    score: number;
    metadata: string | null;
}

export interface HeroRankVersionedScore extends HeroRankScore
{
    ownerEpoch: bigint;
    sequence: bigint;
    observedAt: bigint;
}

export interface HeroRankSource
{
    page(cursor: HeroRankCursor | undefined, now: bigint): Promise<readonly HeroRankSourceRow[]>;
}

export interface HeroRankProjection
{
    write(
        rows: readonly HeroRankScore[],
        observedAt: bigint,
    ): Promise<readonly HeroRankVersionedScore[]>;
}
