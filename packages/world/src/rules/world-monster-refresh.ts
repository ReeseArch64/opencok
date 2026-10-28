import type {
    WorldPopulationCatalog,
    WorldPopulationRule as Rule,
} from "../contracts/population-catalog";
import type { WorldPopulationNumericRuntime } from "../contracts/population-numeric";
import { num, text, type Row } from "../contracts/rows";

export const worldMonsterIntervals = {
    field: 10800000n,
    black: 12600000n,
    exploration: 1800000n,
    barbarian: 1800000n,
};

export function worldMonsterAreaCount(
    size: number,
    side: number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger">,
)
{
    const { cityInteger } = runtime;
    cityInteger(size, 2, 4000);
    cityInteger(side, 1, size);

    return Math.floor(size / side) ** 2 + (size % side ? 1 : 0);
}

export function worldMonsterFree(row: Row, black = false)
{
    return (
        num(row, "pointType") === 0
        && num(row, "gridType") === (black ? 0 : 2)
        && num(row, "grid2Type") === 0
        && !(
            black
            && num(row, "x") > 593
            && num(row, "x") < 607
            && num(row, "y") > 593
            && num(row, "y") < 607
        )
        && !text(row, "ownerId")
        && !text(row, "ownerMarchUUid")
        && !row.runtimeClaimed
    );
}

export function worldMonsterBlack(row: Row)
{
    return (
        num(row, "x") >= 575 && num(row, "x") <= 625 && num(row, "y") >= 575 && num(row, "y") <= 625
    );
}

function rounded(value: number)
{
    if (Number.isNaN(value))
    {
        return 0;
    }

    if (value >= 9223372036854775808)
    {
        return -1;
    }

    if (value <= -9223372036854775808)
    {
        return 0;
    }

    return Number(BigInt.asIntN(32, BigInt(Math.floor(value + 0.5))));
}

function groupCounts(
    group: readonly Rule[],
    age: bigint,
    black: boolean,
    factor: number,
    random: (maximum: number) => number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger" | "worldMutationFailure">,
)
{
    const { cityInteger } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    let selected: Rule | undefined,
        maximum = -1;

    for (const row of group)
    {
        const range = row.day?.split(";") ?? [];

        if (range.length !== 2)
        {
            worldMutationFailure();
        }

        const first = cityInteger(range[0]),
            last = cityInteger(range[1], first);

        if (last > maximum)
        {
            selected = row;
            maximum = last;
        }

        if (age >= BigInt(first) * 86400000n && age < BigInt(last) * 86400000n)
        {
            selected = row;
            break;
        }
    }

    const result = new Map<string, number>();

    if (!selected)
    {
        return result;
    }

    for (let index = 1; index < 1000; index++)
    {
        const raw = selected[`${black ? "blackland" : "para"}${index}`];

        if (raw === undefined)
        {
            break;
        }

        const pair = raw.split(";");

        if (pair.length !== 2)
        {
            worldMutationFailure();
        }

        const id = String(cityInteger(pair[0], 1)),
            count = rounded(cityInteger(pair[1]) * factor);

        if (count > 0)
        {
            result.set(id, count);
        }
        else if (count === 0)
        {
            const draw = random(10);

            if (!Number.isInteger(draw) || draw < 0 || draw >= 10)
            {
                worldMutationFailure();
            }

            if (draw < factor * 20)
            {
                result.set(id, 1);
            }
        }
    }

    return result;
}

