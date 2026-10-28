import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createSeasonalExchangeDomain } from "@opencok/services/seasonal-exchange";
import { activity } from "@opencok/drizzle/schema/opencok_kingdom/activity";
import { user_activity_new } from "@opencok/drizzle/schema/opencok_kingdom/user_activity_new";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([createSeasonalExchangeDomain(() => 0)]);
    h.clock.now = Date.UTC(2026, 9, 26, 12);
    h.rules.items.set("chrisms", {
        id: "chrisms",
        k1: "60",
        k2: "990001;1;1",
        k3: "990001;1;1",
        k4: "990001;1;1",
        k5: "990001;1;1",
        k6: "990001;1;1",
        k12: "1",
    });
    h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
    await h.db.db.insert(activity).values({
        id: 5,
        type: 5,
        name: "Synthetic",
        openTime: BigInt(h.clock.now - 1),
        startTime: BigInt(h.clock.now - 1),
        endTime: BigInt(h.clock.now + 86400000),
    });
    await h.db.db
        .insert(user_item)
        .values({
            uuid: "exchange-tokens",
            ownerId: "owner",
            itemId: "209174",
            count: 10,
            value: 0,
        });
    const command = (name: string, params: Fields = {}) =>
        h.command(name, { type: sfs.int(5), ...params });
    const saved = async () =>
        (await h.db.db.select().from(user_activity_new).where(eq(user_activity_new.uid, "owner")))[
            0
        ]!;
    const gold = async () =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
    const count = async () =>
        (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "exchange-tokens")))[0]!
            .count;
    return { ...h, command, saved, gold, count };
}
test(
    "seasonal exchange pins five offers, enforces sequential levels and refreshes only after a paid final step",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.command("activity.exchange.reward", { level: sfs.int(1) })).rejects
                .toThrow();
            const ui = fields((await h.command("activity.exchange.info")).body.activity);
            expect(Object.keys(ui)).toEqual([
                "level",
                "refreshTime",
                "flushTimes",
                "rewards",
                "receiveLevels",
            ]);
            expect(ui.rewards!.value).toHaveLength(5);
            const first = await h.saved();
            await h.command("activity.exchange.info");
            expect(await h.saved()).toEqual(first);
            await expect(h.command("activity.exchange.reward", { level: sfs.int(2) })).rejects
                .toThrow();
            const baseline = await h.gold(),
                params = { level: sfs.int(1), operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("activity.exchange.reward", params)),
            );
            expect(await h.count()).toBe(9);
            expect(await h.gold()).toBe(baseline + 7n);
            await expect(h.command("activity.exchange.reward", { level: sfs.int(1) })).rejects
                .toThrow();
            for (const level of [2, 3, 4, 5])
            {
                await h.command("activity.exchange.reward", { level: sfs.int(level) });
            }
            expect(await h.count()).toBe(5);
            expect(await h.gold()).toBe(baseline + 35n);
            expect((await h.saved()).level).toBe(0);
            await expect(h.command("activity.exchange.reward", { level: sfs.int(5) })).rejects
                .toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "timed offer refresh honors frozen mode and rejects closed or mismatched persisted periods",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("activity.exchange.info");
            await h.command("activity.exchange.reward", { level: sfs.int(1) });
            const row = await h.saved();
            h.rules.items.get("chrisms")!.k12 = "2";
            h.clock.now += 60000;
            await h.command("activity.exchange.info");
            expect(await h.saved()).toEqual(row);
            h.rules.items.get("chrisms")!.k12 = "1";
            await h.command("activity.exchange.info");
            expect((await h.saved()).level).toBe(0);
            expect((await h.saved()).updateTime).toBe(BigInt(h.clock.now));
            h.rules.items.get("chrisms")!.k12 = "0";
            await expect(h.command("activity.exchange.info")).rejects.toThrow();
            h.rules.items.get("chrisms")!.k12 = "1";
            await expect(h.command("activity.exchange.info", { type: sfs.int(6) })).rejects
                .toThrow();
            h.clock.now += 86400000;
            await expect(h.command("activity.exchange.reward", { level: sfs.int(1) })).rejects
                .toThrow();
            expect(await h.count()).toBe(9);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("seasonal exchange rolls back tokens, grants and step markers with the receipt", async () => {
    const h = await fixture();
    try
    {
        await h.command("activity.exchange.info");
        const baseline = await h.gold();
        await h.db.db.execute(
            sql`CREATE FUNCTION opencok_kingdom.reject_seasonal_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
        );
        await h.db.db.execute(
            sql`CREATE TRIGGER reject_seasonal_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_seasonal_receipt()`,
        );
        await expect(h.command("activity.exchange.reward", { level: sfs.int(1) })).rejects
            .toThrow();
        expect(await h.gold()).toBe(baseline);
        expect(await h.count()).toBe(10);
        expect((await h.saved()).level).toBe(0);
        expect(
            await h.db.db.select().from(user_activity_new).where(
                eq(user_activity_new.uid, "other"),
            ),
        ).toHaveLength(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);
