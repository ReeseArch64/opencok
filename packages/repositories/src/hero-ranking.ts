import { and, asc, eq, gt } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import type { HeroRankingSnapshot } from "@opencok/contracts/hero-ranking";
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
