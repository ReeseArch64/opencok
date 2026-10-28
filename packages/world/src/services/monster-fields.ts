import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { num, text, long } from "../contracts/rows";
import type { WorldMonsterRefreshStore } from "../contracts/world-monster-refresh";
import {
    worldMonsterIntervals,
    worldMonsterAreaCount,
    worldMonsterFree,
    worldMonsterQuotas,
} from "../rules/world-monster-refresh";
import { blank, blackRanges, clear } from "./monster-population-state";

export async function fields(
    store: WorldMonsterRefreshStore,
    catalog: WorldPopulationCatalog,
    size: number,
    kind: "field" | "black",
    random: (maximum: number) => number,
    runtime: WorldMonsterPopulationRuntime,
)
{
    const {
        cityInteger,
        worldFootprint,
        worldMonsterAreaRanges,
        chooseWorldMonsterCells,
        spawnWorldMonsterCells,
        worldMonsterConfiguration,
        monsterFootprint,
    } = runtime;
    const side = cityInteger(catalog.settings["monster"]?.k1, 1, size),
        count = kind === "black" ? 1 : worldMonsterAreaCount(size, side, runtime),
        clock = (await store.clock(kind)) ?? blank();

    if (clock.stage === "idle")
    {
        if (clock.nextAt > store.now)
        {
            return;
        }

        if (clock.nextAt === 0n && !store.fresh)
        {
            clock.nextAt = store.now + (kind === "field" ? 9000000n : 60000n);
            await store.save(kind, clock);

            return;
        }

        clock.quota = Object.fromEntries(
            worldMonsterQuotas(
                catalog,
                store.now - store.monsterStart,
                kind === "black",
                random,
                runtime,
            ),
        );

        if (!Object.keys(clock.quota).length)
        {
            clock.nextAt = store.now + worldMonsterIntervals[kind];
            await store.save(kind, clock);

            return;
        }

        clock.area = 1;
        clock.stage = "reset";
        clock.remaining = {};
        clock.pool = [];
        clock.attempts = 0;
    }

    let budget = 64,
        visited = 0;

    while (clock.area <= count && budget > 0 && visited++ < 4)
    {
        const cells = await store.cells(
            kind === "black" ? blackRanges : worldMonsterAreaRanges(clock.area, side, size),
        );

        if (clock.stage === "reset")
        {
            const protectedIds = new Set<number>(),
                lookup = new Map(cells.map((row) => [num(row, "id"), row]));

            for (const row of cells)
            {
                if (
                    ![9, 15].includes(num(row, "pointType"))
                    || monsterFootprint(text(row, "pointItem")) !== "4"
                )
                {
                    continue;
                }

                let ids: readonly number[];

                try
                {
                    ids = worldFootprint(num(row, "id"), size, true);
                }
                catch
                {
                    protectedIds.add(num(row, "id"));
                    continue;
                }

                const footprint = ids.every((id) => lookup.has(id))
                    ? ids.map((id) => lookup.get(id)!)
                    : await store.points(ids);

                if (
                    footprint.length !== 4
                    || footprint.some(
                        (point) =>
                            point.runtimeClaimed || text(point, "ownerId")
                            || text(point, "ownerMarchUUid"),
                    )
                )
                {
                    for (const id of ids)
                    {
                        protectedIds.add(id);
                    }
                }
            }

            const obsolete = cells
                .filter(
                    (row) =>
                        [9, 15, 17].includes(num(row, "pointType"))
                        && !protectedIds.has(num(row, "id"))
                        && !row.runtimeClaimed
                        && !text(row, "ownerId")
                        && !text(row, "ownerMarchUUid")
                        && (kind === "black" || num(row, "gridType") === 2)
                        && (num(row, "flushFlag") === 0 || long(row, "flushTime") < store.now),
                )
                .slice(0, Math.min(256, budget));

            if (obsolete.length)
            {
                await store.write(obsolete.map((row) => clear(row, true)));
                budget -= obsolete.length;

                if (!budget)
                {
                    await store.save(kind, clock);

                    return;
                }

                continue;
            }

            clock.remaining = { ...clock.quota };

            for (
                const row of cells.filter(
                    (row) =>
                        (row.runtimeClaimed || protectedIds.has(num(row, "id")))
                        && [9, 15].includes(num(row, "pointType")),
                )
            )
            {
                const id = text(row, "pointItem");
                clock.remaining[id] = Math.max(0, (clock.remaining[id] ?? 0) - 1);
            }

            clock.pool = cells
                .filter((row) => worldMonsterFree(row, kind === "black"))
                .map((row) => num(row, "id"));
            clock.attempts = Math.min(
                clock.pool.length,
                Object.values(clock.remaining).reduce((sum, n) => sum + n, 0),
            );
            clock.stage = "fill";
        }

        if (clock.stage === "fill")
        {
            const lookup = new Map(
                cells
                    .filter((row) => worldMonsterFree(row, kind === "black"))
                    .map((row) => [num(row, "id"), row]),
            );
            clock.pool = clock.pool.filter((id) => lookup.has(id));

            while (clock.attempts > 0 && clock.pool.length && budget > 0)
            {
                const ids = Object.keys(clock.remaining).filter((id) => clock.remaining[id]! > 0);

                if (!ids.length)
                {
                    break;
                }

                const id = ids[random(ids.length)]!,
                    config = worldMonsterConfiguration(id),
                    chosen = chooseWorldMonsterCells(
                        clock.pool.map((id) => lookup.get(id)!),
                        config.four,
                        size,
                        random,
                    );
                clock.remaining[id]!--;
                clock.attempts--;
                budget--;

                if (!chosen.length)
                {
                    clock.pool = [];
                    break;
                }

                await store.write(spawnWorldMonsterCells(chosen, id, store.now, 86400));
                const used = new Set(chosen.map((row) => num(row, "id")));
                clock.pool = clock.pool.filter((id) => !used.has(id));
            }

            if (clock.attempts > 0 && clock.pool.length && budget <= 0)
            {
                break;
            }

            clock.area++;
            clock.stage = "reset";
            clock.pool = [];
            clock.remaining = {};
            clock.attempts = 0;
        }
    }

    if (clock.area > count)
    {
        clock.stage = "idle";
        clock.area = 0;
        clock.nextAt = store.now + worldMonsterIntervals[kind];
        clock.quota = {};
    }

    await store.save(kind, clock);
}
