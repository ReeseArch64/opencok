import type { ResponseValue } from "./value";

export interface FragmentExchangeOfferResponse
{
    id: readonly string[];
    type: number;
    same: number;
    reward: readonly ResponseValue[];
    multiple: number;
    allReward?: readonly (readonly ResponseValue[])[];
}

export interface FragmentExchangeResponse
{
    info: readonly FragmentExchangeOfferResponse[];
    exchangeId: string;
    refresh: number;
    freeNum: number;
    refreshCost: number;
    actId?: string;
}
