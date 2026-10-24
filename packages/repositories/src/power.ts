import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { saga_tower_science } from "@opencok/drizzle/schema/opencok_kingdom/saga_tower_science";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { t_hero } from "@opencok/drizzle/schema/opencok_kingdom/t_hero";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { user_knight_title } from "@opencok/drizzle/schema/opencok_kingdom/user_knight_title";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { user_civilization_prestige } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_prestige";
import { user_military_rank } from "@opencok/drizzle/schema/opencok_kingdom/user_military_rank";
import { user_miracle_buff_active } from "@opencok/drizzle/schema/opencok_kingdom/user_miracle_buff_active";
import { and, asc, eq, gt, or } from "drizzle-orm";
import type { PowerState } from "@opencok/contracts/power";
import type { Database } from "./game.ts";

export async function checkPowerStore(db: Database["kingdom"]["db"]) {
  for (const table of [
    userprofile,
    playerinfo,
    user_general,
    user_army,
    user_wall,
    user_building,
    user_science,
    user_civilization_science,
    saga_tower_science,
    user_equip,
    t_hero,
    user_pet_dragon,
    user_knight_title,
    user_item,
    pic_upload_record,
    user_state,
    user_vip,
    alliance_science,
    user_civilization_prestige,
    user_military_rank,
    user_miracle_buff_active,
  ])
    await db.select().from(table).limit(0);
}

