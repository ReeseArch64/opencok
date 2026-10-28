import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import { num } from "@opencok/contracts/rows";
import type { Rules, Rule } from "@opencok/rules/game";
import { cityInteger, cityLevel, cityPrestige } from "@opencok/rules/city-progression";

export function civilizationScience(rules: Rules, base: number, level: number): Rule
{
    cityInteger(base, 1);
    cityInteger(level, 0, 999);
    const catalog = rules.power.civilizationSciences;

    if (catalog?.has(String(base - 1)))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    for (let offset = 0; offset <= level; offset++)
    {
        if (!catalog?.has(String(base + offset)))
        {
            throw new GameError(errors.unsupported, "city_progression");
        }
    }

    return catalog!.get(String(base + level))!;
}

export function civilizationScienceRequirements(
    state: CityProgressionState,
    rules: Rules,
    rule: Rule,
)
{
    for (const id of rule.building_condition?.split(";").filter(Boolean) ?? [])
    {
        const value = cityInteger(id, 1);

        if (
            !state.buildings.some(
                (row) =>
                    num(row, "itemId") === Math.trunc(value / 100) * 100
                    && cityLevel(row) >= value % 100,
            )
        )
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    for (const id of rule.science_condition?.split(";").filter(Boolean) ?? [])
    {
        const required = cityInteger(id, 1);
        let base = required;

        if (!rules.power.civilizationSciences?.has(String(base)))
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        while (rules.power.civilizationSciences.has(String(base - 1)))
        {
            base--;
        }

        if (
            !(state.civilizationSciences ?? []).some(
                (row) => num(row, "baseItemID") === base && num(row, "level") >= required - base,
            )
        )
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    for (const pair of rule.reputation_condition?.split("|").filter(Boolean) ?? [])
    {
        const [type, level, ...extra] = pair.split(";");

        if (extra.length || cityPrestige(state, rules, cityInteger(type)) < cityInteger(level))
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    const required = cityInteger(rule.vip ?? 0),
        vip = state.effects.vip;
    let level = 0;

    for (const entry of rules.power.vip?.values() ?? [])
    {
        if (cityInteger(entry.point) <= num(vip ?? {}, "score"))
        {
            level = Math.max(level, cityInteger(entry.id) - 7000);
        }
    }

    if (required > 10 ? num(vip ?? {}, "sLevel") < required - 10 : level < required)
    {
        throw new GameError(errors.vip, "city_progression");
    }
}
