import { and, asc, eq, sql } from "drizzle-orm";
import { user_region_recall } from "@opencok/drizzle/schema/opencok_kingdom/user_region_recall";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { text, long } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import type { RegionalRecallWrite } from "@opencok/contracts/regional-recall";
import type { MutationTransaction } from "./mutation";
import { insertSystemMail } from "./system-mail";

export async function readRegionalRecall(
  tx: MutationTransaction,
  owner: string,
  realm: number,
  initialize: boolean,
) {
  const [record] = await tx
    .select()
    .from(user_region_recall)
    .where(eq(user_region_recall.uid, owner))
    .for("update");
  const [registration] = await tx
    .select({ country: stat_reg.country })
    .from(stat_reg)
    .where(eq(stat_reg.uid, owner))
    .orderBy(sql`case when ${stat_reg.type} = 2 then 0 else 1 end`, asc(stat_reg.type))
    .limit(1);
  const members: string[] = [];

  if (initialize && !record) {
    const [membership] = await tx
      .select({ allianceId: alliance_member.allianceId })
      .from(alliance_member)
      .where(eq(alliance_member.uid, owner));

    if (membership?.allianceId) {
      const rows = await tx
        .select({ uid: alliance_member.uid })
        .from(alliance_member)
        .innerJoin(userprofile, eq(userprofile.uid, alliance_member.uid))
        .where(
          and(
            eq(alliance_member.allianceId, membership.allianceId),
            eq(userprofile.serverId, realm),
          ),
        )
        .limit(2049);

      if (rows.length > 2048) throw new Error("Regional recall alliance exceeds bound");

      members.push(...rows.map((row) => row.uid));
    }
  }

  return { record, country: registration?.country ?? "", members };
}

export async function writeRegionalRecall(
  tx: MutationTransaction,
  owner: string,
  write: RegionalRecallWrite,
) {
  const row = write.record;

  if (
    row.uid !== owner ||
    owner.length > 32 ||
    text(row, "country").length > 32 ||
    text(row, "reward").length > 255 ||
    long(row, "endtime") < long(row, "begintime")
  )
    throw new Error("Invalid regional recall write");

  const value = {
    uid: owner,
    level: cityInteger(row.level),
    ladder: cityInteger(row.ladder),
    receivedaynum: cityInteger(row.receivedaynum, 0, 32),
    receivetime: cityAmount(row.receivetime),
    begintime: cityAmount(row.begintime),
    endtime: cityAmount(row.endtime),
    country: text(row, "country"),
    reward: text(row, "reward"),
  };
  await tx
    .insert(user_region_recall)
    .values(value)
    .onConflictDoUpdate({ target: user_region_recall.uid, set: value });

  if ((write.mail?.length ?? 0) > 2048) throw new Error("Regional recall mail exceeds bound");

  for (const message of write.mail ?? [])
    await insertSystemMail(
      tx,
      message,
      message.owner,
      message.uid.slice(0, 32),
      message.createTime,
    );
}
