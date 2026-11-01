import { randomUUID } from "node:crypto";
import type { ShopRepository, ShopState } from "@opencok/shop/contracts/shops";
import type { InventoryCommandResponse } from "@opencok/economy/contracts/responses/inventory";
import { long, text } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, encode, str, int, Type, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { shopAvailable, shopInteger, shopLimit, shopPrice } from "@opencok/shop/rules/shops";
import { inventoryCount } from "@opencok/economy/rules/inventory";
import { shopOffer } from "@opencok/shop/mappings/shops";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import {
    inventoryResponse,
    inventoryReplay,
    inventoryEvent,
} from "@opencok/economy/mappings/inventory";
import type { InventoryGrantPlanner } from "../contracts/inventory-grant-planner";

export class ShopService
{
    constructor(
        readonly repository: ShopRepository,
        readonly rules: Rules,
        readonly planInventoryGrants: InventoryGrantPlanner,
    )
    {}

    async command(owner: string, command: string, params: Fields): Promise<InventoryCommandResponse>
    {
        if (["mall.info", "mall.info.type", "mall.data"].includes(command))
        {
            let category = command === "mall.info"
                ? undefined
                : command === "mall.data"
                ? str(params, "mallId", "")
                : str(params, "type", "");

            if (category !== undefined)
            {
                if (!category.trim())
                {
                    return { body: {}, pushes: [] };
                }

                if (
                    !/^[+-]?\d+$/.test(category)
                    || !Number.isSafeInteger(Number(category))
                    || Math.abs(Number(category)) > 2147483647
                )
                {
                    throw new GameError(errors.invalid);
                }

                category = String(Number(category));

                if (![...this.rules.shops.values()].some((rule) => rule.sale_type === category))
                {
                    return { body: {}, pushes: [] };
                }
            }

            return this.repository.read(owner, async (state) => ({
                body: this.catalog(state, category),
                pushes: [],
            }));
        }

        if (command !== "shoppingMall.buy")
        {
            throw new GameError(errors.unsupported);
        }

        const id = str(params, "id");

        if (!id || id.length > 40 || id.includes("\0") || !id.isWellFormed())
        {
            throw new GameError(errors.invalid);
        }

        const count = inventoryCount(int(params, "num"));

        if (str(params, "discountItem", ""))
        {
            throw new GameError(errors.unsupported);
        }

        const operation = params.operationId;

        if (
            operation
            && (operation.type !== Type.String
                || typeof operation.value !== "string"
                || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                    .test(
                        operation.value,
                    ))
        )
        {
            throw new GameError(errors.invalid);
        }

        const requestId = operation ? (operation.value as string).toLowerCase() : randomUUID();
        const request = encode({ id: sfs.string(id), num: sfs.int(count) });
        const response = await this.repository.execute(
            { owner, command, requestId, request },
            id,
            async (state) => {
                const rule = this.rules.shops.get(id);

                if (!rule || !shopAvailable(rule, state, this.rules))
                {
                    throw new GameError(errors.unsupported);
                }

                const counters = shopLimit(rule, state, count);
                const { gold, crystalGold } = shopPrice(rule, counters.daily, count);
                const original = state.inventory;
                const costs = rule.value_item && rule.value_item !== "0"
                    ? [
                        {
                            itemId: rule.value_item,
                            count: inventoryCount(shopInteger(rule.value_item_num) * count),
                        },
                    ]
                    : [];

                if (!gold && !crystalGold && !costs.length)
                {
                    throw new GameError(errors.unsupported);
                }

                const plan = this.planInventoryGrants(
                    original,
                    this.rules,
                    [{ itemId: rule.item_id!, count }],
                    state.now,
                    costs,
                );
                const postings = [...plan.postings];
                const profile: Record<string, bigint> = {};
                const dmm = text(original.profile, "pf") === "dmm";
                const pools = dmm
                    ? ["dmmGold", "dmmPaidSpecialGold", "dmmPaidGold"]
                    : ["gold", "paidSpecialGold", "paidGold"];
                let remaining = BigInt(gold);

                for (const key of pools)
                {
                    const before = long(original.profile, key);

                    if (before < 0n)
                    {
                        throw new GameError(errors.invalid);
                    }

                    const debit = before < remaining ? before : remaining;

                    if (debit)
                    {
                        profile[key] = before - debit;
                        postings.push({
                            account: owner,
                            asset: `profile.${key}`,
                            before,
                            after: before - debit,
                            reason: command,
                        });
                        remaining -= debit;
                    }
                }

                if (remaining)
                {
                    throw new GameError(errors.gold);
                }

                const balance = pools.reduce(
                    (sum, key) => sum + (profile[key] ?? long(original.profile, key)),
                    0n,
                );

                if (balance > 9223372036854775807n)
                {
                    throw new GameError(errors.invalid);
                }

                if (crystalGold)
                {
                    const before = long(original.profile, "crystalGold");

                    if (before < 0n || before > 9223372036854775807n)
                    {
                        throw new GameError(errors.invalid);
                    }

                    if (before < BigInt(crystalGold))
                    {
                        throw new GameError(errors.insufficientResource);
                    }

                    profile.crystalGold = before - BigInt(crystalGold);
                    postings.push({
                        account: owner,
                        asset: "profile.crystalGold",
                        before,
                        after: profile.crystalGold,
                        reason: command,
                    });
                }

                const items = plan.items;
                const delivered = plan.items.find((item) => item.itemId === rule.item_id);

                if (!delivered)
                {
                    throw new Error("Missing shop delivery");
                }

                const body: Fields = {
                    gold: sfs.long(balance),
                    todayBuy: sfs.int(counters.daily + count),
                    totalBuy: sfs.int(counters.total + count),
                    serverTotalBuy: sfs.int(Number(counters.server) + count),
                    goods: sfs.object(inventoryItem({ ...delivered }, this.rules)),
                };
                const nextState = {
                    ...state,
                    purchases: [
                        {
                            id,
                            buyDaily: counters.daily + count,
                            buyTotal: counters.total + count,
                            buyTime: BigInt(state.now),
                            flushTotalTime: counters.cycle,
                        },
                    ],
                    stock: [{ id, purchased: counters.server + BigInt(count) }],
                };

                try
                {
                    shopLimit(rule, nextState, 1);
                    body.shoppingMallItems = sfs.object(shopOffer(rule, nextState));
                }
                catch (error)
                {
                    if (!(error instanceof GameError))
                    {
                        throw error;
                    }

                    body.shoppingMallItems = sfs.object({});
                }

                const pushes: { command: string; body: Fields; }[] = [
                    {
                        command: "push.useritem",
                        body: {
                            useritemlist: sfs.array(
                                items.map((item) =>
                                    sfs.object(inventoryItem({ ...item }, this.rules))
                                ),
                            ),
                        },
                    },
                ];

                if (crystalGold)
                {
                    pushes.push({
                        command: "push.user.crystalGold",
                        body: { crystalGold: sfs.long(profile.crystalGold!) },
                    });
                }

                return {
                    inventory: {
                        ...plan,
                        items,
                        profile,
                        postings,
                        response: inventoryResponse(body, pushes),
                        events: [{
                            id: "shop",
                            type: "shop.purchased",
                            payload: inventoryEvent(postings),
                        }],
                    },
                    purchase: {
                        id,
                        saleType: rule.sale_type,
                        count,
                        daily: counters.daily + count,
                        total: counters.total + count,
                        cycle: counters.cycle,
                    },
                };
            },
        );

        return inventoryReplay(response, requestId);
    }

    catalog(state: ShopState, category?: string): Fields
    {
        const entries = [];

        for (
            const rule of [...this.rules.shops.values()].sort(
                (a, b) => Number(a.display ?? 0) - Number(b.display ?? 0),
            )
        )
        {
            if (category !== undefined && rule.sale_type !== category)
            {
                continue;
            }

            try
            {
                if (!shopAvailable(rule, state, this.rules))
                {
                    continue;
                }

                shopLimit(rule, state, 1);
                entries.push(sfs.object(shopOffer(rule, state)));
            }
            catch (error)
            {
                if (!(error instanceof GameError))
                {
                    throw error;
                }
            }
        }

        return { shoppingMall: sfs.array(entries), mall: sfs.array(entries) };
    }
}
