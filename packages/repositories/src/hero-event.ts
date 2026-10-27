import { server_activity } from "@opencok/drizzle/schema/opencok_kingdom/server_activity";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { long } from "@opencok/contracts/rows";
import { and, asc, desc, eq, gt, inArray, or, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import type { HeroEventSelection, HeroEventSnapshot } from "@opencok/contracts/hero-event";
import type { Database } from "./game";

export async function readHeroEvents(
  db: Database["kingdom"]["db"],
  owner: string,
  selection: HeroEventSelection,
  now: number,
): Promise<HeroEventSnapshot> {
  if (
    !owner ||
    owner.length > 40 ||
    !Number.isSafeInteger(now) ||
    [selection.activityId, selection.eventId].some(
      (id) => id !== undefined && (!id || id.length > 255),
    )
  )
    throw new Error("Invalid hero event selection");

  return db.transaction(
    async (tx) => {
      const [profile] = await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            crossFightSrcServerId: userprofile.crossFightSrcServerId,
            allianceId: userprofile.allianceId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, owner))
          .limit(1),
        empty = {
          profile,
          activities: [],
          events: [],
          scores: [],
          castleLevel: 0,
          alliancePower: 0n,
          scoreManagerRunning: false,
          lastMergeMillis: 0n,
        };

      if (!profile) return empty;

      const [lord] = await tx
          .select()
          .from(server_activity)
          .orderBy(desc(server_activity.startTime))
          .limit(1),
        [server] = await tx
          .select()
          .from(server_info)
          .where(eq(server_info.uid, "server"))
          .limit(1);
      empty.scoreManagerRunning =
        !!lord &&
        long(lord, "startTime") < BigInt(now) &&
        (lord.endTime === null || long(lord, "endTime") > BigInt(now));
      empty.lastMergeMillis = long(server ?? {}, "lastMergeMillis");
      let activityId = selection.activityId;

      if (selection.eventId) {
        const [event] = await tx
          .select({ activity: hero_activity.activityId })
          .from(hero_event)
          .innerJoin(hero_activity, eq(hero_activity.uuid, hero_event.activityId))
          .where(
            and(
              eq(hero_event.uuid, selection.eventId),
              eq(hero_activity.finish, 0),
              gt(hero_activity.endTime, BigInt(now)),
              gt(hero_event.endTime, BigInt(now)),
            ),
          )
          .limit(1);

        if (!event) return empty;

        activityId = event.activity;
      }

      const activities = await tx
        .select()
        .from(hero_activity)
        .where(
          and(
            activityId ? eq(hero_activity.activityId, activityId) : undefined,
            eq(hero_activity.finish, 0),
            gt(hero_activity.endTime, BigInt(now)),
          ),
        )
        .orderBy(asc(hero_activity.startTime), asc(hero_activity.uuid))
        .limit(257);

      if (
        activities.length > 256 ||
        new Set(activities.map((row) => row.activityId)).size !== activities.length
      )
        throw new Error("Ambiguous hero activity");

      if (!activities.length || selection.panels) return { ...empty, activities };

      const events = await tx
        .select()
        .from(hero_event)
        .where(
          and(
            inArray(
              hero_event.activityId,
              activities.map((row) => row.uuid),
            ),
            selection.eventId ? eq(hero_event.uuid, selection.eventId) : undefined,
            gt(hero_event.endTime, BigInt(now)),
          ),
        )
        .orderBy(asc(hero_event.readyTime), asc(hero_event.uuid))
        .limit(257);

      if (events.length > 256) throw new Error("Hero event bound exceeded");

      const scores = events.length
        ? await tx
            .select()
            .from(score_act)
            .where(
              and(
                inArray(
                  score_act.actId,
                  events.map((row) => row.uuid),
                ),
                or(
                  eq(score_act.uid, owner),
                  profile.allianceId ? eq(score_act.uid, profile.allianceId) : undefined,
                ),
              ),
            )
            .limit(513)
        : [];

      if (scores.length > 512) throw new Error("Hero owned score bound exceeded");

      const [castle] = await tx
        .select({ level: user_building.level })
        .from(user_building)
        .where(and(eq(user_building.uid, owner), eq(user_building.itemId, 400000)))
        .limit(2);
      const [power] = profile.allianceId
        ? await tx
            .select({ total: sql<string>`coalesce(sum(${playerinfo.power}),0)::text` })
            .from(alliance_member)
            .innerJoin(playerinfo, eq(playerinfo.uid, alliance_member.uid))
            .where(eq(alliance_member.allianceId, profile.allianceId))
        : [];

      return {
        ...empty,
        activities,
        events,
        scores,
        castleLevel: castle?.level ?? 0,
        alliancePower: BigInt(power?.total ?? 0),
      };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
