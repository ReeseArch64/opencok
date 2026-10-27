import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { continued_cost_fact as facts } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { continued_cost_period as periods } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_period";
import { continued_cost_score as scores } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_score";
import { readContinuedCostSpending } from "@opencok/mappings/continued-cost";
import { costRankingPeriodId, verifyCostFactCoverage } from "@opencok/rules/continued-cost-ranking";
import type { MutationTransaction } from "./mutation";
export async function captureCostFact(
  tx: MutationTransaction,
  event: {
    kingdomId: number;
    ownerUid: string;
    requestId: string;
    eventId: string;
    payload: Uint8Array;
  },
  now: bigint,
  witnessedPostings?: readonly import("@opencok/contracts/rows").Row[],
) {
  const value = readContinuedCostSpending(event.payload);
  if (value.owner !== event.ownerUid || value.at > now || event.eventId !== "continued-cost")
    throw new Error("Foreign or premature confirmed consumption fact");
  const postings =
    witnessedPostings ??
    (await tx
      .select()
      .from(economy_posting)
      .where(
        and(
          eq(economy_posting.kingdomId, event.kingdomId),
          eq(economy_posting.ownerUid, event.ownerUid),
          eq(economy_posting.requestId, event.requestId),
        ),
      ));
  verifyCostFactCoverage(value, postings);
  const id = costRankingPeriodId(value.start, value.end, value.type);
  await tx
    .insert(periods)
    .values({ id, startTime: value.start, endTime: value.end, type: value.type, createdAt: now })
    .onConflictDoNothing();
  const [period] = await tx.select().from(periods).where(eq(periods.id, id)).for("share");
  if (
    !period ||
    period.startTime !== value.start ||
    period.endTime !== value.end ||
    period.type !== value.type
  )
    throw new Error("Conflicting confirmed consumption period");
  const inserted = await tx
    .insert(facts)
    .values({
      ownerUid: event.ownerUid,
      requestId: event.requestId,
      eventId: event.eventId,
      periodId: id,
      at: value.at,
      amount: value.amount,
      paid: value.paid,
      free: value.free,
      digest: createHash("sha256").update(event.payload).digest("hex"),
      createdAt: now,
      counted: period.state === 0 ? 1 : 0,
    })
    .onConflictDoNothing()
    .returning({ id: facts.eventId });
  if (inserted.length !== 1) throw new Error("Consumption fact ingestion race");
  if (period.state === 0)
    await tx
      .insert(scores)
      .values({
        periodId: id,
        uid: value.owner,
        total: value.amount,
        paid: value.paid,
        free: value.free,
        lastAt: value.at,
      })
      .onConflictDoUpdate({
        target: [scores.periodId, scores.uid],
        set: {
          total: sql`${scores.total}+excluded.total`,
          paid: sql`${scores.paid}+excluded.paid`,
          free: sql`${scores.free}+excluded.free`,
          lastAt: sql`greatest(${scores.lastAt},excluded."lastAt")`,
        },
      });
}
