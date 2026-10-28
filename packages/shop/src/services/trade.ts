import { randomInt, randomUUID } from "node:crypto";
import type { TradeExecutor, TradeState } from "@opencok/shop/contracts/trade";
import type { InventoryCommandResponse } from "@opencok/economy/contracts/responses/inventory";
import { num } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, Type, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { inventoryCount, inventoryInteger } from "@opencok/economy/rules/inventory";
import { shopInteger, shopItemSupported } from "@opencok/shop/rules/shops";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import {
    inventoryResponse,
    inventoryReplay,
    inventoryChanges,
} from "@opencok/economy/mappings/inventory";
import type { InventoryGrantPlanner } from "../contracts/inventory-grant-planner";

function wire(trade: TradeState): Fields
{
    return {
        trade: sfs.string(trade.trade),
        times: sfs.int(trade.num),
        superValue: sfs.int(trade.superValue),
    };
}

function weighted<T>(entries: readonly T[], weights: readonly number[]): T
{
    const total = weights.reduce((sum, weight) => sum + weight, 0);

    if (
        entries.length !== weights.length
        || !Number.isSafeInteger(total)
        || total <= 0
        || total > 2147483647
    )
    {
        throw new GameError(errors.unsupported);
    }

    let roll = randomInt(total);

    for (let index = 0; index < entries.length; index++)
    {
        roll -= weights[index]!;

        if (roll < 0)
        {
            return entries[index]!;
        }
    }

    throw new GameError(errors.unsupported);
}

export class TradeService
{
    constructor(
        readonly execute: TradeExecutor,
        readonly rules: Rules,
        readonly planInventoryGrants: InventoryGrantPlanner,
    )
    {}

    async command(owner: string, command: string, params: Fields): Promise<InventoryCommandResponse>
    {
        if (!["trade.info", "trade.exchange", "trade.cancel"].includes(command))
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
        const response = await this.execute(
            { owner, command, requestId, request: encode({}) },
            async (inventory, current, now) => {
                const trade = { ...current };
                let plan = this.planInventoryGrants(inventory, this.rules, [], now);
                let body: Fields;

                if (command === "trade.info" && !trade.trade)
                {
                    const cooldown = shopInteger(this.rules.items.get("trade_time")?.k9, 30);

                    if (trade.num && BigInt(now) - trade.time < BigInt(cooldown) * 1000n)
                    {
                        throw new GameError(errors.invalid);
                    }

                    const castle = inventory.buildings.find((row) => num(row, "itemId") === 400000);
                    const level = castle ? num(castle, "level") : 0;
                    const within = (raw: string | undefined, value: number) => {
                        if (!raw)
                        {
                            return false;
                        }

                        const range = raw.split(";").map((entry) => shopInteger(entry));

                        return (
                            range.length <= 2 && value >= range[0]!
                            && (range.length === 1 || value <= range[1]!)
                        );
                    };
                    const candidates = [...this.rules.trades.values()].filter((rule) => {
                        if (!shopItemSupported(this.rules, rule.recycle_item))
                        {
                            return false;
                        }

                        if (
                            shopInteger(rule.pool_num) !== trade.num + 1
                            || !within(rule.castle_level, level)
                        )
                        {
                            return false;
                        }

                        const count = inventory.items
                            .filter(
                                (item) =>
                                    item.itemId === rule.recycle_item
                                    && item.value === 0
                                    && (item.vanishTime === 0n || item.vanishTime > BigInt(now)),
                            )
                            .reduce((sum, item) => sum + item.count, 0);

                        return within(rule.range, count) && shopInteger(rule.rate) > 0;
                    });

                    if (!candidates.length)
                    {
                        throw new GameError(errors.invalid);
                    }

                    const rule = weighted(
                        candidates,
                        candidates.map((entry) => shopInteger(entry.rate)),
                    );
                    const ids = (rule.exchange_item ?? "").split("|");
                    const amounts = (rule.exchange_num ?? "").split("|").map(inventoryInteger);
                    const weights = (rule.exchange_rate ?? "").split("|").map((value) =>
                        shopInteger(value)
                    );

                    if (ids.length !== amounts.length)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    const index = weighted(
                        ids.map((_, index) => index),
                        weights,
                    );

                    if (!shopItemSupported(this.rules, ids[index]))
                    {
                        throw new GameError(errors.unsupported);
                    }

                    trade.trade = `${rule.recycle_item};${inventoryInteger(rule.num)}|${
                        ids[index]
                    };${amounts[index]}`;
                    trade.superValue = rule.premium === "1" ? 1 : 0;
                    body = wire(trade);
                }
                else if (command === "trade.exchange" && trade.trade)
                {
                    const parts = trade.trade.split("|");

                    if (parts.length !== 2)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    const source = parts[0]!.split(";"),
                        destination = parts[1]!.split(";");

                    if (source.length !== 2 || destination.length !== 2)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    if (
                        !shopItemSupported(this.rules, source[0])
                        || !shopItemSupported(this.rules, destination[0])
                    )
                    {
                        throw new GameError(errors.unsupported);
                    }

                    plan = this.planInventoryGrants(
                        inventory,
                        this.rules,
                        [{ itemId: destination[0]!, count: inventoryInteger(destination[1]) }],
                        now,
                        [{ itemId: source[0]!, count: inventoryInteger(source[1]) }],
                    );
                    trade.trade = "";
                    trade.time = BigInt(now);
                    trade.num = inventoryCount(trade.num + 1);
                    const received = plan.items.find((item) => item.itemId === destination[0]);

                    if (!received)
                    {
                        throw new Error("Missing trade delivery");
                    }

                    body = {
                        decItem: sfs.object(
                            inventoryItem(
                                { ...plan.items.find((item) => item.itemId === source[0])! },
                                this.rules,
                            ),
                        ),
                        addItem: sfs.object(inventoryItem({ ...received }, this.rules)),
                        tradeCaravan: sfs.object(wire(trade)),
                    };
                }
                else
                {
                    if (command === "trade.cancel")
                    {
                        trade.trade = "";
                    }

                    body = command === "trade.info"
                        ? wire(trade)
                        : { tradeCaravan: sfs.object(wire(trade)) };
                }

                const pushes = plan.items.length
                    ? [{ command: "push.useritem", body: inventoryChanges(plan.items, this.rules) }]
                    : [];

                return { trade, inventory: { ...plan, response: inventoryResponse(body, pushes) } };
            },
        );

        return inventoryReplay(response, requestId);
    }
}
