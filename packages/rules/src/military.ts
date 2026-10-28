import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import { num, text, type Row } from "@opencok/contracts/rows";
import type { Rule, Rules } from "./game";
import {
    cityAmount,
    cityInteger,
    cityLevel,
    cityQueueType,
    cityAssets,
    reducedCityCost,
    type CityAsset,
} from "./city-progression";

export function troopDefinition(rules: Rules, armyId: string): Rule
{
    if (!/^\d{6,10}$/.test(armyId))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    const rule = rules.arms.get(armyId);

    if (!rule)
    {
        throw new GameError(errors.unsupported, "city_progression");
    }

    return rule;
}

export function troopQueueType(rule: Rule): number
{
    const building = Math.trunc(cityInteger(rule.building) / 1000) * 1000,
        type = cityQueueType(building);

    if (type === undefined || ![1, 2, 8, 9, 10, 17].includes(type))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    return type;
}

export function troopBuilding(state: CityProgressionState, rule: Rule): Row
{
    const required = cityInteger(rule.building),
        base = Math.trunc(required / 1000) * 1000,
        minimum = required % 1000;
    const building = state.buildings.find(
        (row) => num(row, "itemId") === base && cityLevel(row) >= minimum,
    );

    if (
        !building
        || num(building, "opType") !== 0
        || state.queues.some((queue) => num(queue, "type") === 0 && queue.itemId === building.uuid)
    )
    {
        throw new GameError(errors.troopBuilding, "city_progression");
    }

    if (rule.science)
    {
        const [id, level, ...extra] = rule.science.split(";");

        if (
            extra.length
            || !state.effects.sagaSciences.some(
                (row) => text(row, "itemid") === id && num(row, "level") >= cityInteger(level),
            )
        )
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    for (const condition of rule.unlock_civi_science?.split("|").filter(Boolean) ?? [])
    {
        const [id, level, ...extra] = condition.split(";");

        if (
            extra.length
            || !state.effects.civilizationSciences.some(
                (row) => text(row, "baseItemID") === id && num(row, "level") >= cityInteger(level),
            )
        )
        {
            throw new GameError(errors.researchPrerequisite, "city_progression");
        }
    }

    return building;
}

export function unitPower(rule: Rule, count: number): bigint
{
    cityInteger(count);
    const raw = rule.power ?? "0";

    if (!/^\d+(?:\.\d{1,8})?$/.test(raw))
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    const [integer, fraction = ""] = raw.split("."),
        scale = 10n ** BigInt(fraction.length);

    return cityAmount(
        ((BigInt(integer!) * scale + BigInt(fraction || "0")) * BigInt(count)) / scale,
    );
}

export function troopCosts(
    rule: Rule,
    count: number,
    reduction = 0,
): Partial<Record<CityAsset, bigint>>
{
    cityInteger(count, 1);

    return Object.fromEntries(
        cityAssets.map((asset) => [
            asset,
            reducedCityCost(cityAmount(rule[asset] ?? 0) * BigInt(count), reduction),
        ]),
    );
}

export function cityBuildingParameter(row: Row, rules: Rules, index: number): number
{
    const definition = rules.building(
            text(row, "itemId"),
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
        ),
        parameter = definition.clientParameters?.[index];

    if (!parameter)
    {
        return 0;
    }

    let value = parameter.value;

    for (const step of parameter.steps ?? [])
    {
        if (step.progress <= num(row, "progress"))
        {
            value = step.value;
        }
    }

    return cityInteger(value);
}

export function totalBuildingParameter(
    state: Pick<CityProgressionState, "buildings">,
    rules: Rules,
    itemId: number,
    index: number,
): number
{
    return cityInteger(
        state.buildings
            .filter((row) => num(row, "itemId") === itemId && num(row, "level") > 0)
            .reduce((sum, row) => sum + cityBuildingParameter(row, rules, index), 0),
    );
}

export function transferTroops(
    available: number,
    destination: number,
    count: number,
): readonly [number, number]
{
    cityInteger(available);
    cityInteger(destination);
    cityInteger(count);

    if (count > available)
    {
        throw new GameError(errors.invalid, "troop_quantity");
    }

    return [available - count, cityInteger(destination + count)];
}

export function healingSelection(
    params: Readonly<Record<string, { type: number; value: unknown; }>>,
    integerType: number,
): ReadonlyMap<string, number>
{
    const ignored = new Set(["isBuyRes", "cmdBaseTime", "newbasekey", "operationId", "_cok_"]);
    const result = new Map<string, number>();

    for (const [armyId, field] of Object.entries(params))
    {
        if (ignored.has(armyId))
        {
            continue;
        }

        if (!/^\d{6,10}$/.test(armyId) || field.type !== integerType)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const count = cityInteger(field.value);

        if (count > 0)
        {
            result.set(armyId, count);
        }
    }

    if (!result.size || result.size > 256)
    {
        throw new GameError(errors.invalid, "city_progression");
    }

    cityInteger(
        [...result.values()].reduce((sum, count) => sum + count, 0),
        1,
    );

    return result;
}

export function reserveTroops(
    state: Pick<CityProgressionState, "armies" | "hospital">,
    armyId: string,
    additional: number,
)
{
    const army = state.armies.find((row) => row.armyId === armyId),
        hospital = state.hospital.find((row) => row.armyId === armyId);

    return cityInteger(
        cityInteger(num(army ?? {}, "free"))
            + cityInteger(num(army ?? {}, "train"))
            + cityInteger(num(hospital ?? {}, "heal"))
            + cityInteger(additional),
    );
}
