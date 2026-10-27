import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import { hero_rank_period } from "@opencok/drizzle/schema/opencok_global/hero_rank_period";
import { hero_rank_watermark } from "@opencok/drizzle/schema/opencok_global/hero_rank_watermark";
import { hero_rank_owner } from "@opencok/drizzle/schema/opencok_global/hero_rank_owner";
import { hero_rank_score } from "@opencok/drizzle/schema/opencok_global/hero_rank_score";
import {
  heroCountryOrder,
  heroEmptyDigest,
  heroFinalityIdentity,
} from "@opencok/hero/rules/hero-ranking-finality";
import { cityInteger } from "@opencok/rules/city-progression";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type {
  HeroRankFinalityRegistry,
  HeroRankPeriod,
} from "@opencok/hero/contracts/hero-ranking-finality";
import type { RealmAuthority } from "@opencok/repositories/realm-authority";
import type { Database } from "@opencok/repositories/game";

function periodRow(row: Row): HeroRankPeriod {
  const expectedRealms = text(row, "expectedRealms")
    .split("|")
    .map((value) => cityInteger(value, 1));

  if (
    expectedRealms.length < 1 ||
    expectedRealms.length > 128 ||
    new Set(expectedRealms).size !== expectedRealms.length
  )
    {throw new Error("Invalid persisted hero finality cohort");}

  return {
    id: text(row, "id"),
    type: num(row, "type"),
    eventId: text(row, "eventId"),
    endTime: long(row, "endTime"),
    group: text(row, "group"),
    expectedRealms,
  };
}

