import type { Row } from "@opencok/contracts/rows";

export interface GeneralRankingWeights
{
    normal: number;
    silver: number;
    gold: number;
    periodStart?: bigint;
}

export interface GeneralRoster
{
    wheel?: Row;
    wheelRanks?: readonly Row[];
    tavern?: Row;
    prisoners?: readonly Row[];
    marches?: readonly Row[];
    drawHistory?: readonly Buffer[];
    generals: readonly Row[];
    purchases: readonly Row[];
    offices: readonly Row[];
    skills: readonly Row[];
    statuses: readonly Row[];
}

export interface GeneralWrite
{
    wheel?: Row;
    tavern?: Row;
    legacy?: readonly Row[];
    deletedLegacy?: readonly string[];
    prisoners?: readonly Row[];
    worldResources?: readonly { pointId: number; type: number; level: number; amount: number; }[];
    turntableAt?: bigint;
    refinementPeriod?: { count: number; time: bigint; };
    deletedStatuses?: readonly { generalId: number; stateId: number; }[];
    accelerations?: readonly { type: number; queueId: string; milliseconds: bigint; }[];
    generals?: readonly Row[];
    purchases?: readonly Row[];
    offices?: readonly Row[];
    skills?: readonly Row[];
    statuses?: readonly Row[];
}

export interface GeneralSkill
{
    id: string;
    points: number;
}
