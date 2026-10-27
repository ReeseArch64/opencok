import { pendingOwnedProgression } from "@opencok/repositories/progression-finality";
import { and, asc, eq, inArray, isNull, lt, lte, or, sql } from "drizzle-orm";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { hero_rank_closure } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_closure";
import { heroEmptyDigest } from "@opencok/hero/rules/hero-ranking-finality";
import { long, num, text } from "@opencok/contracts/rows";
import type { HeroRankFinalityRealm } from "@opencok/hero/contracts/hero-ranking-finality";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import type { Database } from "@opencok/repositories/game";

export { createHeroRankFinalityRegistry } from "./hero-ranking-finality-global.ts";

export function createHeroRankFinalityRealm(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
): HeroRankFinalityRealm {
  let closureCursor: { end: bigint; id: string } | undefined;
  const owned = async (
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
    periodId: string,
  ) => {
    const [row] = await tx
      .select()
      .from(hero_rank_closure)
      .where(eq(hero_rank_closure.periodId, periodId))
      .for("update");

    if (!row) throw new Error("Missing owned hero rank closure");

    return row;
  };

  return {
    async candidates(now) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const closures = await tx
            .select()
            .from(hero_rank_closure)
            .where(
              and(
                lt(hero_rank_closure.phase, 2),
                closureCursor
                  ? sql`(${hero_rank_closure.endTime},${hero_rank_closure.periodId})>(${closureCursor.end},${closureCursor.id})`
                  : undefined,
              ),
            )
            .orderBy(asc(hero_rank_closure.endTime), asc(hero_rank_closure.periodId))
            .limit(8),
          events = await tx
            .select()
            .from(hero_event)
            .where(
              and(
                eq(hero_event.rewardStatus, 0),
                lte(hero_event.endTime, now - 300000n),
                inArray(hero_event.type, [1, 2, 3, 4]),
              ),
            )
            .orderBy(asc(hero_event.endTime), asc(hero_event.type))
            .limit(8);
        const last = closures.at(-1);
        closureCursor =
          closures.length === 8 && last ? { end: last.endTime, id: last.periodId } : undefined;

        return { closures, events };
      });
    },
    async closeUnmatched(actId, now) {
      await db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await fenceRealmTransaction(tx, authority, "update");
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        await tx
          .update(hero_event)
          .set({ rewardStatus: 1 })
          .where(
            and(
              eq(hero_event.uuid, actId),
              inArray(hero_event.type, [3, 4]),
              lte(hero_event.endTime, now - 300000n),
              or(isNull(hero_event.serverGroup), eq(hero_event.serverGroup, "")),
            ),
          );
      });
    },
    async seal(period, now) {
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await fenceRealmTransaction(tx, authority, "update");
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);

        if (now < period.endTime + 300000n || !period.expectedRealms.includes(authority.kingdomId))
          throw new Error("Premature hero rank closure");

        const [prior] = await tx
          .select()
          .from(hero_rank_closure)
          .where(eq(hero_rank_closure.periodId, period.id))
          .for("update");

        if (prior) {
          if (
            prior.type !== period.type ||
            prior.endTime !== period.endTime ||
            prior.group !== period.group ||
            prior.eventId !== period.eventId
          )
            throw new Error("Conflicting owned hero rank closure");

          return prior;
        }

        const events = await tx
          .select()
          .from(hero_event)
          .where(
            and(
              eq(hero_event.type, period.type),
              eq(hero_event.endTime, period.endTime),
              eq(hero_event.eventId, period.eventId),
            ),
          )
          .limit(2)
          .for("update");

        if (events.length > 1) throw new Error("Ambiguous owned hero rank event");

        const event = events[0];

        if (event && period.type >= 3 && event.serverGroup !== period.group)
          throw new Error("Unmatched hero rank closure");

        if (await pendingOwnedProgression(tx, authority.kingdomId, period.endTime, now)) return;

        let digest = heroEmptyDigest,
          scoreCount = 0n;

        if (event) {
          const [count] = await tx
            .select({ count: sql<string>`count(*)::text` })
            .from(score_act)
            .where(eq(score_act.actId, event.uuid));
          scoreCount = BigInt(count?.count ?? "0");

          if (scoreCount > 1000000n) throw new Error("Hero ranking seal population bound exceeded");

          const [proof] = await tx
            .select({
              digest: sql<string>`md5(coalesce(string_agg(length(${score_act.uid})::text||':'||${score_act.uid}||':'||coalesce(${score_act.level},0)::text||':'||${score_act.score}::text,'|' order by ${score_act.uid} collate "C"),''))`,
            })
            .from(score_act)
            .where(eq(score_act.actId, event.uuid));
          digest = proof?.digest ?? heroEmptyDigest;
          await tx
            .update(hero_event)
            .set({ rewardStatus: 1 })
            .where(eq(hero_event.uuid, event.uuid));
        }

        const [closure] = await tx
          .insert(hero_rank_closure)
          .values({
            periodId: period.id,
            actId: event?.uuid ?? null,
            type: period.type,
            endTime: period.endTime,
            group: period.group,
            eventId: period.eventId,
            eligible: event?.rewardStatus === 0 ? 1 : 0,
            phase: 0,
            cursor: "",
            processed: 0n,
            scoreCount,
            digest,
            createdAt: now,
            kingdomRank: null,
          })
          .returning();

        if (!closure) throw new Error("Hero ranking closure was not persisted");

        authority.assertReady();

        return closure;
      });
    },
    page(closure) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);

        if (!closure.actId || num(closure, "phase") !== 0) return [];

        const scores = await tx
          .select()
          .from(score_act)
          .where(
            and(
              eq(score_act.actId, text(closure, "actId")),
              sql`${score_act.uid} collate "C">${text(closure, "cursor")} collate "C"`,
            ),
          )
          .orderBy(sql`${score_act.uid} collate "C"`)
          .limit(64);

        return scores.map((score) => ({
          event: {
            uuid: closure.actId!,
            eventId: closure.eventId!,
            type: closure.type!,
            endTime: closure.endTime!,
            serverGroup: closure.group!,
          },
          score,
          metadata: null,
        }));
      });
    },
    async advance(closure, cursor, processed) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, text(closure, "periodId"));

        if (
          row.phase !== 0 ||
          row.cursor !== text(closure, "cursor") ||
          row.processed !== long(closure, "processed") ||
          processed < row.processed ||
          processed > row.scoreCount ||
          Buffer.compare(Buffer.from(cursor), Buffer.from(row.cursor)) < 0
        )
          throw new Error("Stale hero rank upload cursor");

        await tx
          .update(hero_rank_closure)
          .set({ cursor, processed })
          .where(eq(hero_rank_closure.periodId, row.periodId));
      });
    },
    async reset(closure) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, text(closure, "periodId"));

        if (row.phase === 0)
          await tx
            .update(hero_rank_closure)
            .set({ cursor: "", processed: 0n })
            .where(eq(hero_rank_closure.periodId, row.periodId));
      });
    },
    async completed(periodId) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, periodId);

        if (row.processed !== row.scoreCount) throw new Error("Incomplete owned hero rank upload");

        if (row.phase === 0)
          await tx
            .update(hero_rank_closure)
            .set({ phase: 1 })
            .where(eq(hero_rank_closure.periodId, periodId));
      });
    },
    async finished(periodId, kingdomRank) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, periodId);

        if (row.phase < 1) throw new Error("Unsealed hero ranking result");

        if (row.actId && kingdomRank && row.type >= 3) {
          const [event] = await tx.select().from(hero_event).where(eq(hero_event.uuid, row.actId));

          if (!event) throw new Error("Missing hero kingdom result event");

          await tx
            .update(hero_event)
            .set({ kingdomRank })
            .where(eq(hero_event.activityId, event.activityId));
          await tx
            .update(hero_activity)
            .set({ kingdomRank })
            .where(eq(hero_activity.uuid, event.activityId));
        }

        await tx
          .update(hero_rank_closure)
          .set({ phase: 2, kingdomRank })
          .where(eq(hero_rank_closure.periodId, periodId));
      });
    },
  };
}
