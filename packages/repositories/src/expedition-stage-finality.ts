import { and, eq, lt, lte, sql } from "drizzle-orm";
import { expedition_manifest } from "@opencok/drizzle/schema/opencok_kingdom/expedition_manifest";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { expedition_stage_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_closure";
import { expedition_stage_member as members } from "@opencok/drizzle/schema/opencok_kingdom/expedition_stage_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { expeditionPhase } from "@opencok/rules/new-expedition";
import type {
  ExpeditionStagePeriod,
  ExpeditionStageRealm,
} from "@opencok/contracts/expedition-stage-finality";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import { pendingOwnedProgression } from "./progression-finality";
import type { Database } from "./game";
export { createExpeditionStageRegistry } from "./expedition-stage-finality-global";
export function createExpeditionStageRealm(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
): ExpeditionStageRealm {
  let archiveCursor: { end: bigint; id: string } | undefined,
    closureCursor: { end: bigint; id: string; stage: number } | undefined;
  const key = (row: Row) =>
    and(eq(closures.periodId, text(row, "periodId")), eq(closures.stage, num(row, "stage")));
  const owned = async (tx: Parameters<Parameters<typeof db.transaction>[0]>[0], row: Row) => {
    const [saved] = await tx.select().from(closures).where(key(row)).for("update");
    if (!saved) throw new Error("Missing owned expedition stage closure");
    return saved;
  };
  return {
    candidates(now) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const pending = await tx
          .select()
          .from(closures)
          .where(
            and(
              lt(closures.phase, 2),
              closureCursor
                ? sql`(${closures.endTime},${closures.periodId} collate "C",${closures.stage})>(${closureCursor.end},${closureCursor.id} collate "C",${closureCursor.stage})`
                : undefined,
            ),
          )
          .orderBy(closures.endTime, sql`${closures.periodId} collate "C"`, closures.stage)
          .limit(8);
        const last = pending.at(-1);
        closureCursor =
          pending.length === 8 && last
            ? { end: last.endTime, id: last.periodId, stage: last.stage }
            : undefined;
        const archives = await tx
          .select()
          .from(expedition_manifest)
          .where(
            and(
              eq(expedition_manifest.serverId, authority.kingdomId),
              lte(expedition_manifest.startTime, now - 300000n),
              archiveCursor
                ? sql`(${expedition_manifest.endTime},${expedition_manifest.periodId} collate "C")>(${archiveCursor.end},${archiveCursor.id} collate "C")`
                : undefined,
            ),
          )
          .orderBy(expedition_manifest.endTime, sql`${expedition_manifest.periodId} collate "C"`)
          .limit(8);
        const tail = archives.at(-1);
        archiveCursor =
          archives.length === 8 && tail ? { end: tail.endTime, id: tail.periodId } : undefined;
        const result = new Map<string, ExpeditionStagePeriod>();
        const manifests = new Map(archives.map((row) => [row.periodId, row]));
        for (const row of pending) {
          if (!manifests.has(row.periodId)) {
            const [manifest] = await tx
              .select()
              .from(expedition_manifest)
              .where(
                and(
                  eq(expedition_manifest.serverId, authority.kingdomId),
                  eq(expedition_manifest.periodId, row.periodId),
                ),
              )
              .limit(1);
            if (!manifest) throw new Error("Missing sealed expedition manifest");
            manifests.set(row.periodId, manifest);
          }
        }
        for (const manifest of manifests.values()) {
          const raw: unknown = JSON.parse(manifest.schedule);
          if (!Array.isArray(raw) || raw.length > 9)
            throw new Error("Invalid expedition phase archive");
          for (const item of raw) {
            const phase = expeditionPhase(manifest, BigInt(item.startTime));
            if (!phase || phase.endTime > now - 300000n) continue;
            const [prior] = await tx
              .select({ phase: closures.phase })
              .from(closures)
              .where(and(eq(closures.periodId, manifest.periodId), eq(closures.stage, phase.stage)))
              .limit(1);
            if (prior && prior.phase >= 2) continue;
            result.set(`${manifest.periodId}:${phase.stage}`, {
              periodId: manifest.periodId,
              stage: phase.stage,
              kingdomId: authority.kingdomId,
              opponent: manifest.matchServerId,
              startTime: phase.startTime,
              endTime: phase.endTime,
              activityEnd: manifest.endTime,
            });
          }
        }
        return [...result.values()];
      });
    },
    seal(period, now) {
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await fenceRealmTransaction(tx, authority, "update");
        await tx.execute(sql`select pg_advisory_xact_lock(728220,1)`);
        if (period.kingdomId !== authority.kingdomId || now < period.endTime + 300000n)
          throw new Error("Premature expedition stage seal");
        const [prior] = await tx
          .select()
          .from(closures)
          .where(key({ ...period }))
          .for("update");
        if (prior) {
          if (
            prior.opponent !== period.opponent ||
            prior.startTime !== period.startTime ||
            prior.endTime !== period.endTime
          )
            throw new Error("Conflicting expedition stage closure");
          return prior;
        }
        const [manifest] = await tx
          .select()
          .from(expedition_manifest)
          .where(
            and(
              eq(expedition_manifest.serverId, authority.kingdomId),
              eq(expedition_manifest.periodId, period.periodId),
            ),
          )
          .for("share");
        const phase = expeditionPhase(manifest, period.startTime);
        if (
          !manifest ||
          manifest.matchServerId !== period.opponent ||
          manifest.endTime !== period.activityEnd ||
          phase?.stage !== period.stage ||
          phase.endTime !== period.endTime
        )
          throw new Error("Unowned expedition stage closure");
        if (await pendingOwnedProgression(tx, authority.kingdomId, period.endTime, now)) return;
        await tx.execute(sql`insert into ${members}("periodId",stage,uid,score,"allianceId","takeReward",eligibility,metadata)
        select p."periodId",p.stage,p.uid,p.score,coalesce(u."allianceId",''),coalesce(p."takeReward",''),
          json_build_object('home',u.uid is not null,'level',coalesce((select max(b.level+coalesce(b.star,0)) from ${user_building} b where b.uid=p.uid and b."itemId"=400000),0),'sciences',coalesce((select json_agg(s."itemId" order by s."itemId" collate "C") from ${user_science} s where s.uid=p.uid and s.level>0),'[]'::json))::text,
          case when u.uid is null then null else json_build_object('name',coalesce(u.name,''),'pic',coalesce(u.pic,''),'picVer',coalesce(u."picVer",0),'picfraId',0,'abbr',coalesce(a.abbr,''),'serverId',${authority.kingdomId}::integer)::text end
        from ${expedition_progress} p left join ${userprofile} u on u.uid=p.uid left join ${alliance} a on a.uid=u."allianceId"
        where p."periodId"=${period.periodId} and p.stage=${period.stage} and (u.uid is null or (u."serverId"=${authority.kingdomId} and coalesce(u."crossFightSrcServerId",-1)<=0))`);
        const proof = await tx.execute<{ count: string; digest: string; total: number }>(
          sql`select count(*)::text as count,md5(coalesce(string_agg(length(uid)::text||':'||uid||':'||length("allianceId")::text||':'||"allianceId"||':'||encode(float8send(score),'hex'),'|' order by uid collate "C"),'')) as digest,coalesce(sum(score order by uid collate "C"),0)::float8 as total from ${members} where "periodId"=${period.periodId} and stage=${period.stage}`,
        );
        const value = proof.rows[0]!;
        if (BigInt(value.count) > 1000000n || !Number.isFinite(value.total))
          throw new Error("Expedition stage seal bound exceeded");
        const [closure] = await tx
          .insert(closures)
          .values({
            periodId: period.periodId,
            stage: period.stage,
            opponent: period.opponent,
            startTime: period.startTime,
            endTime: period.endTime,
            phase: 0,
            cursor: "",
            processed: 0n,
            scoreCount: BigInt(value.count),
            digest: value.digest,
            total: value.total,
            createdAt: now,
            winner: 0,
            finalizedAt: 0n,
          })
          .returning();
        authority.assertReady();
        return closure;
      });
    },
    page(closure) {
      return db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const [manifest] = await tx
          .select()
          .from(expedition_manifest)
          .where(
            and(
              eq(expedition_manifest.serverId, authority.kingdomId),
              eq(expedition_manifest.periodId, text(closure, "periodId")),
            ),
          )
          .limit(1);
        if (!manifest) throw new Error("Missing expedition upload manifest");
        const rows = await tx
          .select()
          .from(members)
          .where(
            and(
              eq(members.periodId, text(closure, "periodId")),
              eq(members.stage, num(closure, "stage")),
              sql`${members.uid} collate "C">${text(closure, "cursor")} collate "C"`,
            ),
          )
          .orderBy(sql`${members.uid} collate "C"`)
          .limit(64);
        return rows.map((row) => ({
          periodId: row.periodId,
          stage: row.stage,
          member: row.uid,
          kingdomId: authority.kingdomId,
          opponent: manifest.matchServerId,
          allianceId: row.allianceId,
          score: row.score,
          metadata: row.metadata,
          endTime: manifest.endTime,
        }));
      });
    },
    async advance(closure, cursor, processed) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, closure);
        if (
          row.phase !== 0 ||
          row.cursor !== text(closure, "cursor") ||
          row.processed !== long(closure, "processed") ||
          processed < row.processed ||
          processed > row.scoreCount ||
          Buffer.compare(Buffer.from(cursor), Buffer.from(row.cursor)) < 0
        )
          throw new Error("Stale expedition stage cursor");
        await tx.update(closures).set({ cursor, processed }).where(key(row));
      });
    },
    async reset(closure) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, closure);
        if (row.phase === 0)
          await tx.update(closures).set({ cursor: "", processed: 0n }).where(key(row));
      });
    },
    async completed(closure) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, closure);
        if (row.processed !== row.scoreCount) throw new Error("Incomplete expedition stage upload");
        if (row.phase === 0) await tx.update(closures).set({ phase: 1 }).where(key(row));
      });
    },
    async finished(closure, winner, now) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const row = await owned(tx, closure);
        if (
          row.phase < 1 ||
          ![authority.kingdomId, row.opponent].includes(winner) ||
          now < row.endTime
        )
          throw new Error("Invalid expedition stage result");
        if (row.phase >= 2) {
          if (row.winner !== winner) throw new Error("Conflicting expedition stage result");
          return;
        }
        await tx.update(closures).set({ phase: 2, winner, finalizedAt: now }).where(key(row));
      });
    },
  };
}
