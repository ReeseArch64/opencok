import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import { javaDecimal } from "./java-integer";
import type { Rule, Rules } from "./game";

export function boxFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function boxWords(raw: string): number[]
{
    if (raw.length > 1600)
    {
        boxFailure();
    }

    if (raw === "{}")
    {
        raw = "";
    }

    const parts = raw.split(",").filter(Boolean);

    if (parts.length > 128)
    {
        boxFailure();
    }

    const words = Array<number>(128).fill(0);

    for (const [i, part] of parts.entries())
    {
        words[i] = Number(javaDecimal(part, 32));
    }

    return words;
}

export function boxWord(
    words: readonly number[],
    index: number,
    offset: number,
    bits: number,
): number
{
    cityInteger(index, 0, 127);
    cityInteger(offset, 1, 31);
    cityInteger(bits, 1, 31);

    if (offset + bits > 32)
    {
        boxFailure();
    }

    return (words[index]! >>> (32 - offset - bits)) & (2 ** bits - 1);
}

export function setBoxWord(
    words: number[],
    index: number,
    offset: number,
    bits: number,
    value: number,
)
{
    boxWord(words, index, offset, bits);
    cityInteger(value, 0, 2 ** bits - 1);
    const shift = 32 - offset - bits,
        mask = (2 ** bits - 1) << shift;
    words[index] = (words[index]! & ~mask) | (value << shift);
}

export function boxCounter(words: readonly number[], slot: number): number
{
    cityInteger(slot, 1, 12);

    return boxWord(words, 13 + Math.floor((slot - 1) / 4), 1 + ((slot - 1) % 4) * 7, 7);
}

export function setBoxCounter(words: number[], slot: number, value: number)
{
    cityInteger(slot, 1, 12);
    setBoxWord(words, 13 + Math.floor((slot - 1) / 4), 1 + ((slot - 1) % 4) * 7, 7, value);
}

function choose(weights: readonly number[], random: (maximum: number) => number): number
{
    if (!weights.length || weights.length > 128)
    {
        boxFailure();
    }

    const total = cityInteger(
            weights.reduce((sum, weight) => sum + cityInteger(weight), 0),
            1,
        ),
        draw = cityInteger(random(total), 0, total - 1);
    let sum = 0;

    for (const [i, weight] of weights.entries())
    {
        sum += weight;

        if (draw < sum)
        {
            return i;
        }
    }

    return boxFailure();
}

export function boxSelection(
    rules: Rules,
    slot: number,
    eligible: (rule: Rule) => boolean,
    lucky: boolean,
    random: (maximum: number) => number,
)
{
    const tables = [...(rules.advanced.ordinaryBoxes?.values() ?? [])].filter(
        (rule) => rule.type === String(slot) && eligible(rule),
    );
    const rule = tables[
        choose(
            tables.map((rule) => cityInteger(rule.cond_rate)),
            random,
        )
    ]!;
    const rewards = (rule.pay_reward ?? "").split("|"),
        special = (rule.special_reward ?? "").split("|"),
        weights =
            (lucky ? rule.rate_luckyday : rule.rate)?.split("|").map((value) => cityInteger(value))
                ?? [];

    if (rewards.length !== weights.length || special.length !== weights.length)
    {
        boxFailure();
    }

    const index = choose(weights, random),
        id = rewards[index]!;

    if (!rules.advanced.payRewards?.has(id))
    {
        boxFailure();
    }

    return { id: cityInteger(id, 1), special: cityInteger(special[index], 0, 1) };
}
