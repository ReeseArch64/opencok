import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { sfs, str, int, encode, decode, fields, type Fields } from "@opencok/messages/sfs";
import { heroTargetDomain, deliverHeroTargetBatch } from "@opencok/hero/services/hero-score";
import { createPrayerDomain } from "@opencok/services/prayer";
import { lotteryDomain } from "@opencok/services/lottery";
import { trainingDomain } from "@opencok/services/training";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { score_act_in } from "@opencok/drizzle/schema/opencok_kingdom/score_act_in";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import type { CityDomain } from "@opencok/city/contracts/domain";
import { cityHarness } from "./support/city";
const producer: CityDomain = {
    commands: ["hero.synthetic.action"],
    types: [],
    async prepare(context, _command, params)
    {
        context.recordHero(
            int(params, "type", 8),
            str(params, "parameter", "1"),
            int(params, "count", 1),
        );
        context.economy.gold(-1n);
        return { response: encode({}), event: null };
    },
    async apply()
    {
        throw new Error("Unsupported synthetic activity");
    },
};
async function fixture(types = [1, 2])
{
    const h = await cityHarness([producer, heroTargetDomain]);
    const original = h.rules.ranking.heroEvents!.get("9001000")!,
        reward = original.reward!.split("|")[0]!.split(";")[0]!;
    h.rules.ranking.heroEvents!.set("synthetic", {
        ...original,
        id: "synthetic",
        score: "47075",
        target: "2;4",
        reward: `${reward};${reward}`,
    });
    for (const owner of ["owner", "other"])
    {
        await h.db.db
            .update(userprofile)
            .set({ allianceId: "guild" })
            .where(eq(userprofile.uid, owner));
        await h.db.db.insert(alliance_member).values({ uid: owner, allianceId: "guild", rank: 1 });
    }
    for (const type of types)
    {
        await h.db.db.insert(hero_event).values({
            uuid: `event-${type}`,
            eventId: "synthetic",
            activityId: "main",
            type,
            rewardType: type,
            readyTime: 0n,
            startTime: 1n,
            endTime: 2000000n,
            rewardStatus: 0,
        });
    }
    return h;
}
async function deliver(h: Awaited<ReturnType<typeof fixture>>)
{
    for (
        const event of (await h.db.db.select().from(mutation_outbox)).filter(
            (row) => row.eventType === "hero.target.earned",
        )
    )
    {
        await deliverHeroTargetBatch(
            event.payload,
            (owner, params) => h.command("hero.target.deliver", params, owner),
        );
    }
}
test(
    "confirmed hero contributions serialize guild totals and fund each reached tier once across retries",
    async () => {
        const h = await fixture();
        try
        {
            const operation = sfs.string(randomUUID());
            await h.command("hero.synthetic.action", { count: sfs.int(2), operationId: operation });
            await h.command("hero.synthetic.action", { count: sfs.int(2), operationId: operation });
            await Promise.all([
                h.command("hero.synthetic.action", { count: sfs.int(1) }),
                h.command("hero.synthetic.action", { count: sfs.int(2) }, "other"),
            ]);
            const scores = await h.db.db.select().from(score_act);
            expect(scores.find((row) => row.uid === "owner" && row.actId === "event-1"))
                .toMatchObject({
                    score: 3,
                    level: 0,
                    rewardFlag: "0",
                });
            expect(scores.find((row) => row.uid === "guild")).toMatchObject({
                score: 5,
                level: 0,
                rewardFlag: "0,1",
                finishFlag: 1,
            });
            expect((await h.db.db.select().from(score_act_in)).map((row) => row.score).sort())
                .toEqual([
                    2,
                    3,
                ]);
            await deliver(h);
            const messages = await h.db.db.select().from(mail);
            expect(messages.filter((row) => row.toUser === "owner")).toHaveLength(3);
            expect(messages.filter((row) => row.toUser === "other")).toHaveLength(2);
            expect(messages.every((row) => row.rewardId && row.rewardStatus === 0)).toBe(true);
            const publications = (await h.db.db.select().from(mutation_outbox)).filter(
                (row) => row.eventType === "hero.target.mail",
            );
            expect(publications).toHaveLength(5);
            for (const publication of publications)
            {
                const payload = decode(publication.payload);
                expect(str(payload, "owner")).toBe(publication.ownerUid);
                expect(
                    messages.some(
                        (row) =>
                            row.uid === str(fields(payload.mail), "uid")
                            && row.toUser === publication.ownerUid,
                    ),
                ).toBe(true);
                expect(payload.achievement).toBeDefined();
            }

            await deliver(h);
            expect(await h.db.db.select().from(mail)).toEqual(messages);
            expect(
                (await h.db.db.select().from(userprofile)).find((row) => row.uid === "owner")!.gold,
            ).toBe(99998n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero scoring honors prep and end cutoffs, immutable bands, negative power and unmatched kingdom events",
    async () => {
        const h = await fixture([1, 3, 4]);
        try
        {
            await h.db.db.update(hero_event).set({ startTime: 1000001n });
            await h.command("hero.synthetic.action", { count: sfs.int(4) });
            expect(await h.db.db.select().from(score_act)).toHaveLength(0);
            h.clock.now = 1000001;
            await h.command("hero.synthetic.action", { count: sfs.int(4) });
            expect(await h.db.db.select().from(score_act)).toHaveLength(1);
            await h.db.db.update(score_act).set({ level: 0 });
            h.rules.ranking.heroEvents!.get("synthetic")!.score = "47087";
            const scoreRule = h.rules.advanced.heroScores!.get("47087")!;
            scoreRule.type = "6";
            scoreRule.value = "0";
            scoreRule.points = "1";
            await h.command("hero.synthetic.action", {
                type: sfs.int(6),
                parameter: sfs.string("0"),
                count: sfs.int(-2),
            });
            expect((await h.db.db.select().from(score_act))[0]).toMatchObject({
                score: 2,
                rewardFlag: "0,1",
                level: 0,
                finishFlag: 0,
            });
            h.clock.now = 2000000;
            await h.command("hero.synthetic.action", { count: sfs.int(100) });
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(2);
            h.clock.now = 1500000;
            await h.db.db.insert(hero_event).values({
                uuid: "duplicate",
                eventId: "synthetic",
                activityId: "another-main",
                type: 1,
                rewardType: 1,
                startTime: 1n,
                endTime: 2000000n,
            });
            await expect(h.command("hero.synthetic.action", { count: sfs.int(10) })).rejects
                .toThrow(
                    "Ambiguous hero scoring events",
                );
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a failed hero receipt rolls back scoring, contributions, economic debit and reward delivery intents",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`create function opencok_kingdom.reject_hero_receipt() returns trigger language plpgsql as $$ begin raise exception 'synthetic receipt rejection'; end $$`,
            );
            await h.db.db.execute(
                sql`create trigger reject_hero_receipt before insert on opencok_kingdom.command_receipt for each row execute function opencok_kingdom.reject_hero_receipt()`,
            );
            await expect(h.command("hero.synthetic.action", { count: sfs.int(4) })).rejects
                .toThrow();
            expect(await h.db.db.select().from(score_act)).toHaveLength(0);
            expect(await h.db.db.select().from(score_act_in)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
            expect((await h.db.db.select().from(userprofile))[0]!.gold).toBe(100000n);
            await h.db.db.execute(
                sql`drop trigger reject_hero_receipt on opencok_kingdom.command_receipt`,
            );
            await h.command("hero.synthetic.action", { count: sfs.int(4) });
            await h.db.db.execute(
                sql`create trigger reject_hero_receipt before insert on opencok_kingdom.command_receipt for each row execute function opencok_kingdom.reject_hero_receipt()`,
            );
            await expect(deliver(h)).rejects.toThrow();
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            await h.db.db.execute(
                sql`drop trigger reject_hero_receipt on opencok_kingdom.command_receipt`,
            );
            await deliver(h);
            expect(await h.db.db.select().from(mail)).toHaveLength(4);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "native prayer, lottery and both training paths produce hero points only after the underlying action commits",
    async () => {
        const h = await cityHarness([
            createPrayerDomain(() => 0),
            lotteryDomain,
            trainingDomain,
            heroTargetDomain,
        ]);
        try
        {
            h.clock.now = Date.UTC(2017, 2, 20, 12);
            const original = h.rules.ranking.heroEvents!.get("9001000")!;
            h.rules.ranking.heroEvents!.set("synthetic", {
                ...original,
                id: "synthetic",
                score: "47075|47077|47078|47009",
                target: "2000000000;2147483646;2147483647",
                reward: original.reward!.split("|")[0]!,
            });
            await h.db.db.insert(hero_event).values({
                uuid: "native-event",
                eventId: "synthetic",
                activityId: "native-main",
                type: 1,
                rewardType: 1,
                startTime: BigInt(h.clock.now - 1),
                endTime: BigInt(h.clock.now + 86400000),
            });
            await h.db.db.insert(user_building).values({
                uuid: "owner-altar",
                uid: "owner",
                itemId: 428000,
                pos: 14,
                level: 1,
                opType: 0,
                refreshTime: BigInt(h.clock.now),
            });
            const info = await h.command("user.pray.info", {}),
                operationId = sfs.string(randomUUID());
            const params = {
                resource: sfs.int(0),
                gold: sfs.int(0),
                num: info.body.wood!,
                operationId,
            };
            await h.command("user.pray", params);
            await h.command("user.pray", params);
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(1);
            await h.db.db
                .update(user_resource)
                .set({ chip: 50000, diamond: 50000 })
                .where(eq(user_resource.uid, "owner"));
            await h.command("lottery.init", {});
            await h.command("lottery.start", {
                type: sfs.string("1"),
                super: sfs.string("0"),
                useGold: sfs.string("0"),
                times: sfs.string("0"),
                position: sfs.string("0"),
            });
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(1001);
            await h.command("lottery.start", {
                type: sfs.string("2"),
                super: sfs.string("0"),
                useGold: sfs.string("0"),
                times: sfs.string("0"),
                position: sfs.string("4"),
            });
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(3001);
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(3),
                gold: sfs.bool(false),
            });
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(3001);
            await h.finish(1);
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(3031);
            await h.command("army.cd", {
                id: sfs.string("107000"),
                num: sfs.int(2),
                gold: sfs.bool(false),
                complete: sfs.bool(true),
            });
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(3051);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "an unavailable hero recipient cannot block another member and partial delivery resumes without another prize",
    async () => {
        const h = await fixture([2]);
        try
        {
            await h.command("hero.synthetic.action", { count: sfs.int(2) });
            await h.command("hero.synthetic.action", { count: sfs.int(2) }, "other");
            const event = (await h.db.db.select().from(mutation_outbox)).find(
                (row) =>
                    row.eventType === "hero.target.earned"
                    && int(decode(row.payload), "stage") === 2,
            )!;
            const send = (owner: string, params: Fields) =>
                h.command("hero.target.deliver", params, owner);
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await expect(deliverHeroTargetBatch(event.payload, send)).rejects.toThrow(
                "Hero reward delivery pending",
            );
            expect((await h.db.db.select().from(mail)).map((row) => row.toUser)).toEqual(["other"]);
            await h.db.db.update(userprofile).set({ banFlag: 0 }).where(
                eq(userprofile.uid, "owner"),
            );
            await deliverHeroTargetBatch(event.payload, send);
            expect((await h.db.db.select().from(mail)).map((row) => row.toUser).sort()).toEqual([
                "other",
                "owner",
            ]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
