import type {
    WorldPopulationCatalog,
    WorldPopulationRule as Rule,
} from "../contracts/population-catalog";
import type { WorldPopulationNumericRuntime } from "../contracts/population-numeric";
import { num, type Row } from "../contracts/rows";

export function worldResourceBlackLand(point: Row)
{
    const x = num(point, "x"),
        y = num(point, "y");

    return x >= 575 && x <= 625 && y >= 575 && y <= 625;
}

export function worldResourceDuration(
    catalog: Pick<WorldPopulationCatalog, "settings">,
    level: number,
    dead = false,
    runtime: Pick<WorldPopulationNumericRuntime, "worldMutationFailure">,
)
{
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    const hours = Number(
        catalog.settings[dead ? "resources_death" : "resources_life"]?.[`k${level}`],
    );
    const duration = Math.trunc(hours * 3600000);

    if (!Number.isSafeInteger(duration) || duration <= 0)
    {
        worldMutationFailure();
    }

    return BigInt(duration);
}

export function worldResourceAreaCount(
    catalog: WorldPopulationCatalog,
    size: number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger">,
)
{
    const { cityInteger } = runtime;
    const width = cityInteger(catalog.settings["worldmap_city"]?.k6, 1);

    return Math.floor(size / width) ** 2 + (size % width === 0 ? 0 : 1);
}

export function worldResourceQuota(
    catalog: WorldPopulationCatalog,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger">,
)
{
    const { cityInteger } = runtime;
    const width = cityInteger(catalog.settings["worldmap_city"]?.k6, 1),
        ratio = Math.fround(cityInteger(catalog.settings["worldmap_city"]?.k7, 0, 100) / 100);

    return Math.trunc(Math.fround(width * width * ratio));
}

export function worldResourceChoice(
    catalog: WorldPopulationCatalog,
    group: readonly Rule[],
    point: Row,
    size: number,
    age: bigint,
    effects: ReadonlyMap<number, number>,
    goldBonus: boolean,
    random: (maximum: number) => number,
    blackLand = false,
    runtime: Pick<
        WorldPopulationNumericRuntime,
        "cityInteger" | "worldMutationFailure" | "chooseWeight"
    >,
)
{
    const { cityInteger, chooseWeight } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    const bandWidth = cityInteger(catalog.settings["worldmap_city"]?.k4, 1),
        center = Math.trunc((size - 1) / 2),
        band = blackLand
            ? 0
            : Math.max(
                Math.ceil(Math.abs(num(point, "x") - center) / bandWidth),
                Math.ceil(Math.abs(num(point, "y") - center) / bandWidth),
            );

    if (band === 0 && !blackLand)
    {
        return undefined;
    }

    const choices = group.filter(
        (rule) =>
            Number(rule.area_level) === band && BigInt(cityInteger(rule.hours)) * 3600000n <= age,
    );

    if (!choices.length)
    {
        return undefined;
    }

    const goldRatio = goldBonus
        ? Math.fround(Number(catalog.settings["17_wk"]?.k11 ?? 0) / 100)
        : 0;
    const selected = choices[
        chooseWeight(
            choices.map((rule) => {
                const weight = cityInteger(rule.ratio);

                return rule.res_type === "5" && goldRatio > 0
                    ? Math.floor(Math.fround(weight * Math.fround(1 + goldRatio)))
                    : weight;
            }),
            random,
        )
    ];

    if (!selected)
    {
        worldMutationFailure();
    }

    const type = cityInteger(selected.res_type, 0, 6),
        level = cityInteger(selected.res_level, 1, 10);

    if (type === 6)
    {
        return { type, level, amount: 0 };
    }

    const key = ([
        "world_wood",
        "world_stone",
        "world_iron",
        "world_food",
        "world_fineiron",
        "world_gold",
    ] as const)[type]!;
    let amount = cityInteger(catalog.settings[key]?.[`k${level}`], 1);

    if (type !== 5)
    {
        const ratio = Math.fround(
            Math.fround((effects.get(305) ?? 0) / 100) + Math.fround((effects.get(307) ?? 0) / 100),
        );
        amount = cityInteger(Math.trunc(Math.fround(amount * Math.fround(1 + ratio))), 1);
    }

    return { type, level, amount };
}
