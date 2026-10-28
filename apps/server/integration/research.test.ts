import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { researchDomain } from "@opencok/services/research";
import { sfs, fields } from "@opencok/messages/sfs";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { cityHarness } from "./support/city";

test(
    "research enforces trees, persists effects and shares queue recovery, acceleration and cancellation",
    async () => {
        const h = await cityHarness([researchDomain]);
        try
        {
            await expect(h.command("science.research", { itemId: sfs.string("700101") })).rejects
                .toThrow();
            const dependent = h.rules.power.sciences!.get("700200")!;
            h.rules.power.sciences!.set("700200", { ...dependent, science_condition: "700101" });
            await expect(h.command("science.research", { itemId: sfs.string("700200") })).rejects
                .toThrow();
            const operationId = sfs.string(randomUUID()),
                request = { itemId: sfs.string("700100"), gold: sfs.int(0), operationId };
            const started = await Promise.all(
                Array.from({ length: 4 }, () => h.command("science.research", request)),
            );
            const activity = await h.active(6);
            expect(new Set(started.map((reply) => fields(reply.body.queue).activityId!.value)).size)
                .toBe(
                    1,
                );
            expect(
                (await h.db.db.select().from(user_science).where(eq(user_science.uid, "owner")))[0]!
                    .level,
            ).toBe(0);
            await expect(
                h.command("build.upgrade", { uuid: sfs.string("owner-403000"), gold: sfs.int(0) }),
            ).rejects.toThrow();
            await expect(
                h.service.command("owner", "science.upgrade", {
                    uuid: sfs.string(activity.queueId),
                    itemId: sfs.string("700200"),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await h.service.command("owner", "queue.ccd", {
                qUUID: sfs.string(activity.queueId),
                isGold: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            });
            const completed = (
                await h.db.db.select().from(user_science).where(eq(user_science.uid, "owner"))
            )[0]!;
            expect(completed.level).toBe(1);
            expect(completed.cd).toBe(idleDeadline);
            const production = (
                await h.db.db
                    .select()
                    .from(building_production)
                    .where(eq(building_production.buildingId, "owner-413000"))
            )[0]!;
            expect(production.rates).toContain("124800000");
            await h.command("science.research", { itemId: sfs.string("700100"), gold: sfs.int(0) });
            const second = await h.active(6);
            const cost = (
                await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
            )[0]!.wood;
            await h.service.command("owner", "queue.cancel", {
                uuid: sfs.string(second.queueId),
                activityId: sfs.string(second.id),
                operationId: sfs.string(randomUUID()),
            });
            expect(
                (await h.db.db.select().from(user_science).where(eq(user_science.uid, "owner")))[0]!
                    .level,
            ).toBe(1);
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!.wood,
            ).toBe(cost + 780n);
            await h.command("science.directly", { itemId: sfs.string("700100") });
            expect(
                (await h.db.db.select().from(user_science).where(
                    eq(user_science.itemId, "700100"),
                ))[0]!
                    .level,
            ).toBe(2);
            await h.command("science.research", { itemId: sfs.string("700200"), gold: sfs.int(0) });
            await h.finish(6);
            expect(
                (await h.db.db.select().from(user_science).where(
                    eq(user_science.itemId, "700200"),
                ))[0]!
                    .level,
            ).toBe(1);
            const initialized = await h.command("science.data.init", {});
            expect((initialized.body.science!.value as unknown[]).length).toBeGreaterThan(100);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "overdue research changes production at its saved deadline before later settlement",
    async () => {
        const h = await cityHarness([researchDomain]);
        try
        {
            await h.command("science.research", { itemId: sfs.string("700100"), gold: sfs.int(0) });
            const activity = await h.active(6);
            h.clock.now = Number(activity.dueAt) + 3600000;
            await h.finish(6);
            const checkpoint = (
                await h.db.db
                    .select()
                    .from(building_production)
                    .where(eq(building_production.buildingId, "owner-413000"))
            )[0]!;
            expect(checkpoint.settledAt).toBe(activity.dueAt);
            expect(checkpoint.amount).toBe(4n);
            await h.production.command("owner", "production.settle", {});
            const after = (
                await h.db.db
                    .select()
                    .from(building_production)
                    .where(eq(building_production.buildingId, "owner-413000"))
            )[0]!;
            expect(after.amount).toBe(128n);
            expect(after.settledAt).toBe(BigInt(h.clock.now));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
