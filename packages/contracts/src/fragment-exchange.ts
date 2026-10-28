export interface FragmentExchangeOffer
{
    id: readonly string[];
    type: number;
    same: number;
    reward: string;
    multiple: number;
}

export interface FragmentExchangeRecipe
{
    type: number;
    same: number;
    rate: number;
    pool: readonly string[];
    rewards: readonly string[];
    weights: readonly number[];
    multiple: number;
}
