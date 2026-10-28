import type { Row } from "./rows.ts";
import type { InventoryState } from "./inventory.ts";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

export interface MineHelper
{
    gUid: string;
    name: string;
    time: number;
}

export interface FriendshipMineTransaction
{
    mine: Row;
    binding: string;
    helpers: MineHelper[];
    save(mine: Row, helpers: MineHelper[]): Promise<void>;
}

export type FriendshipMineExecutor = (
    command: MutationCommand,
    plan: (inventory: InventoryState, store: FriendshipMineTransaction) => Promise<InventoryPlan>,
) => Promise<Buffer>;
