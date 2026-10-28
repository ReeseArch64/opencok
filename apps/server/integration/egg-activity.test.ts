import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { createEggActivityDomain } from "@opencok/services/egg-activity";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import { createCityProgressionHandlers } from "@opencok/services/city-progression";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import type { MutationTransaction } from "@opencok/repositories/mutation";
import { egg_activity } from "@opencok/drizzle/schema/opencok_kingdom/egg_activity";
import { user_egg } from "@opencok/drizzle/schema/opencok_kingdom/user_egg";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { eggActivityIdle } from "@opencok/rules/egg-activity";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { cityHarness } from "./support/city";
import { configureEggActivity, eggActivityNow } from "../test/fixtures/egg-activity";
async function fixture()
{
    const rng = { last: false, draws: 0 };
    const random = (maximum: number) => {
        rng.draws++;
        return maximum === 100 && rng.last ? maximum - 1 : 0;
    };
    const h = await cityHarness([createEggActivityDomain(random)]);
    h.clock.now = eggActivityNow;
    configureEggActivity(h.rules);
    const saved = async () =>
        (await h.db.db.select().from(egg_activity).where(eq(egg_activity.uid, "owner")))[0]!;
    const gold = async () =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
    const count = async (id: string) =>
        (
            await h.db.db
                .select()
                .from(user_item)
                .where(and(eq(user_item.ownerId, "owner"), eq(user_item.itemId, id)))
        )[0]?.count ?? 0;
    const restart = async () => {
        const authority = await acquireRealmAuthority(h.db.db, 1, () => true),
            effects = { world: async () => new Map<number, number>(), emperor: async () => null };
        const handlers = createCityProgressionHandlers(
            (tx, owner, at) =>
                createCityProgressionStore(
                    tx as MutationTransaction,
                    owner,
                    at,
                    async (_tx, _uid, _at, change) => change(),
                ),
            [createEggActivityDomain(random)],
            h.rules,
            effects,
        );
        const service = new TimedActivityService(
            createActivityExecutor(
                h.db.db,
                authority,
                handlers.domains as ReadonlyMap<number, ActivityDomain>,
                () => h.clock.now,
                { command: handlers.command, next: handlers.next, accelerate: handlers.accelerate },
            ),
            h.rules,
            effects,
        );
        return {
            authority,
            command: (command: string, params: Fields = {}) =>
                service.domainCommand("owner", command, {
                    ...params,
                    operationId: params.operationId ?? sfs.string(randomUUID()),
                }),
        };
    };
    return { ...h, rng, saved, gold, count, restart };
}
test(
    "egg activity opens actual owned eggs, charges switches and exact cooldown costs, grants real weighted goods and consumes repeated final XP thresholds",
    async () => {
        const h = await fixture();
        try
        {
            const info = (await h.command("egg.act.info", {})).body;
            expect(info.opened).toEqual(sfs.bool(true));
            expect(fields(info.eggAct).eggCd).toEqual(sfs.long(-1));
            expect(await h.gold()).toBe(100000n);
            const operationId = sfs.string(randomUUID());
            const first = await h.command("egg.act.open", {
                eggId: sfs.string("132500"),
                operationId,
            });
            expect(await h.command("egg.act.open", { eggId: sfs.string("132500"), operationId }))
                .toEqual(
                    first,
                );
            expect((await h.saved()).eggCd).toBe(BigInt(h.clock.now + 30000));
            expect(await h.gold()).toBe(100000n);
            await expect(h.command("egg.act.open", { eggId: sfs.string("132501") })).rejects
                .toThrow();
            await expect(h.command("egg.act.reward", {})).rejects.toThrow();
            h.clock.now += 1000;
            await h.command("egg.act.cd", {});
            expect(await h.gold()).toBe(99997n);
            expect((await h.saved()).eggCd).toBe(BigInt(h.clock.now - 3000));
            const award = sfs.string(randomUUID()),
                reward = await h.command("egg.act.reward", { operationId: award }),
                draws = h.rng.draws;
            expect(await h.command("egg.act.reward", { operationId: award })).toEqual(reward);
            expect(h.rng.draws).toBe(draws);
            expect(await h.count("200001")).toBe(1);
            expect((await h.saved()).exp).toBe(3);
            expect((await h.saved()).eggCd).toBe(eggActivityIdle);
            expect(
                (await h.db.db.select().from(trigger_var).where(
                    eq(trigger_var.key, "long_egg_grants"),
                ))[0]
                    ?.value,
            ).toBe("1");
            const claims = await Promise.allSettled([
                h.command("egg.exp.reward", {}),
                h.command("egg.exp.reward", {}),
            ]);
            expect(claims.filter((row) => row.status === "fulfilled")).toHaveLength(1);
            expect((await h.saved()).exp).toBe(0);
            expect((await h.saved()).curExpStage).toBe(1);
            expect(await h.gold()).toBe(99999n);
            await h.command("egg.act.open", { eggId: sfs.string("132501") });
            expect(await h.gold()).toBe(99799n);
            h.clock.now += 60000;
            await h.command("egg.act.reward", {});
            expect(await h.count("200002")).toBe(1);
            await h.command("egg.act.open", { eggId: sfs.string("132500") });
            h.clock.now += 30000;
            h.rng.last = true;
            await h.command("egg.act.reward", {});
            expect(await h.count("200002")).toBe(2);
            await h.command("egg.goods.full", { eggId: sfs.string("132500") });
            expect(await h.gold()).toBe(99804n);
            expect((await h.saved()).exp).toBe(13);
            await expect(h.command("egg.goods.full", { eggId: sfs.string("132500") })).rejects
                .toThrow();
            await h.command("egg.exp.reward", {});
            await h.command("egg.exp.reward", {});
            expect((await h.saved()).curExpStage).toBe(1);
            expect((await h.saved()).exp).toBe(1);
            expect(await h.count("200004")).toBe(10);
            const collections = await h.db.db.select().from(user_egg);
            expect(collections.find((row) => row.eggId === "132500")).toMatchObject({
                goods: "200001|200002",
                reward: 1,
            });
            await expect(h.command("egg.act.open", { eggId: sfs.int(132500) })).rejects.toThrow();
            await expect(h.command("egg.act.open", { eggId: sfs.string("missing") })).rejects
                .toThrow();
            await expect(
                h.command("egg.goods.full", { eggId: sfs.string("132501") }),
            ).resolves.toBeDefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "egg inventory, collections, cooldown, XP, receipts and outbox roll back together and authority replacement preserves pinned outcomes",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("egg.act.info", {});
            await h.command("egg.act.open", { eggId: sfs.string("132500") });
            h.clock.now += 30000;
            const before = await h.saved(),
                outbox = await h.db.db.select().from(mutation_outbox);
            await h.db.pool.query(
                "create function reject_egg() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_egg before insert on opencok_kingdom.command_receipt for each row execute function reject_egg()",
            );
            await expect(h.command("egg.act.reward", {})).rejects.toThrow();
            expect(await h.saved()).toEqual(before);
            expect(await h.count("200001")).toBe(0);
            expect(await h.db.db.select().from(user_egg)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toEqual(outbox);
            await h.db.pool.query("drop trigger reject_egg on opencok_kingdom.command_receipt");
            const operationId = sfs.string(randomUUID()),
                result = await h.command("egg.act.reward", { operationId });
            const restarted = await h.restart(),
                draws = h.rng.draws;
            expect(await restarted.command("egg.act.reward", { operationId })).toEqual(result);
            expect(h.rng.draws).toBe(draws);
            expect(await h.count("200001")).toBe(1);
            await expect(h.command("egg.act.open", { eggId: sfs.string("132500") })).rejects
                .toThrow();
            await h.db.db.update(userprofile).set({ gold: 0n }).where(eq(userprofile.uid, "owner"));
            await expect(
                restarted.command("egg.act.open", { eggId: sfs.string("132501") }),
            ).rejects.toThrow();
            expect((await h.saved()).eggCd).toBe(eggActivityIdle);
            expect(
                (await h.db.db.select().from(command_receipt)).filter(
                    (row) => row.command === "egg.act.reward",
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
    "closed-event login settles only a genuinely pending matured egg into one pinned claimable mail without inventing XP, collection or historical progress",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("egg.act.info", {});
            await h.command("egg.act.open", { eggId: sfs.string("132500") });
            const control = h.rules.configuration.payControl!.get("69007")!;
            h.rules.configuration.payControl!.set("69007", { ...control, k9: "2030-01-02-12-00" });
            h.clock.now += 1;
            expect((await h.command("egg.act.info", {})).body.opened).toEqual(sfs.bool(false));
            await h.command("egg.activity.init", {});
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            await h.command("egg.act.info", {}, "other");
            expect(
                (await h.db.db.select().from(egg_activity)).filter((row) => row.uid === "other"),
            ).toHaveLength(0);
            h.clock.now += 30000;
            await h.db.pool.query(
                "create function reject_egg_close() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_egg_close before insert on opencok_kingdom.command_receipt for each row execute function reject_egg_close()",
            );
            await expect(h.command("egg.activity.init", {})).rejects.toThrow();
            expect((await h.saved()).eggCd).not.toBe(eggActivityIdle);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            await h.db.pool.query(
                "drop trigger reject_egg_close on opencok_kingdom.command_receipt",
            );
            const restarted = await h.restart();
            await Promise.all([
                restarted.command("egg.activity.init"),
                restarted.command("egg.activity.init"),
            ]);
            const mails = await h.db.db.select().from(mail);
            expect(mails).toHaveLength(1);
            expect(mails[0]!.toUser).toBe("owner");
            expect(mails[0]!.rewardId).toBe("goods,200001,1");
            expect((await h.saved()).eggCd).toBe(eggActivityIdle);
            expect((await h.saved()).exp).toBe(0);
            expect(await h.db.db.select().from(user_egg)).toHaveLength(0);
            expect(
                (await h.db.db.select().from(mutation_outbox)).filter(
                    (row) => row.eventType === "egg.activity.mail",
                ),
            ).toHaveLength(1);
            const mailService = new MailRewardService(
                createMailRewardExecutor(h.db.db, restarted.authority, () => h.clock.now),
                h.rules,
            );
            await mailService.command("owner", "mail.reward", {
                uid: sfs.string(mails[0]!.uid),
                operationId: sfs.string(randomUUID()),
            });
            expect(await h.count("200001")).toBe(1);
            await restarted.command("egg.activity.init");
            expect(await h.db.db.select().from(mail)).toHaveLength(1);
            await expect(restarted.command("egg.act.reward")).rejects.toThrow();
            expect(
                (await h.db.db.select().from(egg_activity)).filter((row) => row.uid === "other"),
            ).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
