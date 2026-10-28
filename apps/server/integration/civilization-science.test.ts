import type { Rule } from "@opencok/rules/game";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { CivilizationScienceDomain } from "@opencok/research/services/civilization";
import { sfs, fields } from "@opencok/messages/sfs";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { cityHarness } from "./support/city";

const civilizationScienceDomain = new CivilizationScienceDomain();

test(
    "civilization research commits one debit across concurrent retries and survives queue recovery",
    async () => {
        const h = await cityHarness([civilizationScienceDomain]);
        try
        {
            h.rules.power.civilizationSciences = new Map<string, Rule>([
                [
                    "700000",
                    {
                        id: "700000",
                        time_research: "60",
                        research_need: "0;100",
                        para1: "1",
                        para2: "0",
                        power: "0",
                    },
                ],
                [
                    "700001",
                    {
                        id: "700001",
                        time_research: "60",
                        research_need: "0;200",
                        para1: "1",
                        para2: "10",
                        power: "10",
                    },
                ],
                ["700002", { id: "700002", para1: "1", para2: "20", power: "20" }],
            ]);
            await h.db.db.insert(queue).values({
                uuid: "owner-civilization",
                ownerId: "owner",
                qid: 1,
                type: 19,
                itemId: "",
                startTime: idleDeadline,
                endTime: idleDeadline,
                updateTime: idleDeadline,
                totalTime: 0n,
            });
            const request = { itemId: sfs.string("700000"), operationId: sfs.string(randomUUID()) };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("race.science.research", request)),
            );
            expect(new Set(replies.map((reply) => fields(reply.body.queue).activityId!.value)).size)
                .toBe(
                    1,
                );
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!.wood,
            ).toBe(999900n);
            const active = await h.active(19);
            await expect(
                h.service.command("owner", "race.science.upgrade", {
                    uuid: sfs.string(active.queueId),
                    itemId: sfs.string("700100"),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            h.clock.now = Number(active.dueAt);
            const finish = {
                uuid: sfs.string(active.queueId),
                itemId: sfs.string("700000"),
                operationId: sfs.string(randomUUID()),
            };
            await h.service.command("owner", "race.science.upgrade", finish);
            await h.service.command("owner", "race.science.upgrade", finish);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_civilization_science)
                        .where(eq(user_civilization_science.userID, "owner"))
                )[0]!.level,
            ).toBe(1);
            await h.command("race.science.research", { itemId: sfs.string("700000") });
            const second = await h.active(19);
            await h.service.command("owner", "queue.cancel", {
                uuid: sfs.string(second.queueId),
                operationId: sfs.string(randomUUID()),
            });
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_civilization_science)
                        .where(eq(user_civilization_science.userID, "owner"))
                )[0]!.level,
            ).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
