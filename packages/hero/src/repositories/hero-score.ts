import { and, asc, eq, gt, inArray, lte, sql } from "drizzle-orm";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { score_act_in } from "@opencok/drizzle/schema/opencok_kingdom/score_act_in";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { cityInteger } from "@opencok/rules/city-progression";
import { num, text } from "@opencok/contracts/rows";
import type { HeroScoreReader, HeroScoreWrite } from "@opencok/hero/contracts/hero-score";
import type { MutationTransaction } from "@opencok/repositories/mutation";

export function heroScoreReader(
  tx: MutationTransaction,
  owner: string,
  alliance: string,
): HeroScoreReader {
  return {
    async load(at) {
      const events = await tx
        .select()
        .from(hero_event)
        .where(
          and(
            lte(hero_event.startTime, at),
            gt(hero_event.endTime, at),
            eq(hero_event.rewardStatus, 0),
          ),
        )
        .orderBy(asc(hero_event.uuid))
        .limit(5);

      if (events.length > 4 || new Set(events.map((event) => event.type)).size !== events.length)
        {throw new Error("Ambiguous hero scoring events");}

      if (!events.length)
        {return { events, scores: [], contributions: [], members: [], alliancePower: 0n };}

      for (const event of events)
        {if (alliance && [2, 4].includes(event.type ?? 0))
          {await tx.execute(
            sql`select pg_advisory_xact_lock(728221,hashtext(${event.uuid + ":" + alliance}))`,
          );}}

      const ids = events.map((row) => row.uuid),
        scores = await tx
          .select()
          .from(score_act)
          .where(
            and(
              inArray(score_act.actId, ids),
              inArray(score_act.uid, alliance ? [owner, alliance] : [owner]),
            ),
          )
          .for("update");
      const contributions = alliance
        ? await tx
            .select()
            .from(score_act_in)
            .where(and(inArray(score_act_in.actId, ids), eq(score_act_in.allianceId, alliance)))
            .limit(4097)
        : [];
      const members = alliance
        ? await tx
            .select({ uid: alliance_member.uid })
            .from(alliance_member)
            .where(eq(alliance_member.allianceId, alliance))
            .limit(1025)
        : [];

      if (contributions.length > 4096 || members.length > 1024)
        {throw new Error("Hero alliance scoring bound exceeded");}

      const [power] = alliance
        ? await tx
            .select({ total: sql<string>`coalesce(sum(${playerinfo.power}),0)::text` })
            .from(playerinfo)
            .innerJoin(alliance_member, eq(alliance_member.uid, playerinfo.uid))
            .where(eq(alliance_member.allianceId, alliance))
        : [];

      return {
        events,
        scores,
        contributions,
        members: members.map((row) => row.uid),
        alliancePower: BigInt(power?.total ?? 0),
      };
    },
  };
}

export async function writeHeroScore(
  tx: MutationTransaction,
  owner: string,
  alliance: string,
  write: HeroScoreWrite,
) {
  if (write.scores.length > 4 || write.contributions.length > 4)
    {throw new Error("Hero score write bound exceeded");}

  for (const row of write.scores) {
    if (row.uid !== owner && (!alliance || row.uid !== alliance))
      {throw new Error("Foreign hero score write");}

    const score = num(row, "score");

    if (!Number.isInteger(score) || score < -2147483648 || score > 2147483647)
      {throw new Error("Invalid hero score");}

    const value = {
      uid: text(row, "uid"),
      actId: text(row, "actId"),
      level: cityInteger(row.level, 0, 4095),
      score,
      finishFlag: cityInteger(row.finishFlag, 0, 1),
      rewardFlag: text(row, "rewardFlag"),
    };
    await tx
      .insert(score_act)
      .values(value)
      .onConflictDoUpdate({ target: [score_act.uid, score_act.actId], set: value });
  }

  for (const row of write.contributions) {
    if (row.uid !== owner || !alliance || row.allianceId !== alliance)
      {throw new Error("Foreign hero contribution write");}

    const value = {
      uid: owner,
      allianceId: alliance,
      actId: text(row, "actId"),
      score: num(row, "score"),
    };

    if (!Number.isInteger(value.score) || value.score < -2147483648 || value.score > 2147483647)
      {throw new Error("Invalid hero contribution");}

    await tx
      .insert(score_act_in)
      .values(value)
      .onConflictDoUpdate({
        target: [score_act_in.uid, score_act_in.allianceId, score_act_in.actId],
        set: value,
      });
  }
}

export async function currentHeroScore(
  db: Pick<MutationTransaction, "select">,
  actId: string,
  member: string,
  score: number,
) {
  const [row] = await db
    .select({ score: score_act.score })
    .from(score_act)
    .where(and(eq(score_act.actId, actId), eq(score_act.uid, member)))
    .limit(1);

  return row?.score === score;
}
