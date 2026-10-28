import type { Row } from "@opencok/contracts/rows";
import type { Rule } from "./game.ts";
import { hashOrder } from "./power-hash-order.ts";
import {
    effectInteger as integer,
    effectFloat as float,
    invalidEffect as invalid,
} from "./power-values.ts";

function addId(...values: number[]): string
{
    return String(
        Number(
            BigInt.asIntN(
                32,
                values.reduce((sum, value) => sum + BigInt(value), 0n),
            ),
        ),
    );
}

export function towerResearchEffect(
    rows: readonly Row[],
    bases: ReadonlyMap<string, Rule> | undefined,
    levels: ReadonlyMap<string, Rule> | undefined,
    requested: number,
    initial: number,
): number
{
    let total = initial;

    for (const row of rows)
    {
        const item = integer(row.itemid);
        const base = bases?.get(String(item));

        if (!base)
        {
            return invalid();
        }

        if (integer(base.hide) === 1)
        {
            continue;
        }

        const rule = levels?.get(addId(item, integer(row.level ?? 0), 100000));

        if (!rule)
        {
            return invalid();
        }

        if (!rule.effect?.trim() || !rule.value?.trim())
        {
            continue;
        }

        const ids = rule.effect.split(";").filter(Boolean);
        const values = rule.value.split(";").filter(Boolean);

        for (let index = 0; index < Math.min(ids.length, values.length); index++)
        {
            const id = integer(ids[index]);
            const value = float(values[index]);

            if (id === requested)
            {
                total = Math.fround(total + value);
            }
        }
    }

    return total;
}

export function civilizationResearchEffect(
    rows: readonly Row[],
    levels: ReadonlyMap<string, Rule> | undefined,
    requested: number,
    initial: number,
): number
{
    const selected = new Map<number, Row>();

    for (const row of rows)
    {
        selected.set(integer(row.baseItemID), row);
    }

    let total = initial;

    for (const base of hashOrder(selected.keys()))
    {
        const row = selected.get(base)!;
        const rule = levels?.get(addId(base, integer(row.level ?? 0)));

        if (!rule)
        {
            continue;
        }

        const value = rule.para2 === undefined ? -1 : Math.fround(float(rule.para2) / 100);

        for (const raw of rule.para1?.split("|").filter(Boolean) ?? [])
        {
            if (integer(raw) === requested)
            {
                total = Math.fround(total + value);
            }
        }
    }

    return total;
}
