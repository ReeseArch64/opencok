import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import type { GameplayCatalogDocument } from "./catalog.ts";

export const gameplayCatalogs: Readonly<
  Record<GameplayCatalog, () => Promise<GameplayCatalogDocument>>
> = {
  [GameplayCatalog.Catalog3thAnniversary]: async () =>
    (await import("./catalogs/3th_anniversary.ts")).createCatalog(),
  [GameplayCatalog.Catalog3thAnniversaryControl]: async () =>
    (await import("./catalogs/3th_anniversary_control.ts")).createCatalog(),
  [GameplayCatalog.ArenaMap]: async () => (await import("./catalogs/ArenaMap.ts")).createCatalog(),
  [GameplayCatalog.CivilizationInjury]: async () =>
    (await import("./catalogs/Civilization_injury.ts")).createCatalog(),
  [GameplayCatalog.CrossThroneMap]: async () =>
    (await import("./catalogs/CrossThroneMap.ts")).createCatalog(),
  [GameplayCatalog.SeaWorldmap]: async () =>
    (await import("./catalogs/SeaWorldmap.ts")).createCatalog(),
  [GameplayCatalog.Ab]: async () => (await import("./catalogs/ab.ts")).createCatalog(),
  [GameplayCatalog.Ability]: async () => (await import("./catalogs/ability.ts")).createCatalog(),
  [GameplayCatalog.Accumulate]: async () =>
    (await import("./catalogs/accumulate.ts")).createCatalog(),
  [GameplayCatalog.Achievement]: async () =>
    (await import("./catalogs/achievement.ts")).createCatalog(),
  [GameplayCatalog.Action]: async () => (await import("./catalogs/action.ts")).createCatalog(),
  [GameplayCatalog.Activity]: async () => (await import("./catalogs/activity.ts")).createCatalog(),
  [GameplayCatalog.ActivityEvent]: async () =>
    (await import("./catalogs/activity_event.ts")).createCatalog(),
  [GameplayCatalog.ActivityPage]: async () =>
    (await import("./catalogs/activity_page.ts")).createCatalog(),
  [GameplayCatalog.ActivityPanel]: async () =>
    (await import("./catalogs/activity_panel.ts")).createCatalog(),
  [GameplayCatalog.AddUserEquip]: async () =>
    (await import("./catalogs/add_user_equip.ts")).createCatalog(),
  [GameplayCatalog.AddUserGoods]: async () =>
    (await import("./catalogs/add_user_goods.ts")).createCatalog(),
  [GameplayCatalog.Affairs]: async () => (await import("./catalogs/affairs.ts")).createCatalog(),
  [GameplayCatalog.AllianceBoss]: async () =>
    (await import("./catalogs/alliance_boss.ts")).createCatalog(),
  [GameplayCatalog.AllianceBossControl]: async () =>
    (await import("./catalogs/alliance_boss_control.ts")).createCatalog(),
  [GameplayCatalog.AllianceBossReward]: async () =>
    (await import("./catalogs/alliance_boss_reward.ts")).createCatalog(),
  [GameplayCatalog.AllianceBuilding]: async () =>
    (await import("./catalogs/alliance_building.ts")).createCatalog(),
  [GameplayCatalog.AllianceBuildingSkill]: async () =>
    (await import("./catalogs/alliance_building_skill.ts")).createCatalog(),
  [GameplayCatalog.AllianceMission]: async () =>
    (await import("./catalogs/alliance_mission.ts")).createCatalog(),
  [GameplayCatalog.AllianceQuest]: async () =>
    (await import("./catalogs/alliance_quest.ts")).createCatalog(),
  [GameplayCatalog.AllianceQuestColorran]: async () =>
    (await import("./catalogs/alliance_quest_colorran.ts")).createCatalog(),
  [GameplayCatalog.AllianceTeleport]: async () =>
    (await import("./catalogs/alliance_teleport.ts")).createCatalog(),
  [GameplayCatalog.Alliancescience]: async () =>
    (await import("./catalogs/alliancescience.ts")).createCatalog(),
  [GameplayCatalog.Allianceshop]: async () =>
    (await import("./catalogs/allianceshop.ts")).createCatalog(),
  [GameplayCatalog.Area]: async () => (await import("./catalogs/area.ts")).createCatalog(),
  [GameplayCatalog.Arena]: async () => (await import("./catalogs/arena.ts")).createCatalog(),
  [GameplayCatalog.ArenaRank]: async () =>
    (await import("./catalogs/arena_rank.ts")).createCatalog(),
  [GameplayCatalog.Arms]: async () => (await import("./catalogs/arms.ts")).createCatalog(),
  [GameplayCatalog.Army]: async () => (await import("./catalogs/army.ts")).createCatalog(),
  [GameplayCatalog.ArmyUpBase]: async () =>
    (await import("./catalogs/army_up_base.ts")).createCatalog(),
  [GameplayCatalog.ArmyUpEffect]: async () =>
    (await import("./catalogs/army_up_effect.ts")).createCatalog(),
  [GameplayCatalog.ArmyUpWhole]: async () =>
    (await import("./catalogs/army_up_whole.ts")).createCatalog(),
  [GameplayCatalog.AttributeRandom]: async () =>
    (await import("./catalogs/attribute_random.ts")).createCatalog(),
  [GameplayCatalog.Auction]: async () => (await import("./catalogs/auction.ts")).createCatalog(),
  [GameplayCatalog.AutoUpdata]: async () =>
    (await import("./catalogs/auto_updata.ts")).createCatalog(),
  [GameplayCatalog.Bank]: async () => (await import("./catalogs/bank.ts")).createCatalog(),
  [GameplayCatalog.Banlist]: async () => (await import("./catalogs/banlist.ts")).createCatalog(),
  [GameplayCatalog.Barbarion]: async () =>
    (await import("./catalogs/barbarion.ts")).createCatalog(),
  [GameplayCatalog.BestowTitle]: async () =>
    (await import("./catalogs/bestow_title.ts")).createCatalog(),
  [GameplayCatalog.Bet]: async () => (await import("./catalogs/bet.ts")).createCatalog(),
  [GameplayCatalog.BocaiDragon]: async () =>
    (await import("./catalogs/bocai_dragon.ts")).createCatalog(),
  [GameplayCatalog.BoxOrdinary]: async () =>
    (await import("./catalogs/box_ordinary.ts")).createCatalog(),
  [GameplayCatalog.BoxVip]: async () => (await import("./catalogs/box_vip.ts")).createCatalog(),
  [GameplayCatalog.BrResourceRefresh]: async () =>
    (await import("./catalogs/br_resource_refresh.ts")).createCatalog(),
  [GameplayCatalog.Building]: async () => (await import("./catalogs/building.ts")).createCatalog(),
  [GameplayCatalog.BuildingStar]: async () =>
    (await import("./catalogs/building_star.ts")).createCatalog(),
  [GameplayCatalog.BuildingStarup]: async () =>
    (await import("./catalogs/building_starup.ts")).createCatalog(),
  [GameplayCatalog.Cargo]: async () => (await import("./catalogs/cargo.ts")).createCatalog(),
  [GameplayCatalog.Characters]: async () =>
    (await import("./catalogs/characters.ts")).createCatalog(),
  [GameplayCatalog.ChatbgColor]: async () =>
    (await import("./catalogs/chatbg_color.ts")).createCatalog(),
  [GameplayCatalog.Checkpoint]: async () =>
    (await import("./catalogs/checkpoint.ts")).createCatalog(),
  [GameplayCatalog.City]: async () => (await import("./catalogs/city.ts")).createCatalog(),
  [GameplayCatalog.Civilization]: async () =>
    (await import("./catalogs/civilization.ts")).createCatalog(),
  [GameplayCatalog.CivilizationFeature]: async () =>
    (await import("./catalogs/civilization_feature.ts")).createCatalog(),
  [GameplayCatalog.CivilizationFortress]: async () =>
    (await import("./catalogs/civilization_fortress.ts")).createCatalog(),
  [GameplayCatalog.Clean]: async () => (await import("./catalogs/clean.ts")).createCatalog(),
  [GameplayCatalog.Comeback]: async () => (await import("./catalogs/comeback.ts")).createCatalog(),
  [GameplayCatalog.Compensation]: async () =>
    (await import("./catalogs/compensation.ts")).createCatalog(),
  [GameplayCatalog.ContinuedCost]: async () =>
    (await import("./catalogs/continued_cost.ts")).createCatalog(),
  [GameplayCatalog.Convert]: async () => (await import("./catalogs/convert.ts")).createCatalog(),
  [GameplayCatalog.CrossFightWorld]: async () =>
    (await import("./catalogs/crossFightWorld.ts")).createCatalog(),
  [GameplayCatalog.CrossThroneMaster]: async () =>
    (await import("./catalogs/CrossThroneMap.ts")).createCatalog(),
  [GameplayCatalog.CsmodAutoUpgrade]: async () =>
    (await import("./catalogs/building_starup.ts")).createCatalog(),
  [GameplayCatalog.CsmodSettings]: async () =>
    (await import("./catalogs/csmod_settings.ts")).createCatalog(),
  [GameplayCatalog.DailyLogin]: async () =>
    (await import("./catalogs/daily_login.ts")).createCatalog(),
  [GameplayCatalog.DailyQuest]: async () =>
    (await import("./catalogs/daily_quest.ts")).createCatalog(),
  [GameplayCatalog.DailyRecharge]: async () =>
    (await import("./catalogs/daily_recharge.ts")).createCatalog(),
  [GameplayCatalog.DailyReward]: async () =>
    (await import("./catalogs/daily_reward.ts")).createCatalog(),
  [GameplayCatalog.DailyTaskBox]: async () =>
    (await import("./catalogs/daily_task_box.ts")).createCatalog(),
  [GameplayCatalog.DailyTaskReward]: async () =>
    (await import("./catalogs/daily_task_reward.ts")).createCatalog(),
  [GameplayCatalog.DeepLink]: async () => (await import("./catalogs/deep_link.ts")).createCatalog(),
  [GameplayCatalog.DefeatNotice]: async () =>
    (await import("./catalogs/defeatNotice.ts")).createCatalog(),
  [GameplayCatalog.Defensor]: async () => (await import("./catalogs/defensor.ts")).createCatalog(),
  [GameplayCatalog.DelExchange]: async () =>
    (await import("./catalogs/del_exchange.ts")).createCatalog(),
  [GameplayCatalog.DgRefinement]: async () =>
    (await import("./catalogs/dg_refinement.ts")).createCatalog(),
  [GameplayCatalog.DianjiReward]: async () =>
    (await import("./catalogs/dianji_reward.ts")).createCatalog(),
  [GameplayCatalog.DiscountMall]: async () =>
    (await import("./catalogs/discount_mall.ts")).createCatalog(),
  [GameplayCatalog.Dragon]: async () => (await import("./catalogs/dragon.ts")).createCatalog(),
  [GameplayCatalog.DragonBattleWorld]: async () =>
    (await import("./catalogs/dragonBattleWorld.ts")).createCatalog(),
  [GameplayCatalog.DragonBase]: async () =>
    (await import("./catalogs/dragon_base.ts")).createCatalog(),
  [GameplayCatalog.DragonCommunicate]: async () =>
    (await import("./catalogs/dragon_communicate.ts")).createCatalog(),
  [GameplayCatalog.DragonCrystalCondition]: async () =>
    (await import("./catalogs/dragon_crystal_condition.ts")).createCatalog(),
  [GameplayCatalog.DragonDetail]: async () =>
    (await import("./catalogs/dragon_detail.ts")).createCatalog(),
  [GameplayCatalog.DragonEgg]: async () => (await import("./catalogs/dragon.ts")).createCatalog(),
  [GameplayCatalog.DragonExp]: async () => (await import("./catalogs/dragon.ts")).createCatalog(),
  [GameplayCatalog.DragonFood]: async () =>
    (await import("./catalogs/dragon_food.ts")).createCatalog(),
  [GameplayCatalog.DragonGift]: async () =>
    (await import("./catalogs/dragon_gift.ts")).createCatalog(),
  [GameplayCatalog.DragonNew]: async () =>
    (await import("./catalogs/dragon_new.ts")).createCatalog(),
  [GameplayCatalog.DragonSkill]: async () =>
    (await import("./catalogs/dragon_skill.ts")).createCatalog(),
  [GameplayCatalog.DragonSkillExp]: async () =>
    (await import("./catalogs/dragon_skill_exp.ts")).createCatalog(),
  [GameplayCatalog.DragonTalent]: async () =>
    (await import("./catalogs/dragon_talent.ts")).createCatalog(),
  [GameplayCatalog.DragonTalentExp]: async () =>
    (await import("./catalogs/dragon_talent_exp.ts")).createCatalog(),
  [GameplayCatalog.DragonTowerBuff]: async () =>
    (await import("./catalogs/dragon_tower_buff.ts")).createCatalog(),
  [GameplayCatalog.DragonTowerCoord]: async () =>
    (await import("./catalogs/dragon_tower_coord.ts")).createCatalog(),
  [GameplayCatalog.DragonTowerLayer]: async () =>
    (await import("./catalogs/dragon_tower_layer.ts")).createCatalog(),
  [GameplayCatalog.DragonTowerMonster]: async () =>
    (await import("./catalogs/dragon_tower_monster.ts")).createCatalog(),
  [GameplayCatalog.DragonTravel]: async () =>
    (await import("./catalogs/dragon_travel.ts")).createCatalog(),
  [GameplayCatalog.DragonWords]: async () =>
    (await import("./catalogs/dragon_words.ts")).createCatalog(),
  [GameplayCatalog.DrawRandom]: async () =>
    (await import("./catalogs/drawRandom.ts")).createCatalog(),
  [GameplayCatalog.Drconfig]: async () => (await import("./catalogs/drconfig.ts")).createCatalog(),
  [GameplayCatalog.Drconfig7260]: async () =>
    (await import("./catalogs/drconfig7.26.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9100]: async () =>
    (await import("./catalogs/drconfig7.26.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9140]: async () =>
    (await import("./catalogs/drconfig9.14.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9150]: async () =>
    (await import("./catalogs/drconfig9.14.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9160]: async () =>
    (await import("./catalogs/drconfig9.14.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9170]: async () =>
    (await import("./catalogs/drconfig9.14.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9180]: async () =>
    (await import("./catalogs/drconfig9.14.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9260]: async () =>
    (await import("./catalogs/drconfig9.26.0.ts")).createCatalog(),
  [GameplayCatalog.Drconfig9270]: async () =>
    (await import("./catalogs/drconfig9.26.0.ts")).createCatalog(),
  [GameplayCatalog.Effect]: async () => (await import("./catalogs/effect.ts")).createCatalog(),
  [GameplayCatalog.EffectRequirement]: async () =>
    (await import("./catalogs/effect_requirement.ts")).createCatalog(),
  [GameplayCatalog.Egg]: async () => (await import("./catalogs/egg.ts")).createCatalog(),
  [GameplayCatalog.Emulator]: async () => (await import("./catalogs/emulator.ts")).createCatalog(),
  [GameplayCatalog.Endowment]: async () =>
    (await import("./catalogs/endowment.ts")).createCatalog(),
  [GameplayCatalog.EquipStrength]: async () =>
    (await import("./catalogs/equip_strength.ts")).createCatalog(),
  [GameplayCatalog.Equipment]: async () =>
    (await import("./catalogs/equipment.ts")).createCatalog(),
  [GameplayCatalog.EquipmentRandom]: async () =>
    (await import("./catalogs/equipmentRandom.ts")).createCatalog(),
  [GameplayCatalog.EquipmentRandomPower]: async () =>
    (await import("./catalogs/equipmentRandomPower.ts")).createCatalog(),
  [GameplayCatalog.EquipmentBagSuitFilter]: async () =>
    (await import("./catalogs/equipment_bag_suit_filter.ts")).createCatalog(),
  [GameplayCatalog.EquipmentRank]: async () =>
    (await import("./catalogs/equipment_rank.ts")).createCatalog(),
  [GameplayCatalog.EquipmentSmelt]: async () =>
    (await import("./catalogs/equipment_smelt.ts")).createCatalog(),
  [GameplayCatalog.EquipmentStrength]: async () =>
    (await import("./catalogs/equipment_strength.ts")).createCatalog(),
  [GameplayCatalog.EquipmentStrengthenMove]: async () =>
    (await import("./catalogs/equipment_strengthen_move.ts")).createCatalog(),
  [GameplayCatalog.EquipmentStrengthenRemove]: async () =>
    (await import("./catalogs/equipment_strengthen_remove.ts")).createCatalog(),
  [GameplayCatalog.EquipmentstrengthRandom]: async () =>
    (await import("./catalogs/equip_strength.ts")).createCatalog(),
  [GameplayCatalog.EquipmentstrengthRandomPower]: async () =>
    (await import("./catalogs/equipmentRandomPower.ts")).createCatalog(),
  [GameplayCatalog.Event]: async () => (await import("./catalogs/event.ts")).createCatalog(),
  [GameplayCatalog.Events]: async () => (await import("./catalogs/events.ts")).createCatalog(),
  [GameplayCatalog.EverydayRecharge]: async () =>
    (await import("./catalogs/everyday_recharge.ts")).createCatalog(),
  [GameplayCatalog.Exchange]: async () => (await import("./catalogs/exchange.ts")).createCatalog(),
  [GameplayCatalog.ExchangeCycle]: async () =>
    (await import("./catalogs/exchange_cycle.ts")).createCatalog(),
  [GameplayCatalog.ExchangeFieldType]: async () =>
    (await import("./catalogs/exchange_field_type.ts")).createCatalog(),
  [GameplayCatalog.Explore]: async () => (await import("./catalogs/explore.ts")).createCatalog(),
  [GameplayCatalog.FbShare]: async () => (await import("./catalogs/fb_share.ts")).createCatalog(),
  [GameplayCatalog.FieldMonster]: async () =>
    (await import("./catalogs/field_monster.ts")).createCatalog(),
  [GameplayCatalog.ForeignCivilizationBase]: async () =>
    (await import("./catalogs/foreign_civilization_base.ts")).createCatalog(),
  [GameplayCatalog.ForeignCivilizationUp]: async () =>
    (await import("./catalogs/foreign_civilization_up.ts")).createCatalog(),
  [GameplayCatalog.Fragment]: async () => (await import("./catalogs/fragment.ts")).createCatalog(),
  [GameplayCatalog.FunctionOnCopy]: async () =>
    (await import("./catalogs/function_on - Copy.ts")).createCatalog(),
  [GameplayCatalog.FunctionOn]: async () =>
    (await import("./catalogs/function_on.ts")).createCatalog(),
  [GameplayCatalog.FunctionOn7210]: async () =>
    (await import("./catalogs/function_on7.21.0.ts")).createCatalog(),
  [GameplayCatalog.FunctionOn9170]: async () =>
    (await import("./catalogs/function_on9.17.0.ts")).createCatalog(),
  [GameplayCatalog.FunctionOn9180]: async () =>
    (await import("./catalogs/function_on9.18.0.ts")).createCatalog(),
  [GameplayCatalog.FunctionOnLuaUI]: async () =>
    (await import("./catalogs/function_on_luaUI.ts")).createCatalog(),
  [GameplayCatalog.FunctionStar]: async () =>
    (await import("./catalogs/function_star.ts")).createCatalog(),
  [GameplayCatalog.General]: async () => (await import("./catalogs/general.ts")).createCatalog(),
  [GameplayCatalog.GeneralAb]: async () =>
    (await import("./catalogs/general_ab.ts")).createCatalog(),
  [GameplayCatalog.GeneralAwake]: async () =>
    (await import("./catalogs/general_awake.ts")).createCatalog(),
  [GameplayCatalog.GeneralAwakenChallengeReward]: async () =>
    (await import("./catalogs/general_awaken_challenge_reward.ts")).createCatalog(),
  [GameplayCatalog.GeneralBase]: async () =>
    (await import("./catalogs/general_base.ts")).createCatalog(),
  [GameplayCatalog.GeneralBaseSkillTree]: async () =>
    (await import("./catalogs/general_base_skill_tree.ts")).createCatalog(),
  [GameplayCatalog.GeneralCalledTask]: async () =>
    (await import("./catalogs/general_called_task.ts")).createCatalog(),
  [GameplayCatalog.GeneralDetail]: async () =>
    (await import("./catalogs/general_detail.ts")).createCatalog(),
  [GameplayCatalog.GeneralDraw]: async () =>
    (await import("./catalogs/general_draw.ts")).createCatalog(),
  [GameplayCatalog.GeneralDrawNewMain]: async () =>
    (await import("./catalogs/general_draw_new_main.ts")).createCatalog(),
  [GameplayCatalog.GeneralDrawRate]: async () =>
    (await import("./catalogs/general_draw_rate.ts")).createCatalog(),
  [GameplayCatalog.GeneralLevel]: async () =>
    (await import("./catalogs/general_level.ts")).createCatalog(),
  [GameplayCatalog.GeneralMaxNum]: async () =>
    (await import("./catalogs/general_max_num.ts")).createCatalog(),
  [GameplayCatalog.GeneralOfficial]: async () =>
    (await import("./catalogs/general_official.ts")).createCatalog(),
  [GameplayCatalog.GeneralRandomEffect]: async () =>
    (await import("./catalogs/general_random_effect.ts")).createCatalog(),
  [GameplayCatalog.GeneralRandomNum]: async () =>
    (await import("./catalogs/general_random_num.ts")).createCatalog(),
  [GameplayCatalog.GeneralRank]: async () =>
    (await import("./catalogs/general_rank.ts")).createCatalog(),
  [GameplayCatalog.GeneralRepeat]: async () =>
    (await import("./catalogs/general_repeat.ts")).createCatalog(),
  [GameplayCatalog.GeneralSale]: async () =>
    (await import("./catalogs/general_sale.ts")).createCatalog(),
  [GameplayCatalog.GeneralSkill]: async () =>
    (await import("./catalogs/general_skill.ts")).createCatalog(),
  [GameplayCatalog.GeneralStation]: async () =>
    (await import("./catalogs/general_station.ts")).createCatalog(),
  [GameplayCatalog.GeneralTalent]: async () =>
    (await import("./catalogs/general_talent.ts")).createCatalog(),
  [GameplayCatalog.GeoTreasureTask]: async () =>
    (await import("./catalogs/geo_treasure_task.ts")).createCatalog(),
  [GameplayCatalog.GetGeneral]: async () =>
    (await import("./catalogs/get_general.ts")).createCatalog(),
  [GameplayCatalog.Gift]: async () => (await import("./catalogs/gift.ts")).createCatalog(),
  [GameplayCatalog.Gold]: async () => (await import("./catalogs/gold.ts")).createCatalog(),
  [GameplayCatalog.GoldPrice]: async () =>
    (await import("./catalogs/gold_price.ts")).createCatalog(),
  [GameplayCatalog.GoldReward]: async () =>
    (await import("./catalogs/gold_reward.ts")).createCatalog(),
  [GameplayCatalog.GoldenEgg]: async () =>
    (await import("./catalogs/golden_egg.ts")).createCatalog(),
  [GameplayCatalog.GoldenEggStep]: async () =>
    (await import("./catalogs/golden_egg_step.ts")).createCatalog(),
  [GameplayCatalog.GoldenRoulette]: async () =>
    (await import("./catalogs/golden_roulette.ts")).createCatalog(),
  [GameplayCatalog.Goods]: async () => (await import("./catalogs/goods.ts")).createCatalog(),
  [GameplayCatalog.Grade]: async () => (await import("./catalogs/grade.ts")).createCatalog(),
  [GameplayCatalog.GrowthFund]: async () =>
    (await import("./catalogs/growth_fund.ts")).createCatalog(),
  [GameplayCatalog.Heap]: async () => (await import("./catalogs/heap.ts")).createCatalog(),
  [GameplayCatalog.Heritage]: async () => (await import("./catalogs/heritage.ts")).createCatalog(),
  [GameplayCatalog.Hero]: async () => (await import("./catalogs/hero.ts")).createCatalog(),
  [GameplayCatalog.HeroChallengeLayer]: async () =>
    (await import("./catalogs/hero_challenge_layer.ts")).createCatalog(),
  [GameplayCatalog.HeroChallengeMonster]: async () =>
    (await import("./catalogs/hero_challenge_monster.ts")).createCatalog(),
  [GameplayCatalog.HeroRoulette]: async () =>
    (await import("./catalogs/hero_roulette.ts")).createCatalog(),
  [GameplayCatalog.Heroactivity]: async () =>
    (await import("./catalogs/heroactivity.ts")).createCatalog(),
  [GameplayCatalog.Heroevent]: async () =>
    (await import("./catalogs/heroevent.ts")).createCatalog(),
  [GameplayCatalog.Hotgoods]: async () => (await import("./catalogs/hotgoods.ts")).createCatalog(),
  [GameplayCatalog.Hotstore]: async () => (await import("./catalogs/hotstore.ts")).createCatalog(),
  [GameplayCatalog.House]: async () => (await import("./catalogs/house.ts")).createCatalog(),
  [GameplayCatalog.Inspire]: async () => (await import("./catalogs/inspire.ts")).createCatalog(),
  [GameplayCatalog.IsopenUid]: async () =>
    (await import("./catalogs/isopen_uid.ts")).createCatalog(),
  [GameplayCatalog.Item]: async () => (await import("./catalogs/item.ts")).createCatalog(),
  [GameplayCatalog.KingdomBuilding]: async () =>
    (await import("./catalogs/kingdom_building.ts")).createCatalog(),
  [GameplayCatalog.KingdomBuildingBuff]: async () =>
    (await import("./catalogs/kingdom_building_buff.ts")).createCatalog(),
  [GameplayCatalog.Kingdomshop]: async () =>
    (await import("./catalogs/kingdomshop.ts")).createCatalog(),
  [GameplayCatalog.Kingdomskill]: async () =>
    (await import("./catalogs/kingdomskill.ts")).createCatalog(),
  [GameplayCatalog.Kingdon1]: async () => (await import("./catalogs/kingdon_1.ts")).createCatalog(),
  [GameplayCatalog.Kingdon2]: async () => (await import("./catalogs/kingdon_2.ts")).createCatalog(),
  [GameplayCatalog.KnightTitle]: async () =>
    (await import("./catalogs/knight_title.ts")).createCatalog(),
  [GameplayCatalog.Landing]: async () => (await import("./catalogs/landing.ts")).createCatalog(),
  [GameplayCatalog.LifeTreeS]: async () =>
    (await import("./catalogs/life_treeS.ts")).createCatalog(),
  [GameplayCatalog.LordDetails]: async () =>
    (await import("./catalogs/lordDetails.ts")).createCatalog(),
  [GameplayCatalog.LordImage]: async () =>
    (await import("./catalogs/lord_image.ts")).createCatalog(),
  [GameplayCatalog.LordImageXml]: async () =>
    (await import("./catalogs/lord_image.xml.ts")).createCatalog(),
  [GameplayCatalog.Lottery]: async () => (await import("./catalogs/lottery.ts")).createCatalog(),
  [GameplayCatalog.LuckDraw]: async () => (await import("./catalogs/luck_draw.ts")).createCatalog(),
  [GameplayCatalog.LuckyDay]: async () => (await import("./catalogs/lucky_day.ts")).createCatalog(),
  [GameplayCatalog.LuckyEffect]: async () =>
    (await import("./catalogs/lucky_effect.ts")).createCatalog(),
  [GameplayCatalog.LuckyEgg]: async () => (await import("./catalogs/lucky_egg.ts")).createCatalog(),
  [GameplayCatalog.LuckyReturnExchange]: async () =>
    (await import("./catalogs/lucky_return_exchange.ts")).createCatalog(),
  [GameplayCatalog.MagicRush]: async () =>
    (await import("./catalogs/magic_rush.ts")).createCatalog(),
  [GameplayCatalog.Mail]: async () => (await import("./catalogs/mail.ts")).createCatalog(),
  [GameplayCatalog.Mark]: async () => (await import("./catalogs/mark.ts")).createCatalog(),
  [GameplayCatalog.Market]: async () => (await import("./catalogs/market.ts")).createCatalog(),
  [GameplayCatalog.Material]: async () => (await import("./catalogs/material.ts")).createCatalog(),
  [GameplayCatalog.MergeActivity]: async () =>
    (await import("./catalogs/merge_activity.ts")).createCatalog(),
  [GameplayCatalog.MiracleBuff]: async () =>
    (await import("./catalogs/miracle_buff.ts")).createCatalog(),
  [GameplayCatalog.Monarch]: async () => (await import("./catalogs/monarch.ts")).createCatalog(),
  [GameplayCatalog.MonarchTitleKingdom]: async () =>
    (await import("./catalogs/monarch_title_kingdom.ts")).createCatalog(),
  [GameplayCatalog.MonarchTitleLord]: async () =>
    (await import("./catalogs/monarch_title_lord.ts")).createCatalog(),
  [GameplayCatalog.MonsterSiege]: async () =>
    (await import("./catalogs/monster_siege.ts")).createCatalog(),
  [GameplayCatalog.MonsterSiegeReward]: async () =>
    (await import("./catalogs/monster_siege_reward.ts")).createCatalog(),
  [GameplayCatalog.NeutralServerWorld]: async () =>
    (await import("./catalogs/dragonBattleWorld.ts")).createCatalog(),
  [GameplayCatalog.NeutralServerBuilding]: async () =>
    (await import("./catalogs/neutralServer_building.ts")).createCatalog(),
  [GameplayCatalog.NeutralServerReward]: async () =>
    (await import("./catalogs/neutralServer_reward.ts")).createCatalog(),
  [GameplayCatalog.NeutralServerScore]: async () =>
    (await import("./catalogs/neutralServer_score.ts")).createCatalog(),
  [GameplayCatalog.NewBank]: async () => (await import("./catalogs/new_bank.ts")).createCatalog(),
  [GameplayCatalog.NewContinuedCost]: async () =>
    (await import("./catalogs/continued_cost.ts")).createCatalog(),
  [GameplayCatalog.NewDailyTask]: async () =>
    (await import("./catalogs/new_daily_task.ts")).createCatalog(),
  [GameplayCatalog.NewExchange]: async () =>
    (await import("./catalogs/new_exchange.ts")).createCatalog(),
  [GameplayCatalog.NewRecallQuest]: async () =>
    (await import("./catalogs/new_recall_quest.ts")).createCatalog(),
  [GameplayCatalog.NewSprInfo]: async () =>
    (await import("./catalogs/new_spr_info.ts")).createCatalog(),
  [GameplayCatalog.NewSprRound]: async () =>
    (await import("./catalogs/new_spr_round.ts")).createCatalog(),
  [GameplayCatalog.NewWkPersonReward]: async () =>
    (await import("./catalogs/new_wk_person_reward.ts")).createCatalog(),
  [GameplayCatalog.NewWkReward]: async () =>
    (await import("./catalogs/new_wk_reward.ts")).createCatalog(),
  [GameplayCatalog.NewWkScore]: async () =>
    (await import("./catalogs/new_wk_score.ts")).createCatalog(),
  [GameplayCatalog.NewbeeCastleReward]: async () =>
    (await import("./catalogs/newbee_castle_reward.ts")).createCatalog(),
  [GameplayCatalog.NewbieItems]: async () =>
    (await import("./catalogs/newbie_items.ts")).createCatalog(),
  [GameplayCatalog.NewcomerTreviFountain]: async () =>
    (await import("./catalogs/newcomer_trevi_fountain.ts")).createCatalog(),
  [GameplayCatalog.Newplayer]: async () =>
    (await import("./catalogs/newplayer.ts")).createCatalog(),
  [GameplayCatalog.NewsCastleLV]: async () =>
    (await import("./catalogs/news_castleLV.ts")).createCatalog(),
  [GameplayCatalog.NewsHeap]: async () => (await import("./catalogs/news_heap.ts")).createCatalog(),
  [GameplayCatalog.NotiTimezone]: async () =>
    (await import("./catalogs/noti_timezone.ts")).createCatalog(),
  [GameplayCatalog.Npc]: async () => (await import("./catalogs/npc.ts")).createCatalog(),
  [GameplayCatalog.Office]: async () => (await import("./catalogs/office.ts")).createCatalog(),
  [GameplayCatalog.OnlineReward]: async () =>
    (await import("./catalogs/onlineReward.ts")).createCatalog(),
  [GameplayCatalog.Overlord]: async () => (await import("./catalogs/overlord.ts")).createCatalog(),
  [GameplayCatalog.P6Arms]: async () => (await import("./catalogs/p6_arms.ts")).createCatalog(),
  [GameplayCatalog.Package]: async () => (await import("./catalogs/package.ts")).createCatalog(),
  [GameplayCatalog.PayLottery]: async () =>
    (await import("./catalogs/pay_lottery.ts")).createCatalog(),
  [GameplayCatalog.PayReward]: async () =>
    (await import("./catalogs/pay_reward.ts")).createCatalog(),
  [GameplayCatalog.PayServercontrol]: async () =>
    (await import("./catalogs/pay_servercontrol.ts")).createCatalog(),
  [GameplayCatalog.PayUserReward]: async () =>
    (await import("./catalogs/pay_user_reward.ts")).createCatalog(),
  [GameplayCatalog.Paycard]: async () => (await import("./catalogs/paycard.ts")).createCatalog(),
  [GameplayCatalog.PfCheck]: async () => (await import("./catalogs/pf_check.ts")).createCatalog(),
  [GameplayCatalog.PlayerData]: async () =>
    (await import("./catalogs/playerData.ts")).createCatalog(),
  [GameplayCatalog.PlayerName]: async () =>
    (await import("./catalogs/playerName.ts")).createCatalog(),
  [GameplayCatalog.Position]: async () => (await import("./catalogs/position.ts")).createCatalog(),
  [GameplayCatalog.PositionUnlock]: async () =>
    (await import("./catalogs/position_unlock.ts")).createCatalog(),
  [GameplayCatalog.PowerRandom]: async () =>
    (await import("./catalogs/powerRandom.ts")).createCatalog(),
  [GameplayCatalog.Princess]: async () => (await import("./catalogs/princess.ts")).createCatalog(),
  [GameplayCatalog.PrincessQuest]: async () =>
    (await import("./catalogs/princess_quest.ts")).createCatalog(),
  [GameplayCatalog.Quest]: async () => (await import("./catalogs/quest.ts")).createCatalog(),
  [GameplayCatalog.QuestMark]: async () =>
    (await import("./catalogs/quest_mark.ts")).createCatalog(),
  [GameplayCatalog.QuestPhase]: async () =>
    (await import("./catalogs/quest_phase.ts")).createCatalog(),
  [GameplayCatalog.QuickBuilding]: async () =>
    (await import("./catalogs/quick_building.ts")).createCatalog(),
  [GameplayCatalog.QuickScience]: async () =>
    (await import("./catalogs/quick_science.ts")).createCatalog(),
  [GameplayCatalog.Rank]: async () => (await import("./catalogs/rank.ts")).createCatalog(),
  [GameplayCatalog.Recall]: async () => (await import("./catalogs/recall.ts")).createCatalog(),
  [GameplayCatalog.RecallActivity]: async () =>
    (await import("./catalogs/recall_activity.ts")).createCatalog(),
  [GameplayCatalog.RecallQuest]: async () =>
    (await import("./catalogs/recall_quest.ts")).createCatalog(),
  [GameplayCatalog.Recruit]: async () => (await import("./catalogs/recruit.ts")).createCatalog(),
  [GameplayCatalog.ReforgeRandom]: async () =>
    (await import("./catalogs/reforgeRandom.ts")).createCatalog(),
  [GameplayCatalog.ReputationAction]: async () =>
    (await import("./catalogs/reputation_action.ts")).createCatalog(),
  [GameplayCatalog.ReputationClassifylimit]: async () =>
    (await import("./catalogs/reputation_classifylimit.ts")).createCatalog(),
  [GameplayCatalog.ReputationLevel]: async () =>
    (await import("./catalogs/reputation_level.ts")).createCatalog(),
  [GameplayCatalog.Resdential]: async () =>
    (await import("./catalogs/resdential.ts")).createCatalog(),
  [GameplayCatalog.ResouceLife]: async () =>
    (await import("./catalogs/resouce_life.ts")).createCatalog(),
  [GameplayCatalog.Resource2]: async () =>
    (await import("./catalogs/resouce_life.ts")).createCatalog(),
  [GameplayCatalog.Resource3]: async () =>
    (await import("./catalogs/resource3.ts")).createCatalog(),
  [GameplayCatalog.Resources]: async () =>
    (await import("./catalogs/resources.ts")).createCatalog(),
  [GameplayCatalog.Reward]: async () => (await import("./catalogs/reward.ts")).createCatalog(),
  [GameplayCatalog.RewardAdd]: async () =>
    (await import("./catalogs/reward_add.ts")).createCatalog(),
  [GameplayCatalog.Role]: async () => (await import("./catalogs/role.ts")).createCatalog(),
  [GameplayCatalog.Safe]: async () => (await import("./catalogs/safe.ts")).createCatalog(),
  [GameplayCatalog.SagaTowerScienceBase]: async () =>
    (await import("./catalogs/saga_tower_science_base.ts")).createCatalog(),
  [GameplayCatalog.SagaTowerScienceUp]: async () =>
    (await import("./catalogs/saga_tower_science_up.ts")).createCatalog(),
  [GameplayCatalog.Science]: async () => (await import("./catalogs/science.ts")).createCatalog(),
  [GameplayCatalog.ScienceRace]: async () =>
    (await import("./catalogs/scienceRace.ts")).createCatalog(),
  [GameplayCatalog.ScienceRaceType]: async () =>
    (await import("./catalogs/scienceRaceType.ts")).createCatalog(),
  [GameplayCatalog.ScienceType]: async () =>
    (await import("./catalogs/scienceType.ts")).createCatalog(),
  [GameplayCatalog.Score]: async () => (await import("./catalogs/score.ts")).createCatalog(),
  [GameplayCatalog.Serverlist]: async () =>
    (await import("./catalogs/serverlist.ts")).createCatalog(),
  [GameplayCatalog.Serverpos]: async () =>
    (await import("./catalogs/serverpos.ts")).createCatalog(),
  [GameplayCatalog.Servers]: async () => (await import("./catalogs/servers.ts")).createCatalog(),
  [GameplayCatalog.ServersConfig]: async () =>
    (await import("./catalogs/servers_config.ts")).createCatalog(),
  [GameplayCatalog.Servertransfer]: async () =>
    (await import("./catalogs/servertransfer.ts")).createCatalog(),
  [GameplayCatalog.Setting]: async () => (await import("./catalogs/setting.ts")).createCatalog(),
  [GameplayCatalog.ShopNew]: async () => (await import("./catalogs/shop_new.ts")).createCatalog(),
  [GameplayCatalog.ShopNew7210]: async () =>
    (await import("./catalogs/shop_new7.21.0.ts")).createCatalog(),
  [GameplayCatalog.ShopNew926]: async () =>
    (await import("./catalogs/shop_new_9.26.ts")).createCatalog(),
  [GameplayCatalog.SignIn]: async () => (await import("./catalogs/sign_in.ts")).createCatalog(),
  [GameplayCatalog.SignIn2]: async () => (await import("./catalogs/sign_in_2.ts")).createCatalog(),
  [GameplayCatalog.SingleCharge]: async () =>
    (await import("./catalogs/single_charge.ts")).createCatalog(),
  [GameplayCatalog.Sk]: async () => (await import("./catalogs/sk.ts")).createCatalog(),
  [GameplayCatalog.Skill]: async () => (await import("./catalogs/skill.ts")).createCatalog(),
  [GameplayCatalog.Skill2]: async () => (await import("./catalogs/skill2.ts")).createCatalog(),
  [GameplayCatalog.Soldiers]: async () => (await import("./catalogs/soldiers.ts")).createCatalog(),
  [GameplayCatalog.SpLoad]: async () => (await import("./catalogs/sp_load.ts")).createCatalog(),
  [GameplayCatalog.SpResources]: async () =>
    (await import("./catalogs/sp_resources.ts")).createCatalog(),
  [GameplayCatalog.SpResourcesBet]: async () =>
    (await import("./catalogs/sp_resources_bet.ts")).createCatalog(),
  [GameplayCatalog.SpResourcesInit]: async () =>
    (await import("./catalogs/sp_resources_init.ts")).createCatalog(),
  [GameplayCatalog.SpResourcesList]: async () =>
    (await import("./catalogs/sp_resources_list.ts")).createCatalog(),
  [GameplayCatalog.SpResourcesRound]: async () =>
    (await import("./catalogs/sp_resources_round.ts")).createCatalog(),
  [GameplayCatalog.SpResourcesType]: async () =>
    (await import("./catalogs/sp_resources_type.ts")).createCatalog(),
  [GameplayCatalog.SpecialPush]: async () =>
    (await import("./catalogs/special_push.ts")).createCatalog(),
  [GameplayCatalog.StatusCopy]: async () =>
    (await import("./catalogs/status - Copy.ts")).createCatalog(),
  [GameplayCatalog.Status]: async () => (await import("./catalogs/status.ts")).createCatalog(),
  [GameplayCatalog.StorySetting]: async () =>
    (await import("./catalogs/story_setting.ts")).createCatalog(),
  [GameplayCatalog.SubcityReward]: async () =>
    (await import("./catalogs/subcity_reward.ts")).createCatalog(),
  [GameplayCatalog.Suit]: async () => (await import("./catalogs/suit.ts")).createCatalog(),
  [GameplayCatalog.Suitequipment]: async () =>
    (await import("./catalogs/suitequipment.ts")).createCatalog(),
  [GameplayCatalog.Svip]: async () => (await import("./catalogs/svip.ts")).createCatalog(),
  [GameplayCatalog.SvipShopBuilding]: async () =>
    (await import("./catalogs/svip_shop_building.ts")).createCatalog(),
  [GameplayCatalog.TargetQuest]: async () =>
    (await import("./catalogs/target_quest.ts")).createCatalog(),
  [GameplayCatalog.Territory]: async () =>
    (await import("./catalogs/territory.ts")).createCatalog(),
  [GameplayCatalog.TerritoryEffect]: async () =>
    (await import("./catalogs/territory_effect.ts")).createCatalog(),
  [GameplayCatalog.TimeGift]: async () => (await import("./catalogs/time_gift.ts")).createCatalog(),
  [GameplayCatalog.Totem]: async () => (await import("./catalogs/totem.ts")).createCatalog(),
  [GameplayCatalog.Tower]: async () => (await import("./catalogs/tower.ts")).createCatalog(),
  [GameplayCatalog.Trade]: async () => (await import("./catalogs/trade.ts")).createCatalog(),
  [GameplayCatalog.Train]: async () => (await import("./catalogs/train.ts")).createCatalog(),
  [GameplayCatalog.Treasure]: async () => (await import("./catalogs/treasure.ts")).createCatalog(),
  [GameplayCatalog.Trial]: async () => (await import("./catalogs/trial.ts")).createCatalog(),
  [GameplayCatalog.TriggerActivity]: async () =>
    (await import("./catalogs/trigger-activity.ts")).createCatalog(),
  [GameplayCatalog.TriggerExchange]: async () =>
    (await import("./catalogs/trigger-exchange.ts")).createCatalog(),
  [GameplayCatalog.TriggerVar]: async () =>
    (await import("./catalogs/trigger-var.ts")).createCatalog(),
  [GameplayCatalog.Trigger]: async () => (await import("./catalogs/trigger.ts")).createCatalog(),
  [GameplayCatalog.UpgradeReward]: async () =>
    (await import("./catalogs/lord_image.xml.ts")).createCatalog(),
  [GameplayCatalog.Variable]: async () => (await import("./catalogs/variable.ts")).createCatalog(),
  [GameplayCatalog.Vip]: async () => (await import("./catalogs/vip.ts")).createCatalog(),
  [GameplayCatalog.VoteServer]: async () =>
    (await import("./catalogs/vote_server.ts")).createCatalog(),
  [GameplayCatalog.WaBuild]: async () => (await import("./catalogs/wa_build.ts")).createCatalog(),
  [GameplayCatalog.WaMonster]: async () =>
    (await import("./catalogs/wa_monster.ts")).createCatalog(),
  [GameplayCatalog.WaRewardS]: async () =>
    (await import("./catalogs/wa_reward_s.ts")).createCatalog(),
  [GameplayCatalog.WagArea]: async () => (await import("./catalogs/wag_area.ts")).createCatalog(),
  [GameplayCatalog.WagBuild]: async () => (await import("./catalogs/wag_build.ts")).createCatalog(),
  [GameplayCatalog.WagMonster]: async () =>
    (await import("./catalogs/wag_monster.ts")).createCatalog(),
  [GameplayCatalog.WagReRank]: async () =>
    (await import("./catalogs/wag_re_rank.ts")).createCatalog(),
  [GameplayCatalog.WagReTeam]: async () =>
    (await import("./catalogs/wag_re_team.ts")).createCatalog(),
  [GameplayCatalog.WagRole]: async () => (await import("./catalogs/wag_role.ts")).createCatalog(),
  [GameplayCatalog.WapMatch]: async () => (await import("./catalogs/wap_match.ts")).createCatalog(),
  [GameplayCatalog.WapReRank]: async () =>
    (await import("./catalogs/wap_re_rank.ts")).createCatalog(),
  [GameplayCatalog.WapReTeam]: async () =>
    (await import("./catalogs/wag_re_team.ts")).createCatalog(),
  [GameplayCatalog.WbKill]: async () => (await import("./catalogs/wb_kill.ts")).createCatalog(),
  [GameplayCatalog.WbReward]: async () => (await import("./catalogs/wb_reward.ts")).createCatalog(),
  [GameplayCatalog.WbSkill]: async () => (await import("./catalogs/wb_skill.ts")).createCatalog(),
  [GameplayCatalog.Web]: async () => (await import("./catalogs/web.ts")).createCatalog(),
  [GameplayCatalog.WebCheck]: async () => (await import("./catalogs/webCheck.ts")).createCatalog(),
  [GameplayCatalog.Wish]: async () => (await import("./catalogs/wish.ts")).createCatalog(),
  [GameplayCatalog.WkBuild]: async () => (await import("./catalogs/wk_build.ts")).createCatalog(),
  [GameplayCatalog.WkPersonReward]: async () =>
    (await import("./catalogs/wk_person_reward.ts")).createCatalog(),
  [GameplayCatalog.WkQuest]: async () => (await import("./catalogs/wk_quest.ts")).createCatalog(),
  [GameplayCatalog.WkReward]: async () => (await import("./catalogs/wk_reward.ts")).createCatalog(),
  [GameplayCatalog.WkScore]: async () => (await import("./catalogs/wk_score.ts")).createCatalog(),
  [GameplayCatalog.WkServer]: async () => (await import("./catalogs/wk_server.ts")).createCatalog(),
  [GameplayCatalog.Wonder]: async () => (await import("./catalogs/wonder.ts")).createCatalog(),
  [GameplayCatalog.World]: async () => (await import("./catalogs/SeaWorldmap.ts")).createCatalog(),
  [GameplayCatalog.WorldLevel]: async () =>
    (await import("./catalogs/world_level.ts")).createCatalog(),
  [GameplayCatalog.Worldboss]: async () =>
    (await import("./catalogs/worldboss.ts")).createCatalog(),
  [GameplayCatalog.WrExp]: async () => (await import("./catalogs/wr_exp.ts")).createCatalog(),
  [GameplayCatalog.WrRank]: async () => (await import("./catalogs/wr_rank.ts")).createCatalog(),
  [GameplayCatalog.WrSever]: async () => (await import("./catalogs/wr_sever.ts")).createCatalog(),
  [GameplayCatalog.WrSkill]: async () => (await import("./catalogs/wr_skill.ts")).createCatalog(),
  [GameplayCatalog.WrTroopsPoint]: async () =>
    (await import("./catalogs/wr_troops_point.ts")).createCatalog(),
};
