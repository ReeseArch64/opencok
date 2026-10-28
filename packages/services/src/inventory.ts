import { confirmedContinuedCost } from "./continued-cost-spending";
import { activityEconomy } from "@opencok/economy/services/activity-economy";
import type { InventoryCommandResponse } from "@opencok/economy/contracts/responses/inventory";
import {
    inventoryPurchase,
    inventoryUse,
    inventoryBuyUse,
    inventoryComposition,
    inventoryChanges,
    inventoryEvent,
    inventoryResponse,
    inventoryReplay,
} from "@opencok/economy/mappings/inventory";
import { InventoryLedger } from "@opencok/economy/domain/inventory-ledger";
import { randomUUID } from "node:crypto";
import type { InventoryItem } from "@opencok/economy/contracts/inventory";
import type {
    InventoryExecutor,
    InventoryPlan,
    InventoryState,
} from "@opencok/contracts/inventory";
import { long, num, text } from "@opencok/contracts/rows";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { Type, sfs, encode, decode, fields, str, int, type Fields } from "@opencok/messages/sfs";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import { resource } from "@opencok/mappings/city";
import type { Rules } from "@opencok/rules/game";
import {
    inventoryCount,
    inventoryInteger,
    inventoryGoods,
    inventoryPrice,
    inventoryPairs,
    inventoryRecipe,
    inventoryWeighted,
} from "@opencok/economy/rules/inventory";
import { serverFeature } from "@opencok/rules/power-context";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";

export interface InventoryEffects
{
    world(): Promise<ReadonlyMap<number, number>>;
    emperor(): Promise<number | null | undefined>;
}

export class InventoryService
{
    constructor(
        readonly execute: InventoryExecutor,
        readonly rules: Rules,
        readonly effects: InventoryEffects,
        readonly now = Date.now,
    )
    {}

    async command(owner: string, command: string, params: Fields): Promise<InventoryCommandResponse>
    {
        if (
            ![
                "item.buy",
                "item.use",
                "item.buyUse",
                "item.compose",
                "item.compose2",
                "item.compose.suitequipment.store",
            ].includes(command)
        )
        {
            throw new GameError(errors.unsupported);
        }

        for (const key of ["num", "count", "pernum", "batch", "id"])
        {
            const value = params[key];

            if (
                value
                && (value.type !== Type.Int
                    || typeof value.value !== "number"
                    || !Number.isInteger(value.value)
                    || value.value < 0
                    || value.value > 2147483647)
            )
            {
                throw new GameError(errors.invalid);
            }
        }

        for (const key of ["itemId", "uuid", "targetId"])
        {
            const value = params[key];

            if (
                value
                && (value.type !== Type.String
                    || typeof value.value !== "string"
                    || value.value.length > 255
                    || !value.value.isWellFormed())
            )
            {
                throw new GameError(errors.invalid);
            }
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

        const request: Fields = {};

        for (const key of Object.keys(params).sort())
        {
            if (!["operationId", "_cok_", "cmdBaseTime"].includes(key))
            {
                request[key] = params[key]!;
            }
        }

        const requestId = operation ? (operation.value as string).toLowerCase() : randomUUID();
        const bytes = encode(request);
        const response = await this.execute(
            { owner, requestId, command, request: bytes },
            async (state) => {
                const planner = new InventoryPlanner(state, this.rules, this.effects, this.now());
                const body = await planner.command(command, decode(bytes));

                return planner.result(body);
            },
        );

        return inventoryReplay(response, requestId);
    }

    async grant(
        owner: string,
        operationId: string,
        itemId: string,
        count: number,
        value = 0,
    ): Promise<Fields>
    {
        inventoryCount(count);

        if (!Number.isInteger(value) || value < 0 || value > 2147483647)
        {
            throw new GameError(errors.invalid);
        }

        const request = encode({
            itemId: sfs.string(itemId),
            count: sfs.int(count),
            value: sfs.int(value),
        });

        return fields(
            decode(
                await this.execute(
                    { owner, requestId: operationId, command: "inventory.grant", request },
                    async (state) => {
                        const planner = new InventoryPlanner(
                            state,
                            this.rules,
                            this.effects,
                            this.now(),
                        );
                        const item = planner.add(itemId, count, value);

                        return planner.result(inventoryItem({ ...item }, this.rules));
                    },
                ),
            ).body,
        );
    }
}

export class InventoryPlanner extends InventoryLedger<InventoryState, Rules>
{
    constructor(
        state: InventoryState,
        rules: Rules,
        readonly effects: InventoryEffects,
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
                && serverFeature(this.rules, "sale_badge1", {
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
            && !serverFeature(this.rules, "prep_cant_buy", {
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
                String(num(this.state.profile, "civilizationType")),
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
            if (text(this.state.profile, "pf") === "cn1")
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
            const state = await this.state.effects();
            const bonus = playerGameEffect(
                {
                    ...state,
                    profile: {
                        ...state.profile,
                        decomposeSuitEffect: state.profile.decomposesuiteffect ?? null,
                    },
                },
                this.rules,
                { kingdomId: this.rules.kingdomId, version: MOBILE_CLIENT_VERSION, now: this.now },
                generalSkillPoints(state.generals),
                await this.effects.world(),
                await this.effects.emperor(),
                id as 100 | 101 | 102 | 103 | 104 | 158 | 159 | 160,
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

                    if (!castle || num(castle, "level") < required)
                    {
                        throw new GameError(errors.unsupported);
                    }
                }

                const bound = id >= 158 ? key : `${key}bind`;

                if (id >= 158 && long(this.state.resource, bound) + BigInt(amount) > 2147483647n)
                {
                    throw new GameError(errors.invalid);
                }

                this.post(
                    `resource.${bound}`,
                    long(this.state.resource, bound),
                    long(this.state.resource, bound) + BigInt(amount),
                    "inventory.effect",
                );
                this.resources[bound] = long(this.state.resource, bound) + BigInt(amount);
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
            confirmedSpending: confirmedContinuedCost(this.state, this.rules, this.now, this.items),
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

export function planInventoryGrants(
    state: InventoryState,
    rules: Rules,
    grants: readonly { itemId: string; count: number; }[],
    now: number,
    costs: readonly { itemId: string; count: number; }[] = [],
): InventoryPlan
{
    const planner = new InventoryPlanner(
        state,
        rules,
        { world: async () => new Map(), emperor: async () => null },
        now,
    );

    for (const cost of costs)
    {
        planner.spendItems(cost.itemId, inventoryCount(cost.count));
    }

    for (const grant of grants)
    {
        planner.add(grant.itemId, grant.count);
    }

    return planner.result({});
}