export function createHeroRankFinalityRegistry(
  db: Database["databases"]["global"]["db"],
  authority: RealmAuthority,
): HeroRankFinalityRegistry {
  let cursor: { end: bigint; id: string } | undefined;
  const deadline = async (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => {
    await tx.execute(sql`set local lock_timeout='1s'`);
    await tx.execute(sql`set local statement_timeout='3s'`);
  };
  const periodFilter = (period: HeroRankPeriod) =>
    and(
      eq(hero_rank_score.kingdomId, authority.kingdomId),
      eq(hero_rank_score.type, period.type),
      eq(hero_rank_score.endTime, period.endTime),
      sql`right(${hero_rank_score.rankKey},length(${`_${period.group}_${BigInt.asIntN(32, period.endTime / 1000n)}`}))=${`_${period.group}_${BigInt.asIntN(32, period.endTime / 1000n)}`}`,
    );

  return {
    async register(period, now) {
      authority.assertReady();

      if (
        period.id !== heroFinalityIdentity(period.type, period.group, period.endTime) ||
        now < period.endTime + 300000n ||
        !period.expectedRealms.includes(authority.kingdomId) ||
        period.expectedRealms.length > 128 ||
        new Set(period.expectedRealms).size !== period.expectedRealms.length
      )
        {throw new Error("Invalid hero ranking finality admission");}

      await db.transaction(async (tx) => {
        await deadline(tx);
        await tx.execute(sql`select pg_advisory_xact_lock(728224,hashtext(${period.id}))`);
        const [old] = await tx
          .select()
          .from(hero_rank_period)
          .where(eq(hero_rank_period.id, period.id))
          .for("update");
        const expected = period.expectedRealms.join("|");

        if (old) {
          if (
            old.type !== period.type ||
            old.eventId !== period.eventId ||
            old.endTime !== period.endTime ||
            old.group !== period.group ||
            old.expectedRealms !== expected
          )
            {throw new Error("Conflicting hero ranking finality period");}

          return;
        }

        await tx.insert(hero_rank_period).values({
          id: period.id,
          type: period.type,
          eventId: period.eventId,
          endTime: period.endTime,
          group: period.group,
          expectedRealms: expected,
          createdAt: now,
          state: 0,
          finalizedAt: 0n,
          kingdomRank: null,
        });
        authority.assertReady();
      });
    },
    async get(periodId) {
      const [row] = await db
        .select()
        .from(hero_rank_period)
        .where(eq(hero_rank_period.id, periodId))
        .limit(1);

      return row ? periodRow(row) : undefined;
    },
    async pending(kingdomId) {
      if (kingdomId !== authority.kingdomId) {throw new Error("Foreign hero finality subscriber");}

      const rows = await db
        .select({ period: hero_rank_period })
        .from(hero_rank_period)
        .leftJoin(
          hero_rank_watermark,
          and(
            eq(hero_rank_watermark.periodId, hero_rank_period.id),
            eq(hero_rank_watermark.kingdomId, kingdomId),
          ),
        )
        .where(
          and(
            sql`position(${`|${kingdomId}|`} in '|'||${hero_rank_period.expectedRealms}||'|')>0`,
            or(
              eq(hero_rank_period.state, 0),
              sql`${hero_rank_watermark.state} is null`,
              eq(hero_rank_watermark.state, 0),
            ),
            cursor
              ? sql`(${hero_rank_period.endTime},${hero_rank_period.id})>(${cursor.end},${cursor.id})`
              : undefined,
          ),
        )
        .orderBy(asc(hero_rank_period.endTime), asc(hero_rank_period.id))
        .limit(8);
      const last = rows.at(-1)?.period;
      cursor = rows.length === 8 && last ? { end: last.endTime, id: last.id } : undefined;

      return rows.map((row) => periodRow(row.period));
    },
    async complete(period, closure, now) {
      authority.assertReady();

      if (
        now < period.endTime + 300000n ||
        text(closure, "periodId") !== period.id ||
        long(closure, "processed") !== long(closure, "scoreCount")
      )
        {throw new Error("Incomplete hero finality upload");}

      return db.transaction(async (tx) => {
        await deadline(tx);
        await tx.execute(sql`select pg_advisory_xact_lock(728223,${authority.kingdomId})`);
        const [savedPeriod] = await tx
          .select()
          .from(hero_rank_period)
          .where(eq(hero_rank_period.id, period.id))
          .limit(1)
          .for("share");

        if (
          !savedPeriod ||
          savedPeriod.type !== period.type ||
          savedPeriod.endTime !== period.endTime ||
          savedPeriod.group !== period.group ||
          savedPeriod.eventId !== period.eventId ||
          savedPeriod.expectedRealms !== period.expectedRealms.join("|") ||
          !periodRow(savedPeriod).expectedRealms.includes(authority.kingdomId)
        )
          {throw new Error("Conflicting hero ranking proof cohort");}

        const [owner] = await tx
          .select()
          .from(hero_rank_owner)
          .where(eq(hero_rank_owner.kingdomId, authority.kingdomId));

        if (
          owner &&
          (owner.ownerEpoch > authority.epoch ||
            (owner.ownerEpoch === authority.epoch && owner.instanceId !== authority.instance))
        )
          {throw new Error("Stale hero finality projection owner");}

        const [existing] = await tx
          .select()
          .from(hero_rank_watermark)
          .where(
            and(
              eq(hero_rank_watermark.periodId, period.id),
              eq(hero_rank_watermark.kingdomId, authority.kingdomId),
            ),
          )
          .for("update");

        if (existing) {
          if (
            existing.actId !== (closure.actId ?? null) ||
            existing.digest !== text(closure, "digest") ||
            existing.scoreCount !== long(closure, "scoreCount") ||
            existing.eligible !== num(closure, "eligible")
          )
            {throw new Error("Conflicting hero ranking sealed proof");}

          return existing.state === 1;
        }

        const filter = and(
          periodFilter(period),
          closure.actId ? eq(hero_rank_score.actId, text(closure, "actId")) : undefined,
        );
        const [count] = await tx
          .select({ count: sql<string>`count(*)::text` })
          .from(hero_rank_score)
          .where(filter);
        const size = BigInt(count?.count ?? "0");

        if (size !== long(closure, "scoreCount") || size > 1000000n) {return false;}

        const [proof] = await tx
          .select({
            digest: sql<string>`md5(coalesce(string_agg(length(${hero_rank_score.member})::text||':'||${hero_rank_score.member}||':'||${hero_rank_score.level}::text||':'||${hero_rank_score.score}::text,'|' order by ${hero_rank_score.member} collate "C"),''))`,
            total: sql<string>`coalesce(sum(${hero_rank_score.score}),0)::text`,
          })
          .from(hero_rank_score)
          .where(filter);

        if ((proof?.digest ?? heroEmptyDigest) !== text(closure, "digest")) {return false;}

        await tx.insert(hero_rank_watermark).values({
          periodId: period.id,
          kingdomId: authority.kingdomId,
          actId: closure.actId === null ? null : text(closure, "actId"),
          state: 1,
          digest: text(closure, "digest"),
          scoreCount: size,
          eligible: num(closure, "eligible"),
          completedAt: now,
          total: BigInt(proof?.total ?? "0"),
        });
        authority.assertReady();

        return true;
      });
    },
    async finalize(period, now) {
      authority.assertReady();
      await db.transaction(async (tx) => {
        await deadline(tx);
        await tx.execute(sql`select pg_advisory_xact_lock(728224,hashtext(${period.id}))`);
        const [saved] = await tx
          .select()
          .from(hero_rank_period)
          .where(eq(hero_rank_period.id, period.id))
          .for("update");

        if (!saved || saved.state === 1 || now < saved.endTime + 300000n) {return;}

        const authoritative = periodRow(saved);

        if (
          authoritative.type !== period.type ||
          authoritative.endTime !== period.endTime ||
          authoritative.group !== period.group ||
          authoritative.eventId !== period.eventId ||
          authoritative.expectedRealms.join("|") !== period.expectedRealms.join("|")
        )
          {throw new Error("Conflicting hero ranking finality cohort");}

        const proofs = await tx
          .select()
          .from(hero_rank_watermark)
          .where(
            and(
              eq(hero_rank_watermark.periodId, period.id),
              eq(hero_rank_watermark.state, 1),
              inArray(hero_rank_watermark.kingdomId, authoritative.expectedRealms),
            ),
          );

        if (proofs.length !== authoritative.expectedRealms.length) {return;}

        let kingdomRank: string | null = null;

        if (period.type === 3)
          {kingdomRank = heroCountryOrder(
            period.group,
            new Map(proofs.map((row) => [row.kingdomId, row.total])),
          );}

        if (period.type === 4) {
          const [personal] = await tx
            .select()
            .from(hero_rank_period)
            .where(eq(hero_rank_period.id, heroFinalityIdentity(3, period.group, period.endTime)))
            .limit(1);

          if (!personal || personal.state !== 1 || !personal.kingdomRank) {return;}

          kingdomRank = personal.kingdomRank;
        }

        await tx
          .update(hero_rank_period)
          .set({ state: 1, finalizedAt: now, kingdomRank })
          .where(eq(hero_rank_period.id, period.id));
        authority.assertReady();
      });
    },
    async result(periodId) {
      const [row] = await db
        .select()
        .from(hero_rank_period)
        .where(and(eq(hero_rank_period.id, periodId), eq(hero_rank_period.state, 1)))
        .limit(1);

      return row ? { kingdomRank: row.kingdomRank } : undefined;
    },
  };
}
