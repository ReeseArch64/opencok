import { expect, test } from "bun:test";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createPaymentObservers } from "@opencok/services/payment-observers";
import {
    createNormalRechargeDomain,
    normalRechargeOperation,
} from "@opencok/services/normal-recharge";
import { createRedPacketDomain } from "@opencok/services/red-packets";
import {
    createRechargeActivityDomain,
    rechargeActivityOperationId,
} from "@opencok/services/recharge-activity";
import { createRechargeFeedbackDomain } from "@opencok/services/recharge-feedback";
import { redPacketReader } from "@opencok/repositories/red-packets";
import type { MutationTransaction } from "@opencok/repositories/mutation";
import type { DeliveredGiftProof } from "@opencok/contracts/paid-gifts";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { pay_total } from "@opencok/drizzle/schema/opencok_kingdom/pay_total";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { recharge_feedback_claim } from "@opencok/drizzle/schema/opencok_kingdom/recharge_feedback_claim";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const proofs = new Map<string, DeliveredGiftProof>(),
        transactions = new AsyncLocalStorage<MutationTransaction>();
    const gateway = {
        delivered: async ({ owner, orderId }: { owner: string; orderId: string; }) => {
            const proof = proofs.get(orderId);
            return proof?.owner === owner ? proof : null;
        },
    };
    let readers = 0,
        live: ReturnType<typeof createPaymentObservers>;
    const h = await cityHarness([
        createNormalRechargeDomain(gateway),
        createRedPacketDomain(gateway),
        createRechargeActivityDomain({ accepted: (input) => live.newcomer.accepted(input) }),
        createRechargeFeedbackDomain({ accepted: (input) => live.feedback.accepted(input) }),
    ]);
    live = createPaymentObservers(
        gateway,
        h.rules,
        async (owner, order, platform) => {
            const tx = transactions.getStore();
            if (!tx)
            {
                throw new Error("Payment reader escaped its mutation transaction");
            }
            readers++;
            return redPacketReader(tx, owner).payment(order, platform);
        },
        (owner, command, params) => h.command(command, params, owner),
        () => h.clock.now,
    );
    const original = h.db.db.transaction.bind(h.db.db);
    h.db.db.transaction = (apply, settings) =>
        original((tx) => transactions.run(tx, () => apply(tx)), settings);
    h.clock.now = Date.UTC(2030, 0, 2, 12);
    for (const id of ["69022", "69023", "69025"])
    {
        h.rules.configuration.payControl!.set(id, {
            id,
            k1: "1.0.0",
            k2: "all",
            k4: "1",
            k5: id === "69023" ? "0" : "2030-01-01-00-00",
            k6: "2030-01-05-00-00",
            k7: "2030-01-01-00-00",
            k8: "2030-01-05-00-00",
        });
    }
    await h.db.db.insert(server_info).values({ uid: "server", payTotalTime: 1n });
    h.rules.advanced.campaignRules = [];
    h.rules.advanced.castleExchanges = new Map([
        ["synthetic", {
            id: "synthetic",
            product_id: "gold_1",
            dollar: "4.99",
            gold_doller: "1700",
        }],
    ]);
    h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
    h.rules.advanced.normalRechargeThresholds = new Map([
        ["normal", { id: "normal", type: "1", Node: "500", level: "1", Gift: "990001" }],
    ]);
    h.rules.advanced.rechargeThresholds = new Map([
        ["9912001", { id: "9912001", pay_node: "500", pay_reward: "990001" }],
    ]);
    h.rules.advanced.rechargeFeedback = new Map([
        ["one", { id: "one", product_id: "gold_1", number: "1", reward: "990001" }],
        ["two", { id: "two", product_id: "gold_1", number: "2", reward: "990001" }],
    ]);
    const order = async (extra: Partial<DeliveredGiftProof> = {}) => {
        const id = randomUUID(),
            proof = {
                owner: "owner",
                kingdomId: 1,
                orderId: id,
                platform: "synthetic",
                exchangeId: "synthetic",
                productId: "gold_1",
                priceCents: 499,
                occurredAt: BigInt(h.clock.now),
                ...extra,
            };
        proofs.set(id, proof);
        await h.db.db.insert(paylog).values({
            uid: proof.owner,
            orderId: id,
            pf: proof.platform,
            productId: proof.productId,
            time: proof.occurredAt,
            spend: 4.99,
            status: 2,
            payLevel: 1,
        });
        return id;
    };
    const consume = (id: string, owner = "owner") => live.consume(owner, id, "synthetic");
    const total = async () => (await h.db.db.select().from(pay_total))[0]?.gold;
    const newcomer = async () =>
        (await h.db.db.select().from(user_lord).where(eq(user_lord.uid, "owner")))[0]
            ?.newSerCumRechargeTotal;
    const claims = () => h.db.db.select().from(recharge_feedback_claim);
    const messages = () => h.db.db.select().from(mail);
    return { ...h, order, consume, total, newcomer, claims, messages, readers: () => readers };
}
test(
    "one configured delivered-order adapter funds all observers once and unaccepted orders never inflate feedback",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(paylog).values({
                uid: "owner",
                orderId: "synthetic-pending",
                pf: "synthetic",
                productId: "gold_1",
                time: BigInt(h.clock.now),
                spend: 4.99,
                status: 0,
                payLevel: 1,
            });
            const id = await h.order();
            await Promise.all([h.consume(id), h.consume(id)]);
            expect(await h.total()).toBe(1700n);
            expect(await h.newcomer()).toBe(1700n);
            expect((await h.claims()).map((row) => row.id)).toEqual(["one"]);
            expect(await h.messages()).toHaveLength(2);
            expect(h.readers()).toBeGreaterThanOrEqual(2);
            const commands = (await h.db.db.select().from(command_receipt)).map((row) =>
                row.command
            );
            for (
                const command of [
                    "normal.recharge.paid",
                    "campaign.paid.gift",
                    "new.sercum.paid",
                    "feedback.paid",
                ]
            )
            {
                expect(commands.filter((value) => value === command)).toHaveLength(1);
            }
            const zero = await h.order({ rechargeGold: 0n });
            await h.consume(zero);
            expect(await h.total()).toBe(1700n);
            expect(await h.newcomer()).toBe(1700n);
            expect(await h.claims()).toHaveLength(2);
            expect(await h.messages()).toHaveLength(3);
            await expect(h.consume(id, "other")).rejects.toThrow();
            const privateOrder = await h.order(),
                eventId = normalRechargeOperation("owner", privateOrder, "synthetic").slice(9);
            await expect(
                h.command("new.sercum.paid", {
                    eventId: sfs.string(eventId),
                    operationId: sfs.string(rechargeActivityOperationId("owner", eventId)),
                }),
            ).rejects.toThrow();
            expect(await h.newcomer()).toBe(1700n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a later observer failure retries the canonical order without repeating completed counters or mails",
    async () => {
        const h = await fixture();
        try
        {
            const id = await h.order();
            await h.db.pool.query(
                "create function reject_feedback_observer() returns trigger language plpgsql as $$ begin if NEW.command='feedback.paid' then raise exception 'synthetic observer failure'; end if; return NEW; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_feedback_observer before insert on opencok_kingdom.command_receipt for each row execute function reject_feedback_observer()",
            );
            await expect(h.consume(id)).rejects.toThrow();
            expect(await h.total()).toBe(1700n);
            expect(await h.newcomer()).toBe(1700n);
            expect(await h.claims()).toHaveLength(0);
            expect(await h.messages()).toHaveLength(1);
            await h.db.pool.query(
                "drop trigger reject_feedback_observer on opencok_kingdom.command_receipt",
            );
            await h.consume(id);
            await h.consume(id);
            expect(await h.total()).toBe(1700n);
            expect(await h.newcomer()).toBe(1700n);
            expect(await h.claims()).toHaveLength(1);
            expect(await h.messages()).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "closed observers acknowledge verified delivery without retroactive paid rewards after calendar changes",
    async () => {
        const h = await fixture();
        try
        {
            for (const id of ["69022", "69023", "69025"])
            {
                h.rules.configuration.payControl!.get(id)!.k2 = "close";
            }
            const order = await h.order();
            await h.consume(order);
            expect(await h.total()).toBeUndefined();
            expect((await h.newcomer()) ?? 0n).toBe(0n);
            expect(await h.messages()).toHaveLength(0);
            for (const id of ["69022", "69023", "69025"])
            {
                h.rules.configuration.payControl!.get(id)!.k2 = "all";
            }
            await h.consume(order);
            expect(await h.total()).toBeUndefined();
            expect((await h.newcomer()) ?? 0n).toBe(0n);
            expect(await h.messages()).toHaveLength(0);
            await h.consume(await h.order());
            expect(await h.total()).toBe(1700n);
            expect(await h.newcomer()).toBe(1700n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
