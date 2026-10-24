import { and, asc, desc, eq, gt, sql, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import type {
  HeroRankingSnapshot,
  HeroInsideRankingSnapshot,
  HeroHistorySnapshot,
} from "@opencok/contracts/hero-ranking";
import { score_act_in } from "@opencok/drizzle/schema/opencok_kingdom/score_act_in";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance as globalAlliance } from "@opencok/drizzle/schema/opencok_global/alliance";
import { server_king_info } from "@opencok/drizzle/schema/opencok_global/server_king_info";
import type { Database } from "./game.ts";

export async function readHeroRanking(
  db: Database["kingdom"]["db"],
  uid: string,
  activityId: string,
  now: number,
): Promise<HeroRankingSnapshot> {
  if (
    !uid ||
    uid.length > 40 ||
    !activityId ||
    activityId.length > 100 ||
    !Number.isSafeInteger(now)
  )
    throw new Error("Invalid hero ranking query");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            allianceId: userprofile.allianceId,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      if (!profile) return { profile, events: [] };
      const activities = await tx
        .select({ uuid: hero_activity.uuid })
        .from(hero_activity)
        .where(
          and(
            eq(hero_activity.activityId, activityId),
            eq(hero_activity.finish, 0),
            gt(hero_activity.endTime, BigInt(now)),
          ),
        )
        .limit(2);
      if (activities.length > 1) throw new Error("Ambiguous active hero activity");
      const activity = activities[0];
      if (!activity) return { profile, events: [] };
      const events = await tx
        .select({
          uuid: hero_event.uuid,
          activityId: hero_event.activityId,
          eventId: hero_event.eventId,
          type: hero_event.type,
          endTime: hero_event.endTime,
          serverGroup: hero_event.serverGroup,
        })
        .from(hero_event)
        .where(and(eq(hero_event.activityId, activity.uuid), gt(hero_event.endTime, BigInt(now))))
        .orderBy(asc(hero_event.readyTime), asc(hero_event.uuid))
        .limit(257);
      if (events.length > 256 || events.some((event) => event.activityId !== activity.uuid))
        throw new Error("Invalid hero event snapshot");
      return { profile, events };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}

export async function readHeroInsideRanking(
  db: Database["kingdom"]["db"],
  uid: string,
  eventId: string,
  now: number,
): Promise<HeroInsideRankingSnapshot> {
  if (!uid || uid.length > 40 || !eventId || eventId.length > 100 || !Number.isSafeInteger(now))
    throw new Error("Invalid hero inside ranking query");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            allianceId: userprofile.allianceId,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      if (!profile?.allianceId) return { profile, rows: [] };
      const event = (
        await tx
          .select({ type: hero_event.type })
          .from(hero_event)
          .innerJoin(hero_activity, eq(hero_activity.uuid, hero_event.activityId))
          .where(
            and(
              eq(hero_event.uuid, eventId),
              eq(hero_activity.finish, 0),
              gt(hero_activity.endTime, BigInt(now)),
              gt(hero_event.endTime, BigInt(now)),
            ),
          )
          .limit(1)
      )[0];
      if (!event || ![2, 4].includes(Number(event.type))) return { profile, rows: [] };
      const rows = await tx
        .select({
          uid: userprofile.uid,
          name: userprofile.name,
          pic: userprofile.pic,
          picVer: userprofile.picVer,
          picfraId: userprofile.picfraId,
          power: playerinfo.power,
          abbr: alliance.abbr,
          lang: userprofile.lang,
          mainBuildingLevel: user_building.level,
          allianceId: userprofile.allianceId,
          gmFlag: userprofile.gmFlag,
          crossFightSrcServerId: userprofile.crossFightSrcServerId,
          vipLevel: user_vip.level,
          svipLevel: user_vip.sLevel,
          vipEndTime: user_vip.vipEndTime,
          offLineTime: userprofile.offLineTime,
          score: score_act_in.score,
        })
        .from(score_act_in)
        .innerJoin(userprofile, eq(userprofile.uid, score_act_in.uid))
        .leftJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
        .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
        .leftJoin(user_vip, eq(user_vip.uid, userprofile.uid))
        .leftJoin(
          user_building,
          and(eq(user_building.uid, userprofile.uid), eq(user_building.itemId, 400000)),
        )
        .where(
          and(eq(score_act_in.actId, eventId), eq(score_act_in.allianceId, profile.allianceId)),
        )
        .orderBy(desc(score_act_in.score), asc(score_act_in.uid))
        .limit(32768);
      if (rows.length > 32767 || new Set(rows.map((row) => row.uid)).size !== rows.length)
        throw new Error("Invalid hero inside ranking snapshot");
      return { profile, rows };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}

