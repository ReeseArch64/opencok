import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
    ExpeditionTreasuryService,
    publishExpeditionTreasuryMutation,
} from "@opencok/services/expedition-treasury";
import { createExpeditionTreasuryExecutor } from "@opencok/repositories/expedition-treasury";
import { createMutationExecutor } from "@opencok/repositories/mutation";
import { kingdom_info } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_info";
import { kingdom_position } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_position";
import { user_expedition_info } from "@opencok/drizzle/schema/opencok_kingdom/user_expedition_info";
import { king_allot_tax_record } from "@opencok/drizzle/schema/opencok_kingdom/king_allot_tax_record";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, encode, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness();
    h.clock.now = 1792929600000;
    await h.db.db.insert(kingdom_info).values({
        serverId: 1,
        wood: 1000n,
        food: 1000n,
        iron: 1000n,
        stone: 1000n,
        silver: 9007199254740993n,
    });
    await h.db.db
        .insert(kingdom_position)
        .values({ uid: "owner", positionId: "216000", serverId: 1 });
    const service = new ExpeditionTreasuryService(
        createExpeditionTreasuryExecutor(h.db.db, h.authority, () => h.clock.now),
        h.rules,
    );
    const command = (name: string, params: Fields = {}, owner = "owner") =>
        service.command(owner, name, { operationId: sfs.string(randomUUID()), ...params });
    return { ...h, treasury: service, treasuryCommand: command };
}
test(
    "treasury gifts debit the shared account and create one funded recipient mail and history under retry",
    async () => {
        const h = await fixture();
        try
        {
            const info = await h.treasuryCommand("exchequer.show");
            expect(info.body.silver).toEqual(sfs.long(9007199254740993n));
            const params = {
                uid: sfs.string("other"),
                wood: sfs.int(100),
                iron: sfs.int(10),
                operationId: sfs.string(randomUUID()),
            };
            const results = await Promise.all(
                Array.from(
                    { length: 5 },
                    () => h.treasuryCommand("expedition.king.present", params),
                ),
            );
            expect(results.every((reply) => reply.body.wood!.value === 900n)).toBe(true);
            expect((await h.db.db.select().from(kingdom_info))[0]!.iron).toBe(990n);
            expect((await h.db.db.select().from(user_expedition_info))[0]!.recieveResource).toBe(
                160n,
            );
            expect((await h.db.db.select().from(king_allot_tax_record)).length).toBe(1);
            const [message] = await h.db.db.select().from(mail);
            expect(message).toMatchObject({
                toUser: "other",
                rewardId: "wood,0,100|iron,0,10",
                rewardStatus: 0,
            });
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")))[
                    0
                ]!.wood,
            ).toBe(1000000n);
            const postings = await h.db.db.select().from(economy_posting);
            expect(postings.map((row) => [row.accountUid, row.asset, row.delta])).toEqual([
                ["kingdom:1:treasury", "resource.wood", -100n],
                ["kingdom:1:treasury", "resource.iron", -10n],
            ]);
            const events = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "expedition.king.present"));
            expect(events.length).toBe(1);
            const notifications: string[] = [];
            await publishExpeditionTreasuryMutation(events[0]!.payload, async (owner, command) => {
                notifications.push(`${owner}:${command}`);
            });
            expect(notifications).toEqual(["other:push.mail"]);
            const rewards = new MailRewardService(
                createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
                h.rules,
            );
            const claim = { uid: sfs.string(message!.uid), operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 4 }, () => rewards.command("other", "mail.reward", claim)),
            );
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")))[
                    0
                ]!.wood,
            ).toBe(1000100n);
            expect((await h.db.db.select().from(mail))[0]!.rewardStatus).toBe(1);
            expect((await h.db.db.select().from(kingdom_info))[0]!.wood).toBe(900n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "treasury authorization, daily weighted caps and insufficient balances reject without partial awards",
    async () => {
        const h = await fixture();
        try
        {
            const send = (params: Fields = {}, owner = "owner") =>
                h.treasuryCommand(
                    "expedition.king.present",
                    { uid: sfs.string("other"), wood: sfs.int(1), ...params },
                    owner,
                );
            await expect(send({}, "other")).rejects.toThrow();
            await expect(send({ wood: sfs.int(-1) })).rejects.toThrow();
            await expect(send({ wood: sfs.int(1001) })).rejects.toThrow();
            h.rules.items.get("wk_info_new1")!.k3 = "24";
            await send({ wood: sfs.int(0), stone: sfs.int(1) });
            await expect(send()).rejects.toThrow();
            expect((await h.db.db.select().from(kingdom_info))[0]!.wood).toBe(1000n);
            expect((await h.db.db.select().from(mail)).length).toBe(1);
            const current = await h.treasuryCommand("expedition.recieve.count", {
                uid: sfs.string("other"),
            });
            expect(current.body.count).toEqual(sfs.long(24n));
            h.clock.now += 86400000;
            const next = await h.treasuryCommand("expedition.recieve.count", {
                uid: sfs.string("other"),
            });
            expect(next.body.count).toEqual(sfs.long(0n));
            await send();
            expect((await h.db.db.select().from(user_expedition_info))[0]!.recieveResource).toBe(
                1n,
            );
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(send()).rejects.toThrow();
            expect((await h.db.db.select().from(mail)).length).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "treasury accounting, recipient counter, mail and receipt roll back together on database failure",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`ALTER TABLE opencok_kingdom.mail ADD CONSTRAINT synthetic_reject_mail CHECK (false) NOT VALID`,
            );
            const params = {
                uid: sfs.string("other"),
                wood: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            };
            await expect(h.treasuryCommand("expedition.king.present", params)).rejects.toThrow();
            expect((await h.db.db.select().from(kingdom_info))[0]!.wood).toBe(1000n);
            expect((await h.db.db.select().from(king_allot_tax_record)).length).toBe(0);
            expect((await h.db.db.select().from(economy_posting)).length).toBe(0);
            expect((await h.db.db.select().from(user_expedition_info)).length).toBe(0);
            await h.db.db.execute(
                sql`ALTER TABLE opencok_kingdom.mail DROP CONSTRAINT synthetic_reject_mail`,
            );
            await h.treasuryCommand("expedition.king.present", params);
            expect((await h.db.db.select().from(mail)).length).toBe(1);
            const generic = createMutationExecutor(h.db.db, h.authority, () => h.clock.now);
            await expect(
                generic(
                    {
                        owner: "owner",
                        requestId: randomUUID(),
                        command: "synthetic",
                        request: encode({}),
                    },
                    async () => ({
                        response: encode({}),
                        postings: [
                            {
                                account: "kingdom:1:treasury",
                                asset: "resource.wood",
                                before: 1n,
                                after: 0n,
                                reason: "synthetic",
                            },
                        ],
                    }),
                ),
            ).rejects.toThrow("Mutation posting owner mismatch");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
