import type { CityProgressionPlan } from "@opencok/contracts/city-progression-plan";
import type { CityDomain } from "@opencok/contracts/city-domain";
import type { Rules } from "@opencok/rules/game";

export type ResearchContext = CityProgressionPlan<Rules>;
export type ResearchActivityDomain = CityDomain<ResearchContext>;

export interface ResearchCompletionHooks
{
    target(context: ResearchContext, type: number, count: number): void;
    expedition(context: ResearchContext, type: 3, parameter: number, count: number): void;
}
