import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test(
    "construction commits costs, positions, queues, progression and earned production exactly once",
    async () => {
        const h = await cityHarness();
        try
        {
            const id = "owner-413000";
            await expect(
                h.command("build.upgrade", { uuid: sfs.string("other-413000"), gold: sfs.int(0) }),
            ).rejects.toThrow();
            await expect(
                h.command("build.create", {
                    itemId: sfs.string("413000"),
                    pos: sfs.int(6),
                    gold: sfs.int(0),
                }),
            ).rejects.toThrow();
            await expect(
                h.command("build.create", {
                    itemId: sfs.string("413000"),
                    pos: sfs.int(17),
                    gold: sfs.int(0),
                }),
            ).rejects.toThrow();
            const operationId = sfs.string(randomUUID()),
                params = { uuid: sfs.string(id), gold: sfs.int(0), operationId };
            const before = (
                await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
            )[0]!;
            const started = await Promise.all(
                Array.from({ length: 5 }, () => h.command("build.upgrade", params)),
            );
            expect(new Set(started.map((reply) => reply.body.activityId!.value)).size).toBe(1);
            expect((await h.building(id))!.opType).toBe(1);
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!.food,
            ).toBe(before.food - 140n);
            await expect(
                h.command("build.upgrade", { ...params, operationId: sfs.string(randomUUID()) }),
            ).rejects.toThrow();
            const activity = await h.active(0);
            await expect(
                h.service.command("owner", "queue.finish", {
                    uuid: sfs.string(activity.queueId),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await h.finish(0);
            expect((await h.building(id))!.level).toBe(2);
            expect((await h.building(id))!.opType).toBe(0);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .exp,
            ).toBe(8);
            const account = (
                await h.db.db.select().from(building_production).where(
                    eq(building_production.buildingId, id),
                )
            )[0]!;
            expect(account.amount).toBeGreaterThan(0n);
            const next = await h.command("build.upgrade", {
                uuid: sfs.string(id),
                gold: sfs.int(0),
            });
            await expect(
                h.service.command("owner", "queue.cancel", {
                    uuid: sfs.string(activity.queueId),
                    activityId: sfs.string(activity.id),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            const cancelParams = {
                uuid: sfs.string(activity.queueId),
                activityId: next.body.activityId!,
                operationId: sfs.string(randomUUID()),
            };
            const cancelled = await h.service.command("owner", "queue.cancel", cancelParams);
            expect((await h.building(id))!.level).toBe(2);
            expect((await h.building(id))!.opType).toBe(0);
            expect((await h.service.command("owner", "queue.cancel", cancelParams)).body).toEqual(
                cancelled.body,
            );
            const created = await h.command("build.create", {
                itemId: sfs.string("413000"),
                pos: sfs.int(20),
                gold: sfs.int(1),
            });
            const createdId = String(created.body.uuid!.value);
            expect((await h.building(createdId))!.level).toBe(1);
            await h.command("build.destroy", { uuid: sfs.string(createdId) });
            await h.finish(0);
            expect(await h.building(createdId)).toBeUndefined();
            expect(
                await h.db.db
                    .select()
                    .from(building_production)
                    .where(eq(building_production.buildingId, createdId)),
            ).toHaveLength(0);
            const beforeMove = await h.building(id);
            await h.command("build.move", {
                pos1: sfs.int(17),
                pos2: sfs.int(20),
                gold: sfs.int(1),
            });
            expect((await h.building(id))!.pos).toBe(20);
            expect(beforeMove!.uuid).toBe((await h.building(id))!.uuid);
            const rollbackId = randomUUID();
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_city_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_city_receipt BEFORE INSERT ON ${command_receipt} FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_city_receipt()`,
            );
            const count = (await h.db.db.select().from(timed_activity)).length;
            await expect(
                h.command("build.upgrade", {
                    uuid: sfs.string(id),
                    gold: sfs.int(0),
                    operationId: sfs.string(rollbackId),
                }),
            ).rejects.toThrow();
            expect((await h.building(id))!.opType).toBe(0);
            expect((await h.db.db.select().from(timed_activity)).length).toBe(count);
            await h.db.db.execute(sql`DROP TRIGGER reject_city_receipt ON ${command_receipt}`);
            await h.command("build.upgrade", {
                uuid: sfs.string(id),
                gold: sfs.int(0),
                operationId: sfs.string(rollbackId),
            });
            expect((await h.building(id))!.opType).toBe(1);
            expect(await h.db.db.select().from(user_building)).toHaveLength(16);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test("star unlocks and castle rewards apply once with persisted targets", async () => {
    const h = await cityHarness();
    try
    {
        h.rules.maxStar = () => 1;
        const base = {
            buildingId: 413000,
            level: 30,
            starLevel: 0,
            costs: { food: 100n },
            constructionSeconds: 60,
            experience: 10,
            power: 100,
            maxInstances: 10,
            unlockConditions: [{ code: 3, value: 1 }],
            effects: { productionResourceId: 0, productionPerHour: 120, productionCapacity: 1200 },
            upgrades: {
                constructionSeconds: [{ progress: 100, value: 60 }],
                experience: [{ progress: 100, value: 10 }],
            },
        };
        h.rules.buildings.set(413030, { ...base, id: 413030 });
        h.rules.buildings.set(413031, {
            ...base,
            id: 413031,
            starLevel: 1,
            power: 200,
            unlockConditions: [],
        });
        await h.db.db
            .update(user_building)
            .set({ level: 30, star: 0, progress: 90, unlockFlag: 0 })
            .where(eq(user_building.uuid, "owner-413000"));
        const params = { uuid: sfs.string("owner-413000"), gold: sfs.int(0) };
        await h.command("buildingUnlock.glory", { uuid: params.uuid, cost: sfs.int(0) });
        expect((await h.building("owner-413000"))!.unlockFlag).toBe(1);
        await h.command("build.upgrade", params);
        const active = await h.active(0);
        expect((active.data as { target: unknown; }).target).toEqual({
            level: 30,
            star: 1,
            progress: 0,
        });
        await h.finish(0);
        expect((await h.building("owner-413000"))!.star).toBe(1);
        expect((await h.building("owner-413000"))!.progress).toBe(0);
        await expect(h.command("build.upgrade", params)).rejects.toThrow();
        const castleRule = h.rules.buildings.get(400001)!;
        h.rules.buildings.set(400001, {
            ...castleRule,
            clientParameters: [null, null, null, { value: "synthetic-castle-reward" }],
        });
        h.rules.reconnect.rewards!.set("synthetic-castle-reward", {
            id: "synthetic-castle-reward",
            gold: "1",
            wood: "50",
        });
        await h.db.db
            .update(user_building)
            .set({ reward: 1 })
            .where(eq(user_building.uuid, "owner-400000"));
        const operationId = sfs.string(randomUUID());
        const before = (
            await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
        )[0]!.gold;
        const reward = await h.command("building.reward", { operationId });
        expect((await h.command("building.reward", { operationId })).body).toEqual(reward.body);
        await expect(h.command("building.reward", {})).rejects.toThrow();
        expect(
            (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
        ).toBe(before! + 1n);
        expect((await h.building("owner-400000"))!.reward).toBe(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);

test(
    "legacy occupied construction is restored without recharging and malformed targets remain preserved",
    async () => {
        const { queue } = await import("@opencok/drizzle/schema/opencok_kingdom/queue");
        const { unregisteredActivities } = await import("@opencok/repositories/timed-activity");
        const h = await cityHarness();
        try
        {
            await h.db.db
                .update(user_building)
                .set({ opType: 1 })
                .where(eq(user_building.uuid, "owner-413000"));
            await h.db.db
                .update(queue)
                .set({
                    itemId: "owner-413000",
                    startTime: BigInt(h.clock.now),
                    updateTime: BigInt(h.clock.now + 60000),
                    totalTime: 60000n,
                })
                .where(eq(queue.uuid, "owner-q0"));
            const pending = await unregisteredActivities(h.db.db, [0], 64, "owner");
            expect(pending.map((row) => row.uuid)).toEqual(["owner-q0"]);
            const operationId = randomUUID();
            const restored = await h.service.restore("owner", operationId, "owner-q0");
            expect((await h.service.restore("owner", operationId, "owner-q0")).body).toEqual(
                restored.body,
            );
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!.food,
            ).toBe(1000000n);
            expect(await unregisteredActivities(h.db.db, [0], 64, "owner")).toHaveLength(0);
            await h.finish(0);
            expect((await h.building("owner-413000"))!.level).toBe(2);
            await h.db.db
                .update(queue)
                .set({
                    itemId: "missing-building",
                    startTime: BigInt(h.clock.now),
                    updateTime: BigInt(h.clock.now + 60000),
                })
                .where(eq(queue.uuid, "owner-q0"));
            await expect(h.service.restore("owner", randomUUID(), "owner-q0")).rejects.toThrow();
            expect(
                (await h.db.db.select().from(queue).where(eq(queue.uuid, "owner-q0")))[0]!.itemId,
            ).toBe(
                "missing-building",
            );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "overdue construction installs the new rate at its deadline and retains the preceding output",
    async () => {
        const h = await cityHarness();
        try
        {
            const started = BigInt(h.clock.now);
            await h.command("build.upgrade", {
                uuid: sfs.string("owner-413000"),
                gold: sfs.int(0),
            });
            const activity = await h.active(0);
            h.clock.now = Number(activity.dueAt) + 3600000;
            await h.finish(0);
            const checkpoint = (
                await h.db.db
                    .select()
                    .from(building_production)
                    .where(eq(building_production.buildingId, "owner-413000"))
            )[0]!;
            expect(checkpoint.settledAt).toBe(activity.dueAt);
            const { decodeProductionRates } = await import("@opencok/mappings/production");
            const next = decodeProductionRates(checkpoint.rates)[0]!;
            const expected = ((activity.dueAt - started) * 120000000n + 3600000n * next.perHour)
                / 3600000000000n;
            await h.production.command("owner", "production.settle", {});
            expect(
                (
                    await h.db.db
                        .select()
                        .from(building_production)
                        .where(eq(building_production.buildingId, "owner-413000"))
                )[0]!.amount,
            ).toBe(expected);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