export async function readHeroHistory(
  db: Database["kingdom"]["db"],
  uid: string,
  type: number,
  now: number,
): Promise<HeroHistorySnapshot> {
  if (
    !uid ||
    uid.length > 40 ||
    !Number.isInteger(type) ||
    type < 0 ||
    type > 4 ||
    !Number.isSafeInteger(now)
  )
    throw new Error("Invalid hero history query");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            allianceId: userprofile.allianceId,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      const empty = { profile, active: undefined, events: [], castleLevel: 0, alliancePower: 0n };
      if (!profile || type === 0) return empty;
      const active = (
        await tx
          .select({ eventId: hero_event.eventId, type: hero_event.type })
          .from(hero_event)
          .innerJoin(hero_activity, eq(hero_activity.uuid, hero_event.activityId))
          .where(
            and(
              eq(hero_event.type, type),
              eq(hero_activity.finish, 0),
              gt(hero_activity.endTime, BigInt(now)),
              gt(hero_event.endTime, BigInt(now)),
            ),
          )
          .orderBy(asc(hero_activity.uuid), asc(hero_event.readyTime), asc(hero_event.uuid))
          .limit(1)
      )[0];
      if (!active) return empty;
      const castle = await tx
        .select({ level: user_building.level })
        .from(user_building)
        .where(and(eq(user_building.uid, uid), eq(user_building.itemId, 400000)))
        .limit(2);
      if (castle.length > 1) throw new Error("Ambiguous main building");
      const power = profile.allianceId
        ? (
            await tx
              .select({ power: sql<string>`coalesce(sum(${playerinfo.power}), 0)::text` })
              .from(alliance_member)
              .innerJoin(playerinfo, eq(playerinfo.uid, alliance_member.uid))
              .where(eq(alliance_member.allianceId, profile.allianceId))
          )[0]?.power
        : "0";
      const events = await tx
        .select({
          uuid: hero_event.uuid,
          eventId: hero_event.eventId,
          type: hero_event.type,
          endTime: hero_event.endTime,
          serverGroup: hero_event.serverGroup,
          kingdomRank: hero_event.kingdomRank,
        })
        .from(hero_event)
        .where(and(eq(hero_event.type, type), eq(hero_event.rewardStatus, 1)))
        .orderBy(desc(hero_event.endTime), asc(hero_event.uuid))
        .limit(10);
      return {
        profile,
        active,
        events,
        castleLevel: castle[0]?.level ?? 0,
        alliancePower: BigInt(power ?? "0"),
      };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
export async function readHeroHistoryPresentation(
  db: Database["databases"]["global"]["db"],
  alliances: readonly string[],
  realms: readonly number[],
) {
  if (
    alliances.length > 100 ||
    realms.length > 100 ||
    alliances.some((id) => !id || id.length > 255) ||
    realms.some((id) => !Number.isInteger(id))
  )
    throw new Error("Invalid hero presentation query");
  return db.transaction(
    async (tx) => ({
      alliances: alliances.length
        ? await tx
            .select({
              allianceId: globalAlliance.allianceId,
              name: globalAlliance.alliancename,
              server: globalAlliance.serverId,
            })
            .from(globalAlliance)
            .where(inArray(globalAlliance.allianceId, [...alliances]))
        : [],
      realms: realms.length
        ? await tx
            .select({
              id: server_king_info.Id,
              name: server_king_info.name,
              banner: server_king_info.banner,
            })
            .from(server_king_info)
            .where(inArray(server_king_info.Id, [...realms]))
        : [],
    }),
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
