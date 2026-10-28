import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { questsDomain } from "@opencok/services/quests";
import { user_14day_login } from "@opencok/drizzle/schema/opencok_kingdom/user_14day_login";
import { user_story_task } from "@opencok/drizzle/schema/opencok_kingdom/user_story_task";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { sfs } from "@opencok/messages/sfs";

test("quest claims are durable, concurrent, replayable, and isolated by owner", async () => {
    const h = await cityHarness([questsDomain]);
    try
    {
        await h.command("signIn.info", {});
        const operationId = sfs.string(randomUUID());
        const results = await Promise.allSettled([
            h.command("signIn.reward", { operationId }),
            h.command("signIn.reward", { operationId: sfs.string(randomUUID()) }),
        ]);
        expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
        const [record] = await h.db.db
            .select()
            .from(user_14day_login)
            .where(eq(user_14day_login.uid, "owner"));
        expect(record?.day).toBe(1);
        await expect(h.command("signIn.reward", {})).rejects.toThrow();
        h.clock.now = 86400000 + 1000000;
        await h.command("signIn.reward", {});
        expect(
            (await h.db.db.select().from(user_14day_login).where(
                eq(user_14day_login.uid, "owner"),
            ))[0]
                ?.day,
        ).toBe(2);
        expect(
            await h.db.db.select().from(user_14day_login).where(eq(user_14day_login.uid, "other")),
        ).toHaveLength(0);
        const tasks = await h.db.db.select().from(user_task).where(eq(user_task.uid, "owner"));
        expect(tasks.length).toBeGreaterThan(0);
        const story = await h.db.db
            .select()
            .from(user_story_task)
            .where(eq(user_story_task.uid, "owner"));
        expect(story).toHaveLength(57);
        await expect(h.command("story.task.reward", { id: sfs.int(2906530) })).rejects.toThrow();
    }
    finally
    {
        await h.close();
    }
}, 60000);

test(
    "beginner rewards grant equipment atomically and quest assets have receipt protection",
    async () => {
        const h = await cityHarness([questsDomain]);
        try
        {
            const { user_equip } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/user_equip"
            );
            const { sign_in } = await import("@opencok/drizzle/schema/opencok_kingdom/sign_in");
            const { user_assets } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/user_assets"
            );
            const request = { operationId: sfs.string(randomUUID()) };
            await h.command("fresh.signIn", request);
            await h.command("fresh.signIn", request);
            expect(await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner")))
                .toHaveLength(
                    1,
                );
            expect((await h.db.db.select().from(sign_in).where(eq(sign_in.uid, "owner")))[0]?.day)
                .toBe(1);
            const task = h.rules.reconnect.quests!.find(
                (rule) => h.rules.reconnect.rewards?.get(rule.reward ?? "")?.wbskill,
            )!;
            await h.db.db
                .insert(user_task)
                .values({ uid: "owner", id: task.id!, type: 3, num: Number(task.para2), state: 1 });
            const claim = { id: sfs.string(task.id!), operationId: sfs.string(randomUUID()) };
            await h.command("task.reward.get", claim);
            await h.command("task.reward.get", claim);
            expect(
                (await h.db.db.select().from(user_assets).where(eq(user_assets.uid, "owner")))[0]
                    ?.winPoint,
            ).toBe(BigInt(h.rules.reconnect.rewards!.get(task.reward!)!.wbskill!));
            await expect(h.command("task.reward.get", { id: sfs.string(task.id!) })).rejects
                .toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);

test("daily rollover preserves unclaimed rewards in mail exactly once", async () => {
    const h = await cityHarness([questsDomain]);
    try
    {
        const { user_new_daily_task } = await import(
            "@opencok/drizzle/schema/opencok_kingdom/user_new_daily_task"
        );
        const { user_lord } = await import("@opencok/drizzle/schema/opencok_kingdom/user_lord");
        const { mail } = await import("@opencok/drizzle/schema/opencok_kingdom/mail");
        const rule = [...h.rules.progression.daily!.values()][0]!;
        await h.db.db
            .insert(user_new_daily_task)
            .values({ uid: "owner", id: Number(rule.id), type: 0, num: 1, state: 1 });
        await h.db.db.insert(user_lord).values({ uid: "owner", newDailyTaskFlushTime: 86400000n });
        h.clock.now = 172800000 + 300000;
        await h.command("quest.init", {});
        const first = await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
        expect(first).toHaveLength(1);
        expect(first[0]?.rewardStatus).toBe(0);
        expect(first[0]?.rewardId).toBeTruthy();
        await h.command("quest.init", {});
        expect(await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"))).toHaveLength(1);
    }
    finally
    {
        await h.close();
    }
}, 60000);

test(
    "repeated initialization preserves quest row versions and failed batches roll back",
    async () => {
        const h = await cityHarness([questsDomain]);
        try
        {
            const { sql } = await import("drizzle-orm");
            const { writeQuests } = await import("@opencok/repositories/quests");
            await h.db.db.transaction(async (tx) => {
                await writeQuests(tx, "owner", {
                    tasks: Array.from({ length: 600 }, (_, id) => ({
                        uid: "owner",
                        id: `synthetic-${id}`,
                        type: 3,
                        state: id % 3,
                        num: id,
                    })),
                });
            });
            await h.command("quest.init", {});
            const snapshot = async () =>
                (
                    await h.db.db.execute(
                        sql`SELECT id, xmin::text AS version, state, num FROM opencok_kingdom.user_task WHERE uid = 'owner' ORDER BY id`,
                    )
                ).rows;
            const before = await snapshot();
            expect(before.length).toBeGreaterThan(256);
            await h.command("quest.init", {});
            expect(await snapshot()).toEqual(expect.arrayContaining(before));
            const settled = await snapshot();
            await expect(
                h.db.db.transaction(async (tx) => {
                    await writeQuests(tx, "owner", {
                        tasks: [{ uid: "owner", id: "rollback-only", type: 3, state: 1, num: 1 }],
                        story: [{ uid: "owner", id: 2147483648, type: 1, state: 1, num: 1 }],
                    });
                }),
            ).rejects.toThrow();
            expect(await snapshot()).toEqual(settled);
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);

test("PostgreSQL statement timeout is classified through Drizzle and rolls back", async () => {
    const h = await cityHarness([questsDomain]);
    try
    {
        const { sql } = await import("drizzle-orm");
        const { errorReason } = await import("@opencok/core/logging");
        let reason = "";
        try
        {
            await h.db.db.transaction(async (tx) => {
                await tx
                    .insert(user_task)
                    .values({ uid: "owner", id: "timeout-only", type: 3, state: 1, num: 1 });
                await tx.execute(sql`SET LOCAL statement_timeout = '25ms'`);
                await tx.execute(sql`SELECT pg_sleep(0.2)`);
            });
        }
        catch (error)
        {
            reason = errorReason(error);
        }
        expect(reason).toBe("database_query_cancelled");
        expect(
            await h.db.db.select().from(user_task).where(eq(user_task.id, "timeout-only")),
        ).toHaveLength(0);
    }
    finally
    {
        await h.close();
    }
}, 60000);
