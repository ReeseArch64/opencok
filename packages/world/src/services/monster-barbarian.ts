import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { num } from "../contracts/rows";
import type {
    WorldMonsterRefreshStore,
    WorldMonsterFamily,
} from "../contracts/world-monster-refresh";
import {
    worldMonsterIntervals,
    worldMonsterAreaCount,
    worldMonsterFree,
    worldBarbarianQuota,
    worldBarbarianChoice,
    worldBarbarianBand,
} from "../rules/world-monster-refresh";
import { blank, blackRanges } from "./monster-population-state";

export async function barbarians(
    store: WorldMonsterRefreshStore,
    catalog: WorldPopulationCatalog,
    size: number,
    random: (maximum: number) => number,
    runtime: WorldMonsterPopulationRuntime,
)
{
    const { cityInteger, worldMonsterAreaRanges, chooseWorldMonsterCells, serverFeature } = runtime;
    const kind: WorldMonsterFamily = "barbarian",
        side = cityInteger(catalog.settings["world_barbarion"]?.k2, 1, size),
        count = worldMonsterAreaCount(size, side, runtime),
        quota = worldBarbarianQuota(catalog, runtime),
        clock = (await store.clock(kind)) ?? blank(),
        open = serverFeature("barbarion_switch", {
            kingdomId: catalog.kingdomId,
            version: "12.06.0",
            now: Number(store.now),
        });

    if (clock.stage === "idle")
    {
        if (clock.nextAt > store.now)
        {
            return;
        }

        if (clock.nextAt === 0n)
        {
            clock.initial = store.fresh;
            clock.stage = store.fresh ? "seed" : "fill";
            clock.area = 1;

            if (!store.fresh)
            {
                clock.stage = "idle";
                clock.nextAt = store.now + 1200000n;
                await store.save(kind, clock);

                return;
            }
        }
        else
        {
            clock.stage = "fill";
            clock.area = 1;
        }
    }

    const spawn = async (area: number) => {
        const cells = (
                await store.cells(
                    area === 0 ? blackRanges : worldMonsterAreaRanges(area, side, size),
                )
            ).filter((row) => worldMonsterFree(row, area === 0)),
            chosen = chooseWorldMonsterCells(cells, true, size, random);

        if (!chosen.length)
        {
            return false;
        }

        const actor = worldBarbarianChoice(catalog, chosen[0]!, size, random, runtime);

        if (!actor)
        {
            return false;
        }

        const points = chosen.map((row, index) => ({
            ...row,
            pointType: index ? 45 : 44,
            pointItem: actor.configId,
            flushTime: store.now + actor.duration,
        }));
        await store.barbarian(points, actor);

        return true;
    };
    let budget = 32;

    if (clock.stage === "seed")
    {
        for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++)
        {
            const ranges = worldMonsterAreaRanges(clock.area, side, size),
                band = worldBarbarianBand(
                    catalog,
                    { x: ranges[0]![0]!, y: ranges[0]![2]! },
                    size,
                    runtime,
                );

            if (
                ![...(catalog.barbarianSpawns?.values() ?? [])].some(
                    (row) => Number(row.area_level) === band,
                )
            )
            {
                clock.area++;
                clock.pool = [];
                clock.remaining = {};
                clock.attempts = 0;
                continue;
            }

            const cells = await store.cells(ranges),
                lookup = new Map(
                    cells.filter((row) => worldMonsterFree(row)).map((
                        row,
                    ) => [num(row, "id"), row]),
                );

            if (!clock.remaining["0"])
            {
                clock.pool = [...lookup.keys()];
                clock.attempts = quota;
                clock.remaining["0"] = 1;
            }

            clock.pool = clock.pool.filter((id) => lookup.has(id));

            while (clock.attempts > 0 && budget > 0 && clock.pool.length)
            {
                const chosen = chooseWorldMonsterCells(
                    clock.pool.map((id) => lookup.get(id)!),
                    true,
                    size,
                    random,
                );

                if (!chosen.length)
                {
                    clock.pool = [];
                    break;
                }

                await store.ticket(clock.area, "0", 0, store.now + 3600000n, 4);
                const ids = new Set(chosen.map((row) => num(row, "id")));
                clock.pool = clock.pool.filter((id) => !ids.has(id));
                clock.attempts--;
                budget--;
            }

            if (clock.attempts && clock.pool.length && !budget)
            {
                break;
            }

            clock.area++;
            clock.pool = [];
            clock.remaining = {};
            clock.attempts = 0;
        }

        if (clock.area > count)
        {
            clock.stage = "idle";
            clock.area = 0;
            clock.nextAt = store.now + 1200000n;
        }

        await store.save(kind, clock);

        return;
    }

    if (!open)
    {
        return;
    }

    for (const ticket of await store.tickets())
    {
        if (!budget--)
        {
            break;
        }

        const area = ticket.blackLand ? 0 : num(ticket, "areaId"),
            limit = area === 0 ? cityInteger(catalog.settings["blackland_resource"]?.k2) : quota;

        if ((await store.population(area)) > limit)
        {
            await store.remove(ticket);
            continue;
        }

        if (await spawn(area))
        {
            await store.remove(ticket);
        }
        else
        {
            await store.retry(ticket, store.now + 3600000n);
        }
    }

    if ((await store.population(0)) <= cityInteger(catalog.settings["blackland_resource"]?.k1))
    {
        const maximum = cityInteger(catalog.settings["blackland_resource"]?.k2);

        while (budget > 0 && (await store.population(0)) < maximum)
        {
            budget--;

            if (!(await spawn(0)))
            {
                break;
            }
        }
    }

    for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++)
    {
        while (budget > 0 && (await store.population(clock.area)) < quota)
        {
            budget--;

            if (!(await spawn(clock.area)))
            {
                break;
            }
        }

        if (budget > 0)
        {
            clock.area++;
        }
        else
        {
            break;
        }
    }

    if (clock.area > count)
    {
        clock.stage = "idle";
        clock.area = 0;
        clock.nextAt = store.now + worldMonsterIntervals.barbarian;
    }

    await store.save(kind, clock);
}
