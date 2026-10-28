import { expect, test } from "bun:test";
import { and, eq } from "drizzle-orm";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { ActivityDispatchResult } from "@opencok/queues/enums/dispatch-result";
import { ActivityOperationMapper } from "@opencok/queues/mappings/operation-id";
import { sfs, encode, decode, fields } from "@opencok/messages/sfs";
import { schedulerHarness } from "./support/fixture";

const roster = [
    { type: 0, item: "413000" },
    { type: 1, item: "107000" },
    { type: 2, item: "107900" },
    { type: 3, item: "1" },
    { type: 6, item: "700100" },
    { type: 8, item: "107100" },
    { type: 9, item: "107200" },
    { type: 10, item: "107300" },
    { type: 11, item: "1001010" },
    { type: 12, item: "201010;" },
    { type: 17, item: "107010" },
    { type: 19, item: "5607100" },
] as const;

test(
    "signed owner dispatch restores and completes every registered timed family with native receipt replay",
    async () => {
        const h = await schedulerHarness();
        const now = 1000000;
        const deadline = BigInt(now + 5000);
        const operationIds = new ActivityOperationMapper();
        const executed: number[] = [];
        try
        {
            await h.startOwner(1, true, now);
            const dispatcher = h.publisher(1, 5000);
            expect(await dispatcher.capabilities()).toEqual(roster.map((entry) => entry.type));
            const db = h.kingdoms[0]!.db;
            for (const entry of roster)
            {
                const uid = `roster-${entry.type}`;
                await h.seedOwner(1, uid, now);
                const item = entry.type === 0
                    ? `${uid}-413000`
                    : entry.type === 11
                    ? `${uid}-equipment`
                    : entry.item;
                await db.transaction(async (tx) => {
                    await tx.update(queue).set({
                        itemId: item,
                        startTime: BigInt(now),
                        updateTime: deadline,
                        totalTime: 5000n,
                    }).where(eq(queue.uuid, `${uid}-q${entry.type}`));
                    if (entry.type === 0)
                    {
                        await tx.update(user_building).set({ opType: 1, updateTime: deadline })
                            .where(eq(user_building.uuid, item));
                    }
                    else if ([1, 8, 9, 10, 17].includes(entry.type))
                    {
                        await tx.insert(user_army).values({
                            uid,
                            armyId: entry.item,
                            free: 2,
                            train: 3,
                            finishTime: deadline,
                            foodCostTime: BigInt(now),
                        });
                    }
                    else if (entry.type === 2)
                    {
                        await tx.insert(user_wall).values({
                            uid,
                            armyId: entry.item,
                            level: 0,
                            num: 4,
                            build: 3,
                            finishTime: deadline,
                        });
                    }
                    else if (entry.type === 3)
                    {
                        await tx.insert(user_army).values({
                            uid,
                            armyId: "107000",
                            free: 4,
                            foodCostTime: BigInt(now),
                        });
                        await tx.insert(user_hospital).values({
                            uid,
                            armyId: "107000",
                            dead: 2,
                            heal: 3,
                            finishTime: deadline,
                        });
                    }
                    else if (entry.type === 6)
                    {
                        await tx.insert(user_science).values({
                            uid,
                            itemId: entry.item,
                            level: 0,
                            cd: deadline,
                        });
                    }
                    else if (entry.type === 11)
                    {
                        await tx.insert(user_equip).values({
                            uid,
                            uuid: item,
                            itemId: Number(entry.item),
                            on: 2,
                            cost: "0;100",
                        });
                    }
                    else if (entry.type === 19)
                    {
                        await tx.insert(user_civilization_science).values({
                            userID: uid,
                            baseItemID: Number(entry.item),
                            level: 0,
                        });
                    }
                });
                const legacy = await h.legacy(1, `${uid}-q${entry.type}`);
                expect(
                    await Promise.all(Array.from({ length: 3 }, () => dispatcher.restore(legacy))),
                )
                    .toEqual(Array(3).fill(ActivityDispatchResult.Applied));
                const active = await h.active(1, entry.type, uid);
                expect(active.dueAt).toBe(deadline);
                expect(active.version).toBe(1);
                await h.owner(1).request("clock", { now: Number(deadline) - 1 });
                expect(await dispatcher.finish(active)).toBe(ActivityDispatchResult.NotDue);
                expect(
                    (await db.select().from(timed_activity).where(
                        eq(timed_activity.id, active.id),
                    ))[0]!.status,
                ).toBe(0);
                await h.owner(1).request("clock", { now: Number(deadline) });
                expect(
                    await Promise.all(Array.from({ length: 3 }, () => dispatcher.finish(active))),
                )
                    .toEqual(Array(3).fill(ActivityDispatchResult.Applied));
                const completed = (await db.select().from(timed_activity).where(
                    eq(timed_activity.id, active.id),
                ))[0]!;
                expect(completed).toMatchObject({ status: 1, version: 2, dueAt: deadline });
                const receipts = await db.select().from(command_receipt).where(
                    eq(command_receipt.ownerUid, uid),
                );
                expect(receipts.filter((row) => row.command === "activity.restore")).toHaveLength(
                    1,
                );
                expect(receipts.filter((row) => row.command === "queue.finish")).toHaveLength(1);
                const receipt = receipts.find((row) => row.command === "queue.finish")!;
                expect(receipt.requestId).toBe(operationIds.finish(active));
                expect(receipt.ownerEpoch).toBe(BigInt(String(h.owner(1).address.epoch)));
                expect(receipt.request).toEqual(
                    encode({
                        activityId: sfs.string(active.id),
                        uuid: sfs.string(active.queueId),
                        version: sfs.int(active.version),
                    }),
                );
                const body = fields(decode(receipt.response).body);
                expect(body.activityId).toEqual(sfs.string(active.id));
                expect(body.version).toEqual(sfs.int(2));
                const postings = await db.select().from(economy_posting).where(
                    eq(economy_posting.ownerUid, uid),
                );
                const events = await db.select().from(mutation_outbox).where(
                    eq(mutation_outbox.ownerUid, uid),
                );
                const resources = await db.select().from(user_resource).where(
                    eq(user_resource.uid, uid),
                );
                const native = await h.command(
                    1,
                    "queue.finish",
                    {
                        uuid: sfs.string(active.queueId),
                        activityId: sfs.string(active.id),
                        version: sfs.int(active.version),
                        operationId: sfs.string(operationIds.finish(active)),
                    },
                    uid,
                    true,
                );
                expect(encode(native)).toEqual(
                    encode({ ...body, operationId: sfs.string(operationIds.finish(active)) }),
                );
                expect(
                    await db.select().from(economy_posting).where(
                        eq(economy_posting.ownerUid, uid),
                    ),
                ).toEqual(postings);
                expect(
                    await db.select().from(mutation_outbox).where(
                        eq(mutation_outbox.ownerUid, uid),
                    ),
                ).toEqual(events);
                expect(await db.select().from(user_resource).where(eq(user_resource.uid, uid)))
                    .toEqual(resources);
                expect(
                    events.filter((row) =>
                        row.requestId === operationIds.finish(active)
                        && row.eventType === "queue.finish"
                    ),
                ).toHaveLength(1);
                if (entry.type === 0)
                {
                    expect(
                        (await db.select().from(user_building).where(eq(user_building.uuid, item)))[
                            0
                        ],
                    ).toMatchObject({ level: 2, opType: 0 });
                }
                else if ([1, 8, 9, 10, 17].includes(entry.type))
                {
                    expect(
                        (await db.select().from(user_army).where(
                            and(eq(user_army.uid, uid), eq(user_army.armyId, entry.item)),
                        ))[0],
                    ).toMatchObject({ free: 5, train: 0, finishTime: 0n });
                }
                else if (entry.type === 2)
                {
                    expect((await db.select().from(user_wall).where(eq(user_wall.uid, uid)))[0])
                        .toMatchObject({ num: 7, build: 0, finishTime: 0n });
                }
                else if (entry.type === 3)
                {
                    expect(
                        (await db.select().from(user_hospital).where(eq(user_hospital.uid, uid)))[
                            0
                        ],
                    ).toMatchObject({ dead: 2, heal: 0, finishTime: 0n });
                    expect(
                        (await db.select().from(user_army).where(eq(user_army.uid, uid)))[0]!.free,
                    ).toBe(7);
                }
                else if (entry.type === 6)
                {
                    expect(
                        (await db.select().from(user_science).where(eq(user_science.uid, uid)))[0]!
                            .level,
                    ).toBe(1);
                }
                else if (entry.type === 11)
                {
                    expect((await db.select().from(user_equip).where(eq(user_equip.uid, uid)))[0])
                        .toMatchObject({ on: 0, cost: "" });
                }
                else if (entry.type === 12)
                {
                    expect((await db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0])
                        .toMatchObject({ itemId: "201010", count: 1 });
                }
                else if (entry.type === 19)
                {
                    expect(
                        (await db.select().from(user_civilization_science).where(
                            eq(user_civilization_science.userID, uid),
                        ))[0]!.level,
                    ).toBe(1);
                }
                expect(
                    (await db.select().from(queue).where(eq(queue.uuid, active.queueId)))[0]!
                        .itemId,
                ).toBe("");
                executed.push(entry.type);
            }
            expect(executed).toEqual([...await dispatcher.capabilities()]);
        }
        finally
        {
            await h.close();
        }
    },
    180000,
);

