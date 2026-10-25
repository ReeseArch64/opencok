import type { Row } from "./rows";
import type { MutationCommand } from "./mutation";

export interface TimedActivity {
  id: string;
  ownerId: string;
  queueId: string;
  type: number;
  itemId: string;
  startedAt: bigint;
  dueAt: bigint;
  version: number;
  status: number;
}
export type ActivityAction = "start" | "restore" | "finish" | "cancel" | "reschedule";
import type { InventoryState, InventoryPlan } from "./inventory";

export interface ActivityEconomy {
  gold(delta: bigint): void;
  resource(asset: "wood" | "stone" | "iron" | "food" | "silver", delta: bigint): void;
  item(itemId: string, delta: number): void;
}
export interface ActivityState extends InventoryState {
  now: bigint;
  queues: readonly Row[];
  activities: readonly TimedActivity[];
  apply(
    action: ActivityAction,
    activity: TimedActivity,
    economy: ActivityEconomy,
  ): Promise<Uint8Array>;
}
export interface ActivityPlan extends InventoryPlan {
  guideStep?: string;
  queues: readonly Row[];
  activities: readonly TimedActivity[];
}
export type ActivityExecutor = (
  command: MutationCommand,
  plan: (state: ActivityState) => Promise<ActivityPlan>,
) => Promise<Buffer>;
export interface ProductionRate {
  at: bigint;
  perHour: bigint;
  capacity: bigint;
}
export interface ProductionAccount {
  buildingId: string;
  ownerId: string;
  asset: string;
  settledAt: bigint;
  amount: bigint;
  remainder: bigint;
  rates: readonly ProductionRate[];
}
export interface ProductionState extends InventoryState {
  now: bigint;
  accounts: readonly ProductionAccount[];
  rates(building: Row, from: bigint): Promise<readonly ProductionRate[]>;
}
export interface ProductionPlan extends InventoryPlan {
  accounts: readonly ProductionAccount[];
  buildings: readonly Row[];
}
export type ProductionExecutor = (
  command: MutationCommand,
  plan: (state: ProductionState) => Promise<ProductionPlan>,
) => Promise<Buffer>;