export function worldMonsterQuotas(
    catalog: WorldPopulationCatalog,
    age: bigint,
    black: boolean,
    random: (maximum: number) => number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger" | "worldMutationFailure">,
)
{
    const { cityInteger } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    if (age < 0n)
    {
        worldMutationFailure();
    }

    const groups = catalog.monsterGroups;

    if (!groups?.get("refresh")?.length)
    {
        worldMutationFailure();
    }

    const event = black || catalog.settings["function_on2"]?.k9 === "1",
        common = groups.get("refresh")!,
        result = new Map<string, number>();

    if (!event)
    {
        return groupCounts(common, age, black, 1, random, runtime);
    }

    const config = catalog.settings["monster_event_config"],
        rate = cityInteger(config?.k1, 0, 100),
        leader = cityInteger(config?.k6, 0, 100),
        factor = 1 - (rate + leader) / 100;
    const base = groupCounts(common, age, black, factor, random, runtime),
        act = groups.get("refresh_event") ?? [],
        other = groups.get("refresh_event_other") ?? [],
        csmod = groups.get("refresh_event_csmod") ?? [],
        boss = groups.get("refresh_event_csmod_boss") ?? [],
        npc = groups.get("refresh_event_csmod_npc") ?? [],
        total = (map: ReadonlyMap<string, number>) =>
            [...map.values()].reduce((sum, n) => sum + n, 0),
        normal = total(base),
        actTotal = total(groupCounts(act, age, black, 1, random, runtime)),
        leaderTotal = [other, csmod, boss, npc].reduce(
            (sum, g) => sum + total(groupCounts(g, age, black, 1, random, runtime)),
            0,
        );
    const actorFactor = normal === 0 ? 1 : ((normal / factor) * (rate / 100)) / actTotal,
        leaderFactor = normal === 0 ? 1 : ((normal / factor) * (leader / 100)) / leaderTotal;

    for (
        const map of [
            base,
            groupCounts(act, age, black, actorFactor, random, runtime),
            groupCounts(csmod, age, black, leaderFactor, random, runtime),
            groupCounts(npc, age, black, leaderFactor, random, runtime),
            groupCounts(other, age, black, leaderFactor, random, runtime),
        ]
    )
    {
        for (const [id, count] of map)
        {
            result.set(id, cityInteger((result.get(id) ?? 0) + count));
        }
    }

    return result;
}

export function worldBarbarianQuota(
    catalog: WorldPopulationCatalog,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger" | "worldMutationFailure">,
)
{
    const { cityInteger } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    const row = catalog.settings["world_barbarion"],
        side = cityInteger(row?.k2, 1),
        ratio = Math.fround(Number(row?.k3));

    if (!Number.isFinite(ratio) || ratio < 0)
    {
        worldMutationFailure();
    }

    return Math.trunc(Math.fround(side * side * Math.fround(ratio / 100)));
}

export function worldBarbarianBand(
    catalog: WorldPopulationCatalog,
    point: Row,
    size: number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger">,
)
{
    const { cityInteger } = runtime;
    const width = cityInteger(catalog.settings["worldmap_city"]?.k4, 1),
        center = Math.trunc((size - 1) / 2);

    return Math.max(
        Math.ceil(Math.abs(num(point, "x") - center) / width),
        Math.ceil(Math.abs(num(point, "y") - center) / width),
    );
}

export function worldBarbarianChoice(
    catalog: WorldPopulationCatalog,
    point: Row,
    size: number,
    random: (maximum: number) => number,
    runtime: Pick<
        WorldPopulationNumericRuntime,
        "cityInteger" | "chooseWeight" | "worldMutationFailure" | "javaDecimal" | "javaHashMapOrder"
    >,
)
{
    const { cityInteger, chooseWeight } = runtime;
    const band = worldBarbarianBand(catalog, point, size, runtime),
        choices = [...(catalog.barbarianSpawns?.values() ?? [])].filter(
            (row) => Number(row.area_level) === band,
        );

    if (!choices.length)
    {
        return undefined;
    }

    const rule = choices[
        chooseWeight(
            choices.map((row) => cityInteger(row.ratio)),
            random,
        )
    ]!;

    return worldBarbarianActor(catalog, rule.id!, runtime);
}

export function worldBarbarianActor(
    catalog: Pick<WorldPopulationCatalog, "barbarianSpawns" | "armyLayouts">,
    id: string,
    runtime: Pick<
        WorldPopulationNumericRuntime,
        "cityInteger" | "worldMutationFailure" | "javaDecimal" | "javaHashMapOrder"
    >,
)
{
    const { cityInteger, javaDecimal, javaHashMapOrder } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    const rule = catalog.barbarianSpawns?.get(id);

    if (!rule)
    {
        worldMutationFailure();
    }

    const duration = Math.trunc(Number(rule.life_time) * 60 * 60 * 1000);

    if (!Number.isSafeInteger(duration) || duration <= 0)
    {
        worldMutationFailure();
    }

    const parse = (raw: string | undefined) => {
        const values = new Map<string, number>();

        for (const entry of (raw ?? "").split("|").filter(Boolean))
        {
            const parts = entry.split(";").filter(Boolean);

            if (parts.length !== 2)
            {
                worldMutationFailure();
            }

            values.set(parts[0]!, Number(javaDecimal(parts[1], 32)));
        }

        return new Map(javaHashMapOrder(values.keys()).map((id) => [id, values.get(id)!]));
    };
    const army = catalog.armyLayouts?.get(rule.army ?? "");

    if (!army)
    {
        worldMutationFailure();
    }

    return {
        configId: rule.id!,
        currentHP: cityInteger(rule.para1),
        army: parse(army.arm),
        awards: parse(rule.arm_reward),
        duration: BigInt(duration),
    };
}
