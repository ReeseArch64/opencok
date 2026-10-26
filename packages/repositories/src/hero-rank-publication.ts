import { hero_rank_watermark } from "@opencok/drizzle/schema/opencok_global/hero_rank_watermark";
import { and, asc, eq, gte, inArray, lte, or, gt, sql } from "drizzle-orm";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { hero_rank_owner } from "@opencok/drizzle/schema/opencok_global/hero_rank_owner";
import { hero_rank_score } from "@opencok/drizzle/schema/opencok_global/hero_rank_score";
import type { HeroRankProjection, HeroRankSource } from "@opencok/contracts/hero-rank-publication";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { Database } from "./game";
export function createHeroRankSource(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
): HeroRankSource {
  return {
    page(cursor, now) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const rows = await tx
          .select({ event: hero_event, score: score_act })
          .from(score_act)
          .innerJoin(hero_event, eq(hero_event.uuid, score_act.actId))
          .where(
            and(
              gte(hero_event.endTime, now - 864000000n),
              lte(hero_event.startTime, now),
              inArray(hero_event.type, [1, 2, 3, 4]),
              cursor
                ? or(
                    gt(score_act.actId, cursor.actId),
                    and(eq(score_act.actId, cursor.actId), gt(score_act.uid, cursor.member)),
                  )
                : undefined,
            ),
          )
          .orderBy(asc(score_act.actId), asc(score_act.uid))
          .limit(64);
        const guilds = rows
            .filter((row) => [2, 4].includes(row.event.type ?? 0))
            .map((row) => row.score.uid),
          metadata = guilds.length
            ? await tx
                .select({
                  uid: alliance.uid,
                  name: alliance.alliancename,
                  abbr: alliance.abbr,
                  icon: alliance.icon,
                })
                .from(alliance)
                .where(inArray(alliance.uid, guilds))
            : [];
        authority.assertReady();
        return rows.map((row) => ({
          ...row,
          metadata: [2, 4].includes(row.event.type ?? 0)
            ? (() => {
                const guild = metadata.find((guild) => guild.uid === row.score.uid);
                return guild ? JSON.stringify({ ...guild, server: authority.kingdomId }) : null;
              })()
            : null,
        }));
      });
    },
  };
}
export function createHeroRankProjection(
  db: Database["databases"]["global"]["db"],
  authority: RealmAuthority,
): HeroRankProjection {
  return {
    async write(rows, observedAt) {
      authority.assertReady();
      cityAmount(observedAt);
      if (
        !rows.length ||
        rows.length > 64 ||
        new Set(rows.map((row) => `${row.rankKey}:${row.member}`)).size !== rows.length
      )
        throw new Error("Invalid hero rank publication batch");
      for (const row of rows) {
        if (
          row.kingdomId !== authority.kingdomId ||
          !row.member ||
          row.member.length > 40 ||
          !row.actId ||
          row.actId.length > 40 ||
          !row.eventId ||
          row.eventId.length > 200 ||
          !/^(HERO_PERSON_RANK|HERO_ALLIANCE_RANK|KINGDOM_PERSON_RANK|KINGDOM_ALLIANCE_RANK)_\d+_[0-9|]+_-?\d+$/.test(
            row.rankKey,
          ) ||
          row.rankKey.length > 400 ||
          !Number.isInteger(row.score) ||
          row.score < -2147483648 ||
          row.score > 2147483647 ||
          (row.metadata !== null && Buffer.byteLength(row.metadata) > 8192)
        )
          throw new Error("Invalid owned hero rank score");
        cityInteger(row.type, 1, 4);
        cityInteger(row.level, 0, 4095);
        cityAmount(row.endTime);
      }
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`set local statement_timeout='3s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728223,${authority.kingdomId})`);
        let [owner] = await tx
          .select()
          .from(hero_rank_owner)
          .where(eq(hero_rank_owner.kingdomId, authority.kingdomId))
          .for("update");
        if (
          owner &&
          (owner.ownerEpoch > authority.epoch ||
            (owner.ownerEpoch === authority.epoch && owner.instanceId !== authority.instance))
        )
          throw new Error("Stale global hero rank owner");
        if (!owner) {
          [owner] = await tx
            .insert(hero_rank_owner)
            .values({
              kingdomId: authority.kingdomId,
              ownerEpoch: authority.epoch,
              instanceId: authority.instance,
              sequence: 0n,
            })
            .returning();
        } else if (owner.ownerEpoch < authority.epoch) {
          [owner] = await tx
            .update(hero_rank_owner)
            .set({ ownerEpoch: authority.epoch, instanceId: authority.instance, sequence: 0n })
            .where(eq(hero_rank_owner.kingdomId, authority.kingdomId))
            .returning();
        }
        if (!owner) throw new Error("Missing global hero rank owner");
        const [version] = await tx
          .update(hero_rank_owner)
          .set({ sequence: sql`${hero_rank_owner.sequence}+1` })
          .where(eq(hero_rank_owner.kingdomId, authority.kingdomId))
          .returning();
        if (!version) throw new Error("Missing hero rank publication version");
        const seals = await tx
          .select({ actId: hero_rank_watermark.actId })
          .from(hero_rank_watermark)
          .where(
            and(
              eq(hero_rank_watermark.kingdomId, authority.kingdomId),
              eq(hero_rank_watermark.state, 1),
              inArray(
                hero_rank_watermark.actId,
                rows.map((row) => row.actId),
              ),
            ),
          );
        const closed = new Set(seals.map((row) => row.actId)),
          sealed = rows.filter((row) => closed.has(row.actId)),
          open = rows.filter((row) => !closed.has(row.actId));
        const existing = sealed.length
          ? await tx
              .select()
              .from(hero_rank_score)
              .where(
                or(
                  ...sealed.map((row) =>
                    and(
                      eq(hero_rank_score.rankKey, row.rankKey),
                      eq(hero_rank_score.member, row.member),
                    ),
                  ),
                ),
              )
          : [];
        if (existing.some((row) => row.kingdomId !== authority.kingdomId))
          throw new Error("Foreign sealed hero ranking member");
        const preserved = existing.map((row) => ({
          ...row,
          metadata:
            sealed.find(
              (request) => request.rankKey === row.rankKey && request.member === row.member,
            )?.metadata ?? row.metadata,
        }));
        const values = [...open, ...preserved]
          .toSorted(
            (a, b) => a.rankKey.localeCompare(b.rankKey) || a.member.localeCompare(b.member),
          )
          .map((row) => ({
            ...row,
            ownerEpoch: version.ownerEpoch,
            sequence: version.sequence,
            observedAt,
          }));
        if (!values.length) return [];
        const result = await tx
          .insert(hero_rank_score)
          .values(values)
          .onConflictDoUpdate({
            target: [hero_rank_score.rankKey, hero_rank_score.member],
            set: {
              actId: sql`excluded."actId"`,
              eventId: sql`excluded."eventId"`,
              type: sql`excluded."type"`,
              level: sql`excluded."level"`,
              endTime: sql`excluded."endTime"`,
              score: sql`excluded."score"`,
              metadata: sql`excluded."metadata"`,
              ownerEpoch: sql`excluded."ownerEpoch"`,
              sequence: sql`excluded."sequence"`,
              observedAt: sql`excluded."observedAt"`,
            },
            setWhere: eq(hero_rank_score.kingdomId, authority.kingdomId),
          })
          .returning();
        if (result.length !== values.length) throw new Error("Foreign hero rank member ownership");
        authority.assertReady();
        return result;
      });
    },
  };
}
