import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import {
    effectInteger as integer,
    effectFloat as float,
    invalidEffect as invalid,
} from "./power-values.ts";

export function personalThroneEffect(
    rewards: readonly Row[],
    emperorVersion: number | null | undefined,
    rules: Rules,
    effect: number,
    initial: number,
): number
{
    if (!rewards.length || emperorVersion === null)
    {
        return initial;
    }

    if (emperorVersion === undefined || rewards.length > 4096)
    {
        return invalid();
    }

    const version = integer(emperorVersion);
    let total = initial;

    for (const reward of rewards)
    {
        if (integer(reward.version) !== version)
        {
            continue;
        }

        const rule = rules.power.monarchTitles?.get(String(integer(reward.rewardId)));

        if (rule?.effect === undefined || rule.num === undefined)
        {
            return invalid();
        }

        const ids = rule.effect.split("|").filter(Boolean);
        const values = rule.num.split("|").filter(Boolean);

        for (let index = 0; index < Math.min(ids.length, values.length); index++)
        {
            const id = integer(ids[index]);
            const value = float(values[index]);

            if (id === effect)
            {
                total = Math.fround(total + value);
            }
        }
    }

    return total;
}