test(
    "equal deadlines follow PostgreSQL identity collation and blocked preparation rolls back",
    async () => {
        const h = await schedulerHarness();
        const now = 1000000;
        const dueAt = 1005000n;
        try
        {
            await h.startOwner(1, true, now);
            const db = h.kingdoms[0]!.db;
            await h.kingdoms[0]!.pool.query(
                "CREATE COLLATION scheduler_activity_order (provider = icu, locale = 'en', deterministic = true)",
            );
            await h.kingdoms[0]!.pool.query(
                "ALTER TABLE opencok_kingdom.timed_activity ALTER COLUMN id TYPE varchar(40) COLLATE scheduler_activity_order",
            );
            await db.transaction(async (tx) => {
                await tx.update(queue).set({
                    itemId: "owner-413000",
                    startTime: BigInt(now),
                    updateTime: dueAt,
                    totalTime: 5000n,
                }).where(eq(queue.uuid, "owner-q0"));
                await tx.update(queue).set({
                    itemId: "700100",
                    startTime: BigInt(now),
                    updateTime: dueAt,
                    totalTime: 5000n,
                }).where(eq(queue.uuid, "owner-q6"));
                await tx.update(user_building).set({ opType: 1, updateTime: dueAt }).where(
                    eq(user_building.uuid, "owner-413000"),
                );
                await tx.insert(user_science).values({
                    uid: "owner",
                    itemId: "700100",
                    level: 0,
                    cd: dueAt,
                });
                await tx.insert(timed_activity).values([
                    {
                        id: "B",
                        ownerId: "owner",
                        queueId: "owner-q0",
                        type: 0,
                        itemId: "owner-413000",
                        startedAt: BigInt(now),
                        dueAt,
                        version: 1,
                        status: 0,
                    },
                    {
                        id: "a",
                        ownerId: "owner",
                        queueId: "owner-q6",
                        type: 6,
                        itemId: "700100",
                        startedAt: BigInt(now),
                        dueAt,
                        version: 1,
                        status: 0,
                    },
                ]);
            });
            expect(
                (await h.kingdoms[0]!.pool.query(
                    "SELECT id FROM opencok_kingdom.timed_activity ORDER BY id",
                )).rows.map((row) => row.id),
            ).toEqual(["a", "B"]);
            const construction = await h.active(1, 0);
            const research = await h.active(1, 6);
            expect(research.id < construction.id).toBe(false);
            const resources = await db.select().from(user_resource).where(
                eq(user_resource.uid, "owner"),
            );
            const checkpoints = (await h.kingdoms[0]!.pool.query(
                "SELECT * FROM opencok_kingdom.building_production ORDER BY \"buildingId\"",
            )).rows;
            await h.owner(1).request("clock", { now: Number(dueAt) });
            const dispatcher = h.publisher(1, 5000);
            expect(await dispatcher.finish(construction)).toBe(ActivityDispatchResult.Blocked);
            expect(await db.select().from(user_resource).where(eq(user_resource.uid, "owner")))
                .toEqual(resources);
            expect(
                (await h.kingdoms[0]!.pool.query(
                    "SELECT * FROM opencok_kingdom.building_production ORDER BY \"buildingId\"",
                )).rows,
            ).toEqual(checkpoints);
            expect(
                await db.select().from(command_receipt).where(
                    eq(command_receipt.ownerUid, "owner"),
                ),
            ).toHaveLength(0);
            expect(await dispatcher.finish(research)).toBe(ActivityDispatchResult.Applied);
            expect(await dispatcher.finish(construction)).toBe(ActivityDispatchResult.Applied);
            expect(
                (await db.select().from(user_building).where(
                    eq(user_building.uuid, "owner-413000"),
                ))[0]!.level,
            ).toBe(2);
            expect(
                (await db.select().from(user_science).where(eq(user_science.uid, "owner")))[0]!
                    .level,
            ).toBe(1);
            const finalReceipts = await db.select().from(command_receipt).where(
                eq(command_receipt.ownerUid, "owner"),
            );
            expect(finalReceipts.map((row) => row.command).sort()).toEqual([
                "queue.finish",
                "queue.finish",
                "resource.settle",
            ]);
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);
