import type { TimedActivity } from "@opencok/base/contracts/activity";
import type { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand, MutationResult } from "@opencok/ledger/contracts/mutation";
import type { AllianceTransaction } from "./persistence";
import type { AllianceContextState } from "./context-state";
import type { AllianceRecordReaders } from "./readers";

export type AllianceActivityRescheduler = (
    tx: AllianceTransaction,
    action: `${TimedActivityAction.Reschedule}`,
    activity: TimedActivity,
    now: bigint,
    economy: ActivityEconomy,
) => Promise<Uint8Array>;

export interface AllianceCommitRuntime extends Pick<AllianceRecordReaders, "text" | "long">
{
    readonly domains: ReadonlyMap<number, AllianceActivityRescheduler>;
    boundary(
        tx: AllianceTransaction,
        owner: string,
        now: bigint,
        change: () => Promise<void>,
        deleted: readonly string[],
        economy: ActivityEconomy,
    ): Promise<void>;
    recordAction?(
        tx: AllianceTransaction,
        owner: string,
        kind: string,
        count: number,
        now: bigint,
    ): Promise<void>;
}

export interface AllianceGameplayRuntime<TInventory extends AllianceContextState["inventory"]>
{
    readonly kingdomId: number;
    now(): number;
    execute(
        input: MutationCommand,
        apply: (tx: AllianceTransaction) => Promise<MutationResult>,
    ): Promise<Buffer>;
    executeInventory(
        tx: AllianceTransaction,
        owner: string,
        plan: (inventory: TInventory) => Promise<InventoryPlan>,
        reason: string,
    ): Promise<MutationResult>;
}
