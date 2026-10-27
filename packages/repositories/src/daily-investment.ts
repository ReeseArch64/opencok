import { eq } from "drizzle-orm";
import { invest_everyday } from "@opencok/drizzle/schema/opencok_kingdom/invest_everyday";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { investmentFlags } from "@opencok/rules/daily-investment";
import type { MutationTransaction } from "./mutation";

export async function readDailyInvestment(tx: MutationTransaction, owner: string) {
  const [record] = await tx
    .select()
    .from(invest_everyday)
    .where(eq(invest_everyday.uid, owner))
    .for("update");
  const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));

  return { record, serverOpenTime: long(server ?? {}, "activityTime") };
}

export async function writeDailyInvestment(tx: MutationTransaction, owner: string, row: Row) {
  if (row.uid !== owner || ![0, 1].includes(num(row, "endactive")))
    {throw new Error("Invalid investment owner or state");}

  investmentFlags(text(row, "isreceive"));
  const timestamps = ["beginTime", "receiveTime", "promptTime"].map((key) => long(row, key));

  if (timestamps.some((at) => at < 0n || at > 9223372036854775807n))
    {throw new Error("Invalid investment timestamp");}

  const value = {
    uid: owner,
    tableid: cityInteger(row.tableid, 1),
    level: cityInteger(row.level),
    isreceive: text(row, "isreceive"),
    beginTime: timestamps[0]!,
    receiveTime: timestamps[1]!,
    promptTime: timestamps[2]!,
    endactive: num(row, "endactive"),
  };
  await tx
    .insert(invest_everyday)
    .values(value)
    .onConflictDoUpdate({ target: invest_everyday.uid, set: value });
}
