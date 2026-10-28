import type { ActivityDispatchResult } from "../enums/dispatch-result";
import type { DeadlineOperation } from "../enums/deadline-operation";

export interface DueActivitySnapshot
{
    id: string;
    ownerId: string;
    queueId: string;
    type: number;
    dueAt: bigint;
    version: number;
}

export interface LegacyActivitySnapshot
{
    uuid: string;
    ownerId: string;
    type: number;
    itemId: string;
    startTime: bigint | null;
    updateTime: bigint;
}

export interface ActivityDeadlineDispatcher
{
    capabilities(): Promise<readonly number[]>;
    restore(snapshot: LegacyActivitySnapshot): Promise<ActivityDispatchResult>;
    finish(snapshot: DueActivitySnapshot): Promise<ActivityDispatchResult>;
}

export interface DeadlineEnvelope
{
    contractVersion: 1;
    kingdomId: number;
    requestId: string;
}

export type DeadlineRequest =
    & DeadlineEnvelope
    & (
        | { operation: DeadlineOperation.Capabilities; }
        | { operation: DeadlineOperation.Restore; snapshot: LegacyActivitySnapshot; }
        | { operation: DeadlineOperation.Finish; snapshot: DueActivitySnapshot; }
    );

export type DeadlineResponse =
    & DeadlineEnvelope
    & (
        | { operation: DeadlineOperation.Capabilities; types: readonly number[]; }
        | {
            operation: DeadlineOperation.Restore | DeadlineOperation.Finish;
            result: ActivityDispatchResult;
        }
    );

export const activityDeadlinePath = "/_internal/activity-deadlines";
