import type { Row } from "@opencok/contracts/rows";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";

export interface ProductionRate
{
    at: bigint;
    perHour: bigint;
    capacity: bigint;
}

export interface ProductionAccount
{
    buildingId: string;
    ownerId: string;
    asset: string;
    settledAt: bigint;
    amount: bigint;
    remainder: bigint;
    rates: readonly ProductionRate[];
}

export interface ProductionState extends InventoryState
{
    now: bigint;
    accounts: readonly ProductionAccount[];
    rates(building: Row, from: bigint): Promise<readonly ProductionRate[]>;
}

export interface ProductionPlan extends InventoryPlan
{
    accounts: readonly ProductionAccount[];
    buildings: readonly Row[];
}

export type ProductionExecutor = (
    command: MutationCommand,
    plan: (state: ProductionState) => Promise<ProductionPlan>,
) => Promise<Buffer>;
