import { cityHarness } from "../integration/support/city";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { populationWork } from "./benchmark-world-population-domain";

export async function populationFixture(pages: number)
{
    const size = 64;
    if (!Number.isInteger(pages) || pages < 1 || pages > 8)
    {
        throw new Error("Population fixture requires 1..8 pages");
    }
    const h = await cityHarness([], false, undefined, size);
    const now = 1000000n;
    try
    {
        await h.db.db.insert(server_info).values({ uid: "server", activityTime: now + 86400000n });
        h.rules.items.set("worldmap_city", {
            ...h.rules.items.get("worldmap_city")!,
            k6: String(size),
        });
        h.rules.items.set("on_event2", {
            ...h.rules.items.get("on_event2")!,
            k1: "0",
            k9: "2030-01-01-00-00",
            k10: "2030-01-02-00-00",
        });
        const rows: (typeof worldpoint.$inferInsert)[] = [];
        for (let y = 0; y < size; y++)
        {
            for (let x = 0; x < size; x++)
            {
                rows.push({
                    id: 1 + x + y * size,
                    worldId: 0,
                    x,
                    y,
                    areaId: 1,
                    monsterAreaId: 1,
                    gridType: 2,
                    grid2Type: 0,
                    pointType: 0,
                    ownerId: "",
                    ownerMarchUUid: "",
                    resLevel: 1,
                    resInitValue: 0,
                    flushTime: 0n,
                });
            }
        }
        for (let start = 0; start < rows.length; start += 256)
        {
            await h.db.db.insert(worldpoint).values(rows.slice(start, start + 256));
        }
        const state = async () => {
            const points = await h.db.pool.query<{ type: number; count: number; }>(
                "SELECT \"pointType\" AS type, count(*)::int AS count FROM opencok_kingdom.worldpoint GROUP BY \"pointType\" ORDER BY \"pointType\"",
            );
            const outbox = await h.db.pool.query<{ count: number; }>(
                "SELECT count(*)::int AS count FROM opencok_kingdom.mutation_outbox",
            );
            const tickets = await h.db.pool.query<{ count: number; }>(
                "SELECT ((SELECT count(*) FROM opencok_kingdom.world_res_dead) + (SELECT count(*) FROM opencok_kingdom.world_res_new_dead))::int AS count",
            );
            return {
                points: points.rows,
                outbox: outbox.rows[0]!.count,
                tickets: tickets.rows[0]!.count,
            };
        };
        const reset = async (backlog: boolean) => {
            await h.db.pool.query(
                "TRUNCATE opencok_kingdom.trigger_var, opencok_kingdom.world_resource_runtime, opencok_kingdom.mutation_outbox, opencok_kingdom.world_res_dead, opencok_kingdom.world_res_new_dead",
            );
            await h.db.pool.query(
                "UPDATE opencok_kingdom.worldpoint SET \"pointType\"=0, \"pointItem\"=NULL, \"flushTime\"=0, \"startTime\"=0, \"resInitValue\"=0, \"ownerId\"=''",
            );
            await h.db.pool.query("UPDATE opencok_kingdom.server_info SET \"activityTime\"=$1", [
                String(now + 86400000n),
            ]);
            if (backlog)
            {
                await h.db.pool.query(
                    "UPDATE opencok_kingdom.worldpoint SET \"pointType\"=3, \"pointItem\"='0', \"resInitValue\"=100 WHERE id <= $1",
                    [pages * 64],
                );
                await h.db.pool.query(
                    "UPDATE opencok_kingdom.worldpoint SET \"pointType\"=7 WHERE id > $1 AND id <= $2",
                    [pages * 64, pages * 128],
                );
                const firstRow = pages * 2;
                for (let index = 0; index < pages * 64; index++)
                {
                    const x = 1 + (index % 32) * 2;
                    const y = firstRow + 1 + Math.floor(index / 32) * 2;
                    const id = 1 + x + y * size;
                    await h.db.pool.query(
                        "UPDATE opencok_kingdom.worldpoint SET \"pointType\"=CASE WHEN id=$1 THEN 37 ELSE 38 END, \"pointItem\"='0', \"resInitValue\"=100 WHERE id = ANY($2::int[])",
                        [id, [id, id - 1, id - size, id - size - 1]],
                    );
                }
            }
            return populationWork(h, size);
        };
        const generation = async (blocked: boolean) => {
            await reset(false);
            await h.db.pool.query("UPDATE opencok_kingdom.server_info SET \"activityTime\"=1");
            await h.db.pool.query("DELETE FROM opencok_kingdom.userprofile");
            await h.db.pool.query(
                "INSERT INTO opencok_kingdom.trigger_var (type, uid, key, value) VALUES (-1, '@world:0', 'opencok.world.terrain.v1', $1)",
                [JSON.stringify({ version: 1, kingdomId: 1, size, complete: true })],
            );
            if (blocked)
            {
                await h.db.pool.query(
                    "UPDATE opencok_kingdom.worldpoint SET \"ownerId\"='blocked'",
                );
            }
            h.rules.items.set("worldmap_city", {
                ...h.rules.items.get("worldmap_city")!,
                k4: "1",
                k7: "1",
            });
            h.rules.items.set("monster", { ...h.rules.items.get("monster")!, k1: String(size) });
            h.rules.items.set("worldmap_explore", {
                k1: String(size),
                k2: "0",
                k3: "1",
                k4: "1",
                k6: "0",
            });
            h.rules.items.set("world_barbarion", { k2: String(size), k3: "0" });
            h.rules.items.set("function_on2", { k9: "0" });
            h.rules.world.fieldMonsterGroups = new Map([["refresh", [{
                day: "0;999",
                para1: "9414;100",
            }]]]);
            h.rules.world.resources = new Map(Array.from({ length: 4 }, (_, group) => [
                group ? `resources${group}` : "resources",
                Array.from(
                    { length: size },
                    (_, band) => ({
                        id: String(band + 1),
                        area_level: String(band),
                        ratio: "1",
                        res_type: "0",
                        res_level: "1",
                        hours: "0",
                    }),
                ),
            ]));
            return populationWork(h, size);
        };
        return { ...h, now, size, pages, state, reset, generation };
    }
    catch (error)
    {
        await h.close();
        throw error;
    }
}
