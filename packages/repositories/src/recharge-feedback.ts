import { and, eq, gte, lte, inArray, sql } from "drizzle-orm";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { recharge_feedback_claim } from "@opencok/drizzle/schema/opencok_kingdom/recharge_feedback_claim";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import type {
  RechargeFeedbackReader,
  RechargeFeedbackClaim,
} from "@opencok/contracts/recharge-feedback";
import type { MutationTransaction } from "./mutation";
export function rechargeFeedbackReader(
  tx: MutationTransaction,
  owner: string,
): RechargeFeedbackReader {
  return {
    async counts(start, end, prices) {
      if (!prices.length) return new Map();
      if (prices.length > 1024) throw new Error("Too many feedback price classes");
      const rows = await tx
        .select({ spend: paylog.spend, count: sql<string>`count(*)` })
        .from(paylog)
        .where(
          and(
            eq(paylog.uid, owner),
            eq(paylog.status, 2),
            gte(paylog.time, cityAmount(start)),
            lte(paylog.time, cityAmount(end)),
            inArray(
              paylog.spend,
              [...new Set(prices)].map((price) => cityInteger(price, 1) / 100),
            ),
          ),
        )
        .groupBy(paylog.spend);
      return new Map(rows.map((row) => [Math.round(row.spend * 100), BigInt(row.count)]));
    },
    async claims(start, end) {
      const rows = await tx
        .select({
          id: recharge_feedback_claim.id,
          startTime: recharge_feedback_claim.startTime,
          endTime: recharge_feedback_claim.endTime,
        })
        .from(recharge_feedback_claim)
        .where(
          and(
            eq(recharge_feedback_claim.uid, owner),
            eq(recharge_feedback_claim.startTime, start),
            eq(recharge_feedback_claim.endTime, end),
          ),
        )
        .limit(1025);
      if (rows.length > 1024) throw new Error("Too many feedback claims");
      return rows;
    },
    async payment(orderId, platform) {
      if (!orderId || orderId.length > 200 || !platform || platform.length > 20)
        throw new Error("Invalid feedback order selection");
      return (
        await tx
          .select({ productId: paylog.productId, time: paylog.time, spend: paylog.spend })
          .from(paylog)
          .where(and(eq(paylog.uid, owner), eq(paylog.orderId, orderId), eq(paylog.pf, platform)))
      )[0];
    },
  };
}
export async function writeRechargeFeedback(
  tx: MutationTransaction,
  owner: string,
  claims: readonly RechargeFeedbackClaim[],
  now: bigint,
) {
  if (claims.length > 1024) throw new Error("Too many feedback claim writes");
  for (const claim of claims) {
    if (!claim.id || claim.id.length > 40 || claim.endTime < claim.startTime)
      throw new Error("Invalid feedback claim");
    await tx.insert(recharge_feedback_claim).values({
      uid: owner,
      id: claim.id,
      startTime: cityAmount(claim.startTime),
      endTime: cityAmount(claim.endTime),
      createdAt: cityAmount(now),
    });
  }
}
