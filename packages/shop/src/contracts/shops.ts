import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { Row } from "@opencok/contracts/rows";

export interface ShopState
{
    inventory: InventoryState;
    purchases: readonly Row[];
    stock: readonly Row[];
    now: number;
}

export interface ShopPurchase
{
    saleType?: string;
    id: string;
    count: number;
    daily: number;
    total: number;
    cycle: bigint;
}

export interface ShopPlan
{
    inventory: InventoryPlan;
    purchase?: ShopPurchase;
}

export interface ShopRepository
{
    read<T>(owner: string, select: (state: ShopState) => Promise<T>): Promise<T>;
    execute(
        input: MutationCommand,
        offer: string,
        plan: (state: ShopState) => Promise<ShopPlan>,
    ): Promise<Buffer>;
}
