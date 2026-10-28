import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { num, text, long } from "../contracts/rows";
import type { WorldMonsterRefreshStore } from "../contracts/world-monster-refresh";
import {
    worldMonsterFree,
    worldMonsterBlack,
    worldBarbarianQuota,
} from "../rules/world-monster-refresh";
import { clear, footprint } from "./monster-population-state";

export async function expire(
    store: WorldMonsterRefreshStore,
    catalog: WorldPopulationCatalog,
    size: number,
    random: (maximum: number) => number,
    runtime: WorldMonsterPopulationRuntime,
)
{
    const { cityInteger, worldMonsterAreaRanges, chooseWorldMonsterCells, monsterFootprint } =
        runtime;
    let budget = 64;
    const populations = new Map<number, number>();

    for (const point of await store.expired())
    {
        if (budget-- <= 0)
        {
            break;
        }

        const live = (await store.points([num(point, "id")]))[0];

        if (!live || long(live, "flushTime") >= store.now)
        {
            continue;
        }

        const type = num(live, "pointType");

        if (type === 7)
        {
            if (live.runtimeClaimed || text(live, "ownerId") || text(live, "ownerMarchUUid"))
            {
                continue;
            }

            await store.write([clear(live, false)]);
            continue;
        }

        const four = type === 6
                || type === 44
                || ((type === 9 || type === 15)
                    && monsterFootprint(text(live, "pointItem")) === "4"),
            all = four ? await footprint(store, live, size, runtime) : [live];

        if (
            all.some((row) =>
                row.runtimeClaimed || text(row, "ownerId") || text(row, "ownerMarchUUid")
            )
        )
        {
            if (type === 44)
            {
                await store.defer(all, long(live, "flushTime") + 3600000n);
            }

            continue;
        }

        const ranges = all.filter(
            (row) =>
                num(row, "id") !== num(live, "id")
                && num(row, "pointType") === (type === 6 ? 7 : type === 44 ? 45 : 17),
        );

        if (type === 6)
        {
            const side = cityInteger(catalog.settings["worldmap_explore"]?.k1, 1, size),
                area = num(live, "monsterAreaId");

            if (area > 0)
            {
                const free = (await store.cells(worldMonsterAreaRanges(area, side, size))).filter((
                        row,
                    ) => worldMonsterFree(row)
                    ),
                    chosen = chooseWorldMonsterCells(free, true, size, random);

                if (chosen.length)
                {
                    const start = cityInteger(catalog.settings["worldmap_explore"]?.k3, 1),
                        end = cityInteger(catalog.settings["worldmap_explore"]?.k4, start),
                        hours = start + random(end - start + 1),
                        deadline = store.now + BigInt(hours) * 3600000n;
                    await store.write(
                        chosen.map((row, index) => ({
                            ...row,
                            pointType: index ? 7 : 6,
                            startTime: store.now,
                            flushTime: deadline,
                        })),
                    );
                }
            }

            await store.write([live, ...ranges].map((row) => clear(row, false)));
        }
        else if (type === 44)
        {
            const quota = worldBarbarianQuota(catalog, runtime),
                black = worldMonsterBlack(live),
                area = black ? 0 : num(live, "areaId"),
                limit = black ? cityInteger(catalog.settings["blackland_resource"]?.k2) : quota;

            if (!populations.has(area))
            {
                populations.set(area, await store.population(area));
            }

            const population = populations.get(area)!;

            if (population > limit)
            {
                populations.set(area, population - 1);
            }

            if (
                num(live, "flushFlag") === 0
                && (black || text(live, "pointItem") !== "4800000")
                && population <= limit
            )
            {
                await store.ticket(
                    num(live, "areaId"),
                    "0",
                    num(live, "resLevel"),
                    store.now + 3600000n,
                    1 + ranges.length,
                );
            }

            const cleared = [live, ...ranges].map((row) => ({
                ...clear(row, true),
                pointItem: null,
                resLevel: 0,
                resInitValue: 0,
                resCostValue: 0,
            }));
            await store.barbarian(cleared);
        }
        else if (type === 9 || type === 15)
        {
            await store.write([live, ...ranges].map((row) => clear(row, true)));
        }
    }
}
