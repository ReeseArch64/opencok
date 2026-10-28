import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { expeditionDomain, recordExpeditionScore } from "@opencok/services/new-expedition";
import { trainingDomain } from "@opencok/services/training";
import { installExpeditionPeriod } from "@opencok/repositories/new-expedition";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { sfs, encode, int } from "@opencok/messages/sfs";
import type { CityDomain } from "@opencok/city/contracts/domain";
import { cityHarness } from "./support/city";

const trustedProducer: CityDomain = {
    commands: ["trusted.test.score"],
    types: [],
    async prepare(context, _, params)
    {
        recordExpeditionScore(context, 5, 107000, int(params, "count"));
        return { response: encode({}), event: null };
    },
    async apply()
    {
        throw new Error("No timer");
    },
};
async function fixture(stage = 7)
{
    const h = await cityHarness([expeditionDomain, trainingDomain, trustedProducer]);
    const startTime = BigInt(h.clock.now);
    const manifest = {
        serverId: 1,
        periodId: "synthetic-period-1",
        matchServerId: 2,
        startTime,
        stages: [{ stage, durationMs: 10000000n }],
    };
    await h.db.db.transaction((tx) =>
        installExpeditionPeriod(tx, h.authority, manifest, async () => true)
    );
    h.rules.advanced.expeditionRewards!.set("1", {
        id: "1",
        stage: String(stage),
        type: "1",
        castle_min: "1",
        castle_max: "40",
        target: "5",
        reward: "249200",
    });
    h.rules.advanced.expeditionRewards!.set("2", {
        id: "2",
        stage: String(stage),
        type: "2",
        castle_min: "1",
        castle_max: "40",
        target: "5",
        reward: "249200",
    });
    return { ...h, manifest };
}
test(
    "expedition periods require authorization, reject conflicting schedules and recover exact stage boundaries",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.transaction((tx) =>
                installExpeditionPeriod(tx, h.authority, h.manifest, async () => true)
            );
            await expect(
                h.db.db.transaction((tx) =>
                    installExpeditionPeriod(
                        tx,
                        h.authority,
                        { ...h.manifest, matchServerId: 3 },
                        async () => true,
                    )
                ),
            ).rejects.toThrow();
            await expect(
                h.db.db.transaction((tx) =>
                    installExpeditionPeriod(
                        tx,
                        h.authority,
                        { ...h.manifest, periodId: "unauthorized" },
                        async () => false,
                    )
                ),
            ).rejects.toThrow();
            const initial = await h.command("newexpidition.activityinfo", {});
            expect(initial.body.state).toEqual(sfs.int(7));
            h.clock.now += 10000000;
            const expired = await h.command("newexpidition.activityinfo", {});
            expect(expired.body.state).toEqual(sfs.int(0));
            await expect(
                h.command("newexpidition.takepersonreward", { id: sfs.string("1") }),
            ).rejects.toThrow();
            await h.command("trusted.test.score", { count: sfs.int(100) });
            expect((await h.db.db.select().from(expedition_progress)).length).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "real training produces stage score once and claims are atomic under concurrent retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(5),
                gold: sfs.bool(false),
            });
            expect((await h.db.db.select().from(expedition_progress)).length).toBe(0);
            await h.finish(1);
            const [progress] = await h.db.db.select().from(expedition_progress);
            expect(progress!.score).toBe(25);
            const operationId = sfs.string(randomUUID());
            const responses = await Promise.all(
                Array.from({ length: 4 }, () =>
                    h.command("newexpidition.takepersonreward", {
                        id: sfs.string("1"),
                        operationId,
                    })),
            );
            expect(responses.every((row) => row.body.rewardinfo!.type === 17)).toBe(true);
            expect((await h.db.db.select().from(expedition_progress))[0]!.takeReward).toBe("1");
            await expect(
                h.command("newexpidition.takepersonreward", { id: sfs.string("1") }),
            ).rejects.toThrow();
            expect(
                (
                    await h.db.db
                        .select()
                        .from(command_receipt)
                        .where(eq(command_receipt.command, "newexpidition.takepersonreward"))
                ).length,
            ).toBe(1);
            await expect(
                h.command("newexpidition.takealliancereward", { id: sfs.string("2") }),
            ).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "alliance rewards use only current realm, period and stage with the personal participation minimum",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.items.get("17_wk")!.k1 = "10";
            await h.db.db.update(userprofile).set({ allianceId: "alliance" });
            await h.command("trusted.test.score", { count: sfs.int(2) });
            await h.db.db
                .insert(expedition_progress)
                .values({ uid: "other", periodId: h.manifest.periodId, stage: 7, score: 100 });
            await expect(
                h.command("newexpidition.takealliancereward", { id: sfs.string("2") }),
            ).rejects.toThrow();
            await h.command("trusted.test.score", { count: sfs.int(1) });
            const info = await h.command("newexpidition.activityinfo", {});
            expect(info.body.alliancescore).toEqual(sfs.double(115));
            expect(info.body.rank).toEqual(sfs.int(2));
            await h.command("newexpidition.takealliancereward", { id: sfs.string("2") });
            expect(
                (
                    await h.db.db.select().from(expedition_progress).where(
                        eq(expedition_progress.uid, "owner"),
                    )
                )[0]!.takeReward,
            ).toBe("2");
            h.clock.now += 10000000;
            const second = {
                ...h.manifest,
                periodId: "synthetic-period-2",
                startTime: BigInt(h.clock.now),
            };
            await h.db.db.transaction((tx) =>
                installExpeditionPeriod(tx, h.authority, second, async () => true)
            );
            const reset = await h.command("newexpidition.activityinfo", {});
            expect(reset.body.score).toEqual(sfs.string("0"));
            expect(reset.body.alliancescore).toEqual(sfs.double(0));
            expect(reset.body.rewardlist).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
