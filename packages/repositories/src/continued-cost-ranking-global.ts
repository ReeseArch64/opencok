import { continued_cost_rank_watermark as marks } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_watermark";
import { costScoreDigest } from "@opencok/rules/continued-cost-finality";
import { and, eq, inArray, notInArray, sql } from "drizzle-orm";
import { continued_cost_rank_period as periods } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_period";
import { continued_cost_rank_score as scores } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_score";
import { continued_cost_rank_owner as owners } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_owner";
import { costRankingBands, costRankingPeriodId } from "@opencok/rules/continued-cost-ranking";
import { costRankingEntry } from "@opencok/mappings/continued-cost-ranking";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import type {
  CostRankingPeriod,
  CostRankingRegistry,
  CostRankingScore,
} from "@opencok/contracts/continued-cost-ranking";
import type { Row } from "@opencok/contracts/rows";
import type { RealmAuthority } from "./realm-authority";
import type { Database } from "./game";

function validate(period: CostRankingPeriod) {
  if (period.id !== costRankingPeriodId(period.startTime, period.endTime, period.type))
    throw new Error("Invalid consumption ranking identity");

  costRankingBands(period.rewards);
  const census = [...new Set(period.expectedRealms.map((id) => cityInteger(id, 1)))].toSorted(
    (a, b) => a - b,
  );

  if (
    census.length < 1 ||
    census.length > 128 ||
    census.join("|") !== period.expectedRealms.join("|")
  )
    throw new Error("Invalid consumption ranking census");
}

function read(row: typeof periods.$inferSelect): CostRankingPeriod {
  const period = { ...row, expectedRealms: row.expectedRealms.split("|").map(Number) };
  validate(period);

  return period;
}

function fingerprint(rows: readonly CostRankingScore[]) {
  return JSON.stringify(
    rows
      .map((row) => ({
        uid: row.uid,
        score: String(row.score),
        paid: String(row.paid),
        free: String(row.free),
        lastAt: String(row.lastAt),
        metadata: row.metadata,
      }))
      .toSorted((a, b) => Buffer.compare(Buffer.from(a.uid), Buffer.from(b.uid))),
  );
}

