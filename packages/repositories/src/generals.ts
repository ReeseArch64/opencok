import { alias } from "drizzle-orm/pg-core";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_gold_wheel } from "@opencok/drizzle/schema/opencok_kingdom/user_gold_wheel";
import { tavern } from "@opencok/drizzle/schema/opencok_kingdom/tavern";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { writeGeneralWorldResources } from "./general-world";
import type { GeneralRankingWeights } from "@opencok/contracts/city-progression";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { and, asc, desc, eq, sql, inArray, exists } from "drizzle-orm";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_buy } from "@opencok/drizzle/schema/opencok_kingdom/new_general_buy";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { GeneralWrite } from "@opencok/contracts/city-progression";
import type { MutationTransaction } from "./mutation";

export async function readGeneralRoster(
  tx: MutationTransaction,
  owner: string,
  command?: string,
  ranking?: GeneralRankingWeights,
) {
  const generals = await tx
    .select()
    .from(new_general)
    .where(eq(new_general.uid, owner))
    .orderBy(asc(new_general.id))
    .limit(257)
    .for("update");
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

  const drawHistory =
    command === "generaltrun"
      ? (
          await tx
            .select({ payload: mutation_outbox.payload })
            .from(mutation_outbox)
            .where(
              and(
                eq(mutation_outbox.ownerUid, owner),
                eq(mutation_outbox.eventType, "generaltrun"),
              ),
            )
            .orderBy(desc(mutation_outbox.createdAt), desc(mutation_outbox.requestId))
            .limit(50)
        ).map((row) => row.payload)
      : [];
  const [wheel] =
    command === "herodraw"
      ? await tx.select().from(user_gold_wheel).where(eq(user_gold_wheel.uid, owner))
      : [];
  const [savedTavern] = command?.startsWith("general.")
    ? await tx.select().from(tavern).where(eq(tavern.uid, owner))
    : [];
  let wheelRanks: Row[] = [];

  if (ranking) {
    for (const weight of [ranking.normal, ranking.silver, ranking.gold])
      if (!Number.isInteger(weight) || weight < 0 || weight > 2147483647)
        throw new Error("Invalid draw ranking weights");

    const score = sql`(${user_gold_wheel.normal_total}::bigint * ${ranking.normal} + ${user_gold_wheel.silver_total}::bigint * ${ranking.silver} + ${user_gold_wheel.gold_total}::bigint * ${ranking.gold})`;
    wheelRanks = await tx
      .select({
        uid: user_gold_wheel.uid,
        name: userprofile.name,
        serverId: userprofile.serverId,
        hide_king: user_gold_wheel.hide_king,
        normal_total: user_gold_wheel.normal_total,
        silver_total: user_gold_wheel.silver_total,
        gold_total: user_gold_wheel.gold_total,
        normal_last_free_millis: user_gold_wheel.normal_last_free_millis,
        silver_last_free_millis: user_gold_wheel.silver_last_free_millis,
        last_normal_wheel_millis: user_gold_wheel.last_normal_wheel_millis,
      })
      .from(user_gold_wheel)
      .innerJoin(userprofile, eq(userprofile.uid, user_gold_wheel.uid))
      .where(
        sql`greatest(${user_gold_wheel.normal_last_free_millis}, ${user_gold_wheel.silver_last_free_millis}, ${user_gold_wheel.last_normal_wheel_millis}) >= ${ranking.periodStart ?? 0n}`,
      )
      .orderBy(desc(score), asc(user_gold_wheel.last_normal_wheel_millis), asc(user_gold_wheel.uid))
      .limit(1000);
  }

  const captive = alias(new_general, "captured_general");
  const prisoners =
    command === "robgeneral"
      ? (
          await tx
            .select({
              general: captive,
              ownername: userprofile.name,
              alliancename: alliance.abbr,
            })
            .from(captive)
            .innerJoin(userprofile, eq(userprofile.uid, captive.uid))
            .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
            .where(
              and(
                eq(userprofile.serverId, captive.serverid),
                eq(captive.predatoruid, owner),
                eq(captive.state, 4),
                exists(
                  tx
                    .select({ id: userprofile.uid })
                    .from(userprofile)
                    .where(
                      and(eq(userprofile.uid, owner), eq(userprofile.serverId, captive.serverid)),
                    ),
                ),
              ),
            )
            .limit(257)
            .for("update", { of: captive })
        ).map((row) => ({
          ...row.general,
          ownername: row.ownername,
          alliancename: row.alliancename,
        }))
      : [];

  if (prisoners.length > 256) throw new Error("Oversized prison");

  const graves = prisoners.length
    ? await tx
        .select()
        .from(user_building)
        .where(
          and(
            inArray(
              user_building.uid,
              prisoners.map((row) => row.uid),
            ),
            eq(user_building.itemId, 435000),
          ),
        )
        .limit(257)
    : [];
  const prisonerRows = prisoners.map((row) => {
    const grave = graves.find((grave) => grave.uid === row.uid);

    return {
      ...row,
      graveLevel: grave?.level ?? 0,
      graveStar: grave?.star ?? 0,
      graveProgress: grave?.progress ?? 0,
    };
  });
  const marches =
    command === "general.init"
      ? await tx
          .select({
            ownerUid: world_march.ownerUid,
            armyInfo: world_march.armyInfo,
            worldId: world_march.worldId,
          })
          .from(world_march)
          .where(eq(world_march.ownerUid, owner))
          .limit(257)
      : [];

  if (marches.length > 256) throw new Error("Oversized general march set");

  return {
    generals,
    purchases,
    offices,
    skills,
    statuses,
    drawHistory,
    wheel,
    wheelRanks,
    tavern: savedTavern,
    prisoners: prisonerRows,
    marches,
  };
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
  await writeGeneralWorldResources(tx, write.worldResources ?? [], now);

  if (write.wheel) {
    owned(write.wheel, owner);
    const row = write.wheel,
      value = {
        uid: owner,
        ...Object.fromEntries(
          [
            "hide_king",
            "normal_free",
            "normal_total",
            "silver_usable",
            "silver_usable_free",
            "silver_daily",
            "silver_total",
            "gold_daily",
            "gold_usable",
            "gold_total",
          ].map((key) => [key, integer(row, key)]),
        ),
        ...Object.fromEntries(
          [
            "normal_last_free_millis",
            "silver_last_add_millis",
            "silver_last_free_millis",
            "gold_last_add_millis",
            "last_normal_wheel_millis",
          ].map((key) => [key, long(row, key)]),
        ),
        rewardFlags: bounded(row, "rewardFlags", 200),
      };
    await tx
      .insert(user_gold_wheel)
      .values(value)
      .onConflictDoUpdate({ target: user_gold_wheel.uid, set: value });
  }

  if (write.tavern) {
    owned(write.tavern, owner);
    const row = write.tavern,
      value = {
        uid: owner,
        free: integer(row, "free"),
        firstFree: integer(row, "firstFree"),
        firstPay: integer(row, "firstPay"),
        freeTimes: integer(row, "freeTimes"),
        payTimes: integer(row, "payTimes"),
        generals: bounded(row, "generals", 255),
        generalId1: bounded(row, "generalId1", 40),
        generalId2: bounded(row, "generalId2", 40),
        generalId3: bounded(row, "generalId3", 40),
        generalId4: bounded(row, "generalId4", 40),
        generalId5: bounded(row, "generalId5", 40),
        generalId6: bounded(row, "generalId6", 40),
        recruit1: integer(row, "recruit1"),
        recruit2: integer(row, "recruit2"),
        recruit3: integer(row, "recruit3"),
        recruit4: integer(row, "recruit4"),
        recruit5: integer(row, "recruit5"),
        recruit6: integer(row, "recruit6"),
        addFreeTime: long(row, "addFreeTime"),
        resetResult: integer(row, "resetResult"),
      };
    await tx.insert(tavern).values(value).onConflictDoUpdate({ target: tavern.uid, set: value });
  }

  if (write.deletedLegacy?.length)
    await tx
      .delete(user_general)
      .where(
        and(eq(user_general.uid, owner), inArray(user_general.uuid, [...write.deletedLegacy])),
      );

  for (const row of write.legacy ?? []) {
    owned(row, owner);
    const value = {
      uid: owner,
      uuid: bounded(row, "uuid", 40),
      generalId: bounded(row, "generalId", 40),
      level: integer(row, "level"),
      status: integer(row, "status", 2),
      color: integer(row, "color", 5),
      exp: integer(row, "exp"),
      time: long(row, "time"),
      ability: Buffer.isBuffer(row.ability) ? row.ability : null,
      abilityIndex: integer(row, "abilityIndex", 3),
      plusSkillPoint: integer(row, "plusSkillPoint"),
    };
    const [existing] = await tx
      .select({ uid: user_general.uid })
      .from(user_general)
      .where(eq(user_general.uuid, value.uuid));

    if (existing && existing.uid !== owner) throw new Error("Foreign legacy general");

    await tx
      .insert(user_general)
      .values(value)
      .onConflictDoUpdate({
        target: user_general.uuid,
        set: value,
        setWhere: eq(user_general.uid, owner),
      });
  }

  for (const row of write.prisoners ?? []) {
    if (row.uid === owner || row.actor !== owner || ![1, 4, 5].includes(num(row, "state")))
      throw new Error("Invalid prisoner operation");

    const result = await tx
      .update(new_general)
      .set({
        state: integer(row, "state", 5),
        serverid: integer(row, "serverid"),
        predatoruid: text(row, "predatoruid"),
        relivetime: long(row, "relivetime"),
        buildingUuid: "",
        gethomttime: long(row, "gethomttime"),
        optime: bounded(row, "optime", 200),
        killtime: long(row, "killtime"),
        robtime: long(row, "robtime"),
      })
      .where(
        and(
          eq(new_general.uid, text(row, "uid")),
          eq(new_general.id, num(row, "id")),
          eq(new_general.predatoruid, owner),
          eq(new_general.state, 4),
          exists(
            tx
              .select({ id: userprofile.uid })
              .from(userprofile)
              .where(
                and(eq(userprofile.uid, owner), eq(userprofile.serverId, new_general.serverid)),
              ),
          ),
        ),
      )
      .returning({ id: new_general.id });

    if (result.length !== 1) throw new Error("Stale prisoner ownership");
  }

  if (write.turntableAt !== undefined) {
    if (write.turntableAt !== now) throw new Error("Invalid turntable period");

    await tx
      .insert(user_mixed_info)
      .values({ uid: owner, mdata: "", generalFree: now })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { generalFree: now } });
  }

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
          eq(timed_activity.queueId, acceleration.queueId),
          eq(timed_activity.status, 0),
        ),
      )
      .limit(2);

    if (active.length !== 1) throw new Error("Missing general queue acceleration");

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
