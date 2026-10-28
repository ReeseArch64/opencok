import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { Type, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import type { InventoryCommandState, InventoryPlan } from "../contracts/inventory-planning.ts";
import type { InventoryPlanningCatalogs } from "../contracts/inventory-catalogs.ts";
import type { InventoryRuntime, InventoryResourceEffect } from "../contracts/inventory-runtime.ts";
import type { InventoryItem } from "../contracts/inventory.ts";
import { InventoryLedger } from "../domain/inventory-ledger.ts";
import {
    inventoryCount,
    inventoryInteger,
    inventoryGoods,
    inventoryPrice,
    inventoryPairs,
    inventoryRecipe,
    inventoryWeighted,
} from "../rules/inventory.ts";
import {
    inventoryPurchase,
    inventoryUse,
    inventoryBuyUse,
    inventoryComposition,
    inventoryChanges,
    inventoryEvent,
    inventoryResponse,
} from "../mappings/inventory.ts";
import { inventoryItem } from "../mappings/inventory-item.ts";
import { resource } from "../mappings/resources.ts";
import { activityEconomy } from "./activity-economy.ts";

export class InventoryPlanner<
    State extends InventoryCommandState = InventoryCommandState,
    Catalogs extends InventoryPlanningCatalogs = InventoryPlanningCatalogs,
> extends InventoryLedger<State, Catalogs>
{
    constructor(
        state: State,
        rules: Catalogs,
        readonly runtime: InventoryRuntime<State, Catalogs>,
        now: number,
    )
    {
        super(state, rules, now);
    }

    buy(itemId: string, requested: number, params: Fields)
    {
        const rule = inventoryGoods(this.rules, itemId);

        if (
            params.hasCDTime
            && (params.hasCDTime.type !== Type.Bool || typeof params.hasCDTime.value !== "boolean")
        )
        {
            throw new GameError(errors.invalid);
        }

        if (
            params.hasCDTime?.value === true
            || (itemId === "200065"
                && this.runtime.feature(this.rules, "sale_badge1", {
                    kingdomId: this.rules.kingdomId,
                    version: MOBILE_CLIENT_VERSION,
                    now: this.now,
                }))
        )
        {
            throw new GameError(errors.unsupported);
        }

        const batch = int(params, "batch", 0);

        if (batch < 0)
        {
            throw new GameError(errors.invalid);
        }

        if (
            batch > 0
            && rule.type === "7"
            && !this.runtime.feature(this.rules, "prep_cant_buy", {
                kingdomId: this.rules.kingdomId,
                version: MOBILE_CLIENT_VERSION,
                now: this.now,
            })
        )
        {
            throw new GameError(errors.unsupported);
        }

        const { count, price } = inventoryPrice(rule, requested, batch > 0);

        if (this.total() < BigInt(price))
        {
            throw new GameError(errors.gold);
        }

        let remaining = BigInt(price);

        for (const key of this.pools())
        {
            const balance = this.balance(key);

            if (balance < 0n)
            {
                throw new GameError(errors.invalid);
            }

            const cost = balance < remaining ? balance : remaining;

            if (cost)
            {
                this.post(`profile.${key}`, balance, balance - cost, "inventory.purchase");
                this.profile[key] = balance - cost;
            }

            remaining -= cost;
        }

        const item = this.add(itemId, count);

        return {
            item,
            count,
            body: inventoryPurchase(item, this.rules, this.total(), price),
        };
    }

    async use(item: InventoryItem, count: number)
    {
        inventoryCount(count);
        const rule = inventoryGoods(this.rules, item.itemId);

        if (count > 1 && !rule.useall)
        {
            throw new GameError(errors.invalid);
        }

        if (
            rule.civilizations
            && rule.civilizations !== "0"
            && !rule.civilizations.split(";").includes(
                String(Number(this.state.profile["civilizationType"] ?? 0)),
            )
        )
        {
            throw new GameError("E100166");
        }

        if (rule.cd_time)
        {
            const cooldown = BigInt(inventoryInteger(rule.cd_time)) * 60000n;
            const last = this.state.cooldowns.get(item.itemId);

            if (last !== undefined && BigInt(this.now) < last + cooldown)
            {
                throw new GameError("111160");
            }

            this.cooldowns.set(item.itemId, BigInt(this.now));
        }

        let effectRule = rule;

        if (rule.type === "13")
        {
            effectRule = inventoryGoods(this.rules, rule.para4 ?? "");
        }

        const effect: Fields = {};

        if (
            (effectRule.id === "200031"
                || ["36", "37", "40"].includes(effectRule.type ?? "")
                || effectRule.type === "4"
                || (effectRule.type === "3"
                    && ["70", "110", "249", "250"].includes(effectRule.para1 ?? "")))
            && this.state.useEffect
        )
        {
            Object.assign(
                effect,
                await this.state.useEffect(effectRule.id!, count, activityEconomy(this)),
            );
        }
        else if (effectRule.type === "3")
        {
            if (String(this.state.profile["pf"] ?? "") === "cn1")
            {
                throw new GameError(errors.unsupported);
            }

            const id = inventoryInteger(effectRule.para1);

            if (![100, 101, 102, 103, 104, 158, 159, 160].includes(id))
            {
                throw new GameError(errors.unsupported);
            }

            const base = inventoryInteger(effectRule.para2);
            inventoryCount(base * count);
            const bonus = await this.runtime.resourceBonus(
                this.state,
                this.rules,
                this.now,
                id as InventoryResourceEffect,
            );
            const amount = Math.trunc(
                Math.fround(base * Math.max(0, Math.fround(Math.fround(100 + bonus) / 100))),
            )
                * count;

            if (!Number.isInteger(amount) || amount < 0 || amount > 2147483647)
            {
                throw new GameError(errors.invalid);
            }

            if (id === 100)
            {
                const key = this.pools()[0]!;
                this.post(
                    `profile.${key}`,
                    this.balance(key),
                    this.balance(key) + BigInt(amount),
                    "inventory.effect",
                );
                this.profile[key] = this.balance(key) + BigInt(amount);
                effect.delta = sfs.int(amount);
                effect.remainGold = sfs.long(this.total());
            }
            else
            {
                const key = id >= 158
                    ? ["silver", "chip", "diamond"][id - 158]!
                    : ["wood", "stone", "iron", "food"][id - 101]!;

                if (key === "stone" || key === "iron")
                {
                    const required = inventoryInteger(
                        this.rules.items.get("building_base")?.[key === "stone" ? "k4" : "k3"],
                    );
                    const castle = this.state.buildings.find((row) =>
                        String(row.itemId) === "400000"
                    );

                    if (!castle || Number(castle["level"] ?? 0) < required)
                    {
                        throw new GameError(errors.unsupported);
                    }
                }

                const bound = id >= 158 ? key : `${key}bind`;

                if (
                    id >= 158
                    && BigInt(String(this.state.resource[bound] ?? 0)) + BigInt(amount)
                        > 2147483647n
                )
                {
                    throw new GameError(errors.invalid);
                }

                this.post(
                    `resource.${bound}`,
                    BigInt(String(this.state.resource[bound] ?? 0)),
                    BigInt(String(this.state.resource[bound] ?? 0)) + BigInt(amount),
                    "inventory.effect",
                );
                this.resources[bound] = BigInt(String(this.state.resource[bound] ?? 0))
                    + BigInt(amount);
                this.pushes.push({
                    command: "push.city.refresh",
                    body: resource({ ...this.state.resource, ...this.resources }),
                });
            }
        }
        else if (effectRule.type !== "21")
        {
            throw new GameError(errors.unsupported);
        }

        this.take(item, count);
        await this.state.recordAction?.("use", item.itemId, count, activityEconomy(this));

        return inventoryUse(item, effect);
    }

    async command(command: string, params: Fields): Promise<Fields>
    {
        if (command === "item.buy" || command === "item.buyUse")
        {
            const purchase = this.buy(
                str(params, "itemId"),
                inventoryCount(int(params, "num")),
                params,
            );

            if (command === "item.buy")
            {
                return purchase.body;
            }

            const useRet = await this.use(purchase.item, purchase.count);

            return inventoryBuyUse(purchase.body, useRet);
        }

        if (command === "item.use")
        {
            return this.use(this.own(str(params, "uuid")), inventoryCount(int(params, "num")));
        }

        if (command === "item.compose2")
        {
            const id = String(inventoryCount(int(params, "id"))),
                count = inventoryCount(int(params, "count"), 9999);
            const rule = this.rules.materials.get(id);

            if (!rule)
            {
                throw new GameError(errors.unsupported);
            }

            const costs = inventoryPairs(rule.material),
                targets = inventoryPairs(rule.target);

            for (const id of targets.keys())
            {
                if (inventoryGoods(this.rules, id).type === "37")
                {
                    throw new GameError(errors.unsupported);
                }
            }

            for (const [id, amount] of costs)
            {
                this.spendItems(id, inventoryCount(amount * count));
            }

            const rewards = new Map<string, number>();

            for (let i = 0; i < count; i++)
            {
                const id = inventoryWeighted(targets);
                rewards.set(id, (rewards.get(id) ?? 0) + 1);
            }

            for (const [id, amount] of rewards)
            {
                this.add(id, amount);
            }

            await this.state.recordAction?.("compose", id, count, activityEconomy(this));

            return inventoryComposition([...this.changed.values()]);
        }

        const suite = command === "item.compose.suitequipment.store";
        const source = suite ? this.own(str(params, "uuid")) : undefined;
        const id = source?.itemId ?? str(params, "itemId");
        const rule = inventoryGoods(this.rules, id);

        if (suite && rule.type !== "43")
        {
            throw new GameError(errors.invalid);
        }

        const multiple = inventoryCount(int(params, suite ? "num" : "pernum", suite ? 0 : 1));
        const { costs, rewards } = inventoryRecipe(rule, id, str(params, "targetId", ""), multiple);

        for (const id of rewards.keys())
        {
            const target = inventoryGoods(this.rules, id);

            if (target.type === "37")
            {
                throw new GameError(errors.unsupported);
            }
        }

        for (const [cost, amount] of costs)
        {
            if (source && cost === source.itemId)
            {
                this.take(source, amount);
            }
            else
            {
                this.spendItems(cost, amount);
            }
        }

        const item = this.add(inventoryWeighted(rewards), multiple);
        await this.state.recordAction?.("compose", id, multiple, activityEconomy(this));

        return suite ? {} : inventoryItem({ ...item }, this.rules);
    }

    result(body: Fields): InventoryPlan
    {
        if (this.changed.size)
        {
            this.pushes.push({
                command: "push.useritem",
                body: inventoryChanges([...this.changed.values()], this.rules),
            });
        }

        return {
            confirmedSpending: this.runtime.confirmedSpending(
                this.state,
                this.rules,
                this.now,
                this.items,
            ),
            postings: this.postings,
            events: [
                ...this.domainEvents,
                {
                    id: "inventory",
                    type: "inventory.changed",
                    payload: inventoryEvent(this.postings),
                },
            ],
            items: [...this.changed.values()],
            profile: this.profile,
            assets: this.assets,
            resource: this.resources,
            cooldowns: this.cooldowns,
            response: inventoryResponse(body, this.pushes),
        };
    }
}
