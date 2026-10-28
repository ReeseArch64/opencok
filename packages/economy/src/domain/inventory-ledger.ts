import { randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { MutationEvent, EconomyPosting } from "@opencok/ledger/contracts/mutation";
import type { InventoryLedgerState } from "../contracts/inventory-ledger.ts";
import type { InventoryCatalogs } from "../contracts/inventory-catalogs.ts";
import type { InventoryItem } from "../contracts/inventory.ts";
import type { InventoryCommandResponse } from "../contracts/responses/inventory.ts";
import type { ActivityLedger } from "../contracts/activity-ledger.ts";
import { inventoryCount, inventoryInteger, inventoryGoods } from "../rules/inventory.ts";

export class InventoryLedger<
    State extends InventoryLedgerState = InventoryLedgerState,
    Catalogs extends InventoryCatalogs = InventoryCatalogs,
> implements ActivityLedger
{
    readonly domainEvents: MutationEvent[] = [];
    readonly items: InventoryItem[];
    readonly changed = new Map<string, InventoryItem>();
    readonly postings: EconomyPosting[] = [];

    post(asset: string, before: bigint, after: bigint, reason: string)
    {
        this.postings.push({
            account: String(this.state.profile["uid"] ?? ""),
            asset,
            before,
            after,
            reason,
        });
    }

    readonly profile: Record<string, bigint> = {};
    readonly assets: Record<string, bigint> = {};
    readonly resources: Record<string, bigint> = {};
    readonly cooldowns = new Map<string, bigint>();
    readonly pushes: InventoryCommandResponse["pushes"] = [];
    campaignPostingCursor = 0;

    constructor(
        readonly state: State,
        readonly rules: Catalogs,
        readonly now: number,
    )
    {
        if (!Number.isSafeInteger(now) || now < 0)
        {
            throw new Error("Invalid inventory clock");
        }

        this.items = state.items.map((item) => ({ ...item }));
    }

    valid(item: InventoryItem)
    {
        return item.vanishTime === 0n || item.vanishTime > BigInt(this.now);
    }

    own(uuid: string)
    {
        const item = this.items.find((item) => item.uuid === uuid);

        if (!item || !this.valid(item))
        {
            throw new GameError("E100166");
        }

        return item;
    }

    add(itemId: string, count: number, value = 0)
    {
        const rule = inventoryGoods(this.rules, itemId);
        inventoryCount(count);
        let item = rule.overlap === "1"
            ? undefined
            : this.items.find(
                (item) => item.itemId === itemId && item.value === value && this.valid(item),
            );

        if (!item)
        {
            item = { uuid: randomUUID(), itemId, count: 0, value, vanishTime: 0n };
            this.items.push(item);
        }

        const next = inventoryCount(item.count + count);
        this.post(`item.${item.uuid}`, BigInt(item.count), BigInt(next), "inventory.grant");
        item.count = next;

        if (rule.time_type === "1" && rule.vanishTime)
        {
            item.vanishTime = BigInt(this.now) + BigInt(inventoryInteger(rule.vanishTime)) * 60000n;
        }

        this.changed.set(item.uuid, item);

        return item;
    }

    take(item: InventoryItem, count: number)
    {
        inventoryCount(count);

        if (!this.valid(item) || item.count < count)
        {
            throw new GameError("E100165");
        }

        this.post(
            `item.${item.uuid}`,
            BigInt(item.count),
            BigInt(item.count - count),
            "inventory.consume",
        );
        item.count -= count;
        this.changed.set(item.uuid, item);
    }

    spendItems(id: string, count: number)
    {
        inventoryCount(count);

        for (const item of this.items)
        {
            if (item.itemId !== id || item.value !== 0 || !this.valid(item) || item.count <= 0)
            {
                continue;
            }

            const take = Math.min(count, item.count);
            this.take(item, take);
            count -= take;

            if (!count)
            {
                return;
            }
        }

        throw new GameError("E100165");
    }

    pools()
    {
        return String(this.state.profile["pf"] ?? "") === "dmm"
            ? ["dmmGold", "dmmPaidSpecialGold", "dmmPaidGold"]
            : ["gold", "paidSpecialGold", "paidGold"];
    }

    balance(key: string)
    {
        return this.profile[key] ?? BigInt(String(this.state.profile[key] ?? 0));
    }

    resourceBalance(asset: string)
    {
        return BigInt(String(this.state.resource[asset] ?? 0));
    }

    assetBalance(asset: string)
    {
        return BigInt(String((this.state.assets ?? {})[asset] ?? 0));
    }

    total()
    {
        const total = this.pools().reduce((sum, key) => sum + this.balance(key), 0n);

        if (total < 0n || total > 9223372036854775807n)
        {
            throw new GameError(errors.invalid);
        }

        return total;
    }
}
