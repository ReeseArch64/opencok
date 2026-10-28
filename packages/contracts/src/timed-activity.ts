import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { Row } from "./rows";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
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

import type { InventoryState } from "./inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";

export interface ActivityState extends InventoryState
{
    accelerate?(
        activity: TimedActivity,
        remaining: bigint,
        economy: ActivityEconomy,
    ): Promise<void>;
    now: bigint;
    queues: readonly Row[];
    activities: readonly TimedActivity[];
    next?(activity: TimedActivity, economy: ActivityEconomy): Promise<PreparedActivity | undefined>;
    prepare?(
        command: string,
        params: Uint8Array,
        economy: ActivityEconomy,
    ): Promise<PreparedActivity>;
    apply(
        action: ActivityAction,
        activity: TimedActivity,
        economy: ActivityEconomy,
    ): Promise<Uint8Array>;
}

export interface ActivityPlan extends InventoryPlan
{
    guideStep?: string;
    queues: readonly Row[];
    activities: readonly TimedActivity[];
}

export type ActivityExecutor = (
    command: MutationCommand,
    plan: (state: ActivityState) => Promise<ActivityPlan>,
) => Promise<Buffer>;
