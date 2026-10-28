import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { createWorldUseDomain } from "@opencok/services/world-use";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([createWorldUseDomain(4)], false, undefined, 4);
    try
    {
        await h.db.db
            .insert(user_world)
            .values({ uid: "owner", pointId: 6, worldId: 0, lastCityDefTime: 0n });
        await h.db.db.update(userprofile).set({ worldPoint: 6 }).where(
            eq(userprofile.uid, "owner"),
        );
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
        await h.db.db.insert(user_item).values([
            { uuid: "chosen", ownerId: "owner", itemId: "200080", count: 2, value: 0 },
            { uuid: "foreign", ownerId: "other", itemId: "200080", count: 2, value: 0 },
        ]);
        h.rules.goods.set("200080", { ...h.rules.goods.get("200080")!, para1: "9414", para2: "1" });
        h.rules.items.set("monster", { ...h.rules.items.get("monster")!, k1: "2" });
        const use = (uuid: string, point: number, operationId: string) =>
                h.command("world.use", {
                    itemUUid: sfs.string(uuid),
                    point: sfs.int(point),
                    operationId: sfs.string(operationId),
                }),
            query = (operationId: string) =>
                h.command("world.get.monster", { operationId: sfs.string(operationId) });
        return {
            ...h,
            use,
            query,
            async point(id: number)
            {
                return (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, id)))[0]!;
            },
            async count()
            {
                return (
                    (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "chosen")))[0]
                        ?.count
                        ?? 0
                );
            },
        };
    }
    catch (error)
    {
        await h.close();
        throw error;
    }
}
test(
    "monster props debit exactly the owned UUID once and retain Source backdated start, zero stored HP and native response",
    async () => {
        const h = await fixture();
        try
        {
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.use("chosen", 10, "same-prop")),
            );
            expect(
                replies.every(
                    (r) => r.body.pointId!.type === Type.Int && r.body.itemid!.type === Type.String,
                ),
            ).toBe(true);
            expect(await h.count()).toBe(1);
            expect(await h.point(10)).toMatchObject({
                pointType: 9,
                pointItem: "9414",
                startTime: 995000n,
                flushTime: 11795000n,
                monsterCurrHP: 0,
                flushFlag: 1,
            });
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "foreign")))[0]!
                    .count,
            ).toBe(2);
            await expect(h.use("foreign", 11, "foreign")).rejects.toThrow();
            await expect(h.use("chosen", 10, "occupied")).rejects.toThrow();
            expect(await h.count()).toBe(1);
            expect(
                (await h.db.db.select().from(mutation_outbox)).filter((r) =>
                    r.eventType === "world.use"
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
    "four-cell boss props use native lower-right ranges and reject a claimed range atomically",
    async () => {
        const h = await fixture();
        try
        {
            const cfg = h.rules.world.fieldMonsters!.get("9414")!;
            h.rules.world.fieldMonsters!.set("9414", { ...cfg, boss: "1", num: "4" });
            await h.db.db.update(worldpoint).set({ ownerId: "other" }).where(eq(worldpoint.id, 11));
            await expect(h.use("chosen", 16, "blocked")).rejects.toThrow();
            expect(await h.count()).toBe(2);
            expect((await h.point(16)).pointType).toBe(0);
            await h.db.db
                .update(worldpoint)
                .set({ ownerId: "", monsterCurrHP: 77, flushTime: 123n, startTime: 100n })
                .where(eq(worldpoint.id, 11));
            expect(
                (await h.command("get.act.boss.point", { operationId: sfs.string("none-boss") }))
                    .body.id,
            ).toEqual(sfs.int(0));
            await h.use("chosen", 16, "boss");
            expect(
                (await h.command("get.act.boss.point", { operationId: sfs.string("nearest-boss") }))
                    .body.id,
            ).toEqual(sfs.int(16));
            expect(await h.count()).toBe(1);
            expect(await h.point(16)).toMatchObject({
                pointType: 15,
                monsterCurrHP: 0,
                flushFlag: 1,
            });
            for (const id of [11, 12, 15])
            {
                expect((await h.point(id)).pointType).toBe(17);
            }
            expect(await h.point(11)).toMatchObject({
                monsterCurrHP: 77,
                flushTime: 123n,
                startTime: 100n,
                flushFlag: 0,
                pointItem: null,
            });
            expect((await h.point(10)).pointType).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "receipt failure rolls back monster placement, stack debit and notifications before retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.pool.query(
                "CREATE FUNCTION reject_monster() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic monster receipt failure'; END $$",
            );
            await h.db.pool.query(
                "CREATE TRIGGER reject_monster BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_monster()",
            );
            await expect(h.use("chosen", 10, "rollback")).rejects.toThrow();
            expect(await h.count()).toBe(2);
            expect((await h.point(10)).pointType).toBe(0);
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
            await h.db.pool.query("DROP TRIGGER reject_monster ON opencok_kingdom.command_receipt");
            await h.use("chosen", 10, "rollback");
            expect(await h.count()).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "temporary monster queries create real shared points then reuse living configured monsters with exact minimum TTL",
    async () => {
        const h = await fixture();
        try
        {
            const first = await h.query("temporary"),
                id = Number(first.body.pointId!.value);
            expect(first.body.pointId!.type).toBe(Type.Int);
            expect(id).toBeGreaterThan(0);
            expect(await h.point(id)).toMatchObject({
                pointType: 9,
                pointItem: "9400",
                monsterCurrHP: 0,
                flushTime: 1300000n,
            });
            const before = await h.db.db.select().from(worldpoint);
            const second = await h.query("reuse");
            expect(second.body.pointId).toEqual(sfs.int(id));
            expect(await h.db.db.select().from(worldpoint)).toEqual(before);
            await h.db.db.update(worldpoint).set({ flushTime: 1180000n }).where(
                eq(worldpoint.id, id),
            );
            const third = await h.query("minimum");
            expect(Number(third.body.pointId!.value)).not.toBe(id);
            expect(await h.count()).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "temporary producer returns native minus one without touching a fully occupied local area",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.update(worldpoint).set({ pointType: 1, ownerId: "owner" });
            const before = await h.db.db.select().from(worldpoint);
            expect((await h.query("none")).body.pointId).toEqual(sfs.int(-1));
            expect(await h.db.db.select().from(worldpoint)).toEqual(before);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
