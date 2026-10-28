import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { num, long } from "../contracts/rows";
import type {
    WorldMonsterRefreshStore,
    WorldMonsterFamily,
} from "../contracts/world-monster-refresh";
import {
    worldMonsterIntervals,
    worldMonsterAreaCount,
    worldMonsterFree,
} from "../rules/world-monster-refresh";
import { blank } from "./monster-population-state";

export async function exploration(
    store: WorldMonsterRefreshStore,
    catalog: WorldPopulationCatalog,
    size: number,
    random: (maximum: number) => number,
    runtime: WorldMonsterPopulationRuntime,
)
{
    const { cityInteger, worldMonsterAreaRanges, chooseWorldMonsterCells } = runtime;
    const kind: WorldMonsterFamily = "exploration",
        side = cityInteger(catalog.settings["worldmap_explore"]?.k1, 1, size),
        count = worldMonsterAreaCount(size, side, runtime),
        clock = (await store.clock(kind)) ?? blank();

    if (clock.stage === "idle")
    {
        if (clock.nextAt > 0n)
        {
            return;
        }

        if (!store.fresh)
        {
            clock.nextAt = store.now + 900000n;
            await store.save(kind, clock);

            return;
        }

        clock.stage = "fill";
        clock.area = 1;
    }

    let budget = 32;

    for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++, clock.area++)
    {
        const cells = await store.cells(worldMonsterAreaRanges(clock.area, side, size));

        if (
            cells.filter((row) => num(row, "gridType") === 2).length
                < cityInteger(catalog.settings["worldmap_explore"]?.k6)
        )
        {
            continue;
        }

        const quota = cityInteger(catalog.settings["worldmap_explore"]?.k2, 0, 64),
            existing = cells.filter((row) => num(row, "pointType") === 6).length,
            free = cells.filter((row) => worldMonsterFree(row));
        let created = 0;

        for (let index = existing; index < quota && budget > 0; index++, budget--)
        {
            const chosen = chooseWorldMonsterCells(free, true, size, random);

            if (!chosen.length)
            {
                break;
            }

            const first = cityInteger(catalog.settings["worldmap_explore"]?.k3, 1),
                last = cityInteger(catalog.settings["worldmap_explore"]?.k4, first),
                duration = BigInt(first + random(last - first + 1)) * 3600000n;
            await store.write(
                chosen.map((row, index) => ({
                    ...row,
                    pointType: index ? 7 : 6,
                    startTime: index ? long(row, "startTime") : store.now,
                    flushTime: index ? duration : store.now + duration,
                    flushFlag: index ? num(row, "flushFlag") : 0,
                })),
            );
            created++;
            const ids = new Set(chosen.map((row) => num(row, "id")));

            for (let index = free.length - 1; index >= 0; index--)
            {
                if (ids.has(num(free[index]!, "id")))
                {
                    free.splice(index, 1);
                }
            }
        }

        if (!budget && existing + created < quota)
        {
            await store.save(kind, clock);

            return;
        }
    }

    if (clock.area > count)
    {
        clock.stage = "idle";
        clock.nextAt = store.now + worldMonsterIntervals.exploration;
    }

    await store.save(kind, clock);
}
