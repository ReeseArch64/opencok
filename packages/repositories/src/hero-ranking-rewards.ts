import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { hero_rank_award } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_award";
import { hero_rank_closure } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_closure";
import { hero_event_reward_record } from "@opencok/drizzle/schema/opencok_kingdom/hero_event_reward_record";
import { score_act_in } from "@opencok/drizzle/schema/opencok_kingdom/score_act_in";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_rank_period } from "@opencok/drizzle/schema/opencok_global/hero_rank_period";
import { hero_rank_watermark } from "@opencok/drizzle/schema/opencok_global/hero_rank_watermark";
import { hero_rank_score } from "@opencok/drizzle/schema/opencok_global/hero_rank_score";
import { heroRankAwardIdentity } from "@opencok/rules/hero-ranking-rewards";
import { cityInteger } from "@opencok/rules/city-progression";
import { long, num, text } from "@opencok/contracts/rows";
import type {
  HeroRankAwardReader,
  HeroRankAwardWrite,
  HeroRankRewardStore,
  HeroRankRewardStandings,
} from "@opencok/contracts/hero-ranking-rewards";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

export function heroRankAwardReader(tx: MutationTransaction, owner: string): HeroRankAwardReader {
  return {
    async load(id) {
      const [award] = await tx
        .select()
        .from(hero_rank_award)
        .where(and(eq(hero_rank_award.id, id), eq(hero_rank_award.ownerUid, owner)))
        .for("update");

      if (!award) return;

      const [record] =
        award.rewardId !== null
          ? await tx
              .select({ uid: hero_event_reward_record.uid })
              .from(hero_event_reward_record)
              .where(
                and(
                  eq(hero_event_reward_record.uid, owner),
                  [1, 3].includes(award.type)
                    ? or(
                        eq(hero_event_reward_record.allianceId, award.member),
                        eq(hero_event_reward_record.allianceId, ""),
                      )
                    : eq(hero_event_reward_record.allianceId, award.member),
                  eq(hero_event_reward_record.eventId, award.actId),
                ),
              )
              .limit(1)
          : [];

      return { award, recorded: !!record };
    },
  };
}

export async function writeHeroRankAward(
  tx: MutationTransaction,
  owner: string,
  write: HeroRankAwardWrite,
  now: bigint,
) {
  const [award] = await tx
    .select()
    .from(hero_rank_award)
    .where(
      and(
        eq(hero_rank_award.id, write.id),
        eq(hero_rank_award.ownerUid, owner),
        eq(hero_rank_award.deliveredAt, 0n),
      ),
    )
    .for("update");

  if (!award || award.createdAt > now)
    throw new Error("Invalid owned hero rank award acknowledgement");

  if (write.history) {
    const row = write.history;

    if (
      row.uid !== owner ||
      row.allianceId !== award.member ||
      row.eventId !== award.actId ||
      num(row, "rank") !== award.rank ||
      num(row, "level") !== award.level ||
      row.rewardId !== award.rewardId ||
      long(row, "time") !== now
    )
      throw new Error("Foreign hero rank reward history");

    const inserted = await tx
      .insert(hero_event_reward_record)
      .values({
        uid: owner,
        allianceId: award.member,
        eventId: award.actId,
        rank: award.rank,
        level: award.level,
        rewardId: award.rewardId,
        time: now,
      })
      .onConflictDoNothing()
      .returning({ uid: hero_event_reward_record.uid });

    if (inserted.length !== 1) throw new Error("Hero rank reward already recorded");
  }

  await tx
    .update(hero_rank_award)
    .set({ deliveredAt: now, nextAttemptAt: 0n })
    .where(eq(hero_rank_award.id, write.id));
}

