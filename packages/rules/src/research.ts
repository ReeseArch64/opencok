import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import { num, text } from "@opencok/contracts/rows";
import type { Rules, Rule } from "./game";
import {
    cityInteger,
    cityAmount,
    cityLevel,
    cityPrestige,
    cityAssets,
    reducedCityCost,
    type CityEffect,
    type CityAsset,
} from "./city-progression";

export function researchDefinition(rules: Rules, itemId: string, level: number): Rule
{
    if (!/^\d{4,8}00$/.test(itemId))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    cityInteger(level, 0, 99);
    const rule = rules.power.sciences?.get(String(cityInteger(itemId) + level));

    if (!rule || cityInteger(rule.science_lv) !== level)
    {
        throw new GameError(errors.unsupported, "city_progression");
    }

    return rule;
}

export function checkResearchRequirements(state: CityProgressionState, rules: Rules, rule: Rule)
{
    for (const condition of rule.science_condition?.split(";").filter(Boolean) ?? [])
    {
        const id = cityInteger(condition),
            base = String(Math.trunc(id / 100) * 100),
            level = id % 100;

        if (
            !state.sciences.some((row) =>
                text(row, "itemId") === base && num(row, "level") >= level
            )
        )
        {
            throw new GameError(errors.researchPrerequisite, "research_prerequisite");
        }
    }

    for (const condition of rule.building_condition?.split(";").filter(Boolean) ?? [])
    {
        const id = cityInteger(condition),
            base = Math.trunc(id / 100) * 100,
            level = id % 100;

        if (!state.buildings.some((row) => num(row, "itemId") === base && cityLevel(row) >= level))
        {
            throw new GameError(errors.researchPrerequisite, "research_building");
        }
    }

    if (rule.reputation_condition)
    {
        const [civilization, minimum, ...extra] = rule.reputation_condition.split(";");

        if (
            extra.length
            || cityPrestige(state, rules, cityInteger(civilization)) < cityInteger(minimum)
        )
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    if (rule.vip)
    {
        const required = cityInteger(rule.vip),
            vip = state.effects.vip;
        let level = 0;

        for (const entry of rules.power.vip?.values() ?? [])
        {
            if (cityInteger(entry.point) <= num(vip ?? {}, "score"))
            {
                level = cityInteger(entry.id) - 7000;
            }
        }

        if (required > 10 ? num(vip ?? {}, "sLevel") < required - 10 : level < required)
        {
            throw new GameError(errors.vip, "city_progression");
        }
    }
}

export function researchCosts(rule: Rule, effect: CityEffect): Partial<Record<CityAsset, bigint>>
{
    const result: Partial<Record<CityAsset, bigint>> = {};

    for (const pair of rule.research_need?.split("|").filter(Boolean) ?? [])
    {
        const [rawId, rawAmount, ...extra] = pair.split(";"),
            id = cityInteger(rawId, 0, 4),
            asset = cityAssets[id]!;

        if (extra.length || result[asset] !== undefined)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const reduction = effect(181)
            + (asset === "silver"
                ? 0
                : effect(({ wood: 757, food: 758, iron: 759, stone: 760 } as const)[asset]));
        result[asset] = reducedCityCost(
            cityAmount(rawAmount),
            reduction,
            effect(180),
            effect(2146),
        );
    }

    return result;
}
