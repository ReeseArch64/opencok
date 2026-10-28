import { expect, test } from "bun:test";
import { eq, inArray } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, Type } from "@opencok/messages/sfs";
import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { createWorldUseDomain } from "@opencok/services/world-use";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness(
        [createWorldUseDomain(4, (maximum) => maximum - 1)],
        false,
        undefined,
        4,
    );
    try
    {
        h.rules.features.set("barbarion_switch", {
            id: "barbarion_switch",
            version: "2.0.17",
            online: "all",
            test: "all",
        });
        h.rules.items.set("world_barbarion", {
            ...h.rules.items.get("world_barbarion")!,
            k5: "4",
            k7: "3",
        });
        await h.db.db
            .insert(user_world)
            .values({ uid: "owner", pointId: 6, worldId: 0, lastCityDefTime: 0n });
        await h.db.db
            .update(userprofile)
            .set({ worldPoint: 6, appVersion: "12.06.0" })
            .where(eq(userprofile.uid, "owner"));
        await h.db.db.insert(worldpoint).values(
            Array.from({ length: 16 }, (_, index) => ({
                id: index + 1,
                worldId: 0,
                x: index % 4,
                y: Math.floor(index / 4),
                areaId: 1,
                gridType: 2,
                grid2Type: 0,
                pointType: index === 5 ? 1 : [0, 1, 4].includes(index) ? 8 : 0,
                ownerId: [0, 1, 4, 5].includes(index) ? "owner" : "",
                pointItem: [0, 1, 4].includes(index) ? "6" : null,
                resLevel: 0,
                resInitValue: 0,
            })),
        );
        return {
            ...h,
            query: (id: string) =>
                h.command("world.get.barbarion", {
                    operationId: sfs.string(id),
                    pointId: sfs.int(999),
                    currentHP: sfs.int(2147483647),
                    count: sfs.int(100),
                }),
            points: () => h.db.db.select().from(worldpoint).orderBy(worldpoint.id),
            actors: () => h.db.db.select().from(world_barbarion).orderBy(world_barbarion.pointId),
        };
    }
    catch (error)
    {
        await h.close();
        throw error;
    }
}
test(
    "native barbarian requests create configured actors once across concurrent replay and reuse living actors without healing",
    async () => {
        const h = await fixture();
        try
        {
            const balances = await h.db.db.select().from(userprofile),
                replies = await Promise.all(
                    Array.from({ length: 4 }, () => h.query("same-request")),
                ),
                id = Number(replies[0]!.body.pointId!.value);
            expect(
                replies.every(
                    (reply) =>
                        reply.body.pointId!.type === Type.Int && reply.body.pointId!.value === id,
                ),
            ).toBe(true);
            expect(id).toBeGreaterThan(0);
            const actors = await h.actors(),
                points = await h.points();
            expect(actors).toHaveLength(4);
            expect(
                actors.every(
                    (row) =>
                        row.configId === "4800000" && row.currentHP === 300
                        && row.lastBeAttackedTime === 0n,
                ),
            ).toBe(true);
            expect(points.filter((row) => row.pointType === 44)).toHaveLength(1);
            expect(points.filter((row) => row.pointType === 45)).toHaveLength(3);
            expect(
                points
                    .filter((row) => [44, 45].includes(row.pointType))
                    .every(
                        (row) =>
                            row.pointItem === "4800000" && row.flushTime === 1360000n
                            && row.flushFlag === 0,
                    ),
            ).toBe(true);
            expect(decodeJavaIntMap(actors[0]!.lastAwardArmyMapByteArray!)).toEqual(
                new Map([
                    ["107000", 130],
                    ["107100", 140],
                    ["107200", 130],
                ]),
            );
            expect(decodeJavaIntMap(actors[0]!.lastArmyMapByteArray!)!.size).toBeGreaterThan(0);
            await h.db.db
                .update(world_barbarion)
                .set({ currentHP: 201 })
                .where(eq(world_barbarion.pointId, id));
            expect((await h.query("reuse")).body.pointId).toEqual(sfs.int(id));
            expect((await h.actors()).find((row) => row.pointId === id)!.currentHP).toBe(201);
            expect(await h.actors()).toHaveLength(4);
            expect(await h.db.db.select().from(userprofile)).toEqual(balances);
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(2);
            expect(
                (await h.db.db.select().from(mutation_outbox)).filter(
                    (row) => row.eventType === "world.get.barbarion",
                ),
            ).toHaveLength(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "barbarian discovery requires positive factual fire health and strictly more than the configured remaining lifetime",
    async () => {
        const h = await fixture();
        try
        {
            const id = Number((await h.query("spawn")).body.pointId!.value);
            await h.db.db.update(worldpoint).set({ ownerId: "other" }).where(
                eq(worldpoint.pointType, 0),
            );
            await h.db.db.update(worldpoint).set({ fireTime: 1000000n }).where(
                eq(worldpoint.id, id),
            );
            expect((await h.query("burnt")).body.pointId).toEqual(sfs.int(-1));
            expect((await h.actors()).find((row) => row.pointId === id)!.currentHP).toBe(300);
            await h.db.db
                .update(worldpoint)
                .set({ fireTime: 0n, flushTime: 1180000n })
                .where(eq(worldpoint.id, id));
            expect((await h.query("ttl-equal")).body.pointId).toEqual(sfs.int(-1));
            await h.db.db.update(worldpoint).set({ flushTime: 1180001n }).where(
                eq(worldpoint.id, id),
            );
            expect((await h.query("ttl-positive")).body.pointId).toEqual(sfs.int(id));
            await h.db.db
                .update(world_barbarion)
                .set({ currentHP: 0 })
                .where(eq(world_barbarion.pointId, id));
            expect((await h.query("zero-hp")).body.pointId).toEqual(sfs.int(-1));
            await h.db.db.delete(world_barbarion).where(eq(world_barbarion.pointId, id));
            expect((await h.query("missing-actor")).body.pointId).toEqual(sfs.int(-1));
            expect((await h.points()).find((row) => row.id === id)!.pointType).toBe(44);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "barbarian feature, client version and resident realm gates reject before any actor creation",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.features.set("barbarion_switch", {
                id: "barbarion_switch",
                version: "2.0.17",
                online: "close",
                test: "close",
            });
            await expect(h.query("closed")).rejects.toMatchObject({ code: "102192" });
            h.rules.features.set("barbarion_switch", {
                id: "barbarion_switch",
                version: "2.0.17",
                online: "all",
                test: "all",
            });
            await h.db.db
                .update(userprofile)
                .set({ appVersion: "1.0.0" })
                .where(eq(userprofile.uid, "owner"));
            await expect(h.query("old-version")).rejects.toMatchObject({ code: "102192" });
            await h.db.db
                .update(userprofile)
                .set({ appVersion: "12.06.0", serverId: 2 })
                .where(eq(userprofile.uid, "owner"));
            await expect(h.query("foreign-realm")).rejects.toThrow();
            expect(await h.actors()).toHaveLength(0);
            expect((await h.points()).some((row) => row.pointType === 44)).toBe(false);
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "barbarian receipt failure rolls back actor maps, terrain and notifications before a successful retry",
    async () => {
        const h = await fixture();
        try
        {
            const before = await h.points();
            await h.db.pool.query(
                "CREATE FUNCTION reject_barbarian_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic barbarian receipt failure'; END $$",
            );
            await h.db.pool.query(
                "CREATE TRIGGER reject_barbarian_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_barbarian_receipt()",
            );
            await expect(h.query("rollback")).rejects.toThrow();
            expect(await h.actors()).toHaveLength(0);
            expect(await h.points()).toEqual(before);
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
            await h.db.pool.query(
                "DROP TRIGGER reject_barbarian_receipt ON opencok_kingdom.command_receipt",
            );
            await h.query("rollback");
            expect(await h.actors()).toHaveLength(4);
            expect((await h.points()).filter((row) => row.pointType === 44)).toHaveLength(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "new barbarian footprints cannot overwrite foreign ownership, active march claims or orphaned actor evidence",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.update(worldpoint).set({ ownerId: "other" }).where(
                eq(worldpoint.pointType, 0),
            );
            await h.db.db
                .update(worldpoint)
                .set({ ownerId: "" })
                .where(inArray(worldpoint.id, [11, 12, 15, 16]));
            await h.db.db
                .insert(world_barbarion)
                .values({
                    pointId: 11,
                    configId: "4800000",
                    currentHP: 123,
                    lastBeAttackedTime: 99n,
                });
            expect((await h.query("orphaned")).body.pointId).toEqual(sfs.int(-1));
            expect((await h.actors())[0]).toMatchObject({
                pointId: 11,
                currentHP: 123,
                lastBeAttackedTime: 99n,
            });
            await h.db.db.delete(world_barbarion);
            await h.db.db.insert(world_march).values({
                uuid: "foreign-march",
                ownerUid: "other",
                ownerId: 6,
                type: 0,
                targetId: 16,
                marchStartTime: 0n,
                worldId: 0,
            });
            expect((await h.query("claimed")).body.pointId).toEqual(sfs.int(-1));
            expect(await h.actors()).toHaveLength(0);
            expect(await h.db.db.select().from(world_march)).toHaveLength(1);
            await h.db.db.delete(world_march);
            expect((await h.query("free")).body.pointId).toEqual(sfs.int(16));
            expect(await h.actors()).toHaveLength(4);
            expect(
                (await h.points())
                    .filter((row) => row.ownerId === "other")
                    .every((row) => row.pointType === 0),
            ).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
