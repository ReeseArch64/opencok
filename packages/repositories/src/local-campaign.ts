import { and, asc, eq, like, or } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";
export async function readCampaignVariables(
  tx: MutationTransaction,
  owner: string,
  kingdomId: number,
) {
  const rows = await tx
    .select()
    .from(trigger_var)
    .where(
      and(
        like(trigger_var.key, "long\\_3th\\_%"),
        or(
          and(eq(trigger_var.type, 1), eq(trigger_var.uid, owner)),
          and(eq(trigger_var.type, 2), eq(trigger_var.uid, String(kingdomId))),
        ),
      ),
    )
    .orderBy(asc(trigger_var.type), asc(trigger_var.key))
    .limit(2049);
  if (rows.length > 2048) throw new Error("Campaign variable bound exceeded");
  return rows;
}
export async function writeCampaignVariables(
  tx: MutationTransaction,
  owner: string,
  rows: readonly Row[],
  now: bigint,
) {
  const at = new Date(Number(now)).toISOString().slice(0, 19).replace("T", " ");
  for (const row of rows) {
    if (
      row.uid !== owner ||
      num(row, "type") !== 1 ||
      !/^long_3th_[a-zA-Z0-9_-]+$/.test(text(row, "key")) ||
      !/^-?\d{1,19}$/.test(text(row, "value")) ||
      BigInt(text(row, "value")) < -9223372036854775808n ||
      BigInt(text(row, "value")) > 9223372036854775807n
    )
      throw new Error("Invalid campaign variable write");
    const value = {
      type: 1,
      uid: owner,
      key: text(row, "key"),
      value: text(row, "value"),
      refreshtime: long(row, "refreshtime"),
      createTime: at,
      lastUpdateTime: at,
    };
    await tx
      .insert(trigger_var)
      .values(value)
      .onConflictDoUpdate({
        target: [trigger_var.type, trigger_var.uid, trigger_var.key],
        set: { value: value.value, refreshtime: value.refreshtime, lastUpdateTime: at },
      });
  }
}
