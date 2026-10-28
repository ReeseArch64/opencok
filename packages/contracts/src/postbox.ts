import type { Row } from "./rows.ts";
import type { InventoryState, InventoryPlan } from "./inventory.ts";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

export interface PostboxTransaction
{
    mixed: Row;
    takeBox(): Promise<Row | null>;
    putBox(row: Row): Promise<void>;
    relation(id: string): Promise<Row | null>;
    relations(ids: string[]): Promise<Row[]>;
    saveRelation(row: Row): Promise<void>;
    unread(): Promise<Row[]>;
    mails(ids: string[]): Promise<Row[]>;
    putMail(row: Row): Promise<void>;
    removeMails(ids: string[]): Promise<void>;
    updateMixed(values: Row): Promise<void>;
    grantSeal(id: string, expiresAt: bigint): Promise<void>;
}

export type PostboxExecutor = (
    command: MutationCommand,
    plan: (inventory: InventoryState, store: PostboxTransaction) => Promise<InventoryPlan>,
) => Promise<Buffer>;
