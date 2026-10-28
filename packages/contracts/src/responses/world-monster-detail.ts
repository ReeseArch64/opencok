import type { ResponseValue } from "./value.ts";

export interface WorldMonsterHealthResponse
{
    readonly mchp?: number;
    readonly mmhp?: number;
}

export interface WorldMonsterExplorationResponse
{
    readonly erp?: ResponseValue[];
    readonly st?: bigint;
    readonly et?: bigint;
}
