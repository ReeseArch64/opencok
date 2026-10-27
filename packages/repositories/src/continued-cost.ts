import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import type { Database } from "./game";
import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray } from "drizzle-orm";
import { activity_cost } from "@opencok/drizzle/schema/opencok_kingdom/activity_cost";
import { activity_cost_log } from "@opencok/drizzle/schema/opencok_kingdom/activity_cost_log";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { continuedCostClaims } from "@opencok/rules/continued-cost";
import { long, text, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export function readContinuedCost(tx: MutationTransaction, owner: string) {
  return {
    async load(type: number, start: bigint) {
      cityInteger(type, 1, 6);
      cityAmount(start);
      const rows = await tx
        .select()
        .from(activity_cost)
        .where(
          and(
            eq(activity_cost.uid, owner),
            eq(activity_cost.type, type),
            inArray(activity_cost.periodStart, [0n, start]),
          ),
        )
        .orderBy(desc(activity_cost.periodStart))
        .limit(2)
        .for("update");

      return rows[0];
    },
  };
}

export async function writeContinuedCost(
  tx: MutationTransaction,
  owner: string,
  write: { row: Row; logs: readonly number[] },
) {
  const row = write.row;

  if (
    row.uid !== owner ||
    write.logs.length > 128 ||
    new Set(write.logs).size !== write.logs.length
  )
    throw new Error("Invalid continued-cost owner or logs");

  continuedCostClaims(row.getLv);
  const value = {
    uid: owner,
    type: cityInteger(row.type, 1, 6),
    total: cityAmount(row.total),
    para1: cityAmount(row.para1),
    para2: cityAmount(row.para2),
    lv: cityInteger(row.lv),
    updateTime: cityAmount(row.updateTime),
    getLv: text(row, "getLv"),
    periodStart: cityAmount(row.periodStart),
  };

  if (value.periodStart <= 0n || value.updateTime < value.periodStart)
    throw new Error("Invalid continued-cost period");

  await tx
    .insert(activity_cost)
    .values(value)
    .onConflictDoUpdate({
      target: [activity_cost.uid, activity_cost.type, activity_cost.periodStart],
      set: value,
    });

  for (const level of write.logs)
    await tx.insert(activity_cost_log).values({
      uid: randomUUID(),
      userId: owner,
      type: value.type,
      total: long(row, "total"),
      lv: cityInteger(level, 1),
      time: long(row, "updateTime"),
    });
}

export async function pendingContinuedCosts(
  db: Database["kingdom"]["db"],
  kingdom: number,
  owner: string,
) {
  return (
    (
      await db
        .select({ id: mutation_outbox.eventId })
        .from(mutation_outbox)
        .where(
          and(
            eq(mutation_outbox.kingdomId, kingdom),
            eq(mutation_outbox.ownerUid, owner),
            eq(mutation_outbox.eventType, "continuedcost.spend"),
            eq(mutation_outbox.publishedAt, 0n),
          ),
        )
        .limit(1)
    ).length > 0
  );
}

export async function writeContinuedCostHide(
  tx: MutationTransaction,
  owner: string,
  value: number,
) {
  if (![0, 1].includes(value)) throw new Error("Invalid continued-cost privacy flag");

  const changed = await tx
    .update(user_mixed_info)
    .set({ costHide: value })
    .where(eq(user_mixed_info.uid, owner))
    .returning({ uid: user_mixed_info.uid });

  if (changed.length !== 1) throw new Error("Missing continued-cost privacy owner");
}
