import type { InventoryPlan, InventoryState } from "./inventory.ts";
import type { MutationCommand } from "./mutation.ts";
import type { Row } from "./rows.ts";

export interface MailRewardSelection {
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

export interface MailRewardEntry {
  category: string;
  itemId: string;
  count: number;
}
