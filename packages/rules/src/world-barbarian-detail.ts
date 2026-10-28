import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaDouble } from "./java-double.ts";
import { mailBlank } from "./mail.ts";
import { javaHashMapOrder as hashOrder } from "./java-hash-map-order.ts";

interface ArmyPlan
{
    rate: number;
    army: ReadonlyMap<string, number>;
}

function invalid(): never
{
    throw new GameError(errors.unsupported, "world_point_detail");
}

function splitWhole(value: string, separator: string): string[]
{
    if (!value)
    {
        return [];
    }

    return value
        .split(separator)
        .filter((part, index, array) => part.length > 0 || index === array.length - 1);
}

function integer(value: unknown): number
{
    if (
        typeof value !== "number"
        || !Number.isInteger(value)
        || value < -2147483648
        || value > 2147483647
    )
    {
        return invalid();
    }

    return value;
}

function intCast(value: number): number
{
    return Number.isNaN(value) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));
}

function longCast(value: number): bigint
{
    if (Number.isNaN(value))
    {
        return 0n;
    }

    if (value >= 9223372036854775808)
    {
        return 9223372036854775807n;
    }

    if (value <= -9223372036854775808)
    {
        return -9223372036854775808n;
    }

    return BigInt(Math.trunc(value));
}

export function barbarianArmyPlan(
    row: Row | undefined,
    rules: Rules,
    now: number,
): ArmyPlan | undefined
{
    if (!row)
    {
        return undefined;
    }

    if (!Number.isSafeInteger(now) || now < 0 || typeof row.configId !== "string")
    {
        return invalid();
    }

    const last = row.lastBeAttackedTime ?? 0n;

    if (typeof last !== "bigint" || BigInt.asIntN(64, last) !== last)
    {
        return invalid();
    }

    const rule = rules.world.barbarians?.get(row.configId);
    let seconds: number;

    try
    {
        seconds = javaDouble(rule?.para3);
    }
    catch
    {
        return invalid();
    }

    const rate = Math.min(1, Number(BigInt.asIntN(64, BigInt(now) - last)) / 1000 / seconds / 100);
    const formation = rule?.army === undefined ? undefined : rules.world.armies?.get(rule.army);

    if (!formation)
    {
        return invalid();
    }

    const army = new Map<string, number>();
    const raw = formation.arm;

    if (!mailBlank(raw))
    {
        if (typeof raw !== "string" || raw.length > 65535)
        {
            return invalid();
        }

        for (const entry of splitWhole(raw, "|"))
        {
            const parts = splitWhole(entry, ";");

            if (parts.length !== 2)
            {
                continue;
            }

            try
            {
                army.set(parts[0]!, Number(javaDecimal(parts[1], 32)));
            }
            catch
            {
                return invalid();
            }

            if (army.size > 4096)
            {
                return invalid();
            }
        }
    }

    const ordered = hashOrder(army.keys());

    return { rate, army: new Map(ordered.map((id) => [id, army.get(id)!])) };
}

export function barbarianPower(
    plan: ArmyPlan | undefined,
    remaining: ReadonlyMap<string | null, number | null> | null,
    rules: Rules,
): bigint
{
    if (!plan || !plan.army.size)
    {
        return 0n;
    }

    if (!remaining)
    {
        return invalid();
    }

    const recovered = new Map<string, number>();

    for (const [id, total] of plan.army)
    {
        const restored = intCast(Math.floor(total * plan.rate));
        const last = integer(remaining.get(id) ?? 0);
        recovered.set(id, Math.min(total, (restored + last) | 0));
    }

    let power = 0;

    for (const id of hashOrder(recovered.keys()))
    {
        let unit: number;

        try
        {
            unit = javaDouble(rules.arms.get(id)?.power);
        }
        catch
        {
            return invalid();
        }

        power += unit * recovered.get(id)!;
    }

    return longCast(Math.floor(power));
}
