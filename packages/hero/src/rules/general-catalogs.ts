import type { Rule } from "@opencok/rules/game";

export interface GeneralCatalogs
{
    levels?: Map<string, Rule>;
    stations?: Map<string, Rule>;
    unlocks?: Map<string, Rule>;
    draws?: Map<string, Rule>;
    wheels?: Map<string, Rule>;
    refinementValues?: readonly Rule[];
    refinementLimits?: readonly Rule[];
    refinementRepeats?: readonly Rule[];
    recruits?: Map<string, Rule>;
    tavernRewards?: Map<string, Rule>;
}
