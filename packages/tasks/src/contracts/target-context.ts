import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { QuestRecord, QuestRule } from "./records";
import type { QuestWrite } from "./progression";
import type { TargetTaskState, TargetTaskWrite } from "./target-task";

export interface TargetTaskCatalog
{
    readonly kingdomId: number;
    readonly items: ReadonlyMap<string, QuestRule>;
    readonly mail: ReadonlyMap<string, QuestRule>;
    readonly advanced: { readonly targetTasks?: ReadonlyMap<string, QuestRule>; };
}

export interface TargetTaskContext<TCatalog extends TargetTaskCatalog>
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: {
        readonly targetTask?: TargetTaskState;
        readonly buildings: readonly QuestRecord[];
    };
    readonly write: { targetTask?: TargetTaskWrite; quests?: QuestWrite; };
    readonly economy: ActivityEconomy;
}
