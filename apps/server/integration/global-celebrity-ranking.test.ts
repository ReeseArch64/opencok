import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { server_info } from "@opencok/drizzle/schema/opencok_global/server_info";
import { readNormalRankingRealm } from "../../../packages/repositories/src/ranking-realm.ts";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { Cache } from "@opencok/storage/session";
import { DisposableRedis } from "./support/redis.ts";
import { eq } from "drizzle-orm";

test(
    "global ranking reads use fresh PostgreSQL realm classification and exact Redis category windows",
    async () => {
        const pg = new DisposablePostgres();
        const redis = new DisposableRedis();
        let database: ReturnType<typeof createDatabase<"global">> | undefined;
        try
        {
            const admin = await pg.start();
            try
            {
                await admin.query("CREATE DATABASE \"ranking_global\"");
            }
            finally
            {
                await admin.end();
            }
            database = createDatabase("global", { ...pg.options, database: "ranking_global" });
            await migrateDatabase(database.pool, "global");
            const cache = new Cache({
                redisUrl: await redis.start(),
                timeoutMs: 500,
                kingdomId: 2,
            });
            expect(await readNormalRankingRealm(database.db, 2)).toBe(false);
            await database.db.insert(server_info).values({ id: 2, type: 0 });
            for (const type of [0, 1, 6, 23, 2])
            {
                await database.db.update(server_info).set({ type }).where(eq(server_info.id, 2));
                expect(await readNormalRankingRealm(database.db, 2)).toBe(type !== 2);
            }
            expect(await readNormalRankingRealm(database.db, 1000000)).toBe(false);
            const board = Array.from(
                { length: 152 },
                (_, i) => JSON.stringify({ uid: `synthetic-${i}`, rank: i }),
            );
            await cache.command("RPUSH", "global_power_rank_2", ...board);
            await cache.command("RPUSH", "global_defence_wins_ranking_2", ...board);
            await cache.command("RPUSH", "global_power_rank_1", "different realm");
            expect(await cache.globalCelebrityRanking(1)).toEqual(board.slice(0, 151));
            expect(await cache.globalCelebrityRanking(5)).toEqual(board.slice(0, 151));
            expect(await cache.globalCelebrityRanking(4)).toEqual(board.slice(0, 30));
            expect(await cache.globalCelebrityRanking(0)).toEqual([]);
            expect(Number(await cache.command("LLEN", "global_power_rank_2"))).toBe(152);
            expect(Number(await cache.command("TTL", "global_power_rank_2"))).toBe(-1);
            expect(await cache.command("LRANGE", "global_power_rank_1", "0", "-1")).toEqual([
                "different realm",
            ]);
            await cache.command("SET", "global_kill_ranking_2", "wrong type");
            await expect(cache.globalCelebrityRanking(0)).rejects.toThrow();
            await database.pool.query("DROP TABLE opencok_global.server_info");
            expect(await readNormalRankingRealm(database.db, 2)).toBe(false);
            await redis.stop();
            await expect(cache.globalCelebrityRanking(1)).rejects.toThrow();
        }
        finally
        {
            await database?.close();
            await redis.stop();
            await pg.stop();
        }
    },
    120000,
);
