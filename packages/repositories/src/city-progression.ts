import { readQuests, writeQuests } from "./quests";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { readResourceNewGenerals } from "./world-resource-owner";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { and, asc, eq, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_building_exp } from "@opencok/drizzle/schema/opencok_kingdom/user_building_exp";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { user_achievement } from "@opencok/drizzle/schema/opencok_kingdom/user_achievement";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_glory_info } from "@opencok/drizzle/schema/opencok_kingdom/user_glory_info";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import type {
  CityProgressionStore,
  CityProgressionWrite,
} from "@opencok/contracts/city-progression";
import type { ActivityEconomy } from "@opencok/contracts/timed-activity";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";
import { readPlayerEffects } from "./power";

export type ProgressionBoundary = (
  tx: MutationTransaction,
  owner: string,
  now: bigint,
  change: () => Promise<void>,
  deleted: readonly string[],
  economy: ActivityEconomy,
) => Promise<void>;

export function createCityProgressionStore(
  tx: MutationTransaction,
  owner: string,
  now: bigint,
  boundary: ProgressionBoundary,
): CityProgressionStore {
  return {
    async getState() {
      const [profile] = await tx.select().from(userprofile).where(eq(userprofile.uid, owner));
      const [resource] = await tx.select().from(user_resource).where(eq(user_resource.uid, owner));
      if (!profile || !resource) throw new Error("Missing city owner");
      const [statistics] = await tx.select().from(playerinfo).where(eq(playerinfo.uid, owner));
      const [buildingExperience] = await tx
        .select()
        .from(user_building_exp)
        .where(eq(user_building_exp.uid, owner));
      const buildings = await tx
        .select()
        .from(user_building)
        .where(eq(user_building.uid, owner))
        .orderBy(asc(user_building.uuid))
        .limit(257);
      const sciences = await tx
        .select()
        .from(user_science)
        .where(eq(user_science.uid, owner))
        .orderBy(asc(user_science.itemId))
        .limit(4097);
      const armies = await tx
        .select()
        .from(user_army)
        .where(eq(user_army.uid, owner))
        .orderBy(asc(user_army.armyId))
        .limit(1025);
      const hospital = await tx
        .select()
        .from(user_hospital)
        .where(eq(user_hospital.uid, owner))
        .orderBy(asc(user_hospital.armyId))
        .limit(1025);
      const forts = await tx
        .select()
        .from(user_wall)
        .where(eq(user_wall.uid, owner))
        .orderBy(asc(user_wall.armyId))
        .limit(1025);
      const queues = await tx.select().from(queue).where(eq(queue.ownerId, owner)).limit(257);
      if (
        buildings.length > 256 ||
        sciences.length > 4096 ||
        armies.length > 1024 ||
        hospital.length > 1024 ||
        forts.length > 1024 ||
        queues.length > 256
      )
        throw new Error("City aggregate exceeds bound");
      const skills = await tx.select().from(user_skill).where(eq(user_skill.ownerId, owner));
      const tasks = await tx.select().from(user_task).where(eq(user_task.uid, owner));
      const achievements = await tx
        .select()
        .from(user_achievement)
        .where(eq(user_achievement.uid, owner));
      const equipment = await tx.select().from(user_equip).where(eq(user_equip.uid, owner));
      const [glory] = await tx.select().from(user_glory_info).where(eq(user_glory_info.uid, owner));
      return {
        profile,
        resource,
        quests: await readQuests(tx, owner, profile, now),
        statistics: statistics ?? {},
        buildingExperience: buildingExperience ?? {},
        buildings,
        sciences,
        armies,
        hospital,
        forts,
        queues,
        effects: await readPlayerEffects(tx, profile, true),
        newGenerals: await readResourceNewGenerals(tx, owner, false),
        tasks,
        skills,
        achievements,
        equipment,
        glory: glory ?? {},
      };
    },
    async update(write, economy) {
      validateWrite(write, owner);
      const persist = async () => {
        if (write.quests) await writeQuests(tx, owner, write.quests);
        for (const row of write.buildings ?? []) {
          const value = {
            uuid: text(row, "uuid"),
            uid: owner,
            itemId: num(row, "itemId"),
            pos: num(row, "pos"),
            level: num(row, "level"),
            opType: num(row, "opType"),
            star: num(row, "star"),
            progress: num(row, "progress"),
            reward: num(row, "reward"),
            refreshTime: long(row, "refreshTime"),
            updateTime: long(row, "updateTime"),
            effectTime: long(row, "effectTime"),
            putId: text(row, "putId"),
            unlockFlag: num(row, "unlockFlag"),
            costUnlockTimes: num(row, "costUnlockTimes"),
          };
          const [existing] = await tx
            .select({ uid: user_building.uid })
            .from(user_building)
            .where(eq(user_building.uuid, value.uuid));
          if (existing && existing.uid !== owner) throw new Error("Foreign building");
          await tx
            .insert(user_building)
            .values(value)
            .onConflictDoUpdate({
              target: user_building.uuid,
              set: value,
              setWhere: eq(user_building.uid, owner),
            });
        }
        for (const row of write.skills ?? []) {
          if (row.ownerId !== owner || !["622800", "622900"].includes(text(row, "skillId")))
            throw new Error("Invalid research skill owner");
          const value = {
            uuid: text(row, "uuid"),
            ownerId: owner,
            skillId: text(row, "skillId"),
            stat: num(row, "stat"),
            startTime: long(row, "startTime"),
            endTime: long(row, "endTime"),
            actTime: long(row, "actTime"),
            param1: num(row, "param1"),
            param2: num(row, "param2"),
          };
          const [existing] = await tx
            .select({ ownerId: user_skill.ownerId })
            .from(user_skill)
            .where(eq(user_skill.uuid, value.uuid));
          if (existing && existing.ownerId !== owner) throw new Error("Foreign research skill");
          await tx
            .insert(user_skill)
            .values(value)
            .onConflictDoUpdate({
              target: user_skill.uuid,
              set: value,
              setWhere: eq(user_skill.ownerId, owner),
            });
        }
        for (const row of write.sciences ?? []) {
          const value = {
            uid: owner,
            itemId: text(row, "itemId"),
            level: num(row, "level"),
            cd: long(row, "cd"),
          };
          await tx
            .insert(user_science)
            .values(value)
            .onConflictDoUpdate({ target: [user_science.uid, user_science.itemId], set: value });
        }
        for (const row of write.armies ?? []) {
          const value = {
            uid: owner,
            armyId: text(row, "armyId"),
            level: num(row, "level"),
            free: num(row, "free"),
            pve: num(row, "pve"),
            march: num(row, "march"),
            defence: num(row, "defence"),
            train: num(row, "train"),
            finishTime: long(row, "finishTime"),
            foodCostTime: long(row, "foodCostTime"),
          };
          await tx
            .insert(user_army)
            .values(value)
            .onConflictDoUpdate({ target: [user_army.uid, user_army.armyId], set: value });
        }
        for (const row of write.hospital ?? []) {
          const value = {
            uid: owner,
            armyId: text(row, "armyId"),
            dead: num(row, "dead"),
            heal: num(row, "heal"),
            finishTime: long(row, "finishTime"),
          };
          await tx
            .insert(user_hospital)
            .values(value)
            .onConflictDoUpdate({ target: [user_hospital.uid, user_hospital.armyId], set: value });
        }
        for (const row of write.forts ?? []) {
          const value = {
            uid: owner,
            armyId: text(row, "armyId"),
            num: num(row, "num"),
            build: num(row, "build"),
            level: num(row, "level"),
            finishTime: long(row, "finishTime"),
          };
          await tx
            .insert(user_wall)
            .values(value)
            .onConflictDoUpdate({ target: [user_wall.uid, user_wall.armyId], set: value });
        }
        for (const row of write.queues ?? []) {
          if (text(row, "ownerId") !== owner) throw new Error("Foreign queue");
          const [existing] = await tx
            .select({ uuid: queue.uuid })
            .from(queue)
            .where(
              and(eq(queue.ownerId, owner), eq(queue.type, num(row, "type")), eq(queue.qid, 1)),
            );
          if (!existing)
            await tx.insert(queue).values({
              uuid: text(row, "uuid"),
              ownerId: owner,
              qid: 1,
              type: num(row, "type"),
              itemId: "",
              startTime: long(row, "startTime"),
              endTime: long(row, "endTime"),
              updateTime: long(row, "updateTime"),
              totalTime: 0n,
              isHelped: 0,
              para: 0,
            });
        }
        if (write.profile)
          await tx.update(userprofile).set(write.profile).where(eq(userprofile.uid, owner));
        if (write.statistics)
          await tx
            .insert(playerinfo)
            .values({ uid: owner, ...write.statistics })
            .onConflictDoUpdate({ target: playerinfo.uid, set: write.statistics });
        if (write.buildingExperience)
          await tx
            .insert(user_building_exp)
            .values({ uid: owner, ...write.buildingExperience })
            .onConflictDoUpdate({ target: user_building_exp.uid, set: write.buildingExperience });
        if (write.deletedBuildings?.length) {
          await tx
            .update(new_general)
            .set({ buildingUuid: "", state: 0 })
            .where(
              and(
                eq(new_general.uid, owner),
                inArray(new_general.buildingUuid, [...write.deletedBuildings]),
              ),
            );
          await tx
            .delete(user_building)
            .where(
              and(
                eq(user_building.uid, owner),
                inArray(user_building.uuid, [...write.deletedBuildings]),
              ),
            );
        }
      };
      const scienceBefore = write.sciences?.length
        ? await tx
            .select({ itemId: user_science.itemId, level: user_science.level })
            .from(user_science)
            .where(eq(user_science.uid, owner))
        : [];
      const changedScience = write.sciences?.some(
        (row) =>
          num(row, "level") !==
          (scienceBefore.find((before) => before.itemId === row.itemId)?.level ?? 0),
      );
      if (
        write.buildings?.length ||
        changedScience ||
        write.profile ||
        write.deletedBuildings?.length
      )
        await boundary(tx, owner, now, persist, write.deletedBuildings ?? [], economy);
      else await persist();
      if (write.deletedBuildings?.length)
        await tx
          .delete(building_production)
          .where(
            and(
              eq(building_production.ownerId, owner),
              inArray(building_production.buildingId, [...write.deletedBuildings]),
            ),
          );
    },
  };
}

