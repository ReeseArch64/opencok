import { javaDecimal } from "./java-integer";
import type { Rules } from "./game";

export interface PlayerExperienceInput
{
    level: number;
    exp: number;
    amount: number;
    effect: number;
}

function integer(value: number, minimum: number)
{
    if (!Number.isInteger(value) || value < minimum || value > 2147483647)
    {
        throw new Error("Invalid player experience input");
    }

    return value;
}

function narrow(value: number)
{
    if (Number.isNaN(value))
    {
        return 0;
    }

    return Math.min(2147483647, Math.max(-2147483648, Math.trunc(value))) || 0;
}

export function planPlayerExperience(
    rules: Rules,
    input: PlayerExperienceInput,
): { level: number; exp: number; }
{
    let level = integer(input.level, 1),
        exp = integer(input.exp, -2147483648);
    const amount = integer(input.amount, 0),
        effect = Math.fround(input.effect);

    if (!Number.isFinite(input.effect) || !Number.isFinite(effect))
    {
        throw new Error("Invalid player experience effect");
    }

    const threshold = (at: number) => Number(javaDecimal(rules.role(at).player_exp, 32));
    let maximumExp = threshold(level);
    const maximum = Number(javaDecimal(rules.items.get("player_max")?.k1, 32));
    integer(maximum, 1);

    if (level === maximum && exp >= maximumExp)
    {
        return { level, exp };
    }

    if (level > maximum)
    {
        return { level: maximum, exp: threshold(maximum) };
    }

    exp = narrow(exp + amount * Math.max(0, 1 + effect / 100));

    while (exp >= maximumExp)
    {
        level++;

        if (level > maximum)
        {
            return { level: maximum, exp: maximumExp };
        }

        exp = (exp - maximumExp) | 0;
        maximumExp = threshold(level);
    }

    return { level, exp };
}
