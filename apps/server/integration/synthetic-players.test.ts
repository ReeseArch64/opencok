import { expect, test } from "bun:test";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { getPowerByPlayerId } from "@opencok/repositories/power";
import { calculatePlayerPower } from "@opencok/rules/power";
import { long } from "@opencok/contracts/rows";
import { powerContext } from "@opencok/services/power";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import { seedSyntheticPlayers } from "../scripts/synthetic-players";

test(
    "synthetic players are coherent, occupy empty cities and never replace existing data",
    async () => {
        const pg = new DisposablePostgres();
        let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"synthetic_players\"");
            await admin.end();
            db = createDatabase("kingdom", { ...pg.options, database: "synthetic_players" });
            await migrate(db.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
            const tiles = [];
            for (let index = 0; index <= 200; index++)
            {
                const x = (index % 25) * 48;
                const y = Math.floor(index / 25) * 48;
                for (
                    const [dx, dy] of [
                        [0, 0],
                        [1, 0],
                        [0, 1],
                        [1, 1],
                    ] as const
                )
                {
                    tiles.push({
                        id: 1 + x + dx + (y + dy) * 1201,
                        worldId: 0,
                        x: x + dx,
                        y: y + dy,
                        areaId: 1,
                        gridType: 0,
                        grid2Type: 0,
                        pointType: 0,
                        resLevel: 1,
                        resInitValue: 0,
                    });
                }
            }
            await db.db.insert(worldpoint).values(tiles);
            await db.pool.query(
                "update opencok_kingdom.worldpoint set \"pointType\" = 1, \"ownerId\" = $1 where id = 1",
                ["existing-owner"],
            );
            const rules = await loadRules(undefined, 1);
            await expect(seedSyntheticPlayers(db.db, rules, 201, Date.now())).rejects.toThrow();
            expect(await db.db.select().from(userprofile)).toHaveLength(0);
            const result = await seedSyntheticPlayers(db.db, rules, 200, Date.now());
            expect(result).toMatchObject({ players: 200, alliances: 8, cities: 200 });
            expect(await db.db.select().from(userprofile)).toHaveLength(200);
            expect(await db.db.select().from(user_army)).toHaveLength(1600);
            expect(await db.db.select().from(user_science)).toHaveLength(1200);
            expect((await db.db.select().from(user_item)).length).toBeGreaterThanOrEqual(600);
            expect(await db.db.select().from(alliance_member)).toHaveLength(200);
            expect(await db.db.select().from(new_general)).toHaveLength(200);
            expect((await db.db.select().from(playerinfo)).every((row) => (row.power ?? 0n) > 0n))
                .toBe(
                    true,
                );
            const powerState = await getPowerByPlayerId(db.db, "simseed-1-001", Date.now());
            const derived = calculatePlayerPower(
                { ...powerState, profile: powerState.profile! },
                rules,
                powerContext(rules, powerState.knight, {
                    kingdomId: 1,
                    version: "12.06.0",
                    now: Date.now(),
                }),
            );
            expect(derived.total).toEqual(long(powerState.statistics!, "power"));
            const map = await db.db.select().from(worldpoint);
            expect(map.filter((row) => row.pointType === 1)).toHaveLength(201);
            expect(map.filter((row) => row.pointType === 8)).toHaveLength(600);
            expect(map.find((row) => row.id === 1)?.ownerId).toBe("existing-owner");
            await expect(seedSyntheticPlayers(db.db, rules, 200, Date.now())).rejects.toThrow();
            expect(await db.db.select().from(userprofile)).toHaveLength(200);
        }
        finally
        {
            await db?.close();
            await pg.stop();
        }
    },
    120000,
);
