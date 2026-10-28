import type { MutationEvent } from "@opencok/ledger/contracts/mutation";
import type { InventoryItem } from "./inventory";

export interface ActivityEconomy
{
    event?(event: MutationEvent): void;
    takeItemGrants?(): readonly { itemId: string; count: number; }[];
    push?(command: string, body: Uint8Array): void;
    gold(delta: bigint): void;
    crystal?(delta: bigint): void;
    winPoints?(delta: bigint): void;
    civilizationScore?(delta: bigint): void;
    balance?(asset: string): bigint;
    quantity?(itemId: string): number;
    itemState?(itemId: string): InventoryItem | undefined;
    consumeItem?(uuid: string, count: number): void;
    ownedItem?(uuid: string): { itemId: string; count: number; };
    resource(
        asset:
            | "wood"
            | "stone"
            | "iron"
            | "food"
            | "silver"
            | "woodbind"
            | "stonebind"
            | "ironbind"
            | "foodbind"
            | "chip"
            | "diamond"
            | "dragon_food"
            | "dragon_gold"
            | "sandstone"
            | "diamondstone"
            | "marble"
            | "granite"
            | "limestone",
        delta: bigint,
    ): void;
    item(itemId: string, delta: number): void;
}
