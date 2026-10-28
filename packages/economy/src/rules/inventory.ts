import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { InventoryCatalogs, InventoryRule } from "../contracts/inventory-catalogs.ts";

export function inventoryCount(value: unknown, maximum = 2147483647): number
{
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > maximum)
    {
        throw new GameError(errors.invalid);
    }

    return value;
}

export function inventoryInteger(value: string | undefined): number
{
    if (!value || !/^[0-9]+$/.test(value))
    {
        throw new GameError(errors.unsupported);
    }

    return inventoryCount(Number(value));
}

export function inventoryGoods(rules: InventoryCatalogs, id: string): InventoryRule
{
    const rule = rules.goods.get(id);

    if (!rule || !/^[0-9]+$/.test(id))
    {
        throw new GameError("E100166");
    }

    return rule;
}

export function inventoryPrice(rule: InventoryRule, requested: number, batch: boolean)
{
    let count = inventoryCount(requested);
    const unit = inventoryInteger(rule.type === "7" ? rule.make?.split("|")[2] : rule.price);
    let price = unit;

    if (batch || !rule.sales)
    {
        price = inventoryCount(unit * count);
    }
    else
    {
        const bundles = rule.sales.split("|").map((pair) => pair.split(";").map(inventoryInteger));
        const match = bundles.find((pair) => pair[0] === count);

        if (match)
        {
            price = match[1]!;
        }
        else
        {
            count = 1;
        }
    }

    return { count, price };
}

export function inventoryPairs(raw: string | undefined): Map<string, number>
{
    const result = new Map<string, number>();

    if (!raw)
    {
        throw new GameError(errors.unsupported);
    }

    for (const pair of raw.split("|"))
    {
        const [id, count, extra] = pair.split(";");

        if (!id || !/^[0-9]+$/.test(id) || extra !== undefined || result.has(id))
        {
            throw new GameError(errors.unsupported);
        }

        result.set(id, inventoryInteger(count));
    }

    if (result.size > 64)
    {
        throw new GameError(errors.unsupported);
    }

    return result;
}

export function inventoryWeighted(weights: ReadonlyMap<string, number>, draw = randomInt): string
{
    const total = inventoryCount(
        [...weights.values()].reduce((sum, weight) => sum + inventoryCount(weight), 0),
    );
    let chosen = draw(total);

    if (!Number.isInteger(chosen) || chosen < 0 || chosen >= total)
    {
        throw new Error("Invalid inventory draw");
    }

    for (const [id, weight] of weights)
    {
        if (chosen < weight)
        {
            return id;
        }

        chosen -= weight;
    }

    throw new Error("Missing inventory outcome");
}

export function inventoryRecipe(
    rule: InventoryRule,
    source: string,
    target: string,
    multiple: number,
)
{
    if (rule.type !== "13" && rule.type !== "43")
    {
        throw new GameError(errors.invalid);
    }

    const targets = rule.para1?.split("\\") ?? [];
    const index = targets.length === 1 ? 0 : targets.indexOf(target);

    if (index < 0 || !targets[index])
    {
        throw new GameError(errors.invalid);
    }

    const select = (value: string | undefined) =>
        value?.includes("\\") ? value.split("\\")[index] : value;
    const materials = select(rule.para2),
        counts = select(rule.para3);

    if (!materials || !counts)
    {
        throw new GameError(errors.unsupported);
    }

    const separator = materials.includes("|") ? "|" : ";";
    const ids = materials.split(separator),
        amounts = counts.split(separator);

    if (!ids.includes(source) || ids.length !== amounts.length || ids.length > 64)
    {
        throw new GameError(errors.unsupported);
    }

    const costs = new Map<string, number>();
    ids.forEach((id, i) => {
        if (separator === ";" && id !== source)
        {
            return;
        }

        if (costs.has(id))
        {
            throw new GameError(errors.unsupported);
        }

        costs.set(id, inventoryCount(inventoryInteger(amounts[i]) * multiple));
    });
    const selection = targets[index]!;
    let rewards = new Map([[selection, 1]]);

    if (selection.includes("|"))
    {
        const [weights, values, extra] = selection.split("|");
        const entries = values?.split(";") ?? [],
            rates = weights?.split(";") ?? [];

        if (extra !== undefined || entries.length !== rates.length || !entries.length)
        {
            throw new GameError(errors.unsupported);
        }

        rewards = new Map(entries.map((id, i) => [id, inventoryInteger(rates[i])]));
    }

    return { costs, rewards };
}
