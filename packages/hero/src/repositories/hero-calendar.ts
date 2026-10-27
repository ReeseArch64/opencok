import { expedition_admission } from "@opencok/drizzle/schema/opencok_kingdom/expedition_admission";
import { and, asc, desc, eq, gt, or, sql } from "drizzle-orm";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { server_activity } from "@opencok/drizzle/schema/opencok_kingdom/server_activity";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { long, text } from "@opencok/contracts/rows";
import type { HeroCalendarStore } from "@opencok/hero/contracts/hero-calendar";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import type { Database } from "@opencok/repositories/game";

export function createHeroCalendarStore(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
): HeroCalendarStore {
  return {
    async reconcile(build) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        const at = BigInt(now()),
          activities = await tx
            .select()
            .from(hero_activity)
            .where(or(eq(hero_activity.finish, 0), gt(hero_activity.endTime, at - 604800000n)))
            .orderBy(asc(hero_activity.startTime), asc(hero_activity.uuid))
            .limit(4097)
            .for("update"),
          events = await tx
            .select()
            .from(hero_event)
            .where(gt(hero_event.endTime, at - 604800000n))
            .orderBy(asc(hero_event.readyTime), asc(hero_event.uuid))
            .limit(4097)
            .for("update");

        if (activities.length > 4096 || events.length > 4096)
          throw new Error("Hero calendar persisted bound exceeded");

        const [lord] = await tx
            .select()
            .from(server_activity)
            .orderBy(desc(server_activity.startTime))
            .limit(1),
          [expedition] = await tx
            .select()
            .from(expedition_period)
            .where(
              and(
                eq(expedition_period.serverId, authority.kingdomId),
                gt(expedition_period.endTime, at),
              ),
            )
            .limit(1);
        const [admission] = await tx
          .select({ id: expedition_admission.periodId })
          .from(expedition_admission)
          .where(
            and(eq(expedition_admission.appliedAt, 0n), gt(expedition_admission.activityEnd, at)),
          )
          .limit(1);
        const blocked =
          !!admission ||
          (!!lord &&
            long(lord, "startTime") < at &&
            (lord.endTime === null || long(lord, "endTime") > at)) ||
          (!!expedition && expedition.startTime <= at);
        const plan = build({ activities, events, blocked });

        if (plan.activities.length > 64 || plan.events.length > 64)
          throw new Error("Hero calendar write bound exceeded");

        for (const row of plan.activities) {
          const value = {
            uuid: text(row, "uuid"),
            activityId: text(row, "activityId"),
            activityType: cityInteger(row.activityType, 1, 3),
            startTime: cityAmount(row.startTime),
            roundTime: cityAmount(row.roundTime),
            endTime: cityAmount(row.endTime),
            finish: cityInteger(row.finish, 0, 1),
            alreadyEvent: text(row, "alreadyEvent"),
            serverGroup: row.serverGroup === null ? null : text(row, "serverGroup"),
            kingdomRank: row.kingdomRank === null ? null : text(row, "kingdomRank"),
          };

          if (
            value.uuid.length > 255 ||
            value.activityId.length > 100 ||
            value.alreadyEvent.length > 1000 ||
            value.endTime <= value.startTime ||
            value.roundTime <= 0n
          )
            throw new Error("Invalid hero calendar write");

          await tx
            .insert(hero_activity)
            .values(value)
            .onConflictDoUpdate({ target: hero_activity.uuid, set: value });
        }

        for (const row of plan.events) {
          const value = {
            uuid: text(row, "uuid"),
            eventId: text(row, "eventId"),
            activityId: text(row, "activityId"),
            type: cityInteger(row.type, 1, 4),
            rewardType: cityInteger(row.rewardType, 1, 4),
            readyTime: cityAmount(row.readyTime),
            startTime: cityAmount(row.startTime),
            lastTime: cityAmount(row.lastTime),
            endTime: cityAmount(row.endTime),
            rewardStatus: cityInteger(row.rewardStatus, 0, 1),
            serverGroup: row.serverGroup === null ? null : text(row, "serverGroup"),
            kingdomRank: row.kingdomRank === null ? null : text(row, "kingdomRank"),
          };
          await tx
            .insert(hero_event)
            .values(value)
            .onConflictDoUpdate({ target: hero_event.uuid, set: value });
        }
      });
    },
  };
}
