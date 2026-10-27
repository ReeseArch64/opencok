import { and, asc, eq, sql, gt } from "drizzle-orm";
import { activity_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/activity_group_buys";
import { alliance_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/alliance_group_buys";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { groupBuyId, groupBuyRounds } from "@opencok/rules/groupbuy";
import { long, text } from "@opencok/contracts/rows";
import type { GroupBuyState, GroupBuyWrite } from "@opencok/contracts/groupbuy";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

export async function readGroupBuy(tx: MutationTransaction, owner: string): Promise<GroupBuyState> {
  const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));

  return {
    openedAt: long(server ?? {}, "activityTime"),
    async load(period, round) {
      cityInteger(round, 1, 31);
      await tx.execute(sql`set local lock_timeout='1s'`);
      await tx.execute(sql`select pg_advisory_xact_lock(728217,1)`);
      const activities = await tx
        .select()
        .from(activity_group_buys)
        .where(
          "id" in period
            ? eq(activity_group_buys.id, period.id)
            : and(
                eq(activity_group_buys.startTime, period.start),
                eq(activity_group_buys.endTime, period.end),
              ),
        )
        .limit(2)
        .for("update");

      if (activities.length > 1) {throw new Error("Ambiguous group-buy period");}

      let activity = activities[0];

      if (!activity && !("id" in period)) {
        [activity] = await tx
          .insert(activity_group_buys)
          .values({
            id: groupBuyId(period),
            startTime: period.start,
            endTime: period.end,
            curRound: round,
            roundInfo: JSON.stringify(period.rounds),
          })
          .returning();
      }

      if (!activity) {throw new Error("Missing group-buy activity");}

      const rounds = groupBuyRounds(activity.roundInfo);

      if (!rounds[round - 1]) {throw new Error("Missing group-buy round");}

      const selection = and(
        eq(alliance_group_buys.id, activity.id),
        eq(alliance_group_buys.round, round),
      );
      const [record] = await tx
        .select()
        .from(alliance_group_buys)
        .where(and(selection, eq(alliance_group_buys.uid, owner)))
        .for("update");
      const [sum] = await tx
        .select({
          total: sql<string>`coalesce(sum(${alliance_group_buys.point}),0)::text`,
          pending: sql<boolean>`coalesce(bool_or(${alliance_group_buys.info} ~ '(^|[|])[a-f0-9]{64}:[0-9]+:[0-9]+:[0-9]+:0([|]|$)'),false)`,
        })
        .from(alliance_group_buys)
        .where(selection);
      const recent = await tx
        .select()
        .from(alliance_group_buys)
        .where(and(selection, gt(alliance_group_buys.point, 0)))
        .orderBy(asc(alliance_group_buys.buyTime), asc(alliance_group_buys.uid))
        .limit(11);

      return {
        activity,
        rounds,
        record,
        total: cityInteger(sum?.total ?? 0),
        pending: sum?.pending ?? false,
        recent,
      };
    },
  };
}

export async function writeGroupBuy(tx: MutationTransaction, owner: string, write: GroupBuyWrite) {
  const activity = write.activity,
    id = text(activity, "id"),
    rounds = groupBuyRounds(activity.roundInfo);

  if (!id || id.length > 40) {throw new Error("Invalid group-buy identity");}

  await tx
    .update(activity_group_buys)
    .set({
      curRound: cityInteger(activity.curRound, 0, rounds.length),
      roundInfo: JSON.stringify(rounds),
    })
    .where(eq(activity_group_buys.id, id));

  if (!write.record) {return;}

  const row = write.record;

  if (
    row.uid !== owner ||
    row.id !== id ||
    text(row, "name").length > 40 ||
    text(row, "allianceId").length > 40 ||
    text(row, "info").length > 1000
  )
    {throw new Error("Invalid group-buy owner");}

  const value = {
    id,
    uid: owner,
    round: cityInteger(row.round, 1, rounds.length),
    name: text(row, "name"),
    allianceId: text(row, "allianceId"),
    point: cityInteger(row.point, 0, 128),
    buyTime: cityAmount(row.buyTime),
    info: text(row, "info"),
    reward: cityInteger(row.reward, 0, cityInteger(row.point, 0, 128)),
  };
  await tx
    .insert(alliance_group_buys)
    .values(value)
    .onConflictDoUpdate({
      target: [alliance_group_buys.id, alliance_group_buys.uid, alliance_group_buys.round],
      set: value,
    });
}

export async function pendingGroupBuys(
  db: Database["kingdom"]["db"],
  after?: { id: string; round: number; owner: string },
) {
  const rows = await db
    .select({
      owner: alliance_group_buys.uid,
      id: alliance_group_buys.id,
      round: alliance_group_buys.round,
      roundInfo: activity_group_buys.roundInfo,
      start: activity_group_buys.startTime,
      end: activity_group_buys.endTime,
    })
    .from(alliance_group_buys)
    .innerJoin(activity_group_buys, eq(activity_group_buys.id, alliance_group_buys.id))
    .where(
      and(
        sql`coalesce(${alliance_group_buys.point},0) > coalesce(${alliance_group_buys.reward},0)`,
        sql`(${activity_group_buys.roundInfo}::jsonb -> (${alliance_group_buys.round} - 1) ->> 'flag') = '1'`,
        after
          ? sql`(${alliance_group_buys.id},${alliance_group_buys.round},${alliance_group_buys.uid}) > (${after.id},${after.round},${after.owner})`
          : undefined,
      ),
    )
    .orderBy(
      asc(alliance_group_buys.id),
      asc(alliance_group_buys.round),
      asc(alliance_group_buys.uid),
    )
    .limit(64);

  return rows;
}
