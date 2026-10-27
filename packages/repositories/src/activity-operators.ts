import { asc, desc, eq, gte, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_target_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task_notes";
import { user_recall_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task_notes";
import { activity_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/activity_group_buys";
import { user_comeback_record } from "@opencok/drizzle/schema/opencok_kingdom/user_comeback_record";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import type { ActivityOperatorsSnapshot } from "@opencok/contracts/activity-operators";
import type { Database } from "./game";
export async function readActivityOperators(
  db: Database["kingdom"]["db"],
  owner: string,
  now: number,
): Promise<ActivityOperatorsSnapshot> {
  if (!owner || owner.length > 40 || !Number.isSafeInteger(now) || now < 0)
    throw new Error("Invalid activity operators selection");
  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          banFlag: userprofile.banFlag,
          banTime: userprofile.banTime,
          crossFightSrcServerId: userprofile.crossFightSrcServerId,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner));
      if (!profile) return { server: {}, buildings: [], country: "", groupBuys: [] };
      const [server] = await tx
        .select({ activityTime: server_info.activityTime })
        .from(server_info)
        .where(eq(server_info.uid, "server"));
      const buildings = await tx
        .select({
          uid: user_building.uid,
          uuid: user_building.uuid,
          itemId: user_building.itemId,
          level: user_building.level,
          star: user_building.star,
        })
        .from(user_building)
        .where(eq(user_building.uid, owner))
        .orderBy(asc(user_building.uuid))
        .limit(257);
      const [target] = await tx
        .select({
          uid: user_target_task_notes.uid,
          beginTime: user_target_task_notes.beginTime,
          endTime: user_target_task_notes.endTime,
        })
        .from(user_target_task_notes)
        .where(eq(user_target_task_notes.uid, owner));
      const [recall] = await tx
        .select({
          uid: user_recall_task_notes.uid,
          country: user_recall_task_notes.country,
          beginTime: user_recall_task_notes.beginTime,
          endTime: user_recall_task_notes.endTime,
        })
        .from(user_recall_task_notes)
        .where(eq(user_recall_task_notes.uid, owner));
      const [comeback] = await tx
        .select({
          uid: user_comeback_record.uid,
          configId: user_comeback_record.configId,
          backTime: user_comeback_record.backTime,
        })
        .from(user_comeback_record)
        .where(eq(user_comeback_record.uid, owner))
        .orderBy(desc(user_comeback_record.backTime), asc(user_comeback_record.configId))
        .limit(1);
      const [registration] = await tx
        .select({ country: stat_reg.country })
        .from(stat_reg)
        .where(eq(stat_reg.uid, owner))
        .orderBy(sql`case when ${stat_reg.type}=2 then 0 else 1 end`, asc(stat_reg.type))
        .limit(1);
      const groupBuys = await tx
        .select({
          id: activity_group_buys.id,
          startTime: activity_group_buys.startTime,
          endTime: activity_group_buys.endTime,
          curRound: activity_group_buys.curRound,
          roundInfo: sql<string>`left(${activity_group_buys.roundInfo},32769)`,
        })
        .from(activity_group_buys)
        .where(gte(activity_group_buys.endTime, BigInt(now)))
        .orderBy(asc(activity_group_buys.startTime))
        .limit(3);
      if (
        buildings.length > 256 ||
        groupBuys.length > 2 ||
        groupBuys.some((row) => (row.roundInfo?.length ?? 0) > 32768)
      )
        throw new Error("Activity operator aggregate exceeds bound");
      return {
        profile,
        server: server ?? {},
        buildings,
        target,
        recall,
        comeback,
        country: registration?.country ?? "",
        groupBuys,
      };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
