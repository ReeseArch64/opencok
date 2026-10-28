import { expedition_manifest } from "@opencok/drizzle/schema/opencok_kingdom/expedition_manifest";
import { ExpeditionStageFinalityService } from "@opencok/services/expedition-stage-finality";
import {
    createExpeditionStageRealm,
    createExpeditionStageRegistry,
} from "@opencok/repositories/expedition-stage-finality";
import { expedition_stage_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_closure";
import { expedition_stage_member as members } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_member";
import { expedition_stage_period as finals } from "@opencok/drizzle/schema/opencok_global/expedition_stage_period";
import { expedition_stage_watermark as marks } from "@opencok/drizzle/schema/opencok_global/expedition_stage_watermark";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { readExpedition } from "@opencok/repositories/new-expedition";
import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { ExpeditionMatchingService } from "@opencok/services/expedition-matching";
import { ExpeditionPhaseService } from "@opencok/services/expedition-phase";
import {
    ExpeditionScorePublicationService,
    ExpeditionLiveViewService,
} from "@opencok/services/expedition-score-publication";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import {
    createExpeditionMatchingRegistry,
    createExpeditionMatchingRealmStore,
} from "@opencok/repositories/expedition-matching";
import { createExpeditionPhaseStore } from "@opencok/repositories/expedition-phase";
import {
    createExpeditionScoreSource,
    createExpeditionScoreProjection,
    createExpeditionLiveSource,
} from "@opencok/repositories/expedition-score-publication";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { expeditionDiscovery } from "@opencok/rules/expedition-score-publication";
import { expeditionDomain } from "@opencok/services/new-expedition";
import { trainingDomain } from "@opencok/services/training";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { expedition_score } from "@opencok/drizzle/schema/opencok_global/expedition_score";
import { Cache } from "@opencok/storage/session";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";
async function fixture()
{
    const h = await cityHarness([expeditionDomain, trainingDomain]),
        redis = new DisposableRedis(),
        closers = [h.close, () => redis.stop()];
    try
    {
        h.clock.now = Date.UTC(2040, 0, 1);
        const redisUrl = await redis.start(),
            cache = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 1 }),
            cache2 = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 2 });
        await h.db.pool.query("CREATE DATABASE \"expedition_score_global\"");
        await h.db.pool.query("CREATE DATABASE \"expedition_score_second\"");
        const global = createDatabase("global", {
                ...h.connection,
                database: "expedition_score_global",
            }),
            second = createDatabase("kingdom", {
                ...h.connection,
                database: "expedition_score_second",
            });
        closers.push(global.close, second.close);
        await migrate(global.db, {
            migrationsFolder:
                new URL("../../../packages/drizzle/migrations/global", import.meta.url)
                    .pathname,
        });
        await migrate(second.db, {
            migrationsFolder:
                new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                    .pathname,
        });
        const rules2 = await loadRules(undefined, 2),
            authority2 = await acquireRealmAuthority(second.db, 2, () => true),
            now = () => h.clock.now,
            calendar = new ExpeditionCalendarService(
                createExpeditionCalendarStore(global.db),
                h.rules,
                [1, 2],
                now,
            ),
            period = (await calendar.refresh())!,
            schedule = expeditionCalendarPhases(period),
            registry = createExpeditionMatchingRegistry(global.db),
            matching = new ExpeditionMatchingService(
                calendar,
                createExpeditionMatchingRealmStore(h.db.db, h.authority, now),
                registry,
                h.rules,
                now,
            ),
            matching2 = new ExpeditionMatchingService(
                new ExpeditionCalendarService(
                    createExpeditionCalendarStore(global.db),
                    rules2,
                    [1, 2],
                    now,
                ),
                createExpeditionMatchingRealmStore(second.db, authority2, now),
                registry,
                rules2,
                now,
            );
        h.clock.now = Number(schedule[1]!.startTime);
        await matching.refresh();
        await matching2.refresh();
        h.clock.now = Number(schedule[1]!.endTime);
        await matching.refresh();
        await matching2.refresh();
        h.clock.now = Number(schedule.find((row) => row.stage === 7)!.startTime);
        await new ExpeditionPhaseService(
            calendar,
            createExpeditionPhaseStore(h.db.db, h.authority, now),
        ).refresh();
        await new ExpeditionPhaseService(
            calendar,
            createExpeditionPhaseStore(second.db, authority2, now),
        ).refresh();
        await h.db.db.update(userprofile).set({ allianceId: "guild" });
        await second.db.insert(userprofile).values({
            uid: "remote",
            name: "Synthetic Remote",
            country: "BR",
            serverId: 2,
            level: 1,
            exp: 0,
            allianceId: "guild",
        });
        await h.command("army.add", {
            id: sfs.string("107000"),
            num: sfs.int(5),
            gold: sfs.bool(false),
        });
        await h.finish(1);
        await h.db.db
            .insert(expedition_progress)
            .values({
                uid: "other",
                periodId: String(period.id),
                stage: 7,
                score: 25,
                takeReward: "",
            });
        await second.db
            .insert(expedition_progress)
            .values({
                uid: "remote",
                periodId: String(period.id),
                stage: 7,
                score: 40,
                takeReward: "",
            });
        const source = createExpeditionScoreSource(h.db.db, h.authority),
            source2 = createExpeditionScoreSource(second.db, authority2),
            projection = createExpeditionScoreProjection(global.db, h.authority),
            projection2 = createExpeditionScoreProjection(global.db, authority2),
            publish = new ExpeditionScorePublicationService(
                source,
                projection,
                (clock, version, at) =>
                    cache.publishExpeditionDiscovery(expeditionDiscovery(clock, version, at)),
                now,
            ),
            publish2 = new ExpeditionScorePublicationService(
                source2,
                projection2,
                (clock, version, at) =>
                    cache2.publishExpeditionDiscovery(expeditionDiscovery(clock, version, at)),
                now,
            ),
            live = new ExpeditionLiveViewService(
                createExpeditionLiveSource(h.db.db, global.db, h.authority),
                now,
            );
        const realm = createExpeditionStageRealm(h.db.db, h.authority),
            realm2 = createExpeditionStageRealm(second.db, authority2),
            finalityRegistry = createExpeditionStageRegistry(global.db, h.authority),
            finalityRegistry2 = createExpeditionStageRegistry(global.db, authority2),
            finality = new ExpeditionStageFinalityService(realm, finalityRegistry, now),
            finality2 = new ExpeditionStageFinalityService(realm2, finalityRegistry2, now);
        return {
            ...h,
            realm,
            realm2,
            finalityRegistry,
            finalityRegistry2,
            finality,
            finality2,
            global,
            second,
            authority2,
            period,
            schedule,
            source,
            source2,
            projection,
            projection2,
            publish,
            publish2,
            cache,
            cache2,
            live,
            close: async () => {
                for (const close of closers.toReversed())
                {
                    await close();
                }
            },
        };
    }
    catch (error)
    {
        for (const close of closers.toReversed())
        {
            await close();
        }
        throw error;
    }
}
async function stage7(h: Awaited<ReturnType<typeof fixture>>)
{
    return (await h.realm.candidates(BigInt(h.clock.now))).find((row) => row.stage === 7)!;
}
async function due(h: Awaited<ReturnType<typeof fixture>>)
{
    h.clock.now = Number(h.schedule.find((row) => row.stage === 7)!.endTime) + 300000;
}
test(
    "expedition stages wait for grace and both owned proofs, freeze native totals and leave unvalidated combat stages open",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(expedition_manifest).values({
                periodId: "legacy-local-only",
                serverId: 1,
                matchServerId: 2,
                startTime: 1000n,
                endTime: 2000n,
                schedule: JSON.stringify([{ stage: 3, startTime: "1000", endTime: "2000" }]),
                recordedAt: 0n,
            });
            h.clock.now = Number(h.schedule.find((row) => row.stage === 7)!.endTime) + 299999;
            await h.finality.refresh();
            expect((await h.db.db.select().from(closures)).some((row) => row.stage === 7)).toBe(
                false,
            );
            h.clock.now++;
            await h.finality.refresh();
            const pending = (await h.global.db.select().from(finals)).find((row) =>
                row.stage === 7
            )!;
            expect(pending.state).toBe(0);
            expect(pending.winner).toBe(0);
            await h.finality2.refresh();
            await h.finality.refresh();
            const result = (await h.global.db.select().from(finals)).find((row) =>
                row.stage === 7
            )!;
            expect(result.state).toBe(1);
            expect(result.winner).toBe(1);
            expect(JSON.parse(result.ranking!).totals).toEqual([
                { serverId: 1, score: 50 },
                { serverId: 2, score: 40 },
            ]);
            expect((await h.db.db.select().from(closures)).find((row) => row.stage === 7)?.phase)
                .toBe(2);
            expect((await h.db.db.select().from(closures)).map((row) => row.stage).toSorted())
                .toEqual([
                    3,
                    5,
                    6,
                    7,
                ]);
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 3)?.winner)
                .toBe(
                    2,
                );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "an overdue training scores its saved expedition phase even after production checkpoints advance past its end",
    async () => {
        const h = await fixture();
        try
        {
            const end = h.schedule.find((row) => row.stage === 7)!.endTime;
            h.clock.now = Number(end - 600000n);
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(5),
                gold: sfs.bool(false),
            });
            const [activity] = await h.db.db
                .select()
                .from(timed_activity)
                .where(eq(timed_activity.status, 0));
            expect(activity!.dueAt < end).toBe(true);
            await due(h);
            await h.db.db.update(user_resource).set({ lastUpdateTime: BigInt(h.clock.now) });
            await h.finality.refresh();
            expect((await h.db.db.select().from(closures)).some((row) => row.stage === 7)).toBe(
                false,
            );
            await h.finish(1);
            const score = (await h.db.db.select().from(expedition_progress)).find(
                (row) => row.uid === "owner" && row.stage === 7,
            )!;
            expect(score.score).toBe(50);
            await due(h);
            await h.finality.refresh();
            expect(
                (await h.db.db.select().from(members)).find((row) =>
                    row.uid === "owner" && row.stage === 7
                )
                    ?.score,
            ).toBe(50);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "sealed expedition facts preserve floating point scores and guild membership across delayed live publications and replacement owners",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db
                .update(expedition_progress)
                .set({ score: 25.125 })
                .where(eq(expedition_progress.uid, "owner"));
            await due(h);
            await h.finality.refresh();
            await h.db.db
                .update(expedition_progress)
                .set({ score: 99999 })
                .where(eq(expedition_progress.uid, "owner"));
            await h.db.db.update(userprofile).set({ allianceId: "changed" });
            await h.db.db
                .insert(expedition_progress)
                .values({
                    uid: "late",
                    periodId: String(h.period.id),
                    stage: 7,
                    score: 999,
                    takeReward: "",
                });
            await h.publish.refresh();
            let rows = await h.global.db
                .select()
                .from(expedition_score)
                .where(eq(expedition_score.stage, 7));
            expect(rows.find((row) => row.member === "owner")?.score).toBe(25.125);
            expect(rows.find((row) => row.member === "owner")?.allianceId).toBe("guild");
            expect(rows.some((row) => row.member === "late")).toBe(false);
            const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
            await createExpeditionScoreProjection(h.global.db, replacement).write(
                await createExpeditionScoreSource(h.db.db, replacement).page(
                    undefined,
                    BigInt(h.clock.now),
                ),
                BigInt(h.clock.now),
            );
            rows = await h.global.db.select().from(expedition_score).where(
                eq(expedition_score.stage, 7),
            );
            expect(rows.find((row) => row.member === "owner")?.score).toBe(25.125);
            const profile = (
                await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
            )[0]!;
            const archived = await h.db.db.transaction((tx) =>
                readExpedition(tx, profile, h.schedule.find((row) => row.stage === 7)!.startTime)
            );
            expect(archived.closed).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "an expedition proof mismatch restarts only its owned upload and resumes after the persisted cursor",
    async () => {
        const h = await fixture();
        try
        {
            await due(h);
            const period = await stage7(h),
                closure = (await h.realm.seal(period, BigInt(h.clock.now)))!;
            await h.finalityRegistry.begin(period, closure, BigInt(h.clock.now));
            const page = await h.realm.page(closure);
            await h.finalityRegistry.append(period, closure, page, BigInt(h.clock.now));
            await h.global.db
                .update(expedition_score)
                .set({ score: 888 })
                .where(eq(expedition_score.member, "owner"));
            expect(await h.finalityRegistry.complete(period, closure, BigInt(h.clock.now))).toBe(
                false,
            );
            expect(await h.global.db.select().from(expedition_score)).toHaveLength(0);
            await h.realm.reset(closure);
            await h.finality.refresh();
            await h.finality2.refresh();
            await h.finality.refresh();
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 7)?.winner)
                .toBe(
                    1,
                );
            expect(
                (await h.global.db.select().from(marks)).find((row) =>
                    row.stage === 7 && row.kingdomId === 1
                )
                    ?.state,
            ).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "sealed expedition upload keeps a bounded durable cursor and resumes the tail after authority replacement",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(expedition_progress).values(
                Array.from({ length: 70 }, (_, i) => ({
                    uid: `z-${String(i).padStart(3, "0")}`,
                    periodId: String(h.period.id),
                    stage: 7,
                    score: 0.25,
                    takeReward: "",
                })),
            );
            await due(h);
            await h.finality.refresh();
            const first = (await h.db.db.select().from(closures)).find((row) => row.stage === 7)!;
            expect(first.processed).toBe(64n);
            expect(first.scoreCount).toBe(72n);
            expect(first.phase).toBe(0);
            const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(h.finality.refresh()).rejects.toThrow();
            const service = new ExpeditionStageFinalityService(
                createExpeditionStageRealm(h.db.db, replacement),
                createExpeditionStageRegistry(h.global.db, replacement),
                () => h.clock.now,
            );
            await service.refresh();
            await h.finality2.refresh();
            await service.refresh();
            const result = (await h.db.db.select().from(closures)).find((row) => row.stage === 7)!;
            expect(result.processed).toBe(72n);
            expect(result.phase).toBe(2);
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 7)?.winner)
                .toBe(
                    1,
                );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "failed expedition seals and finalization roll back their markers and resume without losing frozen members",
    async () => {
        const h = await fixture();
        try
        {
            await due(h);
            await h.db.pool.query(
                `create function reject_expedition_seal() returns trigger language plpgsql as $$ begin if new.stage=7 then raise exception 'synthetic seal failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_expedition_seal before insert on opencok_kingdom.expedition_stage_closure for each row execute function reject_expedition_seal()`,
            );
            await expect(h.finality.refresh()).rejects.toThrow();
            expect((await h.db.db.select().from(members)).some((row) => row.stage === 7)).toBe(
                false,
            );
            await h.db.pool.query(
                `drop trigger reject_expedition_seal on opencok_kingdom.expedition_stage_closure`,
            );
            await h.finality.refresh();
            await h.global.pool.query(
                `create function reject_expedition_final() returns trigger language plpgsql as $$ begin if new.stage=7 and new.state=1 then raise exception 'synthetic final failure'; end if; return new; end $$`,
            );
            await h.global.pool.query(
                `create trigger reject_expedition_final before update on opencok_global.expedition_stage_period for each row execute function reject_expedition_final()`,
            );
            await expect(h.finality2.refresh()).rejects.toThrow();
            expect(
                (await h.global.db.select().from(marks)).filter((row) =>
                    row.stage === 7 && row.state === 1
                ),
            ).toHaveLength(2);
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 7)?.state)
                .toBe(0);
            await h.global.pool.query(
                `drop trigger reject_expedition_final on opencok_global.expedition_stage_period`,
            );
            await h.finality.refresh();
            await h.finality2.refresh();
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 7)?.winner)
                .toBe(
                    1,
                );
            expect((await h.db.db.select().from(members)).filter((row) => row.stage === 7))
                .toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a banned actor cannot hold a phase open and unbanning preserves its units without adding points to the sealed result",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(5),
                gold: sfs.bool(false),
            });
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await due(h);
            await h.finality.refresh();
            expect(
                (await h.db.db.select().from(closures)).find((row) => row.stage === 7)?.scoreCount,
            ).toBe(
                2n,
            );
            await h.db.db.update(userprofile).set({ banFlag: 0 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.finish(1);
            expect(
                (await h.db.db.select().from(expedition_progress)).find(
                    (row) => row.stage === 7 && row.uid === "owner",
                )?.score,
            ).toBe(25);
            await h.finality2.refresh();
            await h.finality.refresh();
            expect((await h.global.db.select().from(finals)).find((row) => row.stage === 7)?.winner)
                .toBe(
                    1,
                );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
