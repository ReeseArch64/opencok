import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldPopulationNumericRuntime } from "../contracts/population-numeric";
import { randomInt } from "node:crypto";
import { num, text } from "../contracts/rows";
import type { WorldResourceRefreshStore } from "../contracts/world-resource-refresh";
import {
    worldResourceAreaCount,
    worldResourceBlackLand,
    worldResourceChoice,
    worldResourceDuration,
    worldResourceQuota,
} from "../rules/world-resource-refresh";

export class WorldResourceRefreshService
{
    public constructor(
        private readonly catalog: WorldPopulationCatalog,
        private readonly size: number,
        private readonly runtime: WorldPopulationNumericRuntime,
        private readonly random: (maximum: number) => number = randomInt,
    )
    {}

    public async refresh(store: WorldResourceRefreshStore, effects: ReadonlyMap<number, number>)
    {
        const { catalog, size, runtime, random } = this;

        const { cityInteger } = runtime;
        const worldMutationFailure: () => never = runtime.worldMutationFailure;
        const { now } = store;
        const ready = store.opening > 0n && store.opening <= now;

        if (ready && store.clock && store.clock.nextRefreshAt > now)
        {
            return;
        }

        const quota = ready ? worldResourceQuota(catalog, runtime) : 0,
            blackMinimum = ready ? cityInteger(catalog.settings["blackland_resource"]?.k1) : 0,
            blackMaximum = ready
                ? cityInteger(catalog.settings["blackland_resource"]?.k2, blackMinimum, 64)
                : 0;
        const limit = (area: number) => (area === 0 ? blackMaximum : quota);
        const expired = await store.expired();

        for (const point of expired)
        {
            if (text(point, "ownerMarchUUid") || text(point, "ownerId"))
            {
                await store.postpone(
                    point,
                    now
                        + worldResourceDuration(
                            catalog,
                            num(point, "resLevel"),
                            undefined,
                            runtime,
                        ),
                );
                continue;
            }

            const area = worldResourceBlackLand(point) ? 0 : num(point, "areaId");

            if (
                ready && num(point, "flushFlag") === 0
                && (await store.population(area)) <= limit(area)
            )
            {
                await store.ticket(
                    area,
                    num(point, "resLevel"),
                    text(point, "pointItem"),
                    now + worldResourceDuration(catalog, num(point, "resLevel"), true, runtime),
                );
            }

            await store.clear(point);
        }

        if (!ready)
        {
            return;
        }

        const count = cityInteger(catalog.settings["resources_weight"]?.k8, 1, 32),
            interval = BigInt(
                Math.trunc(Number(catalog.settings["resources_weight"]?.k7) * 86400000),
            );

        if (interval <= 0n)
        {
            worldMutationFailure();
        }

        const clock = store.clock
            ? { ...store.clock }
            : {
                worldId: 0,
                groupStartedAt: now,
                usedGroups: String(random(count)),
                areaCursor: 0,
                nextRefreshAt: 0n,
            };
        let used = clock.usedGroups.split(",").map((id) => cityInteger(id, 0, count - 1));

        if (new Set(used).size !== used.length || used.length > count)
        {
            worldMutationFailure();
        }

        if (now >= clock.groupStartedAt + interval)
        {
            const available = Array.from({ length: count }, (_, index) => index).filter(
                (id) => !used.includes(id),
            );
            const next = available.length ? available[random(available.length)]! : random(count);
            used = available.length ? [next, ...used] : [next];
            clock.usedGroups = used.join(",");
            clock.groupStartedAt = now;
        }

        const group = catalog.resourceGroups?.get(
            used[0] === 0 ? "resources" : `resources${used[0]}`,
        );

        if (!group?.length)
        {
            worldMutationFailure();
        }

        const areas = worldResourceAreaCount(catalog, size, runtime);
        const spawn = async (area: number) => {
            const point = await store.free(area);

            if (!point)
            {
                return undefined;
            }

            const chosen = worldResourceChoice(
                catalog,
                group,
                point,
                size,
                now - store.opening,
                effects,
                area !== 0 && store.goldBonusUntil > now,
                random,
                area === 0,
                runtime,
            );

            if (!chosen)
            {
                return undefined;
            }

            if (chosen.type !== 6)
            {
                await store.spawn(
                    point,
                    chosen.type,
                    chosen.level,
                    chosen.amount,
                    now + worldResourceDuration(catalog, chosen.level, undefined, runtime),
                );
            }

            return chosen;
        };
        const pending = await store.pending();

        for (const ticket of pending)
        {
            const area = num(ticket, "areaId");

            if ((await store.population(area)) > limit(area))
            {
                await store.removeTicket(ticket);
                continue;
            }

            const chosen = await spawn(area);

            if (chosen && chosen.type !== 6)
            {
                await store.removeTicket(ticket);
            }
            else
            {
                await store.retry(
                    ticket,
                    now + worldResourceDuration(catalog, num(ticket, "level"), true, runtime),
                );
            }
        }

        let blackPopulation = await store.population(0);

        if (blackPopulation <= blackMinimum)
        {
            for (let budget = 0; budget < 64 && blackPopulation < blackMaximum; budget++)
            {
                const chosen = await spawn(0);

                if (!chosen)
                {
                    break;
                }

                if (chosen.type === 6)
                {
                    await store.ticket(
                        0,
                        1,
                        "0",
                        now + worldResourceDuration(catalog, 1, true, runtime),
                    );
                }

                blackPopulation++;
            }
        }

        let budget = 64;

        for (let visited = 0; visited < 8 && budget > 0 && clock.areaCursor < areas; visited++)
        {
            const area = clock.areaCursor + 1;
            let population = await store.population(area);

            while (population < quota && budget-- > 0)
            {
                const chosen = await spawn(area);

                if (!chosen)
                {
                    break;
                }

                if (chosen.type === 6)
                {
                    await store.ticket(
                        area,
                        1,
                        "0",
                        now + worldResourceDuration(catalog, 1, true, runtime),
                    );
                }

                population++;
            }

            if (budget > 0 || population >= quota)
            {
                clock.areaCursor++;
            }
        }

        if (clock.areaCursor >= areas)
        {
            clock.areaCursor = 0;
            clock.nextRefreshAt = expired.length === 64 || pending.length === 64
                ? now
                : now + 1800000n;
        }

        await store.save(clock);
    }
}
