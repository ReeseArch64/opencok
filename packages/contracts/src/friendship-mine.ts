import type { Row } from "./rows.ts";
import type { InventoryState, InventoryPlan } from "./inventory.ts";
import type { MutationCommand } from "./mutation.ts";

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
