import type {
    TimedActivity,
    PreparedActivity,
    ActivityAction,
} from "@opencok/base/contracts/activity";
export type {
    TimedActivity,
    PreparedActivity,
    ActivityAction,
} from "@opencok/base/contracts/activity";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { Row } from "./rows";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

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
