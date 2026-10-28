import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createPrayerDomain } from "@opencok/services/prayer";
import { recallTaskDomain } from "@opencok/services/recall-task";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { InventoryService } from "@opencok/services/inventory";
import { user_pray } from "@opencok/drizzle/schema/opencok_kingdom/user_pray";
import { pray_record } from "@opencok/drizzle/schema/opencok_kingdom/pray_record";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_recall_task } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task";
import { user_recall_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task_notes";
import { sfs, encode, decode, type Fields, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    let draws = 0;
    const h = await cityHarness([
        createPrayerDomain(() => {
            draws++;
            return 0;
        }),
        recallTaskDomain,
    ]);
    h.clock.now = Date.UTC(2017, 2, 20, 12);
    await h.db.db.insert(user_building).values({
        uuid: "owner-altar",
        uid: "owner",
        itemId: 428000,
        pos: 14,
        level: 1,
        opType: 0,
        refreshTime: BigInt(h.clock.now),
    });
    const info = () => h.command("user.pray.info", {});
    const cast = async (params: Fields = {}) => {
        const view = await info();
        return h.command("user.pray", {
            resource: sfs.int(0),
            gold: sfs.int(0),
            num: view.body.wood!,
            ...params,
        });
    };
    const row = async () =>
        (await h.db.db.select().from(user_pray).where(eq(user_pray.uid, "owner")))[0]!;
    const gold = async () =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
    const resources = async () =>
        (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!;
    const inventory = new InventoryService(
        createInventoryExecutor(h.db.db, h.authority, () => h.clock.now, {
            useEffect: async (tx, owner, itemId, count, now, economy) =>
                decode(
                    Buffer.from(
                        (
                            await h.handlers.command(
                                tx,
                                owner,
                                "prayer.item",
                                encode({ itemId: sfs.string(itemId), count: sfs.int(count) }),
                                now,
                                economy,
                            )
                        ).response,
                    ),
                ),
        }),
        h.rules,
        h.effects,
    );
    return { ...h, info, cast, row, gold, resources, inventory, draws: () => draws };
}
test(
    "native prayer pins multipliers once, increases catalog amounts and advances returning-player prayer tasks",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(user_recall_task_notes).values({
                uid: "owner",
                version: "12.06.0",
                beginTime: BigInt(h.clock.now - 1000),
                endTime: BigInt(h.clock.now + 86400000),
                country: "KR",
            });
            await h.db.db.insert(user_recall_task).values({
                uid: "owner",
                id: "9040004",
                num: 0,
                target_num: 5,
                state: 0,
                type_level: 16,
                receive: 0,
            });
            const initial = await h.info();
            expect(initial.body.wood).toEqual(sfs.int(9000));
            expect(initial.body.prayCountFree).toEqual(sfs.int(3));
            expect(initial.body.isFirstFree).toEqual(sfs.bool(true));
            const before = await h.resources(),
                request = {
                    resource: sfs.int(0),
                    gold: sfs.int(0),
                    num: sfs.int(9000),
                    operationId: sfs.string(randomUUID()),
                };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("user.pray", request)),
            );
            expect(h.draws()).toBe(1);
            expect(replies[0]!.body.hit).toEqual(sfs.int(2));
            expect(replies[0]!.body.num).toEqual(sfs.int(9000));
            expect(replies[0]!.body.wood).toEqual(sfs.int(9026));
            expect(replies[0]!.body.WOOD).toEqual(sfs.long(before.wood! + 18000n));
            await h.cast();
            await h.cast();
            expect((await h.row()).prayCount).toBe(3);
            const balance = await h.gold();
            await h.cast({ gold: sfs.int(2) });
            expect(await h.gold()).toBe(balance - 2n);
            await h.cast({ gold: sfs.int(4) });
            expect(await h.gold()).toBe(balance - 6n);
            expect((await h.db.db.select().from(user_recall_task))[0]!).toMatchObject({
                num: 5,
                state: 1,
            });
            expect(await h.db.db.select().from(pray_record)).toHaveLength(5);
            expect((await h.row()).goldwood).toBe(6);
            await expect(
                h.command(
                    "user.pray",
                    { ...request, operationId: sfs.string(randomUUID()) },
                    "other",
                ),
            ).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "prayer validates quoted amounts, owned resources, exact gold costs and the daily limit before granting",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.cast({ num: sfs.int(999999) })).rejects.toThrow();
            await expect(h.cast({ gold: sfs.int(2) })).rejects.toThrow();
            await expect(h.cast({ resource: sfs.int(1), num: sfs.int(380) })).rejects.toThrow();
            await expect(h.cast({ resource: sfs.int(5) })).rejects.toThrow();
            expect((await h.row()).prayCount).toBe(0);
            expect(h.draws()).toBe(0);
            const control = h.rules.items.get("resource_pray")!;
            h.rules.items.set("resource_pray", { ...control, k5: "4" });
            await h.cast();
            await h.cast();
            await h.cast();
            await h.cast({ gold: sfs.int(2) });
            const before = await h.resources();
            await expect(h.cast({ gold: sfs.int(4) })).rejects.toThrow();
            expect(await h.resources()).toEqual(before);
            expect((await h.row()).prayCount).toBe(4);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "owned prayer items preserve free credits through UTC reset and consume inventory atomically",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.update(userprofile).set({ level: 3 }).where(eq(userprofile.uid, "owner"));
            await h.db.db
                .insert(user_item)
                .values({
                    uuid: "prayer-credit",
                    ownerId: "owner",
                    itemId: "200031",
                    count: 3,
                    value: 0,
                });
            const receipt = {
                uuid: sfs.string("prayer-credit"),
                num: sfs.int(2),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(
                Array.from({ length: 3 }, () => h.inventory.command("owner", "item.use", receipt)),
            );
            expect((await h.row()).freeFromItem).toBe(2);
            expect((await h.db.db.select().from(user_item))[0]!.count).toBe(1);
            await h.cast();
            await h.cast();
            await h.cast();
            expect((await h.row()).freeFromItem).toBe(1);
            expect((await h.row()).itemPrayCount).toBe(1);
            const gold = await h.gold();
            await h.cast();
            expect(await h.gold()).toBe(gold);
            expect((await h.row()).freeFromItem).toBe(0);
            await h.inventory.command("owner", "item.use", {
                uuid: sfs.string("prayer-credit"),
                num: sfs.int(1),
            });
            h.clock.now = Date.UTC(2017, 2, 21);
            const info = await h.info();
            expect(info.body.prayCount).toEqual(sfs.int(0));
            expect(info.body.freeFromItem).toEqual(sfs.int(1));
            expect((await h.row()).isFirstFree).toBe(0);
            expect((await h.row()).wood).toBe(9000);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "prayer transaction failure restores counter, gold, reward, history and the pinned first-hit flag",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            const before = await h.resources();
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_prayer_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_prayer_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_prayer_receipt()`,
            );
            await expect(
                h.command("user.pray", {
                    resource: sfs.int(0),
                    gold: sfs.int(0),
                    num: sfs.int(9000),
                }),
            ).rejects.toThrow();
            expect(await h.resources()).toEqual(before);
            expect((await h.row()).prayCount).toBe(0);
            expect((await h.row()).isFirstFree).toBe(1);
            expect(await h.db.db.select().from(pray_record)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_prayer_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.cast();
            expect((await h.row()).prayCount).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "prayer steel uses the configured float effect while crediting the matching native silver resource",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.power.statuses!.set("990900", { id: "990900", type2: "0", effect: "205;50" });
            await h.db.db.insert(user_state).values({
                uid: "owner",
                stateId: 990900,
                startTime: BigInt(h.clock.now),
                endTime: BigInt(h.clock.now + 86400000),
                type2: 0,
            });
            expect((await h.info()).body.steel).toEqual(sfs.int(150));
            const before = await h.resources();
            const result = await h.cast({ resource: sfs.int(4), num: sfs.int(150) });
            expect(result.body.SILVER?.type).toBe(Type.Long);
            expect((await h.resources()).silver).toBe(before.silver! + 300);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "altar upgrade rescales saved daily prayer amounts without replaying prayers or resetting first-use flags",
    async () => {
        const h = await fixture();
        try
        {
            await h.cast();
            await h.db.db
                .update(user_building)
                .set({ level: 16 })
                .where(eq(user_building.uuid, "owner-400000"));
            await h.command("build.upgrade", { uuid: sfs.string("owner-altar"), gold: sfs.int(0) });
            await h.finish(0);
            const record = await h.row();
            expect(record.wood).toBe(9226);
            expect(record.prayCount).toBe(1);
            expect(record.isFirstFree).toBe(0);
            expect(await h.db.db.select().from(pray_record)).toHaveLength(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
