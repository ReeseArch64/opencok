import type { CityProgressionPlan } from "@opencok/contracts/city-progression-plan";
import type { CityDomain } from "@opencok/contracts/city-domain";
import type { Rules } from "@opencok/rules/game";

export type TroopsContext = CityProgressionPlan<Rules>;
export type TroopsActivityDomain = CityDomain<TroopsContext>;

export interface TroopsCompletionHooks
{
    target(context: TroopsContext, type: 2, count: number, condition: string): void;
    expedition(context: TroopsContext, type: 3 | 5, parameter: number, count: number): void;
}
