import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { decode, fields, sfs, str } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([anniversaryDomain]);
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    return {
        ...h,
        ask: (itemId = 212023, operationId = randomUUID(), owner = "owner") =>
            h.command(
                "item.askFor",
                { itemId: sfs.int(itemId), operationId: sfs.string(operationId) },
                owner,
            ),
        counter: async (key: string, owner = "owner") =>
            (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, owner))).find(
                (row) => row.key === key,
            )?.value,
    };
}
function mailRule(h: Awaited<ReturnType<typeof fixture>>)
{
    h.rules.advanced.campaignRules = [
        ...h.rules.advanced.campaignRules!,
        {
            id: "synthetic-request-mail",
            state: 2,
            openType: 2,
            events: [{ code: 57, parameters: "212023" }],
            conditions: [],
            actions: [{ code: 4, parameters: "12290" }],
        },
    ];
}
test(
    "the maintained cake request grants its first reward once per owned campaign quota and replays the same receipt",
    async () => {
        const h = await fixture();
        try
        {
            const id = randomUUID(),
                first = await h.ask(212023, id);
            expect(first.body.success).toEqual(sfs.string("1"));
            expect(await h.counter("long_3th_anniversary_cake_taken")).toBe("1");
            expect(await h.counter("long_3th_anniversary_cake_count")).toBe("1");
            expect(await h.counter("long_3th_week1_score_count")).toBe("45");
            const items = await h.db.db.select().from(user_item);
            expect(items.length).toBeGreaterThan(0);
            expect(await h.ask(212023, id)).toEqual(first);
            await h.ask();
            expect(await h.db.db.select().from(user_item)).toEqual(items);
            expect(await h.counter("long_3th_week1_score_count")).toBe("45");
            await h.ask(212023, randomUUID(), "other");
            expect(await h.counter("long_3th_week1_score_count", "other")).toBe("45");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "unmatched requests and exact campaign boundaries return native success without inventing items or counters",
    async () => {
        const h = await fixture();
        try
        {
            await h.ask(200300);
            h.clock.now = Date.UTC(2024, 8, 4);
            await h.ask();
            h.clock.now = Date.UTC(2024, 8, 13);
            await h.ask();
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            await expect(h.ask(-1)).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "campaign mail saves a funded grant with its native notification, retries publication and claims only once",
    async () => {
        const h = await fixture();
        try
        {
            mailRule(h);
            h.rules.mail.set("12290", { ...h.rules.mail.get("12290")!, reward: "250156" });
            const id = randomUUID();
            await h.ask(212023, id);
            await h.ask(212023, id);
            const saved = await h.db.db.select().from(mail);
            expect(saved).toHaveLength(1);
            expect(saved[0]?.toUser).toBe("owner");
            expect(saved[0]?.rewardStatus).toBe(0);
            const pending = (await h.db.db.select().from(mutation_outbox)).filter(
                (event) => event.eventType === "campaign.mail",
            );
            expect(pending).toHaveLength(1);
            const envelope = decode(pending[0]!.payload),
                body = fields(envelope.mail);
            expect(str(envelope, "owner")).toBe("owner");
            expect(str(body, "uid")).toBe(saved[0]!.uid);
            expect(str(body, "title")).toBe(saved[0]!.title!);
            let at = h.clock.now;
            await expect(
                relayMutationEvent(
                    h.db.db,
                    h.authority,
                    async () => {
                        throw new Error("synthetic publication failure");
                    },
                    () => at,
                    "campaign.mail",
                    60000,
                ),
            ).rejects.toThrow();
            at += 60001;
            let published = 0;
            await relayMutationEvent(
                h.db.db,
                h.authority,
                async (event) => {
                    expect(fields(decode(event.payload).mail)).toEqual(body);
                    published++;
                },
                () => at,
                "campaign.mail",
                60000,
            );
            expect(published).toBe(1);
            expect(
                await relayMutationEvent(
                    h.db.db,
                    h.authority,
                    async () => {
                        published++;
                    },
                    () => at,
                    "campaign.mail",
                    60000,
                ),
            ).toBe(false);
            const claims = new MailRewardService(
                    createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
                    h.rules,
                ),
                claim = () =>
                    claims.command("owner", "mail.reward", {
                        uid: sfs.string(saved[0]!.uid),
                        operationId: sfs.string(randomUUID()),
                    });
            await claim();
            const items = await h.db.db.select().from(user_item);
            await claim();
            expect(await h.db.db.select().from(user_item)).toEqual(items);
            expect((await h.db.db.select().from(mail))[0]?.rewardStatus).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "campaign mail outbox failure rolls back the requested reward, counters and saved mail before retry",
    async () => {
        const h = await fixture();
        try
        {
            mailRule(h);
            await h.db.pool.query(
                `create function reject_campaign_mail() returns trigger language plpgsql as $$ begin if new."eventType"='campaign.mail' then raise exception 'synthetic campaign mail failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_campaign_mail before insert on opencok_kingdom.mutation_outbox for each row execute function reject_campaign_mail()`,
            );
            const id = randomUUID();
            await expect(h.ask(212023, id)).rejects.toThrow();
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            await h.db.pool.query(
                `drop trigger reject_campaign_mail on opencok_kingdom.mutation_outbox`,
            );
            await h.ask(212023, id);
            expect(await h.db.db.select().from(mail)).toHaveLength(1);
            expect(await h.counter("long_3th_week1_score_count")).toBe("45");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
