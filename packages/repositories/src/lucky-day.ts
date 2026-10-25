import { eq } from "drizzle-orm";
import { lucky_day } from "@opencok/drizzle/schema/opencok_kingdom/lucky_day";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import type { MutationTransaction } from "./mutation";
export async function readLuckyDay(tx: MutationTransaction, owner: string) {
  const [day] = await tx.select().from(lucky_day).where(eq(lucky_day.uid, owner)).for("update");
  const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));
  return { day, server };
}
export async function writeLuckyDay(tx: MutationTransaction, owner: string, row: Row) {
  if (
    row.uid !== owner ||
    ![0, 1].includes(num(row, "status")) ||
    long(row, "time") < 0n ||
    text(row, "effectId").length > 40
  )
    throw new Error("Invalid lucky day owner or state");
  const value = {
    uid: owner,
    unluckyCount: cityInteger(row.unluckyCount),
    status: num(row, "status"),
    time: long(row, "time"),
    effectId: text(row, "effectId"),
    luckyCount: cityInteger(row.luckyCount),
    lucky_id: cityInteger(row.lucky_id),
  };
  await tx
    .insert(lucky_day)
    .values(value)
    .onConflictDoUpdate({ target: lucky_day.uid, set: value });
}
