export interface MonsterExchangeOffer
{
    reward: string;
    count: number;
    color: number;
}

export interface MonsterExchangeConfig
{
    id: string;
    token: string;
    interval: bigint;
    free: number;
    costs: readonly number[];
    gears: readonly (readonly (MonsterExchangeOffer & { weight: number; })[])[];
}

export interface MonsterExchangeHeader
{
    token: string;
    interval: bigint;
}
