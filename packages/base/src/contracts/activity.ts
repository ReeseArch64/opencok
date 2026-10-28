import type { TimedActivityAction } from "@opencok/enums/timed-activity-action";

export interface TimedActivity
{
    id: string;
    ownerId: string;
    queueId: string;
    type: number;
    itemId: string;
    startedAt: bigint;
    dueAt: bigint;
    version: number;
    status: number;
    data?: unknown;
}

export interface PreparedActivity
{
    pushes?: readonly { command: string; body: Uint8Array; }[];
    queueItemId?: string;
    startedAt?: bigint;
    type?: number;
    ready?: boolean;
    itemId?: string;
    durationMs?: bigint;
    data?: unknown;
    response: Uint8Array;
    item?: Uint8Array;
    event?: Uint8Array | null;
    responseKind?: "queue" | "nested";
}

export type ActivityAction = `${TimedActivityAction}`;
