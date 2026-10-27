import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { continued_cost_rank_period as periods } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_period";
import { continued_cost_rank_watermark as marks } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_watermark";
import { continued_cost_rank_score as scores } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_score";
import { readCostScoreSnapshot, costScoreDigest } from "@opencok/rules/continued-cost-finality";
import { costRankingPeriodId, costRankingBands } from "@opencok/rules/continued-cost-ranking";
import { cityInteger } from "@opencok/rules/city-progression";
import { writeCostRankingSnapshot } from "./continued-cost-ranking-global";
import type { CostFinalityShared } from "@opencok/contracts/continued-cost-finality";
import type { CostRankingPeriod } from "@opencok/contracts/continued-cost-ranking";
import type { RealmAuthority } from "./realm-authority";
import type { Database } from "./game";

function read(row: typeof periods.$inferSelect): CostRankingPeriod {
  const period = {
    ...row,
    expectedRealms: row.expectedRealms.split("|").map((id) => cityInteger(id, 1)),
  };

  if (
    period.id !== costRankingPeriodId(period.startTime, period.endTime, period.type) ||
    period.expectedRealms.length > 128 ||
    [...new Set(period.expectedRealms)].toSorted((a, b) => a - b).join("|") !== row.expectedRealms
  )
    {throw new Error("Invalid final consumption cohort");}

  costRankingBands(period.rewards);

  return period;
}

export function createCostFinalityShared(
  db: Database["databases"]["global"]["db"],
  authority: RealmAuthority,
): CostFinalityShared {
  return {
    async candidates(cursor, now) {
      authority.assertReady();
      const rows = await db
        .select()
        .from(periods)
        .where(
          and(
            lte(periods.endTime, now - 300000n),
            sql`${authority.kingdomId}=any(string_to_array(${periods.expectedRealms},'|')::integer[])`,
            cursor ? sql`${periods.id} collate "C">${cursor} collate "C"` : undefined,
          ),
        )
        .orderBy(sql`${periods.id} collate "C"`)
        .limit(8);

      return rows.map(read);
    },
    async prove(period, seal, now) {
      if (
        seal.periodId !== period.id ||
        seal.createdAt < period.endTime + 300000n ||
        seal.createdAt > now
      )
        {throw new Error("Foreign or premature consumption proof");}

      const rows = readCostScoreSnapshot(seal.snapshot);

      if (rows.length !== seal.scoreCount || costScoreDigest(rows) !== seal.digest)
        {throw new Error("Corrupt owned consumption closure");}

      await writeCostRankingSnapshot(db, authority, period, rows, now, {
        digest: seal.digest,
        scoreCount: seal.scoreCount,
      });
    },
    async finalize(period, now) {
      authority.assertReady();

      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        const [saved] = await tx
          .select()
          .from(periods)
          .where(eq(periods.id, period.id))
          .for("update");

        if (
          !saved ||
          saved.expectedRealms !== period.expectedRealms.join("|") ||
          saved.endTime !== period.endTime ||
          !period.expectedRealms.includes(authority.kingdomId) ||
          now < saved.endTime + 300000n
        )
          {throw new Error("Invalid consumption finality cohort");}

        if (saved.state === 1) {return saved.finalizedAt;}

        const proofs = await tx.select().from(marks).where(eq(marks.periodId, period.id));

        if (
          proofs.length !== period.expectedRealms.length ||
          !period.expectedRealms.every((id) => proofs.some((row) => row.kingdomId === id))
        )
          {return;}

        for (const proof of proofs) {
          const rows = await tx
            .select()
            .from(scores)
            .where(and(eq(scores.periodId, period.id), eq(scores.kingdomId, proof.kingdomId)));

          if (rows.length !== proof.scoreCount || costScoreDigest(rows) !== proof.digest)
            {throw new Error("Consumption cohort proof no longer matches shared scores");}
        }

        await tx
          .update(periods)
          .set({ state: 1, finalizedAt: now })
          .where(eq(periods.id, period.id));
        authority.assertReady();

        return now;
      });
    },
    standings(id) {
      authority.assertReady();

      return db.transaction(
        async (tx) => {
          const [period] = await tx
            .select()
            .from(periods)
            .where(and(eq(periods.id, id), eq(periods.state, 1)))
            .limit(1);

          if (!period) {return;}

          const definition = read(period);

          if (
            !definition.expectedRealms.includes(authority.kingdomId) ||
            period.finalizedAt < period.endTime + 300000n
          )
            {throw new Error("Invalid finalized consumption standings");}

          const proofs = await tx.select().from(marks).where(eq(marks.periodId, id));

          if (
            proofs.length !== definition.expectedRealms.length ||
            !definition.expectedRealms.every((realm) =>
              proofs.some((proof) => proof.kingdomId === realm),
            )
          )
            {throw new Error("Missing finalized consumption cohort proofs");}

          const economic = await tx
            .select({
              uid: scores.uid,
              kingdomId: scores.kingdomId,
              score: scores.score,
              paid: scores.paid,
              free: scores.free,
              lastAt: scores.lastAt,
            })
            .from(scores)
            .where(eq(scores.periodId, id))
            .limit(12801);

          if (
            economic.length > 100 * definition.expectedRealms.length ||
            economic.some((row) => !definition.expectedRealms.includes(row.kingdomId))
          )
            {throw new Error("Invalid finalized consumption population");}

          for (const proof of proofs) {
            const rows = economic.filter((row) => row.kingdomId === proof.kingdomId);

            if (rows.length !== proof.scoreCount || costScoreDigest(rows) !== proof.digest)
              {throw new Error("Final consumption standings differ from their verified proof");}
          }

          return tx
            .select()
            .from(scores)
            .where(
              and(eq(scores.periodId, id), inArray(scores.kingdomId, definition.expectedRealms)),
            )
            .orderBy(sql`${scores.score} desc`, sql`${scores.uid} collate "C"`)
            .limit(100);
        },
        { isolationLevel: "repeatable read" },
      );
    },
  };
}
