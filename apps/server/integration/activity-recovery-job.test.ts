import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { dueActivities, unregisteredActivities } from "@opencok/repositories/timed-activity";
import { ActivityRecoveryJob } from "../src/activity-recovery-job";
import { cityHarness } from "./support/city";

test(
    "activity recovery restores a legacy queue once, preserves the command target and completes after restart",
    async () => {
        const h = await cityHarness();
        const failures: string[] = [];
        const create = () =>
            new ActivityRecoveryJob(
                () => h.authority.assertReady(),
                () => [...h.handlers.domains.keys()],
                (types, limit, owner, after) =>
                    unregisteredActivities(h.db.db, types, limit, owner, after),
                (types, now, limit, owner, after) =>
                    dueActivities(h.db.db, types, now, limit, owner, after),
                (owner, operationId, queueId) => h.service.restore(owner, operationId, queueId),
                (owner, command, params) => h.service.command(owner, command, params),
                (event) => {
                    failures.push(event);
                },
                () => h.clock.now,
            );

        try
        {
            await h.command("build.upgrade", {
                uuid: sfs.string("owner-413000"),
                gold: sfs.int(0),
                operationId: sfs.string("synthetic:upgrade"),
            });
            const original = await h.active(0);
            const resources = () =>
                h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"));
            const charged = (await resources())[0]!;
            await h.db.db.delete(timed_activity).where(eq(timed_activity.id, original.id));
            h.clock.now = Number(original.dueAt);

            const first = create();
            await first.run("owner", original.queueId);
            const restored = await h.active(0);
            expect(restored.queueId).toBe(original.queueId);
            expect(restored.id).not.toBe(original.id);
            expect(restored.dueAt).toBe(original.dueAt);
            expect((await h.building("owner-413000"))!.level).toBe(1);
            expect((await resources())[0]!.food).toBe(charged.food);
            const receiptsBeforeFinish = await h.db.db.select().from(command_receipt);
            expect(receiptsBeforeFinish.filter((row) => row.command === "activity.restore"))
                .toHaveLength(1);

            const restarted = create();
            await Promise.all([first.run(), restarted.run("owner")]);
            expect((await h.building("owner-413000"))!.level).toBe(2);
            expect((await h.building("owner-413000"))!.opType).toBe(0);
            const completed = await h.db.db.select().from(timed_activity).where(
                eq(timed_activity.id, restored.id),
            );
            expect(completed[0]!.status).toBe(1);
            const receiptsAfterFinish = await h.db.db.select().from(command_receipt);
            expect(receiptsAfterFinish.filter((row) => row.command === "queue.finish"))
                .toHaveLength(1);
            expect(receiptsAfterFinish.filter((row) => row.command === "activity.restore"))
                .toHaveLength(1);

            await create().run();
            expect(await h.db.db.select().from(command_receipt)).toEqual(receiptsAfterFinish);
            expect((await h.building("owner-413000"))!.level).toBe(2);
            expect(failures).toEqual([]);
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);
