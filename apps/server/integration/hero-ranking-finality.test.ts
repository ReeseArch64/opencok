import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { HeroRankingFinalityService } from "@opencok/hero/services/hero-ranking-finality";
import {
    createHeroRankFinalityRealm,
    createHeroRankFinalityRegistry,
} from "@opencok/hero/repositories/hero-ranking-finality";
import { createHeroRankProjection } from "@opencok/hero/repositories/hero-rank-publication";
import {
    fenceRealmDatabase,
    fenceRealmTransaction,
    acquireRealmAuthority,
} from "@opencok/repositories/realm-authority";
import { heroFinalityPeriod } from "@opencok/hero/rules/hero-ranking-finality";
import { createRealmTrainingDomain } from "../src/composition/troops";
import { sfs } from "@opencok/messages/sfs";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_rank_closure } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_closure";
import { hero_rank_period } from "@opencok/drizzle/schema/opencok_global/hero_rank_period";
import { hero_rank_watermark } from "@opencok/drizzle/schema/opencok_global/hero_rank_watermark";
import { hero_rank_score } from "@opencok/drizzle/schema/opencok_global/hero_rank_score";
import { cityHarness } from "./support/city";

const trainingDomain = createRealmTrainingDomain();

async function fixture(types = [1])
{
    const h = await cityHarness([trainingDomain]),
        closers = [h.close];
    try
    {
        h.clock.now = Date.now();
        await h.db.pool.query("CREATE DATABASE \"hero_final_global\"");
        await h.db.pool.query("CREATE DATABASE \"hero_final_second\"");
        const global = createDatabase("global", { ...h.connection, database: "hero_final_global" }),
            second = createDatabase("kingdom", { ...h.connection, database: "hero_final_second" });
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
            end = BigInt(h.clock.now + 3600000),
            now = () => h.clock.now;
        for (
            const [db, realmId] of [
                [h.db, 1],
                [second, 2],
            ] as const
        )
        {
            await db.db.insert(hero_activity).values({
                uuid: "main",
                activityId: types[0]! >= 3 ? "9000002" : "9000000",
                activityType: types[0]! >= 3 ? 3 : 1,
                startTime: BigInt(h.clock.now - 1000),
                endTime: end,
                roundTime: 3600000n,
                finish: 0,
                alreadyEvent: "",
                serverGroup: types[0]! >= 3 ? "2|1" : null,
            });
            for (const type of types)
            {
                const id = `event-${type}`,
                    eventId = type === 3 ? "9001024" : type === 4 ? "9001025" : "9001000";
                await db.db.insert(hero_event).values({
                    uuid: id,
                    eventId,
                    activityId: "main",
                    type,
                    rewardType: type,
                    startTime: BigInt(h.clock.now - 1000),
                    endTime: end,
                    rewardStatus: 0,
                    serverGroup: type >= 3 ? "2|1" : null,
                });
                await db.db.insert(score_act).values({
                    uid: type === 4 ? `guild-${realmId}` : realmId === 1 ? "owner" : "remote",
                    actId: id,
                    level: 0,
                    score: type === 4 ? realmId * 999 : realmId * 100,
                    finishFlag: 0,
                    rewardFlag: "",
                });
            }
        }
        const realm = createHeroRankFinalityRealm(h.db.db, h.authority),
            realm2 = createHeroRankFinalityRealm(second.db, authority2),
            registry = createHeroRankFinalityRegistry(global.db, h.authority),
            registry2 = createHeroRankFinalityRegistry(global.db, authority2),
            projection = createHeroRankProjection(global.db, h.authority),
            projection2 = createHeroRankProjection(global.db, authority2),
            service = new HeroRankingFinalityService(
                realm,
                registry,
                projection,
                h.rules,
                [1, 2],
                now,
            ),
            service2 = new HeroRankingFinalityService(
                realm2,
                registry2,
                projection2,
                rules2,
                [1, 2],
                now,
            );
        return {
            ...h,
            global,
            second,
            realm,
            realm2,
            registry,
            registry2,
            projection,
            projection2,
            service,
            service2,
            end,
            period: async (type = 1) =>
                heroFinalityPeriod(
                    (await h.db.db.select().from(hero_event)).find((row) => row.type === type)!,
                    h.rules,
                    [1, 2],
                )!,
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
test(
    "hero rank finality waits for its grace and both owned score proofs before freezing a shared stage",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Number(h.end) + 299999;
            await h.service.refresh();
            expect(await h.global.db.select().from(hero_rank_period)).toHaveLength(0);
            h.clock.now++;
            await h.service.refresh();
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(0);
            expect(await h.global.db.select().from(hero_rank_watermark)).toHaveLength(1);
            const admitted = await h.period();
            await expect(
                h.registry.finalize({ ...admitted, expectedRealms: [1] }, BigInt(h.clock.now)),
            ).rejects.toThrow("Conflicting hero ranking finality cohort");
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(0);
            expect((await h.db.db.select().from(hero_event))[0]!.rewardStatus).toBe(1);
            expect((await h.db.db.select().from(hero_rank_closure))[0]!.phase).toBe(1);
            await h.service2.refresh();
            await h.service.refresh();
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(1);
            expect(
                (await h.global.db.select().from(hero_rank_watermark)).map((row) => row.total)
                    .sort(),
            ).toEqual([100n, 200n]);
            expect((await h.db.db.select().from(hero_rank_closure))[0]).toMatchObject({
                phase: 2,
                processed: 1n,
                scoreCount: 1n,
                eligible: 1,
            });
            const before = await h.global.db.select().from(hero_rank_period);
            await h.service.refresh();
            await h.service2.refresh();
            expect(await h.global.db.select().from(hero_rank_period)).toEqual(before);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "an overdue authorized training transition blocks hero closure until its actual saved completion has scored",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.ranking.heroEvents!.get("9001000")!.score = "47009";
            await h.db.db.delete(score_act);
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(3),
                gold: sfs.bool(false),
            });
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            expect(await h.db.db.select().from(hero_rank_closure)).toHaveLength(0);
            expect((await h.db.db.select().from(hero_event))[0]!.rewardStatus).toBe(0);
            await h.finish(1);
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(30);
            await h.service.refresh();
            expect((await h.global.db.select().from(hero_rank_watermark))[0]!.total).toBe(30n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero proof mismatch restarts upload and completed proofs freeze scores against delayed publications and new owners",
    async () => {
        const h = await fixture();
        try
        {
            let stale = true;
            const projection = {
                write: async (...args: Parameters<typeof h.projection.write>) => {
                    const rows = await h.projection.write(...args);
                    if (stale)
                    {
                        stale = false;
                        await h.projection.write(
                            args[0].map((row) => ({ ...row, score: 999 })),
                            args[1],
                        );
                    }
                    return rows;
                },
            };
            const service = new HeroRankingFinalityService(
                h.realm,
                h.registry,
                projection,
                h.rules,
                [1, 2],
                () => h.clock.now,
            );
            h.clock.now = Number(h.end) + 300000;
            await service.refresh();
            expect(await h.global.db.select().from(hero_rank_watermark)).toHaveLength(0);
            expect((await h.db.db.select().from(hero_rank_closure))[0]).toMatchObject({
                phase: 0,
                cursor: "",
                processed: 0n,
            });
            await service.refresh();
            expect(await h.global.db.select().from(hero_rank_watermark)).toHaveLength(1);
            const frozen = (await h.global.db.select().from(hero_rank_score))[0]!;
            const result = await h.projection.write(
                [{ ...frozen, score: 5000 }],
                BigInt(h.clock.now),
            );
            expect(result[0]!.score).toBe(100);
            const authority = await acquireRealmAuthority(h.db.db, 1, () => true),
                current = createHeroRankProjection(h.global.db, authority);
            const replacement = await current.write(
                [{ ...frozen, score: 9000 }],
                BigInt(h.clock.now),
            );
            expect(replacement[0]).toMatchObject({ score: 100, ownerEpoch: authority.epoch });
            expect((await h.global.db.select().from(hero_rank_score))[0]!.score).toBe(100);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "an absent realm contributes a verified empty closure and a banned actor cannot hold the shared stage open",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.ranking.heroEvents!.get("9001000")!.score = "47009";
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(3),
                gold: sfs.bool(false),
            });
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.second.db.delete(hero_event);
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            await h.service2.refresh();
            await h.service.refresh();
            const proofs = await h.global.db.select().from(hero_rank_watermark);
            expect(proofs.find((row) => row.kingdomId === 2)).toMatchObject({
                actId: null,
                eligible: 0,
                scoreCount: 0n,
                total: 0n,
                state: 1,
            });
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(1);
            await h.db.db.update(userprofile).set({ banFlag: 0 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.finish(1);
            expect((await h.db.db.select().from(score_act))[0]!.score).toBe(100);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero closure failure rolls back the event marker and a replaced authority cannot seal or advance progress",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Number(h.end) + 300000;
            await h.db.db.execute(
                sql`create function opencok_kingdom.reject_hero_closure() returns trigger language plpgsql as $$ begin raise exception 'synthetic hero closure rejection'; end $$`,
            );
            await h.db.db.execute(
                sql`create trigger reject_hero_closure before insert on opencok_kingdom.hero_rank_closure for each row execute function opencok_kingdom.reject_hero_closure()`,
            );
            await expect(h.service.refresh()).rejects.toThrow();
            expect((await h.db.db.select().from(hero_event))[0]!.rewardStatus).toBe(0);
            expect(await h.db.db.select().from(hero_rank_closure)).toHaveLength(0);
            await h.db.db.execute(
                sql`drop trigger reject_hero_closure on opencok_kingdom.hero_rank_closure`,
            );
            await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(h.realm.seal(await h.period(), BigInt(h.clock.now))).rejects.toThrow();
            expect((await h.db.db.select().from(hero_event))[0]!.rewardStatus).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "coupled kingdom hero results use only personal kingdom totals and preserve the saved opponent order on ties",
    async () => {
        const h = await fixture([3, 4]);
        try
        {
            await h.second.db.update(score_act).set({ score: 100 }).where(
                eq(score_act.actId, "event-3"),
            );
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            await h.service2.refresh();
            await h.service.refresh();
            expect((await h.global.db.select().from(hero_rank_period)).map((row) => row.state))
                .toEqual([
                    1,
                    1,
                ]);
            for (const db of [h.db, h.second])
            {
                expect((await db.db.select().from(hero_event)).map((row) => row.kingdomRank))
                    .toEqual([
                        "2|1|",
                        "2|1|",
                    ]);
                expect((await db.db.select().from(hero_activity))[0]!.kingdomRank).toBe("2|1|");
            }
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero sealed score upload persists a bounded cursor and completes the tail before admitting global finality",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(score_act).values(
                Array.from({ length: 129 }, (_, index) => ({
                    uid: `synthetic-${String(index).padStart(3, "0")}`,
                    actId: "event-1",
                    level: 0,
                    score: index,
                    finishFlag: 0,
                    rewardFlag: "",
                })),
            );
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            expect((await h.db.db.select().from(hero_rank_closure))[0]).toMatchObject({
                processed: 64n,
                scoreCount: 130n,
                phase: 0,
            });
            await h.service2.refresh();
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(0);
            await h.service.refresh();
            expect((await h.db.db.select().from(hero_rank_closure))[0]!.processed).toBe(128n);
            await h.service.refresh();
            expect((await h.db.db.select().from(hero_rank_closure))[0]).toMatchObject({
                processed: 130n,
                phase: 2,
            });
            expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(131);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero closure waits for an in-flight owned mutation before hashing its committed score",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Number(h.end) + 300000;
            const period = await h.period();
            await h.registry.register(period, BigInt(h.clock.now));
            let entered: () => void = () => {},
                release: () => void = () => {};
            const ready = new Promise<void>((resolve) => {
                    entered = resolve;
                }),
                gate = new Promise<void>((resolve) => {
                    release = resolve;
                });
            fenceRealmDatabase(h.db.db, h.authority);
            const mutation = h.db.db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, h.authority);
                await tx.update(score_act).set({ score: 555 }).where(eq(score_act.uid, "owner"));
                entered();
                await gate;
            });
            await ready;
            let settled = false;
            const seal = h.realm.seal(period, BigInt(h.clock.now)).finally(() => {
                settled = true;
            });
            try
            {
                await Bun.sleep(100);
                expect(settled).toBe(false);
            }
            finally
            {
                release();
            }
            await mutation;
            await seal;
            await h.service.refresh();
            expect((await h.global.db.select().from(hero_rank_watermark))[0]!.total).toBe(555n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "unmatched kingdom hero stages close without creating an opponent or discarding imported scores",
    async () => {
        const h = await fixture([3, 4]);
        try
        {
            await h.db.db.update(hero_event).set({ serverGroup: null });
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            expect((await h.db.db.select().from(hero_event)).map((row) => row.rewardStatus))
                .toEqual([
                    1,
                    1,
                ]);
            expect(await h.global.db.select().from(hero_rank_period)).toHaveLength(0);
            expect(
                (await h.db.db.select().from(score_act)).map((row) => row.score).sort((a, b) =>
                    a - b
                ),
            ).toEqual([100, 999]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a failed shared finalization keeps both verified proofs and retries the final marker atomically",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Number(h.end) + 300000;
            await h.service.refresh();
            await h.global.db.execute(
                sql`create function opencok_global.reject_hero_finality() returns trigger language plpgsql as $$ begin raise exception 'synthetic hero finality rejection'; end $$`,
            );
            await h.global.db.execute(
                sql`create trigger reject_hero_finality before update on opencok_global.hero_rank_period for each row execute function opencok_global.reject_hero_finality()`,
            );
            await expect(h.service2.refresh()).rejects.toThrow();
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(0);
            expect(await h.global.db.select().from(hero_rank_watermark)).toHaveLength(2);
            await h.global.db.execute(
                sql`drop trigger reject_hero_finality on opencok_global.hero_rank_period`,
            );
            await h.service.refresh();
            await h.service2.refresh();
            expect((await h.global.db.select().from(hero_rank_period))[0]!.state).toBe(1);
            expect((await h.second.db.select().from(hero_rank_closure))[0]!.phase).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
