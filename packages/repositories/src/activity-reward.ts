import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import type { EconomyPosting } from "@opencok/contracts/mutation";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import type { ActivityRewardWrite } from "@opencok/contracts/activity-reward";
import { user_activity } from "@opencok/drizzle/schema/opencok_kingdom/user_activity";
import { server_push } from "@opencok/drizzle/schema/opencok_kingdom/server_push";
import { and, eq } from "drizzle-orm";
import type { ActivityRewardReader } from "@opencok/contracts/activity-reward";
import type { MutationTransaction } from "./mutation";
export function activityRewardReader(tx: MutationTransaction, owner: string): ActivityRewardReader {
  return {
    async alliance(id) {
      if (!id) return {};
      if (id.length > 40) throw new Error("Invalid activity reward alliance");
      const [record] = await tx.select().from(alliance).where(eq(alliance.uid, id)).for("update");
      const [member] = await tx
        .select()
        .from(alliance_member)
        .where(and(eq(alliance_member.uid, owner), eq(alliance_member.allianceId, id)))
        .for("update");
      return { alliance: record, member };
    },
    async owned(actId) {
      if (!actId || actId.length > 40 || actId.includes("\0"))
        throw new Error("Invalid activity reward identity");
      const [entitlement] = await tx
        .select()
        .from(user_activity)
        .where(and(eq(user_activity.uid, owner), eq(user_activity.actId, actId)))
        .for("update");
      if (!entitlement) return undefined;
      const [announcement] = await tx
        .select()
        .from(server_push)
        .where(eq(server_push.uid, actId))
        .for("share");
      return { entitlement, announcement };
    },
  };
}
export async function writeActivityReward(
  tx: MutationTransaction,
  owner: string,
  write: ActivityRewardWrite,
) {
  const updated = await tx
    .update(user_activity)
    .set({ status: 1 })
    .where(
      and(
        eq(user_activity.uid, owner),
        eq(user_activity.actId, write.actId),
        eq(user_activity.status, 0),
      ),
    )
    .returning({ actId: user_activity.actId });
  if (updated.length !== 1) throw new Error("Activity reward entitlement changed");
  if (!Number.isInteger(write.kingdomId) || write.kingdomId <= 0)
    throw new Error("Invalid activity reward realm");
  const postings: EconomyPosting[] = [];
  if (write.member) {
    const [before] = await tx
      .select()
      .from(alliance_member)
      .where(
        and(
          eq(alliance_member.uid, owner),
          eq(alliance_member.allianceId, write.member.allianceId),
        ),
      )
      .for("update");
    if (!before) throw new Error("Missing activity reward membership");
    for (const key of ["point", "accPoint"] as const) {
      const previous = before[key] ?? 0,
        next = write.member[key];
      if (!Number.isInteger(next) || previous < 0 || next < previous || next > 2147483647)
        throw new Error("Invalid activity reward contribution");
      postings.push({
        account: owner,
        asset: `member.${key}`,
        before: BigInt(previous),
        after: BigInt(next),
        reason: "activity.reward.honor",
      });
    }

    const updated = await tx
      .update(alliance_member)
      .set({ point: write.member.point, accPoint: write.member.accPoint })
      .where(
        and(
          eq(alliance_member.uid, owner),
          eq(alliance_member.allianceId, write.member.allianceId),
        ),
      )
      .returning({ uid: alliance_member.uid });
    if (updated.length !== 1) throw new Error("Activity reward membership changed");
  }
  if (write.alliance) {
    const [before] = await tx
      .select({ points: alliance.alliancepoint })
      .from(alliance)
      .where(eq(alliance.uid, write.alliance.id))
      .for("update");
    if (
      !before ||
      before.points === null ||
      before.points < 0n ||
      write.alliance.points < before.points ||
      write.alliance.points > 9223372036854775807n
    )
      throw new Error("Invalid activity reward alliance points");
    postings.push({
      account: write.alliance.id,
      asset: "alliance.alliancepoint",
      before: before.points,
      after: write.alliance.points,
      reason: "activity.reward.alliance",
    });

    const updated = await tx
      .update(alliance)
      .set({ alliancepoint: write.alliance.points })
      .where(eq(alliance.uid, write.alliance.id))
      .returning({ uid: alliance.uid });
    if (updated.length !== 1) throw new Error("Activity reward alliance changed");
  }

  if (postings.length)
    await tx.insert(economy_posting).values(
      postings.map((posting, entry) => ({
        kingdomId: write.kingdomId,
        ownerUid: owner,
        requestId: `activity-reward:${write.actId}`,
        entry,
        accountUid: posting.account,
        asset: posting.asset,
        before: posting.before,
        after: posting.after,
        delta: posting.after - posting.before,
        reason: posting.reason,
      })),
    );
}
