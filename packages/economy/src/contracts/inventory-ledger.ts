import type { InventoryItem } from "./inventory.ts";

export type InventorySnapshotRow = Record<string, string | number | bigint | Buffer | null>;

export interface InventoryLedgerState
{
    assets?: InventorySnapshotRow;
    profile: InventorySnapshotRow;
    resource: InventorySnapshotRow;
    items: readonly InventoryItem[];
}
