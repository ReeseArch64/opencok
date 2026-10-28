import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import {
    createRechargeFeedbackDomain,
    rechargeFeedbackOperationId,
} from "@opencok/services/recharge-feedback";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { recharge_feedback_claim } from "@opencok/drizzle/schema/opencok_kingdom/recharge_feedback_claim";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, fields, Type, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    let verified = 0;
    const h = await cityHarness([
        createRechargeFeedbackDomain({
            accepted: async ({ owner, eventId }) => {
                verified++;
                return owner === "owner" && eventId.startsWith("approved:")
                    ? { orderId: eventId.slice(9), platform: "synthetic", productId: "gold_8" }
                    : null;
            },
        }),
    ]);
    h.clock.now = Date.UTC(2026, 9, 25, 12);
    h.rules.configuration.payControl!.set("69025", {
        id: "69025",
        k1: "1.0.0",
        k2: "all",
        k72: "all",
        k107: "all",
        k4: "1",
        k5: "2026-10-25-00-00",
        k6: "2026-10-26-00-00",
    });
    h.rules.advanced.rechargeFeedback!.clear();
    for (const number of [1, 2])
    {
        h.rules.advanced.rechargeFeedback!.set(String(9913000 + number), {
            id: String(9913000 + number),
            product_id: "gold_8",
            number: String(number),
            reward: "990001",
        });
    }
    h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
    const order = (orderId: string, owner = "owner", time = BigInt(h.clock.now)) =>
        h.db.db.insert(paylog).values({
            uid: owner,
            orderId,
            pf: "synthetic",
            productId: "gold_8",
            time,
            spend: 0.99,
            payLevel: 1,
            status: 2,
        });
    const paid = (orderId: string) => {
        const eventId = `approved:${orderId}`;
        return h.command("feedback.paid", {
            eventId: sfs.string(eventId),
            operationId: sfs.string(rechargeFeedbackOperationId("owner", eventId)),
        });
    };
    const messages = () => h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
    const claims = () =>
        h.db.db.select().from(recharge_feedback_claim).where(
            eq(recharge_feedback_claim.uid, "owner"),
        );
    return { ...h, order, paid, messages, claims, verified: () => verified };
}
test(
    "feedback UI counts only owned in-window nominal price classes and retains native boolean arrays",
    async () => {
        const h = await fixture();
        try
        {
            await h.order("foreign-one", "other");
            await h.order("foreign-two", "other");
            await h.order("too-old", "owner", BigInt(Date.UTC(2026, 9, 25)) - 1n);
            let ui = await h.command("pay.recharge.ui.state", {});
            expect(ui.body.daily_bool).toEqual(sfs.array([sfs.bool(false), sfs.bool(false)]));
            await h.order("owner-one");
            ui = await h.command("pay.recharge.ui.state", {});
            expect(ui.body.daily_bool!.type).toBe(Type.Array);
            expect(ui.body.daily_bool!.value).toEqual([sfs.bool(true), sfs.bool(false)]);
            expect(fields((ui.body.daily_tab!.value as Value[])[0]).number).toEqual(
                sfs.string("1"),
            );
            expect(fields((ui.body.daily_tab!.value as Value[])[0]).reward!.type).toBe(Type.Array);
            expect(await h.messages()).toHaveLength(0);
            expect(await h.claims()).toHaveLength(0);
            h.clock.now = Date.UTC(2026, 9, 26) + 1;
            expect((await h.command("pay.recharge.ui.state", {})).body.daily_tab).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "out-of-order accepted feedback callbacks recover every reached tier once per period",
    async () => {
        const h = await fixture();
        try
        {
            await h.order("order-one");
            await h.order("order-two");
            h.clock.now = Date.UTC(2026, 9, 26) + 1;
            await Promise.all(Array.from({ length: 4 }, () => h.paid("order-two")));
            expect(h.verified()).toBe(1);
            expect(await h.claims()).toHaveLength(2);
            expect(await h.messages()).toHaveLength(2);
            expect(
                (await h.messages()).every(
                    (message) => message.rewardId === "gold,0,7" && message.rewardStatus === 0,
                ),
            ).toBe(true);
            await h.paid("order-one");
            expect(await h.claims()).toHaveLength(2);
            expect(await h.messages()).toHaveLength(2);
            Object.assign(h.rules.configuration.payControl!.get("69025")!, {
                k5: "2026-11-01-00-00",
                k6: "2026-11-02-00-00",
            });
            h.clock.now = Date.UTC(2026, 10, 1, 12);
            await h.order("new-period");
            await h.paid("new-period");
            expect(await h.claims()).toHaveLength(3);
            expect(await h.messages()).toHaveLength(3);
            expect(
                (await h.claims()).filter((row) => row.startTime === BigInt(Date.UTC(2026, 10, 1))),
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
    "feedback requires a verified owned payment and rolls back mail and claim markers on receipt failure",
    async () => {
        const h = await fixture();
        try
        {
            await h.order("foreign", "other");
            await expect(h.paid("foreign")).rejects.toThrow();
            await expect(
                h.command("feedback.paid", {
                    eventId: sfs.string("unverified"),
                    operationId: sfs.string(rechargeFeedbackOperationId("owner", "unverified")),
                }),
            ).rejects.toThrow();
            expect(await h.claims()).toHaveLength(0);
            await h.order("future", "owner", BigInt(h.clock.now + 60000));
            await expect(h.paid("future")).rejects.toThrow();
            await h.db.db.delete(paylog).where(eq(paylog.orderId, "future"));
            await h.order("valid");
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_feedback_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_feedback_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_feedback_receipt()`,
            );
            await expect(h.paid("valid")).rejects.toThrow();
            expect(await h.messages()).toHaveLength(0);
            expect(await h.claims()).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_feedback_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.paid("valid");
            expect(await h.messages()).toHaveLength(1);
            expect(await h.claims()).toHaveLength(1);
            h.rules.configuration.payControl!.get("69025")!.k4 = "0";
            expect((await h.command("pay.recharge.ui.state", {})).body.daily_tab).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
