import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { readActivityOperators } from "@opencok/repositories/activity-operators";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_target_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task_notes";
import { user_recall_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task_notes";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { activity_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/activity_group_buys";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_target_task } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task";
import { user_recall_task } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";
import { configureOperators, operatorsNow } from "../test/fixtures/activity-operators";
import { cityHarness } from "./support/city";
test(
    "operator reads project exact saved player clocks and registration country without creating tasks, rewards, periods, receipts or outbox",
    async () => {
        const h = await cityHarness();
        try
        {
            configureOperators(h.rules);
            h.clock.now = operatorsNow;
            const now = BigInt(operatorsNow),
                end = 9007199254740993000n;
            await h.db.db.insert(server_info).values({
                uid: "server",
                activityTime: now - 86400000n,
            });
            await h.db.db.insert(user_target_task_notes).values([
                { uid: "owner", version: "12.06.0", beginTime: now - 1000n, endTime: end },
                { uid: "other", version: "12.06.0", beginTime: now - 1000n, endTime: now + 1000n },
            ]);
            await h.db.db.insert(user_recall_task_notes).values({
                uid: "owner",
                version: "12.06.0",
                country: "BR",
                beginTime: now - 1000n,
                endTime: now + 7200001n,
            });
            await h.db.db.insert(stat_reg).values([
                { uid: "owner", type: 1, country: "US", time: now },
                { uid: "owner", type: 2, country: "BR", time: now },
            ]);
            const before = {
                target: await h.db.db.select().from(user_target_task_notes),
                recall: await h.db.db.select().from(user_recall_task_notes),
                resource: await h.db.db.select().from(user_resource),
                items: await h.db.db.select().from(user_item),
            };
            const game = new GameService(
                {
                    activityOperators: (owner, at) => readActivityOperators(h.db.db, owner, at),
                } as GameStore,
                h.rules,
                { kingdomId: 1 },
                () => h.clock.now,
                {
                    async reconcileAlliance()
                    {
                        throw new Error("Operator query attempted alliance mutation");
                    },
                    async cityProgression()
                    {
                        throw new Error("Operator query attempted mutation");
                    },
                },
            );
            for (let index = 0; index < 2; index++)
            {
                const result = await game.execute("owner", "activity.operators", {
                    _cok_: sfs.string("operator"),
                });
                expect(result.pushes).toEqual([]);
                const body = decode(encode(result.body)),
                    rows = (body.activityList!.value as Value[]).map(fields);
                expect(rows.map((row) => row.id)).toEqual([1, 2, 3, 4, 5, 6, 7].map(sfs.int));
                expect(rows.find((row) => row.id?.value === 3)?.endTime).toEqual(
                    sfs.long(9007199254740993n),
                );
                expect(rows.find((row) => row.id?.value === 4)?.endTime).toEqual(
                    sfs.long((now + 7200001n) / 1000n),
                );
                expect(body._cok_).toEqual(sfs.string("operator"));
            }
            expect(await h.db.db.select().from(user_target_task_notes)).toEqual(before.target);
            expect(await h.db.db.select().from(user_recall_task_notes)).toEqual(before.recall);
            expect(await h.db.db.select().from(user_resource)).toEqual(before.resource);
            expect(await h.db.db.select().from(user_item)).toEqual(before.items);
            for (
                const table of [
                    user_target_task,
                    user_recall_task,
                    activity_group_buys,
                    command_receipt,
                    mutation_outbox,
                    economy_posting,
                ]
            )
            {
                expect(await h.db.db.select().from(table)).toHaveLength(0);
            }
            await h.db.db.insert(activity_group_buys).values({
                id: "synthetic-oversized",
                curRound: 1,
                startTime: now - 1n,
                endTime: now + 86400000n,
                roundInfo: " ".repeat(32769),
            });
            await expect(game.execute("owner", "activity.operators", {})).rejects.toThrow();
            await h.db.db
                .delete(activity_group_buys)
                .where(eq(activity_group_buys.id, "synthetic-oversized"));
            const other = await game.execute("other", "activity.operators", {});
            expect(
                (other.body.activityList!.value as Value[]).some((row) =>
                    fields(row).id?.value === 4
                ),
            ).toBe(false);
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await expect(game.execute("owner", "activity.operators", {})).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(game.execute("other", "activity.operators", {})).rejects.toThrow();
            await expect(game.execute("missing", "activity.operators", {})).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