export function readPowerState(
  db: Database["kingdom"]["db"],
  uid: string,
  now: number,
): Promise<PowerState> {
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            level: userprofile.level,
            banTime: userprofile.banTime,
            banFlag: userprofile.banFlag,
            pf: userprofile.pf,
            allianceId: userprofile.allianceId,
            serverId: userprofile.serverId,
            decomposeSuitEffect: userprofile.decomposesuiteffect,
            civilizationType: userprofile.civilizationType,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
      )[0];
      const empty: PowerState = {
        profile,
        statistics: undefined,
        upload: undefined,
        generals: [],
        armies: [],
        walls: [],
        buildings: [],
        sciences: [],
        civilizationSciences: [],
        sagaSciences: [],
        equipment: [],
        heroes: [],
        dragons: [],
        knight: undefined,
        items: [],
        states: [],
        vip: undefined,
        allianceSciences: [],
        prestige: [],
        military: undefined,
        miracle: undefined,
      };
      if (!profile) return empty;
      const statistics = (
        await tx.select().from(playerinfo).where(eq(playerinfo.uid, uid)).limit(1)
      )[0];
      const generals = await tx
        .select({
          generalId: user_general.generalId,
          level: user_general.level,
          ability: user_general.ability,
        })
        .from(user_general)
        .where(eq(user_general.uid, uid))
        .orderBy(asc(user_general.uuid));
      const armies = await tx
        .select({
          armyId: user_army.armyId,
          free: user_army.free,
          pve: user_army.pve,
          defence: user_army.defence,
          march: user_army.march,
        })
        .from(user_army)
        .where(eq(user_army.uid, uid))
        .orderBy(asc(user_army.armyId));
      const walls = await tx
        .select({ armyId: user_wall.armyId, num: user_wall.num })
        .from(user_wall)
        .where(eq(user_wall.uid, uid))
        .orderBy(asc(user_wall.armyId));
      const buildings = await tx
        .select({
          itemId: user_building.itemId,
          level: user_building.level,
          star: user_building.star,
          progress: user_building.progress,
        })
        .from(user_building)
        .where(eq(user_building.uid, uid))
        .orderBy(asc(user_building.uuid));
      const sciences = await tx
        .select({ itemId: user_science.itemId, level: user_science.level })
        .from(user_science)
        .where(eq(user_science.uid, uid))
        .orderBy(asc(user_science.itemId));
      const civilizationSciences = await tx
        .select({
          baseItemID: user_civilization_science.baseItemID,
          level: user_civilization_science.level,
        })
        .from(user_civilization_science)
        .where(eq(user_civilization_science.userID, uid))
        .orderBy(asc(user_civilization_science.baseItemID));
      const sagaSciences = await tx
        .select({ itemid: saga_tower_science.itemid, level: saga_tower_science.level })
        .from(saga_tower_science)
        .where(eq(saga_tower_science.uid, uid))
        .orderBy(asc(saga_tower_science.itemid));
      const equipment = await tx
        .select({
          itemId: user_equip.itemId,
          on: user_equip.on,
          extraProperty: user_equip.extraProperty,
          strengthLevel: user_equip.strengthLevel,
        })
        .from(user_equip)
        .where(and(eq(user_equip.uid, uid), eq(user_equip.on, 1)))
        .orderBy(asc(user_equip.uuid));
      const heroes = await tx
        .select({ heroid: t_hero.heroid })
        .from(t_hero)
        .where(eq(t_hero.uid, uid))
        .orderBy(asc(t_hero.id));
      const dragons = await tx
        .select({
          itemId: user_pet_dragon.itemId,
          dragonState: user_pet_dragon.dragonState,
          lv: user_pet_dragon.lv,
        })
        .from(user_pet_dragon)
        .where(eq(user_pet_dragon.uid, uid))
        .orderBy(asc(user_pet_dragon.uuid));
      const knight = (
        await tx
          .select({
            activity_title: user_knight_title.activity_title,
            contract_activity_title: user_knight_title.contract_activity_title,
            contract_unlock_title: user_knight_title.contract_unlock_title,
          })
          .from(user_knight_title)
          .where(eq(user_knight_title.uid, uid))
          .limit(1)
      )[0];
      const items = await tx
        .select({
          itemId: user_item.itemId,
          count: user_item.count,
          vanishTime: user_item.vanishTime,
        })
        .from(user_item)
        .where(
          and(
            eq(user_item.ownerId, uid),
            gt(user_item.count, 0),
            or(eq(user_item.vanishTime, 0n), gt(user_item.vanishTime, BigInt(now))),
          ),
        )
        .orderBy(asc(user_item.itemId));
      const upload = (
        await tx
          .select({
            updateTime: pic_upload_record.updateTime,
            banTime: pic_upload_record.banTime,
            banCount: pic_upload_record.banCount,
          })
          .from(pic_upload_record)
          .where(eq(pic_upload_record.uid, uid))
          .limit(1)
      )[0];
      const states = await tx
        .select({
          stateId: user_state.stateId,
          endTime: user_state.endTime,
          ranEffId: user_state.ranEffId,
          ranEffValue: user_state.ranEffValue,
        })
        .from(user_state)
        .where(eq(user_state.uid, uid))
        .orderBy(asc(user_state.stateId));
      const vip = (
        await tx
          .select({
            score: user_vip.score,
            vipEndTime: user_vip.vipEndTime,
            sLevel: user_vip.sLevel,
          })
          .from(user_vip)
          .where(eq(user_vip.uid, uid))
          .limit(1)
      )[0];
      const allianceSciences = profile.allianceId?.trim()
        ? await tx
            .select({ scienceId: alliance_science.scienceId, level: alliance_science.level })
            .from(alliance_science)
            .where(eq(alliance_science.allianceId, profile.allianceId))
            .orderBy(asc(alliance_science.scienceId))
        : [];
      const prestige = await tx
        .select({
          civilizationType: user_civilization_prestige.civilizationType,
          prestigeValue: user_civilization_prestige.prestigeValue,
        })
        .from(user_civilization_prestige)
        .where(eq(user_civilization_prestige.uid, uid))
        .orderBy(asc(user_civilization_prestige.civilizationType));
      const military = (
        await tx
          .select({ skill: user_military_rank.skill })
          .from(user_military_rank)
          .where(eq(user_military_rank.uid, uid))
          .limit(1)
      )[0];
      const miracle = (
        await tx
          .select({ level: user_miracle_buff_active.level })
          .from(user_miracle_buff_active)
          .where(eq(user_miracle_buff_active.uid, uid))
          .limit(1)
      )[0];
      return {
        profile,
        statistics,
        generals,
        armies,
        walls,
        buildings,
        sciences,
        civilizationSciences,
        sagaSciences,
        equipment,
        heroes,
        dragons,
        knight,
        items,
        upload,
        states,
        vip,
        allianceSciences,
        prestige,
        military,
        miracle,
      };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
