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
  data?: unknown;
}
export interface PreparedActivity {
  pushes?: readonly { command: string; body: Uint8Array }[];
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
export type ActivityAction = "start" | "restore" | "finish" | "cancel" | "reschedule";
import type { InventoryState, InventoryPlan } from "./inventory";

export interface ActivityEconomy {
  takeItemGrants?(): readonly { itemId: string; count: number }[];
  push?(command: string, body: Uint8Array): void;
  gold(delta: bigint): void;
  winPoints?(delta: bigint): void;
  civilizationScore?(delta: bigint): void;
  balance?(asset: string): bigint;
  quantity?(itemId: string): number;
  itemState?(itemId: string): import("./inventory").InventoryItem | undefined;
  consumeItem?(uuid: string, count: number): void;
  ownedItem?(uuid: string): { itemId: string; count: number };
  resource(
    asset:
      | "wood"
      | "stone"
      | "iron"
      | "food"
      | "silver"
      | "woodbind"
      | "stonebind"
      | "ironbind"
      | "foodbind"
      | "chip"
      | "diamond"
      | "dragon_food"
      | "dragon_gold",
    delta: bigint,
  ): void;
  item(itemId: string, delta: number): void;
}
export interface ActivityState extends InventoryState {
  accelerate?(activity: TimedActivity, remaining: bigint, economy: ActivityEconomy): Promise<void>;
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
