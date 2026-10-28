import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldPopulationNumericRuntime } from "../contracts/population-numeric";
import type { WorldResourceNewClock } from "../contracts/world-resource-new";

export const worldResourceNewIdentity = {
    type: -1,
    uid: "@world:0",
    key: "opencok.world.shared-resources.v1",
};

export function worldResourceNewSettings(
    catalog: WorldPopulationCatalog,
    now: bigint,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger" | "eventTimestamp">,
)
{
    const { cityInteger, eventTimestamp } = runtime;
    const rule = catalog.settings["on_event2"];

    if (!rule)
    {
        return undefined;
    }

    const start = eventTimestamp(rule.k9),
        end = eventTimestamp(rule.k10);

    return {
        open: start !== undefined && end !== undefined && start <= now && now <= end,
        quota: cityInteger(rule.k1),
        amount: cityInteger(rule.k2, 1),
        lifetime: BigInt(cityInteger(rule.k8, 1)) * 1000n,
    };
}

export function worldResourceNewSlots(
    catalog: WorldPopulationCatalog,
    random: (maximum: number) => number,
    runtime: Pick<WorldPopulationNumericRuntime, "cityInteger" | "worldMutationFailure">,
)
{
    const { cityInteger } = runtime;
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    const counts = catalog.settings["on_event2"]?.k12,
        presence = catalog.settings["on_event3"]?.k1;

    if (!counts || !presence)
    {
        return 0;
    }

    const values = counts.split(";").map((value) => cityInteger(value, 1));

    if (!values.length || values.length > 32)
    {
        worldMutationFailure();
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    if (!Number.isSafeInteger(total) || total > 2147483647)
    {
        worldMutationFailure();
    }

    let cumulative = 0;

    for (const value of values)
    {
        cumulative += value;
        const draw = random(total);

        if (!Number.isInteger(draw) || draw < 0 || draw >= total)
        {
            worldMutationFailure();
        }

        if (draw < cumulative)
        {
            return value;
        }
    }

    return values[0]!;
}

export function worldResourceNewFootprint(point: number, size: number)
{
    if (
        !Number.isInteger(size)
        || size < 2
        || !Number.isInteger(point)
        || point <= size
        || point > size * size
        || (point - 1) % size === 0
    )
    {
        return [];
    }

    return [point, point - 1, point - size, point - size - 1];
}

export function parseWorldResourceNewClock(
    raw: string,
    areas: number,
    runtime: Pick<WorldPopulationNumericRuntime, "worldMutationFailure">,
): WorldResourceNewClock
{
    const worldMutationFailure: () => never = runtime.worldMutationFailure;
    if (raw.length > 256)
    {
        worldMutationFailure();
    }

    let value: unknown;

    try
    {
        value = JSON.parse(raw);
    }
    catch
    {
        worldMutationFailure();
    }

    const clock = value as WorldResourceNewClock;

    if (
        !clock
        || typeof clock !== "object"
        || Array.isArray(clock)
        || Object.keys(clock).sort().join(",") !== "areaCursor,nextRefreshAt,version"
        || clock.version !== 1
        || !Number.isInteger(clock.areaCursor)
        || clock.areaCursor < 1
        || clock.areaCursor > areas
        || typeof clock.nextRefreshAt !== "string"
        || !/^(0|[1-9]\d{0,15})$/.test(clock.nextRefreshAt)
        || BigInt(clock.nextRefreshAt) > BigInt(Number.MAX_SAFE_INTEGER)
    )
    {
        worldMutationFailure();
    }

    return clock;
}
