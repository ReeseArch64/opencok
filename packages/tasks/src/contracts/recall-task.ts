import type { QuestRecord as Row } from "./records";

export interface RecallTaskState
{
    notes?: Row;
    tasks: readonly Row[];
    country: string;
}

export interface RecallTaskWrite
{
    notes?: Row;
    tasks?: readonly Row[];
    reset?: boolean;
}
