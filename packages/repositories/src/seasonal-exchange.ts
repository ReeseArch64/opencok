import { eq } from "drizzle-orm";
import { activity } from "@opencok/drizzle/schema/opencok_kingdom/activity";
import { user_activity_new } from "@opencok/drizzle/schema/opencok_kingdom/user_activity_new";
import { and } from "drizzle-orm";
import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { seasonalExchangeRewards } from "@opencok/rules/seasonal-exchange";
import type { MutationTransaction } from "./mutation";

export async function readSeasonalExchange(tx: MutationTransaction, owner: string) {
  const periods = await tx
    .select()
    .from(activity)
    .where(eq(activity.type, 5))
    .limit(2)
    .for("share");

  if (periods.length > 1) throw new Error("Ambiguous seasonal exchange period");

  const [record] = await tx
    .select()
    .from(user_activity_new)
    .where(and(eq(user_activity_new.uid, owner), eq(user_activity_new.actId, 5)))
    .for("update");

  return { period: periods[0], record };
}

export async function writeSeasonalExchange(tx: MutationTransaction, owner: string, row: Row) {
  if (row.uid !== owner || num(row, "actId") !== 5)
    throw new Error("Invalid seasonal exchange owner");

  seasonalExchangeRewards(text(row, "rewards"));
  const value = {
    level: cityInteger(row.level, 0, 4),
    rewards: text(row, "rewards"),
    updateTime: cityAmount(row.updateTime),
  };
  await tx
    .insert(user_activity_new)
    .values({
      uid: owner,
      actId: 5,
      ...value,
      reserve_1: 0,
      reserve_2: "",
      flushTimes: 0,
      flushDate: 0n,
      receiveLevels: "",
    })
    .onConflictDoUpdate({ target: [user_activity_new.uid, user_activity_new.actId], set: value });
}
