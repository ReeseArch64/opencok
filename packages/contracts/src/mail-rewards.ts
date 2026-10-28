import type { InventoryState } from "./inventory.ts";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { Row } from "./rows.ts";

export interface MailRewardSelection
{
    ids: readonly string[];
    labels: readonly number[];
    batch: boolean;
}

export type MailRewardExecutor = (
    input: MutationCommand,
    selection: MailRewardSelection,
    grant: (state: InventoryState, entry: Row, now: number) => Promise<InventoryPlan>,
    combine: (responses: readonly Buffer[], ids: readonly string[]) => Buffer,
) => Promise<Buffer>;

export interface MailRewardEntry
{
    category: string;
    itemId: string;
    count: number;
}
