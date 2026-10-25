import { and, asc, desc, eq, sql } from "drizzle-orm";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { expedition_record } from "@opencok/drizzle/schema/opencok_kingdom/expedition_record";
import { king_tax_record } from "@opencok/drizzle/schema/opencok_kingdom/king_tax_record";
import { king_allot_tax_record } from "@opencok/drizzle/schema/opencok_kingdom/king_allot_tax_record";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import {
  expeditionFailure,
  expeditionPhase,
  expeditionSchedule,
} from "@opencok/rules/new-expedition";
import { cityInteger } from "@opencok/rules/city-progression";
import { text, num, type Row } from "@opencok/contracts/rows";
import type { ExpeditionManifest, ExpeditionState } from "@opencok/contracts/new-expedition";
import { decode, int } from "@opencok/messages/sfs";
import type { MutationTransaction } from "./mutation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export async function installExpeditionPeriod(
  tx: MutationTransaction,
  authority: RealmAuthority,
  manifest: ExpeditionManifest,
  authorize: (manifest: ExpeditionManifest) => Promise<boolean>,
) {
  await fenceRealmTransaction(tx, authority);
  if (manifest.serverId !== authority.kingdomId || !(await authorize(manifest)))
    expeditionFailure();
  const phases = expeditionSchedule(manifest);
  await tx.execute(sql`SELECT pg_advisory_xact_lock(60718, ${manifest.serverId})`);
  const [prior] = await tx
    .select()
    .from(expedition_period)
    .where(eq(expedition_period.serverId, manifest.serverId))
    .for("update");
  const schedule = JSON.stringify(
    phases.map((phase) => ({
      stage: phase.stage,
      startTime: String(phase.startTime),
      endTime: String(phase.endTime),
    })),
  );
  if (prior?.periodId === manifest.periodId) {
    if (prior.schedule !== schedule || prior.matchServerId !== manifest.matchServerId)
      expeditionFailure();
    return;
  }
  if (prior && manifest.startTime < prior.endTime) expeditionFailure();
  const value = {
    serverId: manifest.serverId,
    periodId: manifest.periodId,
    matchServerId: manifest.matchServerId,
    startTime: manifest.startTime,
    endTime: phases.at(-1)!.endTime,
    schedule,
    victoryTimes: prior?.victoryTimes ?? 0,
    count: (prior?.count ?? 0) + 1,
  };
  await tx
    .insert(expedition_period)
    .values(value)
    .onConflictDoUpdate({ target: expedition_period.serverId, set: value });
}
export async function readExpedition(
  tx: MutationTransaction,
  profile: Row,
  now: bigint,
  command?: string,
  request?: Uint8Array,
): Promise<ExpeditionState> {
  const owner = text(profile, "uid"),
    realm = num(profile, "serverId");
  const [period] = await tx
    .select()
    .from(expedition_period)
    .where(eq(expedition_period.serverId, realm))
    .for("share");
  const phase = expeditionPhase(period, now);
  const progress = !period
    ? []
    : await tx
        .select()
        .from(expedition_progress)
        .where(
          and(
            eq(expedition_progress.uid, owner),
            eq(expedition_progress.periodId, period.periodId),
          ),
        )
        .limit(10);
  if (progress.length > 9) expeditionFailure();
  let allianceScore = 0,
    kingdomScore = 0,
    rank = -1;
  if (
    (period && phase && command === "newexpidition.activityinfo") ||
    (period && phase && command === "newexpidition.takealliancereward")
  ) {
    const where = and(
      eq(expedition_progress.periodId, period.periodId),
      eq(expedition_progress.stage, phase.stage),
      eq(userprofile.serverId, realm),
    );
    const [total] = await tx
      .select({
        score: sql<number>`coalesce(sum(${expedition_progress.score}), 0)::float8`,
        alliance: sql<number>`coalesce(sum(${expedition_progress.score}) filter (where ${userprofile.allianceId} = ${text(profile, "allianceId")} and ${userprofile.allianceId} <> ''), 0)::float8`,
        higher: sql<number>`count(*) filter (where ${expedition_progress.score} > ${num(progress.find((row) => row.stage === phase.stage) ?? {}, "score")})::int`,
      })
      .from(expedition_progress)
      .innerJoin(userprofile, eq(userprofile.uid, expedition_progress.uid))
      .where(where);
    kingdomScore = Number(total?.score ?? 0);
    allianceScore = Number(total?.alliance ?? 0);
    rank = progress.some((row) => row.stage === phase.stage && row.score > 0)
      ? Number(total?.higher ?? 0) + 1
      : -1;
  }
  const state: ExpeditionState = { period, phase, progress, allianceScore, kingdomScore, rank };
  if (["expedition.show", "distribution.record.show", "tax.record.show"].includes(command ?? "")) {
    const params = request ? decode(Buffer.from(request)) : {};
    const offset = cityInteger(
      int(params, "currentCount", command === "expedition.show" ? 0 : -1),
      0,
      1000000,
    );
    if (command === "expedition.show")
      state.records = await tx
        .select()
        .from(expedition_record)
        .orderBy(desc(expedition_record.time), asc(expedition_record.uuid))
        .offset(offset)
        .limit(50);
    if (command === "tax.record.show")
      state.taxRecords = await tx
        .select()
        .from(king_tax_record)
        .orderBy(desc(king_tax_record.taxTime), asc(king_tax_record.uuid))
        .offset(offset)
        .limit(50);
    if (command === "distribution.record.show")
      state.distributions = await tx
        .select()
        .from(king_allot_tax_record)
        .orderBy(desc(king_allot_tax_record.sendTime), asc(king_allot_tax_record.uuid))
        .offset(offset)
        .limit(50);
  }
  return state;
}
export async function writeExpedition(
  tx: MutationTransaction,
  owner: string,
  rows: readonly Row[],
) {
  for (const row of rows) {
    if (row.uid !== owner || !Number.isFinite(num(row, "score")) || num(row, "score") < 0)
      expeditionFailure();
    const value = {
      uid: owner,
      periodId: text(row, "periodId"),
      stage: cityInteger(row.stage, 0, 8),
      score: num(row, "score"),
      takeReward: text(row, "takeReward"),
    };
    await tx
      .insert(expedition_progress)
      .values(value)
      .onConflictDoUpdate({
        target: [expedition_progress.uid, expedition_progress.periodId, expedition_progress.stage],
        set: { score: value.score, takeReward: value.takeReward },
      });
  }
}
