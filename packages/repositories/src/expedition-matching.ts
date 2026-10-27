import { randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { expedition_calendar } from "@opencok/drizzle/schema/opencok_global/expedition_calendar";
import { expedition_match_batch } from "@opencok/drizzle/schema/opencok_global/expedition_match_batch";
import { expedition_match_realm } from "@opencok/drizzle/schema/opencok_global/expedition_match_realm";
import { expedition_admission } from "@opencok/drizzle/schema/opencok_kingdom/expedition_admission";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { server_activity } from "@opencok/drizzle/schema/opencok_kingdom/server_activity";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import type {
  ExpeditionMatchingRegistry,
  ExpeditionMatchingRealmStore,
  ExpeditionMatchConfiguration,
} from "@opencok/contracts/expedition-matching";
import {
  decodeExpeditionMatchStats,
  expeditionMatchStats,
  expeditionMatchPairs,
} from "@opencok/rules/expedition-matching";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import { installExpeditionPeriod } from "./new-expedition";
import type { Database } from "./game";

export function expeditionMatchingWindow(period: Row) {
  return expeditionCalendarPhases(period).find((row) => row.stage === 1);
}

type Global = Database["databases"]["global"]["db"];

export function createExpeditionMatchingRegistry(db: Global): ExpeditionMatchingRegistry {
  const lock = async (tx: Parameters<Parameters<Global["transaction"]>[0]>[0], id: string) => {
    await tx.execute(sql`set local lock_timeout='1s'`);
    await tx.execute(sql`set local statement_timeout='3s'`);
    await tx.execute(sql`select pg_advisory_xact_lock(728226,hashtext(${id}))`);
  };
  const header = async (
    tx: Parameters<Parameters<Global["transaction"]>[0]>[0],
    period: Row,
    config: ExpeditionMatchConfiguration | undefined,
    now: bigint,
  ) => {
    const [saved] = await tx
      .select()
      .from(expedition_calendar)
      .where(eq(expedition_calendar.id, text(period, "id")))
      .limit(1);

    if (
      !saved ||
      saved.schedule !== text(period, "schedule") ||
      saved.endTime !== long(period, "endTime") ||
      saved.expectedRealms !== text(period, "expectedRealms")
    )
      {throw new Error("Foreign expedition calendar cohort");}

    const window = expeditionMatchingWindow(saved);

    if (!window || now < window.startTime || now >= saved.endTime) {return;}

    let [batch] = await tx
      .select()
      .from(expedition_match_batch)
      .where(eq(expedition_match_batch.periodId, saved.id))
      .for("update");

    if (!batch && !config) {return;}

    if (!batch)
      {[batch] = await tx
        .insert(expedition_match_batch)
        .values({
          periodId: saved.id,
          admissionStart: window.startTime,
          admissionEnd: window.endTime,
          configuration: JSON.stringify(config),
          seed: randomBytes(16).toString("hex"),
          createdAt: now,
          matchedAt: 0n,
        })
        .returning();}

    return { saved, batch: batch! };
  };

  return {
    async register(period, admission, configuration, now) {
      await db.transaction(async (tx) => {
        await lock(tx, text(period, "id"));
        const state = await header(tx, period, configuration, now);

        if (!state || state.batch.matchedAt > 0n) {return;}

        const kingdomId = cityInteger(admission.kingdomId, 1),
          registeredAt = long(admission, "createdAt");

        if (
          admission.periodId !== state.saved.id ||
          !state.saved.expectedRealms.split("|").includes(String(kingdomId)) ||
          registeredAt < state.batch.admissionStart ||
          registeredAt >= state.batch.admissionEnd ||
          registeredAt > now ||
          long(admission, "endTime") !== state.batch.admissionEnd ||
          long(admission, "startTime") !== state.batch.admissionStart ||
          long(admission, "activityEnd") !== state.saved.endTime
        )
          {throw new Error("Foreign expedition registration");}

        const statistics = JSON.stringify(
            decodeExpeditionMatchStats(text(admission, "statistics")),
          ),
          previousMatch = cityInteger(admission.previousMatch);

        if (previousMatch === kingdomId) {throw new Error("Self expedition previous opponent");}

        await tx
          .insert(expedition_match_realm)
          .values({
            periodId: state.saved.id,
            kingdomId,
            statistics,
            previousMatch,
            registeredAt,
            opponent: 0,
            matchedAt: 0n,
          })
          .onConflictDoNothing();
      });
    },
    async finalize(period, configuration, now) {
      await db.transaction(async (tx) => {
        await lock(tx, text(period, "id"));
        const state = await header(tx, period, configuration, now);

        if (!state || state.batch.matchedAt > 0n || now < state.batch.admissionEnd) {return;}

        const participants = await tx
          .select()
          .from(expedition_match_realm)
          .where(eq(expedition_match_realm.periodId, state.saved.id));
        const pairs = expeditionMatchPairs(
          participants.map((row) => ({
            kingdomId: row.kingdomId,
            statistics: row.statistics,
            stats: decodeExpeditionMatchStats(row.statistics),
            previousMatch: row.previousMatch,
          })),
          JSON.parse(state.batch.configuration),
          state.batch.seed,
        );

        for (const result of pairs)
          {await tx
            .update(expedition_match_realm)
            .set({ opponent: result.opponent, matchedAt: now })
            .where(
              and(
                eq(expedition_match_realm.periodId, state.saved.id),
                eq(expedition_match_realm.kingdomId, result.kingdomId),
              ),
            );}

        await tx
          .update(expedition_match_batch)
          .set({ matchedAt: now })
          .where(eq(expedition_match_batch.periodId, state.saved.id));
      });
    },
    async result(period, kingdomId) {
      cityInteger(kingdomId, 1);

      if (!text(period, "expectedRealms").split("|").includes(String(kingdomId)))
        {throw new Error("Foreign expedition result realm");}

      return db.transaction(
        async (tx) => {
          const [batch] = await tx
            .select()
            .from(expedition_match_batch)
            .where(eq(expedition_match_batch.periodId, text(period, "id")))
            .limit(1);

          if (!batch || batch.matchedAt === 0n) {return;}

          const rows = await tx
              .select()
              .from(expedition_match_realm)
              .where(eq(expedition_match_realm.periodId, batch.periodId)),
            own = rows.find((row) => row.kingdomId === kingdomId);

          if (
            own &&
            (own.matchedAt !== batch.matchedAt ||
              (own.opponent > 0 &&
                !rows.some(
                  (row) =>
                    row.kingdomId === own.opponent &&
                    row.opponent === kingdomId &&
                    row.matchedAt === batch.matchedAt,
                )))
          )
            {throw new Error("Invalid reciprocal expedition result");}

          return { kingdomId, opponent: own?.opponent ?? 0, matchedAt: batch.matchedAt };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
      );
    },
  };
}

export function createExpeditionMatchingRealmStore(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
  hideGm = false,
): ExpeditionMatchingRealmStore {
  return {
    async admit(period, allowNew = true) {
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`set local statement_timeout='5s'`);
        await fenceRealmTransaction(tx, authority, "update");
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        const at = BigInt(now()),
          window = expeditionMatchingWindow(period);

        if (!window) {return;}

        await tx.execute(
          sql`update ${expedition_admission} set "appliedAt"=${at} where "periodId" in (select "periodId" from ${expedition_admission} where "appliedAt"=0 and "activityEnd"<=${at} order by "activityEnd" limit 64)`,
        );
        const [prior] = await tx
          .select()
          .from(expedition_admission)
          .where(eq(expedition_admission.periodId, text(period, "id")))
          .for("update");

        if (prior) {return { ...prior, kingdomId: authority.kingdomId };}

        if (!allowNew || at < window.startTime || at >= window.endTime) {return;}

        if (!text(period, "expectedRealms").split("|").includes(String(authority.kingdomId)))
          {return;}

        const [hero] = await tx
            .select({ id: hero_activity.uuid })
            .from(hero_activity)
            .where(
              sql`${hero_activity.finish}=0 and ${hero_activity.endTime}>${at} and ${hero_activity.startTime}<${long(period, "endTime")}`,
            )
            .limit(1),
          [lord] = await tx
            .select({ id: server_activity.uid })
            .from(server_activity)
            .where(
              sql`${server_activity.startTime}<${at} and (${server_activity.endTime} is null or ${server_activity.endTime}>${at})`,
            )
            .limit(1),
          [old] = await tx
            .select()
            .from(expedition_period)
            .where(eq(expedition_period.serverId, authority.kingdomId))
            .limit(1);

        if (hero || lord || (old && old.endTime > at && old.periodId !== text(period, "id")))
          {return;}

        const [counts] = await tx
          .execute<{
            topUserPower: string;
            over10M: string;
            over30: string;
            over26: string;
            r5: string;
            topAlliancePower: string;
          }>(
            sql`with owned as (select up.*,coalesce(pi.power,0) as power from ${userprofile} up left join ${playerinfo} pi on pi.uid=up.uid where up."serverId"=${authority.kingdomId} and coalesce(up."crossFightSrcServerId",-1)<=0), guilds as (select a.uid,sum(o.power)::numeric+coalesce((select sum(s.power) from ${alliance_science} s where s."allianceId"=a.uid),0) as power from ${alliance} a join ${alliance_member} am on am."allianceId"=a.uid join owned o on o.uid=am.uid where a."ckfThroneFightFlag"=0 and exists(select 1 from ${alliance_member} leader where leader."allianceId"=a.uid and leader.rank=5 and exists(select 1 from ${userprofile} lp where lp.uid=leader.uid)) group by a.uid) select coalesce(max(power) filter(where coalesce("banTime",0)<>9223372036854775807 and (${hideGm}=false or coalesce("gmFlag",0)=0)),0)::text as "topUserPower",count(*) filter(where power>=10000000)::text as "over10M",(select count(*) from ${user_building} b join owned o on o.uid=b.uid where b."itemId"=400000 and b.level>=30)::text as "over30",(select count(*) from ${user_building} b join owned o on o.uid=b.uid where b."itemId"=400000 and b.level>=26)::text as "over26",(select count(distinct b.uid) from ${user_building} b join owned o on o.uid=b.uid where b."itemId" in (423000,424000,425000,426000) and b.star=5 and ${at}-coalesce(o."offLineTime",0)<=604800000)::text as r5,(select coalesce(json_agg(power::text order by power desc),'[]'::json) from (select power from guilds order by power desc limit 5) top_guilds)::text as "topAlliancePower" from owned`,
          )
          .then((result) => result.rows);
        const statistics = expeditionMatchStats({
          ...counts,
          topAlliancePower: (JSON.parse(counts?.topAlliancePower ?? "[]") as string[]).reduce(
            (total, power) => total + Number(power),
            0,
          ),
          topUserPower: counts?.topUserPower ?? "0",
          over10M: counts?.over10M ?? "0",
          over30: counts?.over30 ?? "0",
          over26: counts?.over26 ?? "0",
          r5: counts?.r5 ?? "0",
          victories: old?.victoryTimes ?? 0,
          failures: Math.max(0, (old?.count ?? 0) - (old?.victoryTimes ?? 0)),
        });
        const [admission] = await tx
          .insert(expedition_admission)
          .values({
            periodId: text(period, "id"),
            startTime: window.startTime,
            endTime: window.endTime,
            activityEnd: long(period, "endTime"),
            statistics: JSON.stringify(statistics),
            previousMatch: old?.matchServerId ?? 0,
            createdAt: at,
            appliedAt: 0n,
          })
          .returning();

        return { ...admission!, kingdomId: authority.kingdomId };
      });
    },
    async apply(period, result) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        const at = BigInt(now()),
          [admission] = await tx
            .select()
            .from(expedition_admission)
            .where(eq(expedition_admission.periodId, text(period, "id")))
            .for("update");

        if (!admission || admission.appliedAt > 0n) {return;}

        if (
          result.kingdomId !== authority.kingdomId ||
          result.matchedAt < admission.endTime ||
          result.matchedAt > at ||
          at < admission.endTime ||
          result.opponent === authority.kingdomId ||
          !text(period, "expectedRealms").split("|").includes(String(authority.kingdomId)) ||
          (result.opponent !== 0 &&
            !text(period, "expectedRealms").split("|").includes(String(result.opponent)))
        )
          {throw new Error("Foreign owned expedition match");}

        const window = expeditionMatchingWindow(period);

        if (
          !window ||
          window.startTime !== admission.startTime ||
          window.endTime !== admission.endTime ||
          long(period, "endTime") !== admission.activityEnd
        )
          {throw new Error("Conflicting owned expedition schedule");}

        if (result.opponent > 0 && at < admission.activityEnd) {
          const phases = expeditionCalendarPhases(period).filter(
              (row) => row.stage !== 0 && row.stage !== 1,
            ),
            manifest = {
              serverId: authority.kingdomId,
              periodId: admission.periodId,
              matchServerId: result.opponent,
              startTime: phases[0]!.startTime,
              stages: phases.map((row) => ({
                stage: row.stage,
                durationMs: row.endTime - row.startTime,
              })),
            };
          await installExpeditionPeriod(
            tx,
            authority,
            manifest,
            async (candidate) =>
              candidate.serverId === result.kingdomId &&
              candidate.periodId === text(period, "id") &&
              candidate.matchServerId === result.opponent &&
              result.matchedAt >= admission.endTime,
          );
        }

        await tx
          .update(expedition_admission)
          .set({ appliedAt: at })
          .where(eq(expedition_admission.periodId, admission.periodId));
      });
    },
  };
}
