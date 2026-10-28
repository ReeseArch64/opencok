import type { ResponseValue } from "@opencok/messages/contracts/response-value";

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
