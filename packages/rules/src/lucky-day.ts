import { cityInteger } from "./city-progression";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rule, Rules } from "./game";

export function luckyFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function luckyChoice(rule: Rule, rules: Rules, random: (maximum: number) => number): string
{
    const effects = (rule.effect ?? "").split("|").filter(Boolean),
        weights = (rule.effect_rate ?? "")
            .split("|")
            .filter(Boolean)
            .map((value) => cityInteger(value));

    if (!effects.length || effects.length > 128 || effects.length !== weights.length)
    {
        luckyFailure();
    }

    const total = cityInteger(
            weights.reduce((sum, value) => sum + value, 0),
            1,
        ),
        draw = cityInteger(random(total), 0, total - 1);
    let running = 0;

    for (const [index, effect] of effects.entries())
    {
        running += weights[index]!;

        if (draw < running)
        {
            if (!rules.power.luckyEffects?.has(effect))
            {
                luckyFailure();
            }

            return effect;
        }
    }

    return luckyFailure();
}
