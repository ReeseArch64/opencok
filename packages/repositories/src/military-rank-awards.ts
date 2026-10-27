import { eq } from "drizzle-orm";
import { user_military_rank } from "@opencok/drizzle/schema/opencok_kingdom/user_military_rank";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import {
  militaryRankDefault,
  militaryRankEntitlement,
  militaryRankGrant,
  militaryRankSame,
  militaryRankCents,
  militaryRankValue,
} from "@opencok/rules/military-rank-awards";
import { num, text, long } from "@opencok/contracts/rows";
import type {
  MilitaryRankAwardReader,
  MilitaryRankAwardWrite,
} from "@opencok/contracts/military-rank-awards";
import type { MutationTransaction } from "./mutation";
export function militaryRankAwardReader(
  tx: MutationTransaction,
  owner: string,
): MilitaryRankAwardReader {
  return {
    async load() {
      const [clock] = await tx
        .select({ clockMarker: server_info.lastClearMilitaryMailSendTime })
        .from(server_info)
        .where(eq(server_info.uid, "server"))
        .for("share");
      const [row] = await tx
        .select()
        .from(user_military_rank)
        .where(eq(user_military_rank.uid, owner))
        .for("update");
      return { row, clockMarker: clock?.clockMarker ?? undefined };
    },
  };
}
export async function writeMilitaryRankAward(
  tx: MutationTransaction,
  owner: string,
  write: MilitaryRankAwardWrite,
  now: bigint,
) {
  if (
    write.owner !== owner ||
    write.after.uid !== owner ||
    !Number.isInteger(write.kingdomId) ||
    write.kingdomId <= 0 ||
    !write.awards.length ||
    write.awards.length > 64 ||
    typeof write.clockMarker !== "bigint" ||
    write.clockMarker <= 0n ||
    write.clockMarker > now ||
    typeof write.periodEnd !== "bigint" ||
    write.periodEnd <= now ||
    write.periodEnd <= write.clockMarker
  )
    throw new Error("Invalid military award write");
  const requestId = militaryRankEntitlement(write.entitlementId),
    snapshot = await militaryRankAwardReader(tx, owner).load(),
    [profile] = await tx
      .select({ realm: userprofile.serverId })
      .from(userprofile)
      .where(eq(userprofile.uid, owner));
  if (
    profile?.realm !== write.kingdomId ||
    snapshot.clockMarker !== write.clockMarker ||
    Boolean(snapshot.row) !== Boolean(write.before) ||
    (snapshot.row && write.before && !militaryRankSame(snapshot.row, write.before))
  )
    throw new Error("Stale military award snapshot");
  const before = snapshot.row ?? militaryRankDefault(owner);
  let after = before;
  for (const award of write.awards) after = militaryRankGrant(after, award, write.honorCap);
  if (!militaryRankSame(after, write.after)) throw new Error("Inconsistent military award facts");
  const value = {
    uid: owner,
    militaryScore: militaryRankValue(after.militaryScore),
    honor: militaryRankValue(after.honor),
    rankingExp: num(after, "rankingExp"),
    militaryRank: num(after, "militaryRank"),
    award: text(after, "award"),
    lastRanking: num(after, "lastRanking"),
    lastMilitaryScore: militaryRankValue(after.lastMilitaryScore),
    skill: text(after, "skill"),
    status: num(after, "status"),
    lastTimeSet0Tostatus: long(after, "lastTimeSet0Tostatus"),
    awardReceived: num(after, "awardReceived"),
    lastTimeReset: long(after, "lastTimeReset"),
    maxHonorWeekly: militaryRankValue(after.maxHonorWeekly),
    lastRewardTime: long(after, "lastRewardTime"),
  };
  if (snapshot.row) {
    const score = write.awards.some((award) => award.kind === "military"),
      honor = write.awards.some((award) => award.kind === "milhonor");
    await tx
      .update(user_military_rank)
      .set({
        ...(score ? { militaryScore: value.militaryScore } : {}),
        ...(honor ? { honor: value.honor, maxHonorWeekly: value.maxHonorWeekly } : {}),
      })
      .where(eq(user_military_rank.uid, owner));
  } else await tx.insert(user_military_rank).values(value);
  await tx.insert(economy_posting).values(
    ["militaryScore", "honor", "maxHonorWeekly"].map((asset, entry) => ({
      kingdomId: write.kingdomId,
      ownerUid: owner,
      requestId,
      entry,
      accountUid: owner,
      asset: `military.${asset}.cents`,
      before: militaryRankCents(before[asset]),
      after: militaryRankCents(after[asset]),
      delta: militaryRankCents(after[asset]) - militaryRankCents(before[asset]),
      reason: "activity.military.award",
    })),
  );
}
