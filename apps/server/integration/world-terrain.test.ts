import { expect, test } from "bun:test";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import {
    importWorldTerrain,
    assertWorldTerrain,
    checkWorldTerrainImportTarget,
} from "@opencok/repositories/world-terrain";
import { initializeWorldBirth, worldBirthIdentity } from "@opencok/repositories/world-birth";
import { parseWorldTerrain } from "@opencok/resources/world-terrain";
import { terrainXml } from "../../../packages/resources/tests/support/world-terrain";
import { worldTerrainKey } from "@opencok/rules/world-terrain";
import { parseWorldBirth } from "@opencok/rules/world-birth";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
async function fixture()
{
    const pg = new DisposablePostgres(),
        admin = await pg.start();
    await admin.query("CREATE DATABASE \"terrain\"");
    await admin.end();
    let db = createDatabase("kingdom", { ...pg.options, database: "terrain", max: 8 });
    try
    {
        await migrate(db.db, {
            migrationsFolder:
                new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                    .pathname,
        });
        let authority = await acquireRealmAuthority(db.db, 1, () => true);
        const terrain = parseWorldTerrain(Buffer.from(terrainXml())),
            settings = { size: 5, bornSide: 2, resourceSide: 2, monsterSide: 2 },
            birth = {
                side: 2,
                limits: [50],
                priorities: Array.from({ length: 98 }, (_, i) => ({ id: 43000 + i, areas: [1] })),
            },
            complete: Parameters<typeof importWorldTerrain>[4]["complete"] = (tx, owner, now) =>
                initializeWorldBirth(tx, owner, birth, now);
        return {
            get db()
            {
                return db;
            },
            get authority()
            {
                return authority;
            },
            terrain,
            settings,
            complete,
            async run(options: Partial<Parameters<typeof importWorldTerrain>[4]> = {})
            {
                return importWorldTerrain(db.db, authority, terrain, settings, {
                    complete,
                    pageSize: 4,
                    now: () => 1000000,
                    ...options,
                });
            },
            async adopt()
            {
                authority = await acquireRealmAuthority(db.db, 1, () => true);
                return authority;
            },
            async reconnect()
            {
                await db.close();
                db = createDatabase("kingdom", { ...pg.options, database: "terrain", max: 8 });
            },
            async manifest()
            {
                return JSON.parse(
                    (await db.db.select().from(trigger_var).where(
                        eq(trigger_var.key, worldTerrainKey),
                    ))[0]!
                        .value,
                );
            },
            async close()
            {
                await db.close();
                await pg.stop();
            },
        };
    }
    catch (error)
    {
        await db.close();
        await pg.stop();
        throw error;
    }
}
test(
    "fresh terrain resumes from durable pages and a new pool and epoch before atomically publishing birth readiness",
    async () => {
        const h = await fixture();
        try
        {
            expect(await assertWorldTerrain(h.db.db, h.authority, 1200)).toBeUndefined();
            await checkWorldTerrainImportTarget(h.db.db, 1);
            const first = await h.run({ pageLimit: 1 });
            expect(first).toMatchObject({ cursor: 4, complete: false, size: 5 });
            expect(await h.db.db.select().from(worldpoint)).toHaveLength(4);
            await expect(assertWorldTerrain(h.db.db, h.authority, 5)).rejects.toThrow();
            await checkWorldTerrainImportTarget(h.db.db, 1);
            await h.reconnect();
            await h.adopt();
            const done = await h.run();
            expect(done).toMatchObject({
                cursor: 25,
                complete: true,
                epoch: String(h.authority.epoch),
            });
            expect(await assertWorldTerrain(h.db.db, h.authority, 5)).toEqual(done);
            await expect(assertWorldTerrain(h.db.db, h.authority, 1200)).rejects.toThrow();
            const rows = await h.db.db.select().from(worldpoint);
            expect(rows).toHaveLength(25);
            expect(
                rows.every((row) =>
                    row.gridType === 2 && row.grid2Type === 0 && row.pointType === 0
                ),
            ).toBe(true);
            expect(rows.find((row) => row.id === 25)).toMatchObject({
                x: 4,
                y: 4,
                bornAreaId: 9,
                areaId: 5,
                monsterAreaId: 5,
                startTime: 0n,
            });
            const [birth] = await h.db.db
                .select()
                .from(trigger_var)
                .where(eq(trigger_var.key, worldBirthIdentity.key));
            expect(parseWorldBirth(birth!.value)).toMatchObject({
                priority: 43000,
                phase: 0,
                round: 1,
                limit: 50,
                counts: {},
                epoch: String(h.authority.epoch),
            });
            expect(await h.run()).toEqual(done);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("concurrent identical imports serialize one native map and one birth phase", async () => {
    const h = await fixture();
    try
    {
        const replies = await Promise.all([h.run(), h.run()]);
        expect(replies.every((reply) => reply.complete)).toBe(true);
        expect(await h.db.db.select().from(worldpoint)).toHaveLength(25);
        expect(await h.db.db.select().from(trigger_var)).toHaveLength(2);
        await expect(
            importWorldTerrain(
                h.db.db,
                h.authority,
                { ...h.terrain, sourceHash: "f".repeat(64) },
                h.settings,
                { complete: h.complete },
            ),
        ).rejects.toThrow();
        const changed = { ...h.terrain, grid: h.terrain.grid.slice() };
        changed.grid[0] = 1;
        await expect(
            importWorldTerrain(h.db.db, h.authority, changed, h.settings, { complete: h.complete }),
        ).rejects.toThrow();
        expect((await h.manifest()).complete).toBe(true);
    }
    finally
    {
        await h.close();
    }
}, 120000);
test(
    "failed page and final birth writes roll back cursor and tiles and remain safely retryable",
    async () => {
        const h = await fixture();
        try
        {
            await h.run({ pageLimit: 1 });
            await h.db.pool.query(
                "CREATE FUNCTION terrain_reject() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.id=6 THEN RAISE EXCEPTION 'synthetic terrain failure'; END IF; RETURN NEW; END $$",
            );
            await h.db.pool.query(
                "CREATE TRIGGER terrain_reject BEFORE INSERT ON opencok_kingdom.worldpoint FOR EACH ROW EXECUTE FUNCTION terrain_reject()",
            );
            await expect(h.run()).rejects.toThrow();
            expect((await h.manifest()).cursor).toBe(4);
            expect(await h.db.db.select().from(worldpoint)).toHaveLength(4);
            await h.db.pool.query("DROP TRIGGER terrain_reject ON opencok_kingdom.worldpoint");
            await h.run({ pageLimit: 5 });
            expect((await h.manifest()).cursor).toBe(24);
            await expect(
                h.run({
                    complete: async () => {
                        throw new Error("synthetic finalization failure");
                    },
                }),
            ).rejects.toThrow();
            expect((await h.manifest()).cursor).toBe(24);
            expect(await h.db.db.select().from(worldpoint)).toHaveLength(24);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(1);
            expect((await h.run()).complete).toBe(true);
            expect(await h.db.db.select().from(worldpoint)).toHaveLength(25);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("populated legacy realms and stale ownership cannot be filled or overwritten", async () => {
    const h = await fixture();
    try
    {
        await expect(checkWorldTerrainImportTarget(h.db.db, 2)).rejects.toThrow();
        const stale = h.authority;
        await h.adopt();
        await expect(
            importWorldTerrain(h.db.db, stale, h.terrain, h.settings, { complete: h.complete }),
        ).rejects.toThrow();
        expect(await h.db.db.select().from(worldpoint)).toHaveLength(0);
        await h.db.db.insert(worldpoint).values({
            id: 1,
            worldId: 0,
            x: 0,
            y: 0,
            areaId: 0,
            gridType: 0,
            grid2Type: 0,
            pointType: 1,
            ownerId: "preserved",
            resLevel: 0,
            resInitValue: 0,
        });
        await expect(h.run()).rejects.toThrow();
        expect((await h.db.db.select().from(worldpoint))[0]!.ownerId).toBe("preserved");
        expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
        expect(await assertWorldTerrain(h.db.db, h.authority, 1200)).toBeUndefined();
        await h.db.db.delete(worldpoint);
        await h.db.db.insert(userprofile).values({
            uid: "preserved",
            name: "preserved",
            serverId: 1,
            level: 1,
            exp: 0,
            country: "BR",
        });
        await expect(h.run()).rejects.toThrow();
        expect(await h.db.db.select().from(worldpoint)).toHaveLength(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);
test(
    "partial ownership or malformed manifests preserve all saved data and completed replay preserves actual cities",
    async () => {
        const h = await fixture();
        try
        {
            await h.run({ pageLimit: 1 });
            await h.db.db
                .update(worldpoint)
                .set({ ownerId: "preserved", pointType: 1 })
                .where(eq(worldpoint.id, 1));
            await expect(h.run()).rejects.toThrow();
            expect((await h.manifest()).cursor).toBe(4);
            await h.db.db
                .update(worldpoint)
                .set({ ownerId: null, pointType: 0 })
                .where(eq(worldpoint.id, 1));
            await h.run();
            await h.db.db
                .update(worldpoint)
                .set({ ownerId: "preserved", pointType: 1 })
                .where(eq(worldpoint.id, 1));
            expect((await h.run()).complete).toBe(true);
            expect(
                (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1)))[0]!.ownerId,
            ).toBe(
                "preserved",
            );
            const saved = await h.manifest();
            await h.db.db
                .update(trigger_var)
                .set({ value: JSON.stringify({ ...saved, cursor: 26 }) })
                .where(eq(trigger_var.key, worldTerrainKey));
            await expect(assertWorldTerrain(h.db.db, h.authority, 5)).rejects.toThrow();
            await expect(h.run()).rejects.toThrow();
            expect(await h.db.db.select().from(worldpoint)).toHaveLength(25);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
