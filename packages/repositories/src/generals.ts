import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { and, asc, eq } from "drizzle-orm";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_buy } from "@opencok/drizzle/schema/opencok_kingdom/new_general_buy";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { GeneralWrite } from "@opencok/contracts/city-progression";
import type { MutationTransaction } from "./mutation";

export async function readGeneralRoster(tx: MutationTransaction, owner: string) {
  const generals = await tx
    .select()
    .from(new_general)
    .where(eq(new_general.uid, owner))
    .orderBy(asc(new_general.id))
    .limit(257);
  const purchases = await tx
    .select()
    .from(new_general_buy)
    .where(eq(new_general_buy.uid, owner))
    .limit(257);
  const offices = await tx.select().from(hero_office).where(eq(hero_office.uid, owner)).limit(257);
  const skills = await tx
    .select()
    .from(new_general_skill)
    .where(eq(new_general_skill.uid, owner))
    .limit(4097);
  const statuses = await tx
    .select()
    .from(new_general_status)
    .where(eq(new_general_status.uid, owner))
    .limit(4097);
  if (
    generals.length > 256 ||
    purchases.length > 256 ||
    offices.length > 256 ||
    skills.length > 4096 ||
    statuses.length > 4096
  )
    throw new Error("General aggregate exceeds bound");
  return { generals, purchases, offices, skills, statuses };
}
function owned(row: Row, owner: string) {
  if (row.uid !== owner) throw new Error("Foreign general mutation");
}
function integer(row: Row, key: string, max = 2147483647) {
  const value = num(row, key);
  if (!Number.isInteger(value) || value < 0 || value > max)
    throw new Error("Invalid general quantity");
  return value;
}
function bounded(row: Row, key: string, limit: number) {
  const value = text(row, key);
  if (value.length > limit) throw new Error("Oversized general value");
  return value;
}
export async function writeGeneralRoster(
  tx: MutationTransaction,
  owner: string,
  write: GeneralWrite,
  now: bigint,
) {
  if (write.refinementPeriod) {
    const value = {
      generalRefineCount: write.refinementPeriod.count,
      generalRefineTime: write.refinementPeriod.time,
    };
    if (
      !Number.isInteger(value.generalRefineCount) ||
      value.generalRefineCount < 0 ||
      value.generalRefineCount > 10000 ||
      value.generalRefineTime !== now
    )
      throw new Error("Invalid refinement period");
    await tx
      .insert(user_mixed_info)
      .values({ uid: owner, mdata: "", ...value })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: value });
  }
  for (const status of write.deletedStatuses ?? [])
    await tx
      .delete(new_general_status)
      .where(
        and(
          eq(new_general_status.uid, owner),
          eq(new_general_status.newGeneralId, status.generalId),
          eq(new_general_status.stateId, status.stateId),
        ),
      );
  for (const acceleration of write.accelerations ?? []) {
    if (
      ![6, 11].includes(acceleration.type) ||
      acceleration.milliseconds <= 0n ||
      acceleration.milliseconds > 315360000000n
    )
      throw new Error("Invalid general queue acceleration");
    const active = await tx
      .select()
      .from(timed_activity)
      .where(
        and(
          eq(timed_activity.ownerId, owner),
          eq(timed_activity.type, acceleration.type),
          eq(timed_activity.status, 0),
        ),
      )
      .limit(2);
    if (active.length > 1) throw new Error("Ambiguous general queue acceleration");
    if (active[0]) {
      const activity = active[0],
        dueAt =
          activity.dueAt - acceleration.milliseconds > now
            ? activity.dueAt - acceleration.milliseconds
            : now;
      if (activity.startedAt > now || activity.dueAt <= now)
        throw new Error("Unreconciled general queue");
      await tx
        .update(timed_activity)
        .set({ dueAt, version: activity.version + 1 })
        .where(
          and(
            eq(timed_activity.id, activity.id),
            eq(timed_activity.ownerId, owner),
            eq(timed_activity.version, activity.version),
            eq(timed_activity.status, 0),
          ),
        );
      await tx
        .update(queue)
        .set({ updateTime: dueAt })
        .where(and(eq(queue.uuid, activity.queueId), eq(queue.ownerId, owner)));
    }
  }
  for (const row of write.generals ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      id: integer(row, "id"),
      exp: integer(row, "exp"),
      level: integer(row, "level"),
      quality: integer(row, "quality"),
      talentpoint: integer(row, "talentpoint"),
      state: integer(row, "state", 6),
      predatoruid: bounded(row, "predatoruid", 96),
      relivetime: long(row, "relivetime"),
      buildingUuid: bounded(row, "buildingUuid", 96),
      skillInfo: bounded(row, "skillInfo", 6000),
      createtime: long(row, "createtime"),
      talent: bounded(row, "talent", 5000),
      serverid: integer(row, "serverid"),
      robtime: long(row, "robtime"),
      killtime: long(row, "killtime"),
      gethomttime: long(row, "gethomttime"),
      optime: bounded(row, "optime", 200),
      refineproperty: bounded(row, "refineproperty", 300),
      oldrefineproperty: bounded(row, "oldrefineproperty", 300),
      refinegold: integer(row, "refinegold"),
      refinecard: integer(row, "refinecard"),
      refinecount: integer(row, "refinecount"),
      lockproperty: bounded(row, "lockproperty", 60),
      refreshproperty: bounded(row, "refreshproperty", 300),
      breach: bounded(row, "breach", 128),
      star: integer(row, "star", 5),
      baseSkill: bounded(row, "baseSkill", 256),
    };
    if (value.id === 0 || value.level === 0 || value.star === 0)
      throw new Error("Invalid general progression");
    await tx
      .insert(new_general)
      .values(value)
      .onConflictDoUpdate({ target: [new_general.id, new_general.uid], set: value });
  }
  for (const row of write.purchases ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      generalId: integer(row, "generalId"),
      countType1: integer(row, "countType1"),
      countType2: integer(row, "countType2"),
      countType3: integer(row, "countType3"),
      countType4: integer(row, "countType4"),
    };
    await tx
      .insert(new_general_buy)
      .values(value)
      .onConflictDoUpdate({ target: [new_general_buy.uid, new_general_buy.generalId], set: value });
  }
  for (const row of write.offices ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      id: integer(row, "id"),
      officeId: bounded(row, "officeId", 40),
      position: integer(row, "position", 20),
      startTime: long(row, "startTime"),
      lastRefreshExpTime: long(row, "lastRefreshExpTime"),
    };
    await tx
      .insert(hero_office)
      .values(value)
      .onConflictDoUpdate({ target: [hero_office.id, hero_office.uid], set: value });
  }
  for (const row of write.skills ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      newGeneralId: integer(row, "newGeneralId"),
      skillId: bounded(row, "skillId", 60),
      startTime: long(row, "startTime"),
      actTime: long(row, "actTime"),
      endTime: long(row, "endTime"),
      stat: integer(row, "stat", 3),
    };
    if (value.endTime < value.startTime || value.actTime < value.startTime)
      throw new Error("Invalid general cooldown");
    await tx
      .insert(new_general_skill)
      .values(value)
      .onConflictDoUpdate({
        target: [new_general_skill.uid, new_general_skill.newGeneralId, new_general_skill.skillId],
        set: value,
      });
  }
  for (const row of write.statuses ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      newGeneralId: integer(row, "newGeneralId"),
      stateId: integer(row, "stateId"),
      startTime: long(row, "startTime"),
      endTime: long(row, "endTime"),
    };
    if (value.endTime < value.startTime) throw new Error("Invalid general status");
    await tx
      .insert(new_general_status)
      .values(value)
      .onConflictDoUpdate({
        target: [
          new_general_status.uid,
          new_general_status.newGeneralId,
          new_general_status.stateId,
        ],
        set: value,
      });
  }
}
