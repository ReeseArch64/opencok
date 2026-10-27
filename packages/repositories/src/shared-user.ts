import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { and, eq } from "drizzle-orm";

type Realm = ReturnType<ReturnType<typeof createDatabases>["getKingdom"]>["db"];

type Transaction = Parameters<Parameters<Realm["transaction"]>[0]>[0];

export async function readSharedUserProfile(tx: Transaction, uid: string, kingdomId: number) {
  const rows = await tx
    .select({
      uid: userprofile.uid,
      name: userprofile.name,
      pic: userprofile.pic,
      picVer: userprofile.picVer,
      picfraId: userprofile.picfraId,
      lang: userprofile.lang,
      allianceId: userprofile.allianceId,
      gmFlag: userprofile.gmFlag,
      crossFightSrcServerId: userprofile.crossFightSrcServerId,
      offLineTime: userprofile.offLineTime,
      profileServerId: userprofile.serverId,
      power: playerinfo.power,
      abbr: alliance.abbr,
      mainBuildingLevel: user_building.level,
      vipScore: user_vip.score,
      vipEndTime: user_vip.vipEndTime,
      svipLevel: user_vip.sLevel,
      rank: alliance_member.rank,
    })
    .from(userprofile)
    .leftJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
    .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
    .leftJoin(
      user_building,
      and(eq(user_building.uid, userprofile.uid), eq(user_building.itemId, 400000)),
    )
    .leftJoin(user_vip, eq(user_vip.uid, userprofile.uid))
    .leftJoin(alliance_member, eq(alliance_member.uid, userprofile.uid))
    .where(eq(userprofile.uid, uid))
    .limit(2);

  if (rows.length !== 1 || rows[0]!.uid !== uid || rows[0]!.profileServerId !== kingdomId)
    {throw new Error("Shared user profile unavailable");}

  return rows[0]!;
}
