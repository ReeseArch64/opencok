import { rankingCalendar } from "@opencok/rules/community-ranking";
import { and, asc, desc, eq, gt, gte } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { donate_history } from "@opencok/drizzle/schema/opencok_kingdom/donate_history";
import { user_cemetery } from "@opencok/drizzle/schema/opencok_kingdom/user_cemetery";
import type { CommunityRankingSnapshot } from "@opencok/contracts/community-ranking";
import type { Database } from "./game.ts";

type Db = Database["kingdom"]["db"];

const owner = {
  uid: userprofile.uid,
  serverId: userprofile.serverId,
  allianceId: userprofile.allianceId,
  banFlag: userprofile.banFlag,
  banTime: userprofile.banTime,
};

const presentation = {
  profileUid: userprofile.uid,
  name: userprofile.name,
  pic: userprofile.pic,
  picVer: userprofile.picVer,
  picfraId: userprofile.picfraId,
};

export async function readDonationRanking(
  db: Db,
  uid: string,
  now: number,
): Promise<CommunityRankingSnapshot> {
  if (!uid || uid.length > 40 || !Number.isSafeInteger(now))
    throw new Error("Invalid donation ranking owner");

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx.select(owner).from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
      )[0];

      if (!profile || profile.banFlag || (profile.banTime ?? 0n) > BigInt(now))
        return { profile, rows: [] };

      if (!profile.allianceId?.trim()) throw new Error("Missing alliance membership");

      const found = await tx
        .select({ uid: alliance.uid })
        .from(alliance)
        .where(eq(alliance.uid, profile.allianceId))
        .limit(1);

      if (!found.length) throw new Error("Missing alliance");

      const rows = await tx
        .select({
          uid: alliance_member.uid,
          allianceId: alliance_member.allianceId,
          rank: alliance_member.rank,
          point: alliance_member.point,
          progress: alliance_member.progress,
          donateTime: alliance_member.donateTime,
          todaydonate: alliance_member.todaydonate,
          todayprogress: alliance_member.todayprogress,
          ...presentation,
          power: playerinfo.power,
          historyUid: donate_history.uid,
          historyDonate: donate_history.donate,
          historyProgress: donate_history.progress,
        })
        .from(alliance_member)
        .leftJoin(userprofile, eq(userprofile.uid, alliance_member.uid))
        .leftJoin(playerinfo, eq(playerinfo.uid, alliance_member.uid))
        .leftJoin(
          donate_history,
          and(
            eq(donate_history.uid, alliance_member.uid),
            eq(donate_history.allianceId, alliance_member.allianceId),
            gte(donate_history.donateTime, rankingCalendar(now).nextMonday - 604800000n),
          ),
        )
        .where(eq(alliance_member.allianceId, profile.allianceId))
        .orderBy(asc(alliance_member.uid))
        .limit(32768);

      if (rows.length > 32767 || rows.some((row) => row.allianceId !== profile.allianceId))
        throw new Error("Invalid alliance ranking members");

      return { profile, rows };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}

export async function readCemeteryRanking(
  db: Db,
  uid: string,
  type: "0" | "1",
  now: number,
): Promise<CommunityRankingSnapshot> {
  if (!uid || uid.length > 40 || !["0", "1"].includes(type) || !Number.isSafeInteger(now))
    throw new Error("Invalid cemetery ranking query");

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx.select(owner).from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
      )[0];

      if (!profile || profile.banFlag || (profile.banTime ?? 0n) > BigInt(now))
        return { profile, rows: [] };

      const own = (
        await tx
          .select({ useItemSum: user_cemetery.useItemSum })
          .from(user_cemetery)
          .where(eq(user_cemetery.uid, uid))
          .limit(1)
      )[0];
      const metric = type === "0" ? user_cemetery.useItemSum : user_cemetery.deadSum;
      const rows = await tx
        .select({
          uid: user_cemetery.uid,
          useItemSum: user_cemetery.useItemSum,
          deadSum: user_cemetery.deadSum,
          ...presentation,
          allianceId: userprofile.allianceId,
          foundAlliance: alliance.uid,
          abbr: alliance.abbr,
          alliancename: alliance.alliancename,
        })
        .from(user_cemetery)
        .leftJoin(userprofile, eq(userprofile.uid, user_cemetery.uid))
        .leftJoin(
          alliance,
          and(eq(alliance.uid, userprofile.allianceId), gt(userprofile.allianceId, "")),
        )
        .where(gt(metric, 0))
        .orderBy(desc(metric), asc(user_cemetery.uid))
        .limit(100);

      return { profile, rows, ownItems: own?.useItemSum ?? 0 };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
