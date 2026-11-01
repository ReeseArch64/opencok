import type { PlayerEffectSnapshot } from "@opencok/contracts/power";
import { long, text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";

import { effectInteger as integer } from "./power-values.ts";
import { civilizationResearchEffect, towerResearchEffect } from "./power-research.ts";
import { isCosmeticStatus } from "@opencok/skins/rules/attributes";

function effectValues(source: string | undefined, requested: number): number[]
{
    if (!source?.trim())
    {
        return [];
    }

    const out: number[] = [];

    for (const segment of source.split("|").filter(Boolean))
    {
        const parts = segment.split(";").filter(Boolean);

        if (parts.length < 2)
        {
            throw new GameError(errors.unsupported, "power_effect");
        }

        if (integer(parts[0]) === requested)
        {
            out.push(integer(parts[1]));
        }
    }

    return out;
}

export function storedPowerEffects(
    state: PlayerEffectSnapshot,
    rules: Rules,
    now: number,
    effect = 487,
)
{
    let initialAndScience = 0;

    for (const value of effectValues(rules.items.get("effect")?.k1, effect))
    {
        initialAndScience = Math.fround(initialAndScience + Math.fround(value));
    }

    for (const row of state.sciences)
    {
        if (integer(row.level) <= 0)
        {
            continue;
        }

        const id = String(
            Number(BigInt.asIntN(32, BigInt(integer(row.itemId)) + BigInt(integer(row.level)))),
        );
        const rule = rules.power.sciences?.get(id);

        if (!rule)
        {
            throw new GameError(errors.unsupported, "power_effect");
        }

        const ids = rule.para1;

        if (!ids?.trim() || ids === "army" || ids === "trap" || ids === "up")
        {
            continue;
        }

        for (const id of ids.split("|").filter(Boolean))
        {
            if (integer(id) === effect)
            {
                initialAndScience = Math.fround(
                    initialAndScience + Math.fround(integer(rule.para2 ?? "0")),
                );
            }
        }
    }

    initialAndScience = towerResearchEffect(
        state.sagaSciences,
        rules.power.sagaScienceBases,
        rules.power.sagaSciences,
        effect,
        initialAndScience,
    );
    initialAndScience = towerResearchEffect(
        state.foreignSciences,
        rules.power.foreignScienceBases,
        rules.power.foreignSciences,
        effect,
        initialAndScience,
    );
    initialAndScience = civilizationResearchEffect(
        state.civilizationSciences,
        rules.power.civilizationSciences,
        effect,
        initialAndScience,
    );
    let status = 0n;

    for (const row of state.states)
    {
        if (long(row, "startTime") > BigInt(now) || long(row, "endTime") <= BigInt(now))
        {
            continue;
        }

        const rule = rules.power.statuses?.get(text(row, "stateId"));

        if (!rule)
        {
            throw new GameError(errors.unsupported, "power_effect");
        }

        if (isCosmeticStatus(rule) || !rule.effect?.trim())
        {
            continue;
        }

        if (rule.random?.trim() && rule.random !== "0")
        {
            if (integer(row.ranEffId ?? -1) === effect)
            {
                status += BigInt(integer(row.ranEffValue));
            }
        }
        else
        {
            for (const value of effectValues(rule.effect, effect))
            {
                status += BigInt(
                    integer(row.stateId) === 510152 && integer(row.ranEffValue ?? 0) > 0
                        ? integer(row.ranEffValue)
                        : value,
                );
            }
        }
    }

    return { initialAndScience, status: Number(BigInt.asIntN(32, status)) };
}
