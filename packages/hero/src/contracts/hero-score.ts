import type { Row } from "@opencok/contracts/rows";

export interface HeroScoreAction
{
    type: number;
    parameter: string;
    count: bigint;
    at: bigint;
}

export interface HeroScoreSnapshot
{
    events: readonly Row[];
    scores: readonly Row[];
    contributions: readonly Row[];
    members: readonly string[];
    alliancePower: bigint;
}

export interface HeroScoreReader
{
    load(at: bigint): Promise<HeroScoreSnapshot>;
}

export interface HeroScoreWrite
{
    scores: readonly Row[];
    contributions: readonly Row[];
}