export function createHeroRankRewardStore(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
): HeroRankRewardStore {
  let cursor: { end: bigint; id: string } | undefined;

  return {
    candidates() {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const rows = await tx
          .select()
          .from(hero_rank_closure)
          .where(
            and(
              eq(hero_rank_closure.phase, 2),
              eq(hero_rank_closure.eligible, 1),
              cursor
                ? sql`(${hero_rank_closure.endTime},${hero_rank_closure.periodId})>(${cursor.end},${cursor.id})`
                : undefined,
            ),
          )
          .orderBy(asc(hero_rank_closure.endTime), asc(hero_rank_closure.periodId))
          .limit(8);
        const last = rows.at(-1);
        cursor = rows.length === 8 && last ? { end: last.endTime, id: last.periodId } : undefined;

        return rows;
      });
    },
    async plan(closure, standing, create, now) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const [current] = await tx
          .select()
          .from(hero_rank_closure)
          .where(eq(hero_rank_closure.periodId, text(closure, "periodId")))
          .for("update");
        const member = text(standing, "member");

        if (
          !current ||
          current.phase !== 2 ||
          current.eligible !== 1 ||
          current.awardCursor !== text(closure, "awardCursor") ||
          current.actId !== text(standing, "actId") ||
          current.eventId !== text(standing, "eventId") ||
          current.type !== num(standing, "type") ||
          num(standing, "kingdomId") !== authority.kingdomId ||
          Buffer.compare(Buffer.from(member), Buffer.from(current.awardCursor)) <= 0 ||
          now < current.endTime
        )
          throw new Error("Invalid owned hero ranking award plan");

        const rank = cityInteger(standing.rank, 1, 5000),
          level = cityInteger(standing.level, 0, 4095);
        let owners: string[] = [];

        if (create) {
          const rows = [2, 4].includes(current.type)
            ? await tx
                .select({ uid: userprofile.uid })
                .from(score_act_in)
                .innerJoin(userprofile, eq(userprofile.uid, score_act_in.uid))
                .where(
                  and(
                    eq(score_act_in.actId, current.actId!),
                    eq(score_act_in.allianceId, member),
                    eq(userprofile.allianceId, member),
                    eq(userprofile.serverId, authority.kingdomId),
                  ),
                )
                .orderBy(asc(userprofile.uid))
                .limit(1025)
            : await tx
                .select({ uid: userprofile.uid })
                .from(userprofile)
                .where(
                  and(eq(userprofile.uid, member), eq(userprofile.serverId, authority.kingdomId)),
                )
                .limit(1);

          if (rows.length > 1024) throw new Error("Hero ranking recipient bound exceeded");

          owners = rows.map((row) => row.uid);
          const drafts = create(owners);

          if (
            drafts.length !== owners.length ||
            new Set(drafts.map((row) => row.ownerUid)).size !== drafts.length
          )
            throw new Error("Invalid hero ranking entitlement count");

          for (const draft of drafts)
            if (
              !owners.includes(draft.ownerUid) ||
              draft.id !== heroRankAwardIdentity(current.periodId, member, draft.ownerUid) ||
              Buffer.byteLength(draft.pinnedReward ?? "") > 65535 ||
              draft.contents.length > 40000
            )
              throw new Error("Foreign hero ranking entitlement");

          if (drafts.length)
            await tx
              .insert(hero_rank_award)
              .values(
                drafts.map((draft) => ({
                  ...draft,
                  contents: Buffer.from(draft.contents),
                  periodId: current.periodId,
                  actId: current.actId!,
                  member,
                  type: current.type,
                  rank,
                  level,
                  createdAt: now,
                  deliveredAt: 0n,
                  nextAttemptAt: 0n,
                })),
              )
              .onConflictDoNothing();
        }

        await tx
          .update(hero_rank_closure)
          .set({ awardCursor: member })
          .where(eq(hero_rank_closure.periodId, current.periodId));
        authority.assertReady();

        return owners.length;
      });
    },
    async finished(closure) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const updated = await tx
          .update(hero_rank_closure)
          .set({ phase: 3 })
          .where(
            and(
              eq(hero_rank_closure.periodId, text(closure, "periodId")),
              eq(hero_rank_closure.phase, 2),
              eq(hero_rank_closure.awardCursor, text(closure, "awardCursor")),
            ),
          )
          .returning({ id: hero_rank_closure.periodId });

        if (updated.length !== 1) throw new Error("Stale hero ranking award cursor");
      });
    },
    pending(now) {
      return db
        .select()
        .from(hero_rank_award)
        .where(and(eq(hero_rank_award.deliveredAt, 0n), lte(hero_rank_award.nextAttemptAt, now)))
        .orderBy(
          asc(hero_rank_award.nextAttemptAt),
          asc(hero_rank_award.createdAt),
          asc(hero_rank_award.id),
        )
        .limit(64);
    },
    async defer(id, now) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx
          .update(hero_rank_award)
          .set({ nextAttemptAt: now + 60000n })
          .where(and(eq(hero_rank_award.id, id), eq(hero_rank_award.deliveredAt, 0n)));
      });
    },
  };
}

export function createHeroRankRewardStandings(
  db: Database["databases"]["global"]["db"],
  kingdomId: number,
): HeroRankRewardStandings {
  return {
    async page(closure) {
      const [period] = await db
        .select()
        .from(hero_rank_period)
        .where(
          and(eq(hero_rank_period.id, text(closure, "periodId")), eq(hero_rank_period.state, 1)),
        )
        .limit(1);

      if (!period) return;

      const realms = period.expectedRealms.split("|").map((raw) => cityInteger(raw, 1));

      if (
        !realms.includes(kingdomId) ||
        period.type !== num(closure, "type") ||
        period.eventId !== text(closure, "eventId") ||
        period.endTime !== long(closure, "endTime") ||
        period.group !== text(closure, "group")
      )
        throw new Error("Foreign hero final ranking cohort");

      const [own] = await db
        .select()
        .from(hero_rank_watermark)
        .where(
          and(
            eq(hero_rank_watermark.periodId, period.id),
            eq(hero_rank_watermark.kingdomId, kingdomId),
            eq(hero_rank_watermark.state, 1),
          ),
        )
        .limit(1);

      if (
        !own ||
        own.eligible !== 1 ||
        own.actId !== closure.actId ||
        own.digest !== text(closure, "digest") ||
        own.scoreCount !== long(closure, "scoreCount")
      )
        return;

      const suffix = `_${period.group}_${BigInt.asIntN(32, period.endTime / 1000n)}`;
      const result = await db.execute<{
        member: string;
        kingdomId: number;
        actId: string;
        eventId: string;
        type: number;
        level: number;
        score: number;
        rank: number;
      }>(
        sql`select * from (select s.member,s."kingdomId",s."actId",s."eventId",s.type,s.level,s.score,row_number() over (partition by s.level order by s.score desc,s.member collate "C")::integer as rank from ${hero_rank_score} s join ${hero_rank_watermark} w on w."periodId"=${period.id} and w."kingdomId"=s."kingdomId" and w."actId"=s."actId" and w.state=1 where s.type=${period.type} and s."endTime"=${period.endTime} and s."eventId"=${period.eventId} and right(s."rankKey",length(${suffix}))=${suffix} and s."kingdomId" in (${sql.join(
          realms.map((realm) => sql`${realm}`),
          sql`, `,
        )})) ranked where ranked."kingdomId"=${kingdomId} and ranked.rank<=5000 and ranked.member collate "C">${text(closure, "awardCursor")} collate "C" order by ranked.member collate "C" limit 64`,
      );

      return result.rows;
    },
  };
}
