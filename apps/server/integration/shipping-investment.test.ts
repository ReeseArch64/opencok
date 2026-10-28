import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createShippingInvestmentDomain } from "@opencok/services/shipping-investment";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    let draws = 0;
    const h = await cityHarness([
        createShippingInvestmentDomain((maximum) => {
            draws++;
            return maximum - 1;
        }),
    ]);
    h.rules.configuration.payControl!.set("69027", {
        id: "69027",
        k1: "1.0.0",
        k2: "all",
        k72: "all",
        k107: "all",
    });
    h.rules.advanced.shippingInvestments!.clear();
    h.rules.advanced.shippingInvestments!.set("9014501", {
        id: "9014501",
        Seq: "1",
        Needgold: "100",
        Range: "10;20|30;40",
        weight: "1|3",
        vip: "0",
    });
    h.rules.advanced.shippingInvestments!.set("9014502", {
        id: "9014502",
        Seq: "2",
        Needgold: "200",
        Range: "20;21",
        weight: "1",
        vip: "0",
    });
    await h.db.db
        .insert(user_mixed_info)
        .values({ uid: "owner", mdata: "{}", materialBackup: 7 })
        .onConflictDoUpdate({ target: user_mixed_info.uid, set: { materialBackup: 7 } });
    const saved = async () =>
        (await h.db.db.select().from(user_mixed_info).where(eq(user_mixed_info.uid, "owner")))[0]!;
    const command = (command: string, params: Fields = {}) => h.command(command, params);
    const gold = async () =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
    return { ...h, saved, command, gold, draws: () => draws };
}
test(
    "shipping investments pin weighted returns once, preserve unrelated data and require sequential tiers",
    async () => {
        const h = await fixture();
        try
        {
            const ui = await h.command("shipping.trade.invest.ui");
            expect(Object.keys(fields(ui.body.gold_reward))).toEqual([
                "weight",
                "Needgold",
                "id",
                "Range",
                "vip",
                "Seq",
            ]);
            expect(fields(ui.body.gold_reward).Needgold).toEqual(sfs.string("100"));
            expect(ui.body.count).toEqual(sfs.int(0));
            expect(h.draws()).toBe(0);
            const baseline = await h.gold();
            expect(
                (await h.command("shipping.trade.invest.reward", { id: sfs.string("9014502") }))
                    .body.gold,
            ).toBeUndefined();
            expect(h.draws()).toBe(0);
            const params = { id: sfs.string("9014501"), operationId: sfs.string(randomUUID()) };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("shipping.trade.invest.reward", params)),
            );
            expect(replies.every((reply) => reply.body.gold!.value === 139)).toBe(true);
            expect(h.draws()).toBe(2);
            expect(await h.gold()).toBe(baseline + 39n);
            expect((await h.saved()).shippingTradeInvest).toBe(1);
            expect((await h.saved()).shippingTradeInvestGold).toBe(139);
            expect((await h.saved()).materialBackup).toBe(7);
            expect((await h.command("shipping.trade.invest.ui")).body.gold).toEqual(sfs.int(139));
            await h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") });
            expect(h.draws()).toBe(2);
            const second = await h.command("shipping.trade.invest.reward", {
                id: sfs.string("9014502"),
            });
            expect(second.body.gold).toEqual(sfs.int(220));
            expect(second.body.gold_reward).toBeUndefined();
            expect(second.body.sum_count).toEqual(sfs.int(2));
            expect(await h.gold()).toBe(baseline + 59n);
            expect((await h.saved()).shippingTradeInvest).toBe(2);
            await h.command("shipping.trade.invest.reward", { id: sfs.string("9014502") });
            expect(await h.gold()).toBe(baseline + 59n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "shipping funding, active VIP and feature gates reject unauthorized turns before drawing",
    async () => {
        const h = await fixture();
        try
        {
            const rule = h.rules.advanced.shippingInvestments!.get("9014501")!;
            rule.Needgold = "100001";
            await expect(
                h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") }),
            ).rejects.toThrow();
            expect(h.draws()).toBe(0);
            rule.Needgold = "100";
            rule.vip = "1";
            expect(
                (await h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") }))
                    .body.gold,
            ).toBeUndefined();
            expect(h.draws()).toBe(0);
            await h.db.db.insert(user_vip).values({
                uid: "owner",
                score: 0,
                loginDays: 1,
                lastLoginTime: BigInt(h.clock.now),
                vipEndTime: BigInt(h.clock.now - 1),
            });
            await h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") });
            expect(h.draws()).toBe(0);
            await h.db.db
                .update(user_vip)
                .set({ vipEndTime: BigInt(h.clock.now + 60000) })
                .where(eq(user_vip.uid, "owner"));
            await h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") });
            expect(h.draws()).toBe(2);
            h.rules.configuration.payControl!.get("69027")!.k2 = "close";
            expect((await h.command("shipping.trade.invest.ui")).body.count).toBeUndefined();
            await h.command("shipping.trade.invest.reward", { id: sfs.string("9014502") });
            expect((await h.saved()).shippingTradeInvest).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("shipping database failures roll back the stake, prize and counter together", async () => {
    const h = await fixture();
    try
    {
        const baseline = await h.gold();
        await h.db.db.execute(
            sql`CREATE FUNCTION opencok_kingdom.reject_shipping_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
        );
        await h.db.db.execute(
            sql`CREATE TRIGGER reject_shipping_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_shipping_receipt()`,
        );
        await expect(
            h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") }),
        ).rejects.toThrow();
        expect(await h.gold()).toBe(baseline);
        expect((await h.saved()).shippingTradeInvest).toBe(0);
        expect((await h.saved()).shippingTradeInvestGold).toBe(0);
        await h.db.db.execute(
            sql`DROP TRIGGER reject_shipping_receipt ON opencok_kingdom.command_receipt`,
        );
        await h.command("shipping.trade.invest.reward", { id: sfs.string("9014501") });
        expect(await h.gold()).toBe(baseline + 39n);
        expect((await h.saved()).shippingTradeInvest).toBe(1);
    }
    finally
    {
        await h.close();
    }
}, 120000);
