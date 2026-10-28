import {
    createRealmProductionService,
    planRealmProductionContext,
    createRealmProductionExecutor,
} from "../src/composition/production.ts";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import {
    createActivityExecutor,
    dueActivities,
    type ActivityDomain,
} from "@opencok/repositories/timed-activity";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { createMutationExecutor } from "@opencok/repositories/mutation";
import { changeProductionInTransaction } from "@opencok/production/repositories/production";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { productionScale } from "@opencok/production/rules/settlement";
import { loadRules } from "@opencok/resources/rules";
import { encode, sfs } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

test(
    "timed activities and building production commit once across concurrency, rollback, recovery and ownership loss",
    async () => {
        const pg = new DisposablePostgres();
        let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"timed\"");
            await admin.end();
            db = createDatabase("kingdom", { ...pg.options, database: "timed", max: 8 });
            await migrate(db.db, {
                migrationsFolder:
                    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
            await db.db.insert(userprofile).values({
                uid: "owner",
                name: "Synthetic",
                country: "BR",
                serverId: 1,
                level: 1,
                exp: 0,
                gold: 10000n,
            });
            await db.db.insert(user_resource).values({
                uid: "owner",
                wood: 0n,
                stone: 0n,
                iron: 0n,
                food: 100n,
                silver: 0,
                chip: 0,
                diamond: 0,
                dragon_food: 0,
                dragon_gold: 0,
                lastUpdateTime: 0n,
            });
            await db.db.insert(user_building).values({
                uuid: "wood",
                uid: "owner",
                itemId: 413000,
                pos: 17,
                level: 1,
                refreshTime: 1000n,
            });
            await db.db.insert(queue).values({
                uuid: "q",
                ownerId: "owner",
                qid: 1,
                type: 0,
                startTime: idleDeadline,
                endTime: idleDeadline,
                updateTime: idleDeadline,
                totalTime: 0n,
            });
            const rules = await loadRules(),
                effects = {
                    world: async () => new Map<number, number>(),
                    emperor: async () => null,
                };
            let now = 1000;
            const authority = await acquireRealmAuthority(db.db, 1, () => true);
            const sourceContext = await db.db.transaction(async (tx) =>
                planRealmProductionContext(
                    await readReconnectProgress(tx, "owner", 1, BigInt(now)),
                    rules,
                    BigInt(now),
                    {
                        worldPowerEffects: async () => new Map<string, string>(),
                        emperorVersion: async () => null,
                    },
                )
            );
            const sourceBuilding = (await db.db.select().from(user_building))[0]!;
            const baselineRates = await sourceContext.rates(sourceBuilding, BigInt(now));
            const boostRates = await sourceContext.rates(
                { ...sourceBuilding, effectTime: BigInt(now) + 3600000n },
                BigInt(now),
            );
            expect(baselineRates[0]!.perHour).toBeGreaterThan(0n);
            expect(boostRates[0]!.perHour).toBe(baselineRates[0]!.perHour * 2n);
            expect(boostRates.at(-1)!.perHour).toBe(baselineRates[0]!.perHour);

            const domain: ActivityDomain = async (tx, action, _activity, _now, economy) => {
                if (action === "start")
                {
                    economy.gold(-100n);
                }
                if (action === "cancel")
                {
                    economy.gold(50n);
                }
                if (action === "finish")
                {
                    await tx
                        .update(userprofile)
                        .set({ exp: sql`${userprofile.exp}+1` })
                        .where(eq(userprofile.uid, "owner"));
                }
                return encode({});
            };
            const domains = new Map([[0, domain]]);
            const service = new TimedActivityService(
                createActivityExecutor(db.db, authority, domains, () => now),
                rules,
                effects,
            );
            const operation = randomUUID();
            const starts = await Promise.all(
                Array.from({ length: 6 }, () =>
                    service.start("owner", operation, {
                        type: 0,
                        itemId: "synthetic-domain",
                        durationMs: 60000n,
                    })),
            );
            expect(new Set(starts.map((result) => result.body.activityId!.value)).size).toBe(1);
            expect(await db.db.select().from(timed_activity)).toHaveLength(1);
            const activity = (await db.db.select().from(timed_activity))[0]!;
            const params = {
                uuid: sfs.string("q"),
                activityId: sfs.string(activity.id),
                version: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            };
            await expect(service.command("owner", "queue.finish", params)).rejects.toThrow();
            now = 61000;
            expect(await dueActivities(db.db, [0], BigInt(now))).toHaveLength(1);
            const finished = await Promise.all(
                Array.from({ length: 6 }, () => service.command("owner", "queue.finish", params)),
            );
            expect(finished.every((result) => result.body.version!.value === 2)).toBe(true);
            expect((await db.db.select().from(userprofile))[0]!.exp).toBe(1);
            expect(await dueActivities(db.db, [0], BigInt(now))).toHaveLength(0);
            const second = await service.start("owner", randomUUID(), {
                type: 0,
                itemId: "synthetic-domain",
                durationMs: 100000n,
            });
            await expect(
                service.command("owner", "queue.cancel", {
                    ...params,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await service.command("owner", "queue.cancel", {
                ...params,
                activityId: second.body.activityId!,
                operationId: sfs.string(randomUUID()),
            });
            expect((await db.db.select().from(userprofile))[0]!.exp).toBe(1);
            expect((await db.db.select().from(userprofile))[0]!.gold).toBe(9850n);
            const opening = [...rules.goods.values()].find(
                (row) => row.type === "1" && Number(row.para1) >= 2 && Number(row.para2) > 0,
            )!;
            expect(opening).toBeDefined();
            await db.db
                .insert(user_item)
                .values({
                    uuid: "opening",
                    ownerId: "owner",
                    itemId: opening.id!,
                    count: 2,
                    value: 0,
                });
            const open = { uuid: sfs.string("opening"), operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 4 }, () => service.command("owner", "queue.open", open)),
            );
            const rented = (await db.db.select().from(queue)).find((row) => row.qid === 2)!;
            expect(rented).toBeDefined();
            expect((await db.db.select().from(user_item))[0]!.count).toBe(1);
            await service.command("owner", "queue.rent", {
                qUUID: sfs.string(rented.uuid),
                rentTime: sfs.int(3600),
                operationId: sfs.string(randomUUID()),
            });
            expect(
                (await db.db.select().from(queue).where(eq(queue.uuid, rented.uuid)))[0]!.endTime,
            ).toBe(
                rented.endTime! + 3600000n,
            );
            await expect(
                service.command("owner", "queue.rent", {
                    qUUID: sfs.string("q"),
                    rentTime: sfs.int(3600),
                }),
            ).rejects.toThrow();
            const speed = [...rules.goods.values()].find(
                (row) => row.type === "2" && row.para2 === "1" && Number(row.para3) > 0,
            )!;
            await db.db
                .insert(user_item)
                .values({
                    uuid: "speed",
                    ownerId: "owner",
                    itemId: speed.id!,
                    count: 10,
                    value: 0,
                });
            const running = await service.start("owner", randomUUID(), {
                type: 0,
                itemId: "synthetic-domain",
                durationMs: 86400000n,
            });
            const accelerate = {
                qUUID: sfs.string("q"),
                activityId: running.body.activityId!,
                version: sfs.int(1),
                itemUUID: sfs.string("speed"),
                itemCount: sfs.int(1),
                isGold: sfs.int(0),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(
                Array.from({ length: 4 }, () => service.command("owner", "queue.ccd", accelerate)),
            );
            expect(
                (await db.db.select().from(user_item).where(eq(user_item.uuid, "speed")))[0]!.count,
            ).toBe(9);
            const pending = (
                await db.db.select().from(timed_activity).where(eq(timed_activity.status, 0))
            )[0]!;
            expect(pending.dueAt).toBe(BigInt(now) + 86400000n - BigInt(speed.para3!) * 1000n);
            await db.db
                .insert(user_item)
                .values({
                    uuid: "percentage",
                    ownerId: "owner",
                    itemId: "200220",
                    count: 1,
                    value: 0,
                });
            await service.command("owner", "queue.ccd", {
                qUUID: sfs.string("q"),
                activityId: sfs.string(pending.id),
                version: sfs.int(pending.version),
                isGold: sfs.int(0),
                itemUUID: sfs.string("percentage"),
                guideStep: sfs.string("queue-speed"),
            });
            const accelerated = (
                await db.db.select().from(timed_activity).where(eq(timed_activity.id, pending.id))
            )[0]!;
            expect(accelerated.dueAt).toBe(
                BigInt(now)
                    + BigInt(Math.trunc(Number((pending.dueAt - BigInt(now)) / 1000n) * 0.75))
                        * 1000n,
            );
            expect((await db.db.select().from(userprofile))[0]!.guideStep).toBe("queue-speed");
            now = Number(accelerated.dueAt) + 10000;
            await service.command("owner", "queue.ccd", {
                qUUID: sfs.string("q"),
                isGold: sfs.int(1),
                activityId: sfs.string(pending.id),
                version: sfs.int(accelerated.version),
            });
            expect((await db.db.select().from(userprofile))[0]!.exp).toBe(2);
            const preparation = {
                async prepare()
                {
                    return async (building: Record<string, unknown>, from: bigint) =>
                        BigInt(String(building.effectTime ?? 0)) > from
                            ? [
                                { at: from, perHour: 200n * productionScale, capacity: 1000n },
                                {
                                    at: BigInt(String(building.effectTime)),
                                    perHour: 100n * productionScale,
                                    capacity: 1000n,
                                },
                            ]
                            : [{ at: from, perHour: 100n * productionScale, capacity: 1000n }];
                },
            };
            let production = createRealmProductionService(
                createRealmProductionExecutor(db.db, authority, preparation, () => now),
                rules,
                effects,
            );
            await db.db
                .update(user_building)
                .set({ refreshTime: BigInt(now) })
                .where(eq(user_building.uuid, "wood"));
            now += 3600000;
            const collect = { uuid: sfs.string("wood"), operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from(
                    { length: 8 },
                    () => production.command("owner", "build.collect", collect),
                ),
            );
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(100n);
            expect((await db.db.select().from(building_production))[0]!.amount).toBe(0n);
            await db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_timed_receipt() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''synthetic rollback''; END'`,
            );
            await db.db.execute(
                sql`CREATE TRIGGER reject_timed_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_timed_receipt()`,
            );
            now += 3600000;
            await expect(
                production.command("owner", "build.collect", {
                    ...collect,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(100n);
            await db.db.execute(
                sql`DROP TRIGGER reject_timed_receipt ON opencok_kingdom.command_receipt`,
            );
            await db.close();
            await pg.restart();
            db = createDatabase("kingdom", { ...pg.options, database: "timed", max: 8 });
            const next = await acquireRealmAuthority(db.db, 1, () => true);
            production = createRealmProductionService(
                createRealmProductionExecutor(db.db, next, preparation, () => now),
                rules,
                effects,
            );
            await production.command("owner", "build.collect", collect);
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(100n);
            await production.command("owner", "build.collect", {
                ...collect,
                operationId: sfs.string(randomUUID()),
            });
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(200n);
            const stale = createRealmProductionService(
                createRealmProductionExecutor(db.db, authority, preparation, () => now),
                rules,
                effects,
            );
            await expect(
                stale.command("owner", "build.collect", {
                    ...collect,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await db.db
                .update(queue)
                .set({
                    itemId: "restored-domain",
                    startTime: BigInt(now),
                    updateTime: BigInt(now) + 60000n,
                    totalTime: 60000n,
                })
                .where(eq(queue.uuid, "q"));
            const restoredService = new TimedActivityService(
                createActivityExecutor(db.db, next, domains, () => now),
                rules,
                effects,
            );
            const restoreGold = (await db.db.select().from(userprofile))[0]!.gold;
            const restored = await restoredService.restore("owner", randomUUID(), "q");
            expect((await db.db.select().from(userprofile))[0]!.gold).toBe(restoreGold);
            await expect(restoredService.restore("owner", randomUUID(), "q")).rejects.toThrow();
            await restoredService.command("owner", "queue.cancel", {
                uuid: sfs.string("q"),
                activityId: restored.body.activityId!,
                version: sfs.int(1),
            });
            const receiptCount = (await db.db.select().from(command_receipt)).length;
            const checkpoint = (await db.db.select().from(building_production))[0]!;
            now += 1800000;
            const change = createMutationExecutor(db.db, next, () => now);
            const rateChange = {
                owner: "owner",
                requestId: randomUUID(),
                command: "synthetic.rate",
                request: encode({}),
            };
            await Promise.all(
                Array.from({ length: 4 }, () =>
                    change(rateChange, async (tx) => {
                        await changeProductionInTransaction(
                            tx,
                            "owner",
                            BigInt(now),
                            [
                                {
                                    ...checkpoint,
                                    rates: [
                                        {
                                            at: checkpoint.settledAt,
                                            perHour: 100n * productionScale,
                                            capacity: 1000n,
                                        },
                                    ],
                                },
                            ],
                            async () => ({
                                result: undefined,
                                rates: async () => [
                                    {
                                        at: BigInt(now),
                                        perHour: 200n * productionScale,
                                        capacity: 1000n,
                                    },
                                ],
                            }),
                        );
                        return { response: encode({}) };
                    })),
            );
            now += 1800000;
            await production.command("owner", "build.collect", {
                uuid: sfs.string("wood"),
                operationId: sfs.string(randomUUID()),
            });
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(350n);
            expect(await db.db.select().from(command_receipt)).toHaveLength(receiptCount + 2);
            await db.db
                .insert(user_item)
                .values({ uuid: "boost", ownerId: "owner", itemId: "200027", count: 2, value: 0 });
            now += 900000;
            const boost = {
                uuid: sfs.string("wood"),
                goods: sfs.string("1"),
                operationId: sfs.string(randomUUID()),
            };
            const boosted = await Promise.all(
                Array.from(
                    { length: 4 },
                    () => production.command("owner", "building.addOutPut", boost),
                ),
            );
            expect(boosted[0]!.body.goods).toBeDefined();
            expect(boosted[0]!.body.gold).toBeUndefined();
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(350n);
            expect((await db.db.select().from(building_production))[0]!.amount).toBe(50n);
            expect(
                (await db.db.select().from(user_item).where(eq(user_item.uuid, "boost")))[0]!.count,
            ).toBe(1);
            await expect(
                production.command("owner", "building.addOutPut", {
                    ...boost,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            now += 900000;
            await production.command("owner", "build.collect", {
                uuid: sfs.string("wood"),
                operationId: sfs.string(randomUUID()),
            });
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(450n);
            now = Number((await db.db.select().from(user_building))[0]!.effectTime) + 1000;
            const goldBefore = (await db.db.select().from(userprofile))[0]!.gold!;
            const paidBoost = await production.command("owner", "building.addOutPut", {
                uuid: sfs.string("wood"),
                operationId: sfs.string(randomUUID()),
            });
            expect(paidBoost.body.gold).toBeDefined();
            expect(paidBoost.body.goods).toBeUndefined();
            expect((await db.db.select().from(userprofile))[0]!.gold!).toBeLessThan(goldBefore);
            expect((await db.db.select().from(user_resource))[0]!.wood).toBe(1450n);
        }
        finally
        {
            await db?.close();
            await pg.stop();
        }
    },
    120000,
);
