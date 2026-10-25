import type { InventoryPlan, InventoryState } from "./inventory.ts";
import type { MutationCommand } from "./mutation.ts";
import type { Row } from "./rows.ts";

export interface ShopState {
  inventory: InventoryState;
  purchases: readonly Row[];
  stock: readonly Row[];
  now: number;
}
export interface ShopPurchase {
  id: string;
  count: number;
  daily: number;
  total: number;
  cycle: bigint;
}
export interface ShopPlan {
  inventory: InventoryPlan;
  purchase?: ShopPurchase;
}
export interface ShopRepository {
  read<T>(owner: string, select: (state: ShopState) => Promise<T>): Promise<T>;
  execute(
    input: MutationCommand,
    offer: string,
    plan: (state: ShopState) => Promise<ShopPlan>,
  ): Promise<Buffer>;
}
