import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { and, eq, gt, lte, sql } from "drizzle-orm";
import type { Database } from "./game.ts";

type Transaction = Parameters<Parameters<Database["kingdom"]["db"]["transaction"]>[0]>[0];

export async function readBuildingRanking(tx: Transaction, uid: string, limit: number) {
  const candidates = await tx
    .select({
      uuid: user_building.uuid,
      uid: user_building.uid,
      updateTime: user_building.updateTime,
      level: user_building.level,
      star: user_building.star,
      name: userprofile.name,
      pic: userprofile.pic,
      picVer: userprofile.picVer,
      picfraId: userprofile.picfraId,
      allianceId: userprofile.allianceId,
      banTime: userprofile.banTime,
      alliancename: alliance.alliancename,
      abbr: alliance.abbr,
      icon: alliance.icon,
      buildingPower: playerinfo.buildingPower,
    })
    .from(user_building)
    .innerJoin(playerinfo, eq(playerinfo.uid, user_building.uid))
    .innerJoin(userprofile, eq(userprofile.uid, user_building.uid))
    .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
    .where(and(eq(user_building.itemId, 400000), lte(userprofile.crossFightSrcServerId, 0)))
    .orderBy(
      sql`${user_building.level} desc`,
      sql`${user_building.star} desc nulls last`,
      sql`${user_building.updateTime} asc nulls first`,
      sql`${playerinfo.buildingPower} desc nulls last`,
      sql`${user_building.uid} collate "C" asc`,
      sql`${user_building.uuid} collate "C" asc`,
    )
    .limit(limit * 2);
  if (candidates.some((row) => row.uid === uid && row.banTime !== 9223372036854775807n))
    return { candidates, fallbackRank: 1n };
  const castles = await tx
    .select({ uuid: user_building.uuid, level: user_building.level })
    .from(user_building)
    .where(and(eq(user_building.uid, uid), eq(user_building.itemId, 400000)))
    .orderBy(sql`${user_building.uuid} collate "C" asc`)
    .limit(2);
  if (castles.length > 1) throw new Error("Ambiguous own castle ranking fallback");
  if (!castles.length) return { candidates, fallbackRank: 1n };
  const level = castles[0]!.level;
  const counts = await tx
    .select({ rank: sql<string>`(count(*) + 1)::text`.mapWith(BigInt) })
    .from(user_building)
    .where(and(eq(user_building.itemId, 400000), gt(user_building.level, level)));
  if (counts.length !== 1) throw new Error("Missing castle ranking count");
  const peers = tx
    .select({
      uid: user_building.uid,
      offset:
        sql<string>`(row_number() over (order by ${user_building.updateTime} asc nulls first, ${playerinfo.buildingPower} desc nulls last, ${user_building.uid} collate "C" asc, ${user_building.uuid} collate "C" asc) - 1)::text`.as(
          "peer_offset",
        ),
    })
    .from(user_building)
    .innerJoin(playerinfo, eq(playerinfo.uid, user_building.uid))
    .where(and(eq(user_building.itemId, 400000), eq(user_building.level, level)))
    .as("castle_peers");
  const offsets = await tx
    .select({ offset: sql<string>`${peers.offset}`.mapWith(BigInt) })
    .from(peers)
    .where(eq(peers.uid, uid))
    .limit(2);
  if (offsets.length > 1) throw new Error("Ambiguous castle ranking offset");
  return { candidates, fallbackRank: counts[0]!.rank + (offsets[0]?.offset ?? 0n) };
}