function validateWrite(write: CityProgressionWrite, owner: string) {
  for (const [rows, identity, fields] of [
    [
      write.buildings,
      "uuid",
      [
        "itemId",
        "pos",
        "level",
        "star",
        "progress",
        "opType",
        "reward",
        "unlockFlag",
        "costUnlockTimes",
      ],
    ],
    [write.sciences, "itemId", ["level"]],
    [write.armies, "armyId", ["level", "free", "pve", "march", "defence", "train"]],
    [write.hospital, "armyId", ["dead", "heal"]],
    [write.forts, "armyId", ["level", "num", "build"]],
  ] as const) {
    if (!rows) continue;
    if (rows.length > 1024 || new Set(rows.map((row) => row[identity])).size !== rows.length)
      throw new Error("Invalid city write set");
    for (const row of rows) {
      if (row.uid !== owner || !text(row, identity) || text(row, identity).length > 40)
        throw new Error("Invalid city owner");
      for (const key of fields) {
        const value = num(row as Row, key);
        if (!Number.isInteger(value) || value < 0 || value > 2147483647)
          throw new Error("Invalid city quantity");
      }
      for (const key of ["finishTime", "cd", "refreshTime", "updateTime", "foodCostTime"]) {
        if (long(row as Row, key) < 0n || long(row as Row, key) > 9223372036854775807n)
          throw new Error("Invalid city deadline");
      }
    }
  }
}