export function createCostRankingRegistry(
  db: Database["databases"]["global"]["db"],
  authority: RealmAuthority,
): CostRankingRegistry {
  return {
    async register(period, now) {
      authority.assertReady();
      validate(period);
      cityAmount(now);

      if (!period.expectedRealms.includes(authority.kingdomId))
        throw new Error("Unconfigured consumption ranking realm");

      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728230,hashtext(${period.id}))`);
        await tx
          .insert(periods)
          .values({ ...period, expectedRealms: period.expectedRealms.join("|"), createdAt: now })
          .onConflictDoNothing();
        const [saved] = await tx.select().from(periods).where(eq(periods.id, period.id)).limit(1);

        if (
          !saved ||
          saved.startTime !== period.startTime ||
          saved.endTime !== period.endTime ||
          saved.type !== period.type ||
          saved.rewards !== period.rewards ||
          saved.expectedRealms !== period.expectedRealms.join("|")
        )
          throw new Error("Conflicting consumption ranking period");

        authority.assertReady();

        return read(saved);
      });
    },
    async get(id) {
      authority.assertReady();

      if (!/^[a-f0-9]{32}$/.test(id)) throw new Error("Invalid consumption period lookup");

      const [saved] = await db.select().from(periods).where(eq(periods.id, id)).limit(1);

      return saved ? read(saved) : undefined;
    },
    write(period, rows, now) {
      return writeCostRankingSnapshot(db, authority, period, rows, now);
    },
    board(id) {
      return db.transaction(
        async (tx) => {
          await tx.execute(sql`set local statement_timeout='3s'`);
          const [period] = await tx.select().from(periods).where(eq(periods.id, id)).limit(1);

          if (!period) return;

          const definition = read(period),
            rows = await tx
              .select()
              .from(scores)
              .where(
                and(eq(scores.periodId, id), inArray(scores.kingdomId, definition.expectedRealms)),
              )
              .orderBy(sql`${scores.score} desc`, sql`${scores.uid} collate "C"`)
              .limit(100);

          return rows.map((row, index) =>
            costRankingEntry({ ...row, type: definition.type } as Row, index + 1),
          );
        },
        { isolationLevel: "repeatable read" },
      );
    },
  };
}

export async function writeCostRankingSnapshot(
  db: Database["databases"]["global"]["db"],
  authority: RealmAuthority,
  period: CostRankingPeriod,
  rows: readonly CostRankingScore[],
  now: bigint,
  proof?: import("@opencok/contracts/continued-cost-finality").CostRankingProof,
) {
  authority.assertReady();
  validate(period);
  cityAmount(now);

  if (
    !period.expectedRealms.includes(authority.kingdomId) ||
    rows.length > 100 ||
    new Set(rows.map((row) => row.uid)).size !== rows.length
  )
    throw new Error("Invalid consumption ranking snapshot");

  for (const row of rows) {
    if (
      !row.uid ||
      row.uid.length > 40 ||
      cityAmount(row.score) <= 0n ||
      cityAmount(row.paid) < 0n ||
      cityAmount(row.free) < 0n ||
      row.lastAt < period.startTime ||
      row.lastAt >= period.endTime ||
      Buffer.byteLength(row.metadata) > 8192
    )
      throw new Error("Invalid confirmed consumption score");

    costRankingEntry({ ...row, kingdomId: authority.kingdomId, type: period.type }, 1);
  }

  await db.transaction(async (tx) => {
    await tx.execute(sql`set local lock_timeout='1s'`);
    await tx.execute(sql`set local statement_timeout='3s'`);
    await tx.execute(sql`select pg_advisory_xact_lock(728231,${authority.kingdomId})`);
    let [owner] = await tx
      .select()
      .from(owners)
      .where(eq(owners.kingdomId, authority.kingdomId))
      .for("update");

    if (
      owner &&
      (owner.ownerEpoch > authority.epoch ||
        (owner.ownerEpoch === authority.epoch && owner.instanceId !== authority.instance))
    )
      throw new Error("Stale consumption ranking publisher");

    if (!owner)
      [owner] = await tx
        .insert(owners)
        .values({
          kingdomId: authority.kingdomId,
          ownerEpoch: authority.epoch,
          instanceId: authority.instance,
          sequence: 0n,
        })
        .returning();
    else if (owner.ownerEpoch < authority.epoch)
      [owner] = await tx
        .update(owners)
        .set({ ownerEpoch: authority.epoch, instanceId: authority.instance, sequence: 0n })
        .where(eq(owners.kingdomId, authority.kingdomId))
        .returning();

    const [version] = await tx
      .update(owners)
      .set({ sequence: sql`${owners.sequence}+1` })
      .where(eq(owners.kingdomId, authority.kingdomId))
      .returning();

    if (!version) throw new Error("Missing consumption ranking owner");

    const [saved] = await tx.select().from(periods).where(eq(periods.id, period.id)).for("update");

    if (
      !saved ||
      saved.expectedRealms !== period.expectedRealms.join("|") ||
      saved.rewards !== period.rewards
    )
      throw new Error("Unregistered consumption ranking snapshot");

    const [mark] = await tx
      .select()
      .from(marks)
      .where(and(eq(marks.periodId, period.id), eq(marks.kingdomId, authority.kingdomId)))
      .limit(1);

    if (
      proof &&
      (proof.scoreCount !== rows.length ||
        proof.digest !== costScoreDigest(rows) ||
        (mark && (mark.digest !== proof.digest || mark.scoreCount !== proof.scoreCount)))
    )
      throw new Error("Conflicting consumption ranking proof");

    if (proof && saved.state === 1 && !mark)
      throw new Error("Missing finalized consumption ranking proof");

    const recordProof = async () => {
      if (proof && !mark)
        await tx.insert(marks).values({
          periodId: period.id,
          kingdomId: authority.kingdomId,
          ...proof,
          completedAt: now,
        });
    };
    const existing = await tx
      .select()
      .from(scores)
      .where(and(eq(scores.periodId, period.id), eq(scores.kingdomId, authority.kingdomId)));

    if (proof && mark) {
      const intact =
        existing.length === proof.scoreCount && costScoreDigest(existing) === proof.digest;

      if (intact) {
        authority.assertReady();

        return;
      }

      if (saved.state === 1)
        throw new Error("Final consumption proof differs from its shared economic rows");
    }

    const frozen = saved.state === 1 || (mark !== undefined && !proof);
    const accepted = !frozen
      ? proof && mark
        ? rows.map((row) => ({
            ...row,
            metadata: existing.find((value) => value.uid === row.uid)?.metadata ?? row.metadata,
          }))
        : rows
      : rows.flatMap((row) => {
          const frozen = existing.find((value) => value.uid === row.uid);

          return frozen
            ? [
                {
                  ...row,
                  score: frozen.score,
                  paid: frozen.paid,
                  free: frozen.free,
                  lastAt: frozen.lastAt,
                },
              ]
            : [];
        });
    const economic = !frozen
      ? accepted
      : existing.map((row) => accepted.find((value) => value.uid === row.uid) ?? row);

    if (fingerprint(existing) === fingerprint(economic)) {
      await recordProof();
      authority.assertReady();

      return;
    }

    if (!frozen)
      await tx.delete(scores).where(
        and(
          eq(scores.periodId, period.id),
          eq(scores.kingdomId, authority.kingdomId),
          accepted.length
            ? notInArray(
                scores.uid,
                accepted.map((row) => row.uid),
              )
            : undefined,
        ),
      );

    if (accepted.length) {
      const changed = await tx
        .insert(scores)
        .values(
          accepted.map((row) => ({
            ...row,
            periodId: period.id,
            kingdomId: authority.kingdomId,
            ownerEpoch: version.ownerEpoch,
            sequence: version.sequence,
            observedAt: now,
          })),
        )
        .onConflictDoUpdate({
          target: [scores.periodId, scores.uid],
          set: {
            score: sql`excluded.score`,
            paid: sql`excluded.paid`,
            free: sql`excluded.free`,
            lastAt: sql`excluded."lastAt"`,
            metadata: sql`excluded.metadata`,
            ownerEpoch: sql`excluded."ownerEpoch"`,
            sequence: sql`excluded.sequence`,
            observedAt: sql`excluded."observedAt"`,
          },
          setWhere: sql`${scores.kingdomId}=${authority.kingdomId} and (${scores.ownerEpoch},${scores.sequence})<(excluded."ownerEpoch",excluded.sequence)`,
        })
        .returning({ uid: scores.uid });

      if (changed.length !== accepted.length)
        throw new Error("Foreign or stale consumption ranking member");
    }

    await tx
      .update(periods)
      .set({ revision: sql`${periods.revision}+1` })
      .where(eq(periods.id, period.id));
    await recordProof();
    authority.assertReady();
  });
}
