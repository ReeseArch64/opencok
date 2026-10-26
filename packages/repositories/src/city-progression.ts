import { readAllianceHeart, writeAllianceHeart } from "./alliance-heart";
import { readPlayerItemGifts, writePlayerItemGifts } from "./player-item-gifts";
import { readSeasonalExchange, writeSeasonalExchange } from "./seasonal-exchange";
import { readVipBox, writeVipBox } from "./vip-box";
import { readTargetTasks, writeTargetTasks } from "./target-task";
import { rechargeFeedbackReader, writeRechargeFeedback } from "./recharge-feedback";
import { readRechargeActivity, writeRechargeActivity } from "./recharge-activity";
import { readOrdinaryBoxServer, writeOrdinaryBox } from "./ordinary-box";
import { readSevenDayCycle, writeSevenDayCycle } from "./seven-day-cycle";
import { writeShippingInvestment } from "./shipping-investment";
import { readDailyInvestment, writeDailyInvestment } from "./daily-investment";
import { readCastleLevelEvent, writeCastleLevelEvent } from "./castle-level-event";
import { readLuckyDay, writeLuckyDay } from "./lucky-day";
import { readDragonTower, writeDragonTower } from "./dragon-tower";
import { readExpedition, writeExpedition } from "./new-expedition";
import { readArena, writeArena } from "./arena";
import { readAnniversaryStatistics } from "./anniversary";
import { readCampaignVariables, writeCampaignVariables } from "./local-campaign";
import { readLottery, writeLottery } from "./lottery";
import { readTotems, writeTotems } from "./totem";
import { readCivilizationCastle, writeCivilizationCastle } from "./civilization-castle";
import { readWorldMutationState, writeWorldMutation } from "./world-march-runtime";
import { readDragonProgression, writeDragonProgression } from "./dragon-progression";
import { activity_minstrel } from "@opencok/drizzle/schema/opencok_kingdom/activity_minstrel";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { readGeneralRoster, writeGeneralRoster } from "./generals";
import { readSuitDecompositions, writeEquipment } from "./equipment";
import { readAbilityPages, readProgressionEffects, writePlayerEffects } from "./player-effects";
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
  mapSize = 1200,
): CityProgressionStore {
  return {
    async getState(command, ranking, request) {
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
      const civilizationSciences = await tx
        .select()
        .from(user_civilization_science)
        .where(eq(user_civilization_science.userID, owner))
        .limit(4097);
      if (civilizationSciences.length > 4096)
        throw new Error("Civilization science aggregate exceeds bound");
      return {
        profile,
        resource,
        allianceHeart:
          command === "heart.send" || command === "heart.init"
            ? await readAllianceHeart(tx, owner, command, request)
            : undefined,
        playerItemGifts:
          command === "item.send" || command === "gift.init"
            ? await readPlayerItemGifts(tx, owner, command, request)
            : undefined,
        seasonalExchange: command?.startsWith("activity.exchange.")
          ? await readSeasonalExchange(tx, owner)
          : undefined,
        vipBox: command?.startsWith("vip.box.") ? await readVipBox(tx, owner) : undefined,
        targetTask: await readTargetTasks(tx, owner),
        rechargeFeedback:
          command === "pay.recharge.ui.state" || command === "feedback.paid"
            ? rechargeFeedbackReader(tx, owner)
            : undefined,
        rechargeActivity: command?.startsWith("new.sercum.")
          ? await readRechargeActivity(tx, owner)
          : undefined,
        ordinaryBoxServer:
          command === "get.table.value" || command?.startsWith("ordinary.box.")
            ? await readOrdinaryBoxServer(tx)
            : undefined,
        sevenDayCycle: command?.startsWith("sevenday.")
          ? await readSevenDayCycle(tx, owner)
          : undefined,
        dailyInvestment: command?.startsWith("invest.")
          ? await readDailyInvestment(tx, owner)
          : undefined,
        castleLevelEvent: command?.startsWith("castle.")
          ? await readCastleLevelEvent(tx, owner)
          : undefined,
        luckyDay: command?.startsWith("luckyday.") ? await readLuckyDay(tx, owner) : undefined,
        dragonTower: command?.startsWith("dragontower")
          ? await readDragonTower(tx, owner, now, num(profile, "serverId"), request)
          : undefined,
        expedition: await readExpedition(tx, profile, now, command, request),
        arena:
          command?.startsWith("arena.") || command === "show.arena.army"
            ? await readArena(tx, owner)
            : undefined,
        anniversaryStatistics:
          command === "1year.info" ? await readAnniversaryStatistics(tx, owner) : undefined,
        campaignVariables: await readCampaignVariables(tx, owner, Number(profile.serverId)),
        lottery: command?.startsWith("lottery.") ? await readLottery(tx, owner) : undefined,
        totems: ["totem", "totem.init"].includes(command ?? "")
          ? await readTotems(tx, owner)
          : undefined,
        civilizationSciences,
        ...(command === "civilizationCastle"
          ? await readCivilizationCastle(tx, owner, request)
          : {}),
        worldMutation:
          command?.startsWith("world.") || command === "totem" || command === "civilizationCastle"
            ? await readWorldMutationState(tx, owner, request, mapSize, command)
            : undefined,
        dragons: await readDragonProgression(tx, owner),
        minstrel: ["minstrel", "alchemist"].includes(command ?? "")
          ? (
              await tx
                .select()
                .from(activity_minstrel)
                .where(
                  and(
                    eq(activity_minstrel.uid, owner),
                    eq(activity_minstrel.type, command === "alchemist" ? 1 : 0),
                  ),
                )
            )[0]
          : undefined,
        generalRoster: await readGeneralRoster(tx, owner, command, ranking),
        abilityPages: await readAbilityPages(tx, owner),
        suitDecompositions: await readSuitDecompositions(tx, owner),
        quests: await readQuests(tx, owner, profile, now),
        statistics: statistics ?? {},
        buildingExperience: buildingExperience ?? {},
        buildings,
        sciences,
        armies,
        hospital,
        forts,
        queues,
        effects: await readProgressionEffects(
          tx,
          owner,
          await readPlayerEffects(tx, profile, true),
        ),
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
        for (const row of write.civilizationSciences ?? []) {
          if (row.userID !== owner) throw new Error("Foreign civilization science write");
          const value = {
            userID: owner,
            baseItemID: num(row, "baseItemID"),
            level: num(row, "level"),
          };
          await tx
            .insert(user_civilization_science)
            .values(value)
            .onConflictDoUpdate({
              target: [user_civilization_science.baseItemID, user_civilization_science.userID],
              set: { level: value.level },
            });
        }
        if (write.minstrel) {
          const row = write.minstrel;
          if (row.uid !== owner || ![0, 1].includes(num(row, "type")))
            throw new Error("Foreign minstrel write");
          const value = {
            uid: owner,
            type: num(row, "type"),
            listen: num(row, "listen"),
            listentime: long(row, "listentime"),
            share: num(row, "share"),
            sharetime: long(row, "sharetime"),
            reward: num(row, "reward"),
            rewardtime: long(row, "rewardtime"),
            resettime: long(row, "resettime"),
          };
          await tx
            .insert(activity_minstrel)
            .values(value)
            .onConflictDoUpdate({
              target: [activity_minstrel.uid, activity_minstrel.type],
              set: value,
            });
        }
        if (write.allianceHeart) await writeAllianceHeart(tx, owner, write.allianceHeart);
        if (write.playerItemGifts) await writePlayerItemGifts(tx, owner, write.playerItemGifts);
        if (write.seasonalExchange) await writeSeasonalExchange(tx, owner, write.seasonalExchange);
        if (write.vipBox) await writeVipBox(tx, owner, write.vipBox);
        if (write.targetTask) await writeTargetTasks(tx, owner, write.targetTask);
        if (write.rechargeFeedback)
          await writeRechargeFeedback(tx, owner, write.rechargeFeedback, now);
        if (write.rechargeActivity) await writeRechargeActivity(tx, owner, write.rechargeActivity);
        if (write.ordinaryBox) await writeOrdinaryBox(tx, owner, write.ordinaryBox);
        if (write.sevenDayCycle) await writeSevenDayCycle(tx, owner, write.sevenDayCycle);
        if (write.shippingInvestment)
          await writeShippingInvestment(tx, owner, write.shippingInvestment);
        if (write.dailyInvestment) await writeDailyInvestment(tx, owner, write.dailyInvestment);
        if (write.castleLevelEvent || write.castleLevelEnrollments)
          await writeCastleLevelEvent(
            tx,
            owner,
            write.castleLevelEvent ?? [],
            write.castleLevelEnrollments ?? [],
          );
        if (write.luckyDay) await writeLuckyDay(tx, owner, write.luckyDay);
        if (write.dragonTower) await writeDragonTower(tx, owner, write.dragonTower);
        if (write.expedition) await writeExpedition(tx, owner, write.expedition);
        if (write.arena) await writeArena(tx, owner, write.arena);
        if (write.campaignVariables)
          await writeCampaignVariables(tx, owner, write.campaignVariables, now);
        if (write.lottery) await writeLottery(tx, owner, write.lottery);
        if (write.totems) await writeTotems(tx, owner, write.totems);
        if (write.civilizationCastle)
          await writeCivilizationCastle(tx, owner, write.civilizationCastle);
        if (write.worldMutation) await writeWorldMutation(tx, owner, write.worldMutation);
        if (write.dragons) await writeDragonProgression(tx, owner, write.dragons);
        await writePlayerEffects(tx, owner, write);
        if (write.generalRoster) await writeGeneralRoster(tx, owner, write.generalRoster, now);
        await writeEquipment(tx, owner, write);
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
          if (row.ownerId !== owner || !/^6[0-9]{5}$/.test(text(row, "skillId")))
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
        if (write.profile) {
          await tx.update(userprofile).set(write.profile).where(eq(userprofile.uid, owner));
          await tx
            .update(user_general)
            .set({ level: write.profile.level })
            .where(eq(user_general.uid, owner));
        }
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
            .set({ buildingUuid: "", state: 1 })
            .where(
              and(
                eq(new_general.uid, owner),
                eq(new_general.state, 2),
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
        write.luckyDay ||
        write.generalRoster ||
        write.equipment?.length ||
        write.deletedEquipment?.length ||
        write.equipmentSelection !== undefined ||
        write.vip ||
        write.states?.length ||
        write.deletedStates?.length ||
        write.generals?.length ||
        write.buildings?.length ||
        changedScience ||
        write.civilizationSciences?.length ||
        write.dragons ||
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
