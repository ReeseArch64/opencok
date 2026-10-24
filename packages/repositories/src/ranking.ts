import { readBuildingRanking } from "./ranking-building.ts";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { and, eq, gt, lte, ne, sql } from "drizzle-orm";
import type { PlayerRankingQuery, PlayerRankingSnapshot } from "@opencok/contracts/ranking";
import type { Database } from "./game.ts";

export function readPlayerRanking(
  db: Database["kingdom"]["db"],
  uid: string,
  query: PlayerRankingQuery,
): Promise<PlayerRankingSnapshot> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    !["power", "kills", "level", "building"].includes(query.kind) ||
    !Number.isInteger(query.limit) ||
    query.limit < 1 ||
    query.limit > 32767 ||
    !Number.isSafeInteger(query.now)
  )
    throw new Error("Invalid player ranking query");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            level: userprofile.level,
            serverId: userprofile.serverId,
            banTime: userprofile.banTime,
            banFlag: userprofile.banFlag,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      if (!profile || (profile.banFlag ?? 0) !== 0 || (profile.banTime ?? 0n) > BigInt(query.now))
        return { profile, candidates: [], fallbackRank: 1n };
      if (query.kind === "building")
        return { profile, ...(await readBuildingRanking(tx, uid, query.limit)) };
      const identity = {
        profileUid: userprofile.uid,
        name: userprofile.name,
        pic: userprofile.pic,
        picVer: userprofile.picVer,
        picfraId: userprofile.picfraId,
        allianceId: userprofile.allianceId,
        banTime: userprofile.banTime,
        allianceUid: alliance.uid,
        alliancename: alliance.alliancename,
        abbr: alliance.abbr,
      };
      const joinAlliance = eq(alliance.uid, userprofile.allianceId);
      const countRank = { rank: sql<string>`(count(*) + 1)::text`.mapWith(BigInt) };
      if (query.kind === "level") {
        const candidates = await tx
          .select({
            uid: userprofile.uid,
            level: userprofile.level,
            exp: userprofile.exp,
            ...identity,
          })
          .from(userprofile)
          .leftJoin(alliance, joinAlliance)
          .where(lte(userprofile.crossFightSrcServerId, 0))
          .orderBy(
            sql`${userprofile.level} desc`,
            sql`${userprofile.exp} desc`,
            sql`${userprofile.name} collate "C" asc`,
            sql`${userprofile.uid} collate "C" asc`,
          )
          .limit(query.limit * 3);
        const counts = await tx
          .select(countRank)
          .from(userprofile)
          .where(gt(userprofile.level, profile.level));
        if (counts.length !== 1) throw new Error("Missing player ranking count");
        return { profile, candidates, fallbackRank: counts[0]!.rank };
      }
      const selection = {
        uid: playerinfo.uid,
        power: playerinfo.power,
        armyKill: playerinfo.armyKill,
        ...identity,
      };
      const joinProfile = eq(userprofile.uid, playerinfo.uid);
      const candidates =
        query.kind === "power"
          ? await tx
              .select(selection)
              .from(playerinfo)
              .innerJoin(userprofile, joinProfile)
              .leftJoin(alliance, joinAlliance)
              .where(
                and(
                  lte(userprofile.crossFightSrcServerId, 0),
                  ne(userprofile.banTime, 9223372036854775807n),
                  query.hideGm ? eq(userprofile.gmFlag, 0) : undefined,
                ),
              )
              .orderBy(
                sql`${playerinfo.power} desc nulls last`,
                sql`${playerinfo.uid} collate "C" asc`,
              )
              .limit(query.limit * 2)
          : await tx
              .select(selection)
              .from(playerinfo)
              .leftJoin(userprofile, joinProfile)
              .leftJoin(alliance, joinAlliance)
              .orderBy(
                sql`${playerinfo.armyKill} desc nulls last`,
                sql`${playerinfo.power} desc nulls last`,
                sql`${playerinfo.uid} collate "C" asc`,
              )
              .limit(query.limit * 2);
      const metric = query.kind === "power" ? playerinfo.power : playerinfo.armyKill;
      const own = tx
        .select({ value: metric })
        .from(playerinfo)
        .where(eq(playerinfo.uid, uid))
        .limit(1);
      const counts = await tx.select(countRank).from(playerinfo).where(gt(metric, own));
      if (counts.length !== 1) throw new Error("Missing player ranking count");
      return { profile, candidates, fallbackRank: counts[0]!.rank };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
