import type { EconomyPosting, MutationEvent } from "@opencok/ledger/contracts/mutation";
import type { InventoryItem, InventoryFields } from "./inventory";

export interface ActivityLedger
{
    readonly domainEvents: MutationEvent[];
    readonly pushes: { command: string; body: InventoryFields; }[];
    readonly items: readonly InventoryItem[];
    readonly postings: readonly EconomyPosting[];
    campaignPostingCursor: number;
    readonly profile: Record<string, bigint>;
    readonly assets: Record<string, bigint>;
    readonly resources: Record<string, bigint>;
    resourceBalance(asset: string): bigint;
    assetBalance(asset: string): bigint;
    pools(): readonly string[];
    balance(key: string): bigint;
    total(): bigint;
    post(asset: string, before: bigint, after: bigint, reason: string): void;
    own(uuid: string): InventoryItem;
    valid(item: InventoryItem): boolean;
    take(item: InventoryItem, count: number): void;
    spendItems(itemId: string, count: number): void;
    add(itemId: string, count: number): void;
}
