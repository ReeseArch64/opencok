import type { QuestRecord, QuestRule } from "./records";
import type { RecallTaskState, RecallTaskWrite } from "./recall-task";

export interface RecallTaskCatalog
{
    readonly kingdomId: number;
    readonly advanced: {
        readonly recallTasks?: ReadonlyMap<string, QuestRule>;
        readonly recallActivities?: ReadonlyMap<string, QuestRule>;
    };
    readonly power: { readonly statuses?: ReadonlyMap<string, unknown>; };
}

export interface RecallTaskContext<TCatalog extends RecallTaskCatalog>
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: {
        readonly profile: QuestRecord;
        readonly buildings: readonly QuestRecord[];
        readonly recallTask?: RecallTaskState;
    };
    readonly write: { recallTask?: RecallTaskWrite; };
}
