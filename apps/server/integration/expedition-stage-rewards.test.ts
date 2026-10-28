import { randomUUID } from "node:crypto";
import { ExpeditionStageFinalityService } from "@opencok/services/expedition-stage-finality";
import {
    createExpeditionStageRealm,
    createExpeditionStageRegistry,
} from "@opencok/repositories/expedition-stage-finality";
import {
    ExpeditionStageRewardService,
    expeditionStageRewardDomain,
    ExpeditionHistoryService,
} from "@opencok/services/expedition-stage-rewards";
import {
    createExpeditionAwardStore,
    createExpeditionAwardStandings,
    createExpeditionHistorySource,
} from "@opencok/repositories/expedition-stage-rewards";
import { expeditionAwardOperation } from "@opencok/rules/expedition-stage-rewards";
import { expedition_stage_award as awards } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_award";
import { expedition_stage_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_closure";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { new_exped_history } from "@opencok/drizzle/schema/opencok_kingdom/new_exped_history";
import { server_king_info } from "@opencok/drizzle/schema/opencok_global/server_king_info";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
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
import { createRealmTrainingDomain } from "../src/composition/troops";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { Cache } from "@opencok/storage/session";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";

const trainingDomain = createRealmTrainingDomain();

async function fixture()
{
    const h = await cityHarness([expeditionDomain, trainingDomain, expeditionStageRewardDomain]),
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
            finality = new ExpeditionStageFinalityService(
                realm,
                createExpeditionStageRegistry(global.db, h.authority),
                now,
            ),
            finality2 = new ExpeditionStageFinalityService(
                realm2,
                createExpeditionStageRegistry(global.db, authority2),
                now,
            ),
            store = createExpeditionAwardStore(h.db.db, h.authority),
            standings = createExpeditionAwardStandings(global.db, 1),
            deliver = (owner: string, id: string) =>
                h.command(
                    "expedition.award.deliver",
                    {
                        awardId: sfs.string(id),
                        operationId: sfs.string(expeditionAwardOperation(id)),
                    },
                    owner,
                ),
            rewards = (send = deliver) =>
                new ExpeditionStageRewardService(store, standings, h.rules, send, now),
            history = new ExpeditionHistoryService(
                createExpeditionHistorySource(h.db.db, global.db, h.authority),
                h.rules,
                now,
            );
        const item = h.rules.items.get("17_wk")!;
        h.rules.items.set("17_wk", { ...item, k1: "10", k2: "20", k12: "828000" });
        h.rules.advanced.expeditionRewards!.clear();
        h.rules.advanced.expeditionRewards!.set("1", {
            id: "1",
            stage: "7",
            type: "1",
            castle_min: "1",
            castle_max: "40",
            target: "5",
            reward: "249200",
        });
        h.rules.advanced.expeditionRewards!.set("2", {
            id: "2",
            stage: "7",
            type: "2",
            castle_min: "1",
            castle_max: "40",
            target: "30",
            reward: "249201",
        });
        h.rules.advanced.expeditionRewards!.set("3", {
            id: "3",
            stage: "7",
            type: "1",
            castle_min: "1",
            castle_max: "40",
            target: "5",
            reward: "249202",
            science_quest: "828000",
        });
        await h.db.db.insert(user_science).values({ uid: "owner", itemId: "828000", level: 1 });
        const seal = async () => {
            h.clock.now = Number(schedule.find((row) => row.stage === 7)!.endTime) + 300000;
            await finality.refresh();
            await finality2.refresh();
            await finality.refresh();
        };
        return {
            ...h,
            store,
            standings,
            deliver,
            rewards,
            history,
            seal,
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
function bundle(row: { payload: string; })
{
    return JSON.parse(
        row.payload,
    ) as import("@opencok/contracts/expedition-stage-rewards").ExpeditionAwardPayload;
}
async function stageAwards(h: Awaited<ReturnType<typeof fixture>>)
{
    return (await h.db.db.select().from(awards)).filter((row) => row.stage === 7);
}
test(
    "closed expedition stages fund personal, guild, science double, ranking and winning kingdom prizes once with native mail",
    async () => {
        const h = await fixture();
        try
        {
            await h.seal();
            await h.rewards().refresh();
            await h.rewards().refresh();
            const entitlements = await stageAwards(h),
                owner = entitlements.find((row) => row.ownerUid === "owner")!,
                other = entitlements.find((row) => row.ownerUid === "other")!;
            expect(entitlements).toHaveLength(2);
            expect(bundle(owner).mails).toHaveLength(8);
            expect(bundle(other).mails).toHaveLength(5);
            expect(bundle(owner).claims).toEqual([1, 2, 3]);
            expect(bundle(other).claims).toEqual([1, 2]);
            const messages = await h.db.db.select().from(mail),
                ids = new Set(bundle(owner).mails.map((draft) => draft.id + "00")),
                owned = messages.filter((row) => ids.has(row.uid));
            expect(owned).toHaveLength(8);
            expect(owned.filter((row) => row.rewardStatus === 0)).toHaveLength(7);
            await h.deliver("owner", owner.id);
            expect(await h.db.db.select().from(mail)).toEqual(messages);
            expect(
                (await h.db.db.select().from(expedition_progress)).find(
                    (row) => row.stage === 7 && row.uid === "owner",
                )?.takeReward,
            ).toBe("1|2|3");
            expect((await h.db.db.select().from(closures)).every((row) => row.phase === 3)).toBe(
                true,
            );
            const events = (await h.db.db.select().from(mutation_outbox)).filter(
                (row) => row.eventType === "expedition.award.mail",
            );
            expect(events).toHaveLength(messages.length);
            const target = owned.find((row) => row.rewardStatus === 0)!,
                claims = new MailRewardService(
                    createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
                    h.rules,
                );
            await claims.command("owner", "mail.reward", {
                uid: sfs.string(target.uid),
                operationId: sfs.string(randomUUID()),
            });
            const items = await h.db.db.select().from(user_item);
            expect(items.length).toBeGreaterThan(0);
            await claims.command("owner", "mail.reward", {
                uid: sfs.string(target.uid),
                operationId: sfs.string(randomUUID()),
            });
            expect(await h.db.db.select().from(user_item)).toEqual(items);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "manual expedition claims precede the seal while frozen guild and science eligibility survive later account changes",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("newexpidition.takepersonreward", { id: sfs.string("1") });
            await h.seal();
            await h.db.db.delete(user_science);
            await h.db.db.update(userprofile).set({ allianceId: "departed" });
            await h.rewards().refresh();
            const entitlements = await stageAwards(h),
                owner = entitlements.find((row) => row.ownerUid === "owner")!,
                other = entitlements.find((row) => row.ownerUid === "other")!;
            expect(bundle(owner).claims).toEqual([2, 3]);
            expect(bundle(owner).mails).toHaveLength(6);
            expect(bundle(other).claims).toEqual([1, 2]);
            expect(bundle(other).mails).toHaveLength(5);
            expect(
                (await h.db.db.select().from(expedition_progress)).find(
                    (row) => row.uid === "owner" && row.stage === 7,
                )?.takeReward,
            ).toBe("1|2|3");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "persisted expedition mail outcomes survive reward catalog removal and shared outage without rerolling",
    async () => {
        const h = await fixture();
        try
        {
            await h.seal();
            await h
                .rewards(async () => {
                    throw new Error("synthetic offline delivery");
                })
                .refresh();
            const saved = await stageAwards(h);
            expect(saved).toHaveLength(2);
            expect(saved.every((row) => row.deliveredAt === 0n)).toBe(true);
            h.rules.advanced.expeditionRewards!.clear();
            h.rules.advanced.expeditionStages!.clear();
            h.clock.now += 60000;
            const service = new ExpeditionStageRewardService(
                h.store,
                {
                    read: async () => {
                        throw new Error("synthetic global outage");
                    },
                },
                h.rules,
                h.deliver,
                () => h.clock.now,
            );
            await expect(service.refresh()).rejects.toThrow();
            const messages = await h.db.db.select().from(mail);
            for (const award of saved)
            {
                for (const draft of bundle(award).mails)
                {
                    const message = messages.find((row) => row.uid === draft.id + "00")!;
                    expect(message.rewardId).toBe(draft.reward);
                    expect(message.contents).toEqual(Buffer.from(draft.contents, "base64"));
                }
            }
            expect((await stageAwards(h)).every((row) => row.deliveredAt > 0n)).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "expedition receipt failure restores mail, flags, acknowledgement and outbox before the same pinned delivery retries",
    async () => {
        const h = await fixture();
        try
        {
            await h.seal();
            await h
                .rewards(async () => {
                    throw new Error("synthetic offline delivery");
                })
                .refresh();
            const award = (await stageAwards(h)).find((row) => row.ownerUid === "owner")!;
            const before = await h.db.db.select().from(mutation_outbox),
                progress = await h.db.db.select().from(expedition_progress);
            await h.db.pool.query(
                `create function reject_expedition_receipt() returns trigger language plpgsql as $$ begin if new."requestId" like 'expedition-award:%' then raise exception 'synthetic receipt failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_expedition_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_expedition_receipt()`,
            );
            await expect(h.deliver("owner", award.id)).rejects.toThrow();
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(await h.db.db.select().from(expedition_progress)).toEqual(progress);
            expect(await h.db.db.select().from(mutation_outbox)).toEqual(before);
            expect((await stageAwards(h)).find((row) => row.ownerUid === "owner")?.deliveredAt)
                .toBe(0n);
            await h.db.pool.query(
                `drop trigger reject_expedition_receipt on opencok_kingdom.command_receipt`,
            );
            await h.deliver("owner", award.id);
            expect(await h.db.db.select().from(mail)).toHaveLength(8);
            await expect(h.deliver("other", award.id)).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "banned expedition recipients defer while eligible players receive their stored prizes",
    async () => {
        const h = await fixture();
        try
        {
            await h.seal();
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.rewards().refresh();
            let entitlements = await stageAwards(h);
            expect(entitlements.find((row) => row.ownerUid === "other")?.deliveredAt)
                .toBeGreaterThan(0n);
            expect(entitlements.find((row) => row.ownerUid === "owner")?.deliveredAt).toBe(0n);
            await h.db.db.update(userprofile).set({ banFlag: 0 }).where(
                eq(userprofile.uid, "owner"),
            );
            h.clock.now += 60000;
            await h.rewards().refresh();
            entitlements = await stageAwards(h);
            expect(entitlements.every((row) => row.deliveredAt > 0n)).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "native expedition history pins both kingdoms and top users, retains legacy rows and enforces owned reader authorization",
    async () => {
        const h = await fixture();
        try
        {
            await h.global.db.insert(server_king_info).values([
                { Id: 1, name: "First", banner: "A" },
                { Id: 2, name: "Second", banner: "B" },
            ]);
            await h.seal();
            await h.rewards().refresh();
            const result = await h.history.read("owner"),
                list = result.ranklist!.value as Value[];
            expect(list).toHaveLength(4);
            const stage = list.map(fields).find((row) => row.stage?.value === 7)!,
                people = stage.userlist!.value as Value[],
                kingdoms = stage.kingdomlist!.value as Value[];
            expect(people.map((row) => fields(row).uid?.value)).toEqual([
                "remote",
                "owner",
                "other",
            ]);
            expect(fields(people[0]).ranking).toEqual(sfs.int(1));
            expect(fields(people[0]).score).toBeUndefined();
            expect(fields(kingdoms[0]).serverId).toEqual(sfs.int(1));
            expect(fields(kingdoms[0]).win).toEqual(sfs.int(1));
            await h.global.db.update(server_king_info).set({ name: "Changed", banner: "Changed" });
            const refreshed = (await h.history.read("owner")).ranklist!.value as Value[];
            const refreshedStage = refreshed.map(fields).find((row) => row.stage?.value === 7)!;
            expect(refreshedStage.userlist).toEqual(stage.userlist);
            expect(fields((refreshedStage.kingdomlist!.value as Value[])[0]).name).toEqual(
                sfs.string("Changed"),
            );
            await h.db.db.insert(new_exped_history).values(
                Array.from({ length: 13 }, (_, i) => ({
                    stageId: 3,
                    winServerId: 2,
                    loseServerId: 1,
                    users: "[]",
                    createTime: BigInt(h.clock.now + i + 1),
                })),
            );
            const legacy = await h.db.db.select().from(new_exped_history);
            const recent = (await h.history.read("owner")).ranklist!.value as Value[];
            expect(recent).toHaveLength(12);
            expect(fields(recent[0]).begintime).toEqual(sfs.long(BigInt(h.clock.now + 13)));
            expect(await h.db.db.select().from(new_exped_history)).toEqual(legacy);
            await expect(h.history.read("missing")).rejects.toThrow();
            await h.db.db.update(userprofile).set({ banFlag: 1 }).where(
                eq(userprofile.uid, "owner"),
            );
            await expect(h.history.read("owner")).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "expedition award admission rolls back its cursor and resumes a bounded recipient tail after service restart",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(userprofile).values(
                Array.from({ length: 70 }, (_, i) => ({
                    uid: `z-${String(i).padStart(3, "0")}`,
                    name: "Synthetic",
                    country: "BR",
                    serverId: 1,
                    level: 1,
                    exp: 0,
                    regTime: BigInt(h.clock.now),
                })),
            );
            await h.seal();
            await h.db.pool.query(
                `update opencok_kingdom.expedition_stage_closure set phase=3 where stage<>7`,
            );
            await h.db.pool.query(
                `create function reject_expedition_award() returns trigger language plpgsql as $$ begin raise exception 'synthetic admission failure'; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_expedition_award before insert on opencok_kingdom.expedition_stage_award for each row execute function reject_expedition_award()`,
            );
            await expect(h.rewards().refresh()).rejects.toThrow();
            expect(await stageAwards(h)).toHaveLength(0);
            expect(
                (await h.db.db.select().from(closures)).find((row) => row.stage === 7)?.awardCursor,
            ).toBe("");
            await h.db.pool.query(
                `drop trigger reject_expedition_award on opencok_kingdom.expedition_stage_award`,
            );
            await h
                .rewards(async () => {
                    throw new Error("synthetic offline delivery");
                })
                .refresh();
            const first = await stageAwards(h);
            expect(first.length).toBeGreaterThan(0);
            expect(first.length).toBeLessThanOrEqual(64);
            expect(first.length).toBeLessThan(72);
            const restarted = new ExpeditionStageRewardService(
                createExpeditionAwardStore(h.db.db, h.authority),
                h.standings,
                h.rules,
                async () => {
                    throw new Error("synthetic offline delivery");
                },
                () => h.clock.now,
            );
            await restarted.refresh();
            await restarted.refresh();
            expect(await stageAwards(h)).toHaveLength(72);
            expect((await h.db.db.select().from(closures)).find((row) => row.stage === 7)?.phase)
                .toBe(3);
            await h.db.db.insert(userprofile).values({
                uid: "later-account",
                name: "Later",
                country: "BR",
                serverId: 1,
                level: 1,
                exp: 0,
                regTime: BigInt(h.clock.now + 1),
            });
            await restarted.refresh();
            expect(await stageAwards(h)).toHaveLength(72);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "missing expedition ranking metadata preserves economic facts without inventing recipients or advancing the native ranking prefix",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(expedition_progress).values({
                uid: "absent",
                periodId: String(h.period.id),
                stage: 7,
                score: 1000,
                takeReward: "",
            });
            await h.seal();
            await h.rewards().refresh();
            const entitlements = await stageAwards(h);
            expect(entitlements).toHaveLength(2);
            expect(entitlements.some((row) => row.ownerUid === "absent")).toBe(false);
            expect(bundle(entitlements.find((row) => row.ownerUid === "owner")!).mails)
                .toHaveLength(7);
            const history = (await h.history.read("owner")).ranklist!.value as Value[];
            expect(history.map(fields).find((row) => row.stage?.value === 7)?.userlist).toEqual(
                sfs.array([]),
            );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
