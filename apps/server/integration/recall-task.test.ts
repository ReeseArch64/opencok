import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { recallTaskDomain } from "@opencok/services/recall-task";
import { createRealmTrainingDomain } from "../src/composition/troops";
import { user_recall_task } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task";
import { user_recall_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task_notes";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

const trainingDomain = createRealmTrainingDomain();

async function fixture(synthetic = true)
{
    const h = await cityHarness([recallTaskDomain, trainingDomain]);
    h.clock.now = Date.UTC(2017, 2, 20, 12);
    await h.db.db
        .insert(stat_reg)
        .values({ uid: "owner", type: 2, time: BigInt(Date.UTC(2017, 0, 1)), country: "KR" });
    await h.db.db
        .update(userprofile)
        .set({ regTime: BigInt(Date.UTC(2017, 0, 1)), offLineTime: BigInt(Date.UTC(2017, 1, 1)) })
        .where(eq(userprofile.uid, "owner"));
    await h.db.db
        .update(user_building)
        .set({ level: 16 })
        .where(and(eq(user_building.uid, "owner"), eq(user_building.itemId, 400000)));
    if (synthetic)
    {
        const control = h.rules.advanced.recallActivities!.get("9035001")!;
        h.rules.advanced.recallActivities!.set("9035001", {
            ...control,
            k7: Array.from({ length: 5 }, () => "990001;990002;990003").join("|"),
            k8: "",
        });
        h.rules.advanced.recallTasks!.set("990001", {
            id: "990001",
            type: "2",
            extend_type: "1",
            num: "4",
            rewardall: "990010",
        });
        h.rules.advanced.recallTasks!.set("990002", {
            id: "990002",
            type: "27",
            extend_type: "1",
            num: "2",
            rewardall: "990010",
        });
        h.rules.advanced.recallTasks!.set("990003", {
            id: "990003",
            type: "26",
            extend_type: "1",
            num: "2",
            rewardall: "990010",
        });
        h.rules.reconnect.rewards!.set("990010", { id: "990010", gold: "7" });
    }
    return {
        ...h,
        initialize: () => h.command("recall.task.init", {}),
        rows: () =>
            h.db.db.select().from(user_recall_task).where(eq(user_recall_task.uid, "owner")),
        notes: async () =>
            (
                await h.db.db
                    .select()
                    .from(user_recall_task_notes)
                    .where(eq(user_recall_task_notes.uid, "owner"))
            )[0]!,
        gold: async () =>
            (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    };
}
test(
    "recall task enrollment retains maintained country and castle assignments and native Boolean task fields",
    async () => {
        const h = await fixture(false);
        try
        {
            await h.initialize();
            const tasks = await h.rows();
            expect(tasks).toHaveLength(9);
            expect(tasks.map((row) => row.id)).toContain("9040004");
            expect(
                tasks.every((row) => row.type_level === 16 && row.num === 0 && row.receive === 0),
            ).toBe(
                true,
            );
            const ui = await h.command("recall.task.ui", {});
            expect(ui.body.opentime).toEqual(sfs.long(BigInt(h.clock.now)));
            expect(ui.body.targetList?.type).toBe(Type.Array);
            expect(ui.body.targetList?.value).toHaveLength(9);
            await h.initialize();
            expect(await h.rows()).toEqual(tasks);
            expect((await h.command("recall.task.ui", {}, "other")).body.targetList?.value)
                .toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "recall tasks advance from real completed training while duplicate operations and client counters cannot mint progress",
    async () => {
        const h = await fixture();
        try
        {
            await h.initialize();
            const request = {
                id: sfs.string("107000"),
                num: sfs.int(2),
                gold: sfs.bool(false),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(Array.from({ length: 3 }, () => h.command("army.add", request)));
            expect((await h.rows()).find((row) => row.id === "990001")!.num).toBe(0);
            await h.finish(1);
            expect((await h.rows()).find((row) => row.id === "990001")!).toMatchObject({
                num: 2,
                state: 0,
            });
            const immediate = {
                id: sfs.string("107000"),
                num: sfs.int(2),
                complete: sfs.bool(true),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(Array.from({ length: 3 }, () => h.command("army.cd", immediate)));
            expect((await h.rows()).find((row) => row.id === "990001")!).toMatchObject({
                num: 4,
                state: 1,
            });
            const baseline = await h.gold(),
                claim = {
                    id: sfs.string("990001"),
                    num: sfs.int(999),
                    operationId: sfs.string(randomUUID()),
                };
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("recall.task.receive", claim)),
            );
            expect(await h.gold()).toBe(baseline + 7n);
            await h.command("recall.task.receive", { id: sfs.string("990001") });
            expect(await h.gold()).toBe(baseline + 7n);
            expect((await h.rows()).find((row) => row.id === "990001")!.receive).toBe(1);
            expect(
                (await h.command("recall.task.receive", { id: sfs.string("990001") }, "other")).body
                    .reward,
            ).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "daily recall login credit survives repeated reconnects while per-login credit remains a distinct task",
    async () => {
        const h = await fixture();
        try
        {
            await h.initialize();
            await h.initialize();
            await h.initialize();
            await h.initialize();
            expect((await h.rows()).find((row) => row.id === "990002")!.num).toBe(0);
            expect((await h.rows()).find((row) => row.id === "990003")!).toMatchObject({
                num: 2,
                state: 1,
            });
            h.clock.now = Date.UTC(2017, 2, 21);
            await h.initialize();
            await h.initialize();
            expect((await h.rows()).find((row) => row.id === "990002")!.num).toBe(1);
            h.clock.now = Date.UTC(2017, 2, 22);
            await h.initialize();
            expect((await h.rows()).find((row) => row.id === "990002")!).toMatchObject({
                num: 2,
                state: 1,
            });
            expect((await h.notes()).lastLoginTime).toBe(BigInt(h.clock.now));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "completed recall claims and milestone statuses roll back on receipt failure and cannot refresh the same milestone twice",
    async () => {
        const h = await fixture();
        try
        {
            const control = h.rules.advanced.recallActivities!.get("9035001")!;
            h.rules.advanced.recallActivities!.set("9035001", {
                ...control,
                k8: "0;509040|1;509041",
            });
            await h.initialize();
            await h.db.db.update(user_recall_task).set({ num: 4, state: 1 });
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_recall_task_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_recall_task_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_recall_task_receipt()`,
            );
            const baseline = await h.gold();
            await expect(h.command("recall.task.receive", { id: sfs.string("990001") })).rejects
                .toThrow();
            expect(await h.gold()).toBe(baseline);
            expect((await h.rows()).every((row) => row.receive === 0)).toBe(true);
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_recall_task_receipt ON opencok_kingdom.command_receipt`,
            );
            expect(
                (await h.command("recall.task.receive", { id: sfs.string("990001") })).body.status,
            ).toEqual(sfs.string("509041"));
            const states = await h.db.db.select().from(user_state);
            await h.command("recall.task.receive", { id: sfs.string("990002") });
            expect(await h.db.db.select().from(user_state)).toEqual(states);
            expect((await h.notes()).receive_mode).toBe(509041);
            expect(await h.gold()).toBe(baseline + 14n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
