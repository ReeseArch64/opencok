import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import type {
    TileMapDefinition,
    AutomationCatalog,
    VariableCatalog,
    WebRoutingCatalog,
} from "./catalog-model.ts";
import type { Catalog3thAnniversaryDefinitionCatalog } from "./catalogs/types/3th_anniversary.ts";
import type { Catalog3thAnniversaryControlDefinitionCatalog } from "./catalogs/types/3th_anniversary_control.ts";
import type { CivilizationInjuryDefinitionCatalog } from "./catalogs/types/Civilization_injury.ts";
import type { AbDefinitionCatalog } from "./catalogs/types/ab.ts";
import type { AbilityDefinitionCatalog } from "./catalogs/types/ability.ts";
import type { AccumulateDefinitionCatalog } from "./catalogs/types/accumulate.ts";
import type { AchievementDefinitionCatalog } from "./catalogs/types/achievement.ts";
import type { ActionDefinitionCatalog } from "./catalogs/types/action.ts";
import type { ActivityDefinitionCatalog } from "./catalogs/types/activity.ts";
import type { ActivityEventDefinitionCatalog } from "./catalogs/types/activity_event.ts";
import type { ActivityPageDefinitionCatalog } from "./catalogs/types/activity_page.ts";
import type { ActivityPanelDefinitionCatalog } from "./catalogs/types/activity_panel.ts";
import type { AddUserEquipDefinitionCatalog } from "./catalogs/types/add_user_equip.ts";
import type { AddUserGoodsDefinitionCatalog } from "./catalogs/types/add_user_goods.ts";
import type { AffairsDefinitionCatalog } from "./catalogs/types/affairs.ts";
import type { AllianceBossDefinitionCatalog } from "./catalogs/types/alliance_boss.ts";
import type { AllianceBossControlDefinitionCatalog } from "./catalogs/types/alliance_boss_control.ts";
import type { AllianceBossRewardDefinitionCatalog } from "./catalogs/types/alliance_boss_reward.ts";
import type { AllianceBuildingDefinitionCatalog } from "./catalogs/types/alliance_building.ts";
import type { AllianceBuildingSkillDefinitionCatalog } from "./catalogs/types/alliance_building_skill.ts";
import type { AllianceMissionDefinitionCatalog } from "./catalogs/types/alliance_mission.ts";
import type { AllianceQuestDefinitionCatalog } from "./catalogs/types/alliance_quest.ts";
import type { AllianceQuestColorranDefinitionCatalog } from "./catalogs/types/alliance_quest_colorran.ts";
import type { AllianceTeleportDefinitionCatalog } from "./catalogs/types/alliance_teleport.ts";
import type { AlliancescienceDefinitionCatalog } from "./catalogs/types/alliancescience.ts";
import type { AllianceshopDefinitionCatalog } from "./catalogs/types/allianceshop.ts";
import type { AreaDefinitionCatalog } from "./catalogs/types/area.ts";
import type { ArenaDefinitionCatalog } from "./catalogs/types/arena.ts";
import type { ArenaRankDefinitionCatalog } from "./catalogs/types/arena_rank.ts";
import type { ArmsDefinitionCatalog } from "./catalogs/types/arms.ts";
import type { ArmyDefinitionCatalog } from "./catalogs/types/army.ts";
import type { ArmyUpBaseDefinitionCatalog } from "./catalogs/types/army_up_base.ts";
import type { ArmyUpEffectDefinitionCatalog } from "./catalogs/types/army_up_effect.ts";
import type { ArmyUpWholeDefinitionCatalog } from "./catalogs/types/army_up_whole.ts";
import type { AttributeRandomDefinitionCatalog } from "./catalogs/types/attribute_random.ts";
import type { AuctionDefinitionCatalog } from "./catalogs/types/auction.ts";
import type { AutoUpdataDefinitionCatalog } from "./catalogs/types/auto_updata.ts";
import type { BankDefinitionCatalog } from "./catalogs/types/bank.ts";
import type { BanlistDefinitionCatalog } from "./catalogs/types/banlist.ts";
import type { BarbarionDefinitionCatalog } from "./catalogs/types/barbarion.ts";
import type { BestowTitleDefinitionCatalog } from "./catalogs/types/bestow_title.ts";
import type { BetDefinitionCatalog } from "./catalogs/types/bet.ts";
import type { BocaiDragonDefinitionCatalog } from "./catalogs/types/bocai_dragon.ts";
import type { BoxOrdinaryDefinitionCatalog } from "./catalogs/types/box_ordinary.ts";
import type { BoxVipDefinitionCatalog } from "./catalogs/types/box_vip.ts";
import type { BrResourceRefreshDefinitionCatalog } from "./catalogs/types/br_resource_refresh.ts";
import type { BuildingStarDefinitionCatalog } from "./catalogs/types/building_star.ts";
import type { BuildingStarupDefinitionCatalog } from "./catalogs/types/building_starup.ts";
import type { CargoDefinitionCatalog } from "./catalogs/types/cargo.ts";
import type { CharactersDefinitionCatalog } from "./catalogs/types/characters.ts";
import type { ChatbgColorDefinitionCatalog } from "./catalogs/types/chatbg_color.ts";
import type { CheckpointDefinitionCatalog } from "./catalogs/types/checkpoint.ts";
import type { CityDefinitionCatalog } from "./catalogs/types/city.ts";
import type { CivilizationDefinitionCatalog } from "./catalogs/types/civilization.ts";
import type { CivilizationFeatureDefinitionCatalog } from "./catalogs/types/civilization_feature.ts";
import type { CivilizationFortressDefinitionCatalog } from "./catalogs/types/civilization_fortress.ts";
import type { CleanDefinitionCatalog } from "./catalogs/types/clean.ts";
import type { ComebackDefinitionCatalog } from "./catalogs/types/comeback.ts";
import type { CompensationDefinitionCatalog } from "./catalogs/types/compensation.ts";
import type { ContinuedCostDefinitionCatalog } from "./catalogs/types/continued_cost.ts";
import type { ConvertDefinitionCatalog } from "./catalogs/types/convert.ts";
import type { CsmodSettingsDefinitionCatalog } from "./catalogs/types/csmod_settings.ts";
import type { DailyLoginDefinitionCatalog } from "./catalogs/types/daily_login.ts";
import type { DailyQuestDefinitionCatalog } from "./catalogs/types/daily_quest.ts";
import type { DailyRechargeDefinitionCatalog } from "./catalogs/types/daily_recharge.ts";
import type { DailyRewardDefinitionCatalog } from "./catalogs/types/daily_reward.ts";
import type { DailyTaskBoxDefinitionCatalog } from "./catalogs/types/daily_task_box.ts";
import type { DailyTaskRewardDefinitionCatalog } from "./catalogs/types/daily_task_reward.ts";
import type { DeepLinkDefinitionCatalog } from "./catalogs/types/deep_link.ts";
import type { DefeatNoticeDefinitionCatalog } from "./catalogs/types/defeatNotice.ts";
import type { DefensorDefinitionCatalog } from "./catalogs/types/defensor.ts";
import type { DelExchangeDefinitionCatalog } from "./catalogs/types/del_exchange.ts";
import type { DgRefinementDefinitionCatalog } from "./catalogs/types/dg_refinement.ts";
import type { DianjiRewardDefinitionCatalog } from "./catalogs/types/dianji_reward.ts";
import type { DiscountMallDefinitionCatalog } from "./catalogs/types/discount_mall.ts";
import type { DragonDefinitionCatalog } from "./catalogs/types/dragon.ts";
import type { DragonBaseDefinitionCatalog } from "./catalogs/types/dragon_base.ts";
import type { DragonCommunicateDefinitionCatalog } from "./catalogs/types/dragon_communicate.ts";
import type { DragonCrystalConditionDefinitionCatalog } from "./catalogs/types/dragon_crystal_condition.ts";
import type { DragonDetailDefinitionCatalog } from "./catalogs/types/dragon_detail.ts";
import type { DragonFoodDefinitionCatalog } from "./catalogs/types/dragon_food.ts";
import type { DragonGiftDefinitionCatalog } from "./catalogs/types/dragon_gift.ts";
import type { DragonNewDefinitionCatalog } from "./catalogs/types/dragon_new.ts";
import type { DragonSkillDefinitionCatalog } from "./catalogs/types/dragon_skill.ts";
import type { DragonSkillExpDefinitionCatalog } from "./catalogs/types/dragon_skill_exp.ts";
import type { DragonTalentDefinitionCatalog } from "./catalogs/types/dragon_talent.ts";
import type { DragonTalentExpDefinitionCatalog } from "./catalogs/types/dragon_talent_exp.ts";
import type { DragonTowerBuffDefinitionCatalog } from "./catalogs/types/dragon_tower_buff.ts";
import type { DragonTowerCoordDefinitionCatalog } from "./catalogs/types/dragon_tower_coord.ts";
import type { DragonTowerLayerDefinitionCatalog } from "./catalogs/types/dragon_tower_layer.ts";
import type { DragonTowerMonsterDefinitionCatalog } from "./catalogs/types/dragon_tower_monster.ts";
import type { DragonTravelDefinitionCatalog } from "./catalogs/types/dragon_travel.ts";
import type { DragonWordsDefinitionCatalog } from "./catalogs/types/dragon_words.ts";
import type { DrawRandomDefinitionCatalog } from "./catalogs/types/drawRandom.ts";
import type { DrconfigDefinitionCatalog } from "./catalogs/types/drconfig.ts";
import type { Drconfig7260DefinitionCatalog } from "./catalogs/types/drconfig7.26.0.ts";
import type { Drconfig9140DefinitionCatalog } from "./catalogs/types/drconfig9.14.0.ts";
import type { Drconfig9260DefinitionCatalog } from "./catalogs/types/drconfig9.26.0.ts";
import type { EffectDefinitionCatalog } from "./catalogs/types/effect.ts";
import type { EffectRequirementDefinitionCatalog } from "./catalogs/types/effect_requirement.ts";
import type { EggDefinitionCatalog } from "./catalogs/types/egg.ts";
import type { EmulatorDefinitionCatalog } from "./catalogs/types/emulator.ts";
import type { EndowmentDefinitionCatalog } from "./catalogs/types/endowment.ts";
import type { EquipStrengthDefinitionCatalog } from "./catalogs/types/equip_strength.ts";
import type { EquipmentDefinitionCatalog } from "./catalogs/types/equipment.ts";
import type { EquipmentRandomDefinitionCatalog } from "./catalogs/types/equipmentRandom.ts";
import type { EquipmentRandomPowerDefinitionCatalog } from "./catalogs/types/equipmentRandomPower.ts";
import type { EquipmentBagSuitFilterDefinitionCatalog } from "./catalogs/types/equipment_bag_suit_filter.ts";
import type { EquipmentRankDefinitionCatalog } from "./catalogs/types/equipment_rank.ts";
import type { EquipmentSmeltDefinitionCatalog } from "./catalogs/types/equipment_smelt.ts";
import type { EquipmentStrengthDefinitionCatalog } from "./catalogs/types/equipment_strength.ts";
import type { EquipmentStrengthenMoveDefinitionCatalog } from "./catalogs/types/equipment_strengthen_move.ts";
import type { EquipmentStrengthenRemoveDefinitionCatalog } from "./catalogs/types/equipment_strengthen_remove.ts";
import type { EventsDefinitionCatalog } from "./catalogs/types/events.ts";
import type { EverydayRechargeDefinitionCatalog } from "./catalogs/types/everyday_recharge.ts";
import type { ExchangeDefinitionCatalog } from "./catalogs/types/exchange.ts";
import type { ExchangeCycleDefinitionCatalog } from "./catalogs/types/exchange_cycle.ts";
import type { ExchangeFieldTypeDefinitionCatalog } from "./catalogs/types/exchange_field_type.ts";
import type { ExploreDefinitionCatalog } from "./catalogs/types/explore.ts";
import type { FbShareDefinitionCatalog } from "./catalogs/types/fb_share.ts";
import type { FieldMonsterDefinitionCatalog } from "./catalogs/types/field_monster.ts";
import type { ForeignCivilizationBaseDefinitionCatalog } from "./catalogs/types/foreign_civilization_base.ts";
import type { ForeignCivilizationUpDefinitionCatalog } from "./catalogs/types/foreign_civilization_up.ts";
import type { FragmentDefinitionCatalog } from "./catalogs/types/fragment.ts";
import type { FunctionOnCopyDefinitionCatalog } from "./catalogs/types/function_on - Copy.ts";
import type { FunctionOnDefinitionCatalog } from "./catalogs/types/function_on.ts";
import type { FunctionOn7210DefinitionCatalog } from "./catalogs/types/function_on7.21.0.ts";
import type { FunctionOn9170DefinitionCatalog } from "./catalogs/types/function_on9.17.0.ts";
import type { FunctionOn9180DefinitionCatalog } from "./catalogs/types/function_on9.18.0.ts";
import type { FunctionOnLuaUIDefinitionCatalog } from "./catalogs/types/function_on_luaUI.ts";
import type { FunctionStarDefinitionCatalog } from "./catalogs/types/function_star.ts";
import type { GeneralDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general";
import type { GeneralAbDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_ab";
import type { GeneralAwakeDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_awake";
import type { GeneralAwakenChallengeRewardDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_awaken_challenge_reward";
import type { GeneralBaseDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_base";
import type { GeneralBaseSkillTreeDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_base_skill_tree";
import type { GeneralCalledTaskDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_called_task";
import type { GeneralDetailDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_detail";
import type { GeneralDrawDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_draw";
import type { GeneralDrawNewMainDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_draw_new_main";
import type { GeneralDrawRateDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_draw_rate";
import type { GeneralLevelDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_level";
import type { GeneralMaxNumDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_max_num";
import type { GeneralOfficialDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_official";
import type { GeneralRandomEffectDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_random_effect";
import type { GeneralRandomNumDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_random_num";
import type { GeneralRankDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_rank";
import type { GeneralRepeatDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_repeat";
import type { GeneralSaleDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_sale";
import type { GeneralSkillDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_skill";
import type { GeneralStationDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_station";
import type { GeneralTalentDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/general_talent";
import type { GeoTreasureTaskDefinitionCatalog } from "./catalogs/types/geo_treasure_task.ts";
import type { GetGeneralDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/get_general";
import type { GiftDefinitionCatalog } from "./catalogs/types/gift.ts";
import type { GoldDefinitionCatalog } from "./catalogs/types/gold.ts";
import type { GoldPriceDefinitionCatalog } from "./catalogs/types/gold_price.ts";
import type { GoldRewardDefinitionCatalog } from "./catalogs/types/gold_reward.ts";
import type { GoldenEggDefinitionCatalog } from "./catalogs/types/golden_egg.ts";
import type { GoldenEggStepDefinitionCatalog } from "./catalogs/types/golden_egg_step.ts";
import type { GoldenRouletteDefinitionCatalog } from "./catalogs/types/golden_roulette.ts";
import type { GoodsDefinitionCatalog } from "./catalogs/types/goods.ts";
import type { GradeDefinitionCatalog } from "./catalogs/types/grade.ts";
import type { GrowthFundDefinitionCatalog } from "./catalogs/types/growth_fund.ts";
import type { HeapDefinitionCatalog } from "./catalogs/types/heap.ts";
import type { HeritageDefinitionCatalog } from "./catalogs/types/heritage.ts";
import type { HeroDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/hero";
import type { HeroChallengeLayerDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/hero_challenge_layer";
import type { HeroChallengeMonsterDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/hero_challenge_monster";
import type { HeroRouletteDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/hero_roulette";
import type { HeroactivityDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/heroactivity";
import type { HeroeventDefinitionCatalog } from "@opencok/hero/resources/catalogs/types/heroevent";
import type { HotgoodsDefinitionCatalog } from "./catalogs/types/hotgoods.ts";
import type { HotstoreDefinitionCatalog } from "./catalogs/types/hotstore.ts";
import type { HouseDefinitionCatalog } from "./catalogs/types/house.ts";
import type { InspireDefinitionCatalog } from "./catalogs/types/inspire.ts";
import type { IsopenUidDefinitionCatalog } from "./catalogs/types/isopen_uid.ts";
import type { ItemDefinitionCatalog } from "./catalogs/types/item.ts";
import type { KingdomBuildingDefinitionCatalog } from "./catalogs/types/kingdom_building.ts";
import type { KingdomBuildingBuffDefinitionCatalog } from "./catalogs/types/kingdom_building_buff.ts";
import type { KingdomshopDefinitionCatalog } from "./catalogs/types/kingdomshop.ts";
import type { KingdomskillDefinitionCatalog } from "./catalogs/types/kingdomskill.ts";
import type { Kingdon1DefinitionCatalog } from "./catalogs/types/kingdon_1.ts";
import type { Kingdon2DefinitionCatalog } from "./catalogs/types/kingdon_2.ts";
import type { KnightTitleDefinitionCatalog } from "./catalogs/types/knight_title.ts";
import type { LandingDefinitionCatalog } from "./catalogs/types/landing.ts";
import type { LifeTreeSDefinitionCatalog } from "./catalogs/types/life_treeS.ts";
import type { LordDetailsDefinitionCatalog } from "./catalogs/types/lordDetails.ts";
import type { LordImageDefinitionCatalog } from "./catalogs/types/lord_image.ts";
import type { LordImageXmlDefinitionCatalog } from "./catalogs/types/lord_image.xml.ts";
import type { LotteryDefinitionCatalog } from "./catalogs/types/lottery.ts";
import type { LuckDrawDefinitionCatalog } from "./catalogs/types/luck_draw.ts";
import type { LuckyDayDefinitionCatalog } from "./catalogs/types/lucky_day.ts";
import type { LuckyEffectDefinitionCatalog } from "./catalogs/types/lucky_effect.ts";
import type { LuckyEggDefinitionCatalog } from "./catalogs/types/lucky_egg.ts";
import type { LuckyReturnExchangeDefinitionCatalog } from "./catalogs/types/lucky_return_exchange.ts";
import type { MagicRushDefinitionCatalog } from "./catalogs/types/magic_rush.ts";
import type { MailDefinitionCatalog } from "./catalogs/types/mail.ts";
import type { MarkDefinitionCatalog } from "./catalogs/types/mark.ts";
import type { MarketDefinitionCatalog } from "./catalogs/types/market.ts";
import type { MaterialDefinitionCatalog } from "./catalogs/types/material.ts";
import type { MergeActivityDefinitionCatalog } from "./catalogs/types/merge_activity.ts";
import type { MiracleBuffDefinitionCatalog } from "./catalogs/types/miracle_buff.ts";
import type { MonarchDefinitionCatalog } from "./catalogs/types/monarch.ts";
import type { MonarchTitleKingdomDefinitionCatalog } from "./catalogs/types/monarch_title_kingdom.ts";
import type { MonarchTitleLordDefinitionCatalog } from "./catalogs/types/monarch_title_lord.ts";
import type { MonsterSiegeDefinitionCatalog } from "./catalogs/types/monster_siege.ts";
import type { MonsterSiegeRewardDefinitionCatalog } from "./catalogs/types/monster_siege_reward.ts";
import type { NeutralServerBuildingDefinitionCatalog } from "./catalogs/types/neutralServer_building.ts";
import type { NeutralServerRewardDefinitionCatalog } from "./catalogs/types/neutralServer_reward.ts";
import type { NeutralServerScoreDefinitionCatalog } from "./catalogs/types/neutralServer_score.ts";
import type { NewBankDefinitionCatalog } from "./catalogs/types/new_bank.ts";
import type { NewDailyTaskDefinitionCatalog } from "./catalogs/types/new_daily_task.ts";
import type { NewExchangeDefinitionCatalog } from "./catalogs/types/new_exchange.ts";
import type { NewRecallQuestDefinitionCatalog } from "./catalogs/types/new_recall_quest.ts";
import type { NewSprInfoDefinitionCatalog } from "./catalogs/types/new_spr_info.ts";
import type { NewSprRoundDefinitionCatalog } from "./catalogs/types/new_spr_round.ts";
import type { NewWkPersonRewardDefinitionCatalog } from "./catalogs/types/new_wk_person_reward.ts";
import type { NewWkRewardDefinitionCatalog } from "./catalogs/types/new_wk_reward.ts";
import type { NewWkScoreDefinitionCatalog } from "./catalogs/types/new_wk_score.ts";
import type { NewbeeCastleRewardDefinitionCatalog } from "./catalogs/types/newbee_castle_reward.ts";
import type { NewbieItemsDefinitionCatalog } from "./catalogs/types/newbie_items.ts";
import type { NewcomerTreviFountainDefinitionCatalog } from "./catalogs/types/newcomer_trevi_fountain.ts";
import type { NewplayerDefinitionCatalog } from "./catalogs/types/newplayer.ts";
import type { NewsCastleLVDefinitionCatalog } from "./catalogs/types/news_castleLV.ts";
import type { NewsHeapDefinitionCatalog } from "./catalogs/types/news_heap.ts";
import type { NotiTimezoneDefinitionCatalog } from "./catalogs/types/noti_timezone.ts";
import type { NpcDefinitionCatalog } from "./catalogs/types/npc.ts";
import type { OfficeDefinitionCatalog } from "./catalogs/types/office.ts";
import type { OnlineRewardDefinitionCatalog } from "./catalogs/types/onlineReward.ts";
import type { OverlordDefinitionCatalog } from "./catalogs/types/overlord.ts";
import type { P6ArmsDefinitionCatalog } from "./catalogs/types/p6_arms.ts";
import type { PackageDefinitionCatalog } from "./catalogs/types/package.ts";
import type { PayLotteryDefinitionCatalog } from "./catalogs/types/pay_lottery.ts";
import type { PayRewardDefinitionCatalog } from "./catalogs/types/pay_reward.ts";
import type { PayServercontrolDefinitionCatalog } from "./catalogs/types/pay_servercontrol.ts";
import type { PayUserRewardDefinitionCatalog } from "./catalogs/types/pay_user_reward.ts";
import type { PaycardDefinitionCatalog } from "./catalogs/types/paycard.ts";
import type { PfCheckDefinitionCatalog } from "./catalogs/types/pf_check.ts";
import type { PlayerDataDefinitionCatalog } from "./catalogs/types/playerData.ts";
import type { PlayerNameDefinitionCatalog } from "./catalogs/types/playerName.ts";
import type { PositionDefinitionCatalog } from "./catalogs/types/position.ts";
import type { PositionUnlockDefinitionCatalog } from "./catalogs/types/position_unlock.ts";
import type { PowerRandomDefinitionCatalog } from "./catalogs/types/powerRandom.ts";
import type { PrincessDefinitionCatalog } from "./catalogs/types/princess.ts";
import type { PrincessQuestDefinitionCatalog } from "./catalogs/types/princess_quest.ts";
import type { QuestDefinitionCatalog } from "./catalogs/types/quest.ts";
import type { QuestMarkDefinitionCatalog } from "./catalogs/types/quest_mark.ts";
import type { QuestPhaseDefinitionCatalog } from "./catalogs/types/quest_phase.ts";
import type { QuickBuildingDefinitionCatalog } from "./catalogs/types/quick_building.ts";
import type { QuickScienceDefinitionCatalog } from "./catalogs/types/quick_science.ts";
import type { RankDefinitionCatalog } from "./catalogs/types/rank.ts";
import type { RecallDefinitionCatalog } from "./catalogs/types/recall.ts";
import type { RecallActivityDefinitionCatalog } from "./catalogs/types/recall_activity.ts";
import type { RecallQuestDefinitionCatalog } from "./catalogs/types/recall_quest.ts";
import type { RecruitDefinitionCatalog } from "./catalogs/types/recruit.ts";
import type { ReforgeRandomDefinitionCatalog } from "./catalogs/types/reforgeRandom.ts";
import type { ReputationActionDefinitionCatalog } from "./catalogs/types/reputation_action.ts";
import type { ReputationClassifylimitDefinitionCatalog } from "./catalogs/types/reputation_classifylimit.ts";
import type { ReputationLevelDefinitionCatalog } from "./catalogs/types/reputation_level.ts";
import type { ResdentialDefinitionCatalog } from "./catalogs/types/resdential.ts";
import type { ResouceLifeDefinitionCatalog } from "./catalogs/types/resouce_life.ts";
import type { Resource3DefinitionCatalog } from "./catalogs/types/resource3.ts";
import type { ResourcesDefinitionCatalog } from "./catalogs/types/resources.ts";
import type { RewardDefinitionCatalog } from "./catalogs/types/reward.ts";
import type { RewardAddDefinitionCatalog } from "./catalogs/types/reward_add.ts";
import type { RoleDefinitionCatalog } from "./catalogs/types/role.ts";
import type { SafeDefinitionCatalog } from "./catalogs/types/safe.ts";
import type { SagaTowerScienceBaseDefinitionCatalog } from "./catalogs/types/saga_tower_science_base.ts";
import type { SagaTowerScienceUpDefinitionCatalog } from "./catalogs/types/saga_tower_science_up.ts";
import type { ScienceDefinitionCatalog } from "./catalogs/types/science.ts";
import type { ScienceRaceDefinitionCatalog } from "./catalogs/types/scienceRace.ts";
import type { ScienceRaceTypeDefinitionCatalog } from "./catalogs/types/scienceRaceType.ts";
import type { ScienceTypeDefinitionCatalog } from "./catalogs/types/scienceType.ts";
import type { ScoreDefinitionCatalog } from "./catalogs/types/score.ts";
import type { ServerlistDefinitionCatalog } from "./catalogs/types/serverlist.ts";
import type { ServerposDefinitionCatalog } from "./catalogs/types/serverpos.ts";
import type { ServersDefinitionCatalog } from "./catalogs/types/servers.ts";
import type { ServersConfigDefinitionCatalog } from "./catalogs/types/servers_config.ts";
import type { ServertransferDefinitionCatalog } from "./catalogs/types/servertransfer.ts";
import type { SettingDefinitionCatalog } from "./catalogs/types/setting.ts";
import type { ShopNewDefinitionCatalog } from "./catalogs/types/shop_new.ts";
import type { ShopNew7210DefinitionCatalog } from "./catalogs/types/shop_new7.21.0.ts";
import type { ShopNew926DefinitionCatalog } from "./catalogs/types/shop_new_9.26.ts";
import type { SignInDefinitionCatalog } from "./catalogs/types/sign_in.ts";
import type { SignIn2DefinitionCatalog } from "./catalogs/types/sign_in_2.ts";
import type { SingleChargeDefinitionCatalog } from "./catalogs/types/single_charge.ts";
import type { SkDefinitionCatalog } from "./catalogs/types/sk.ts";
import type { SkillDefinitionCatalog } from "./catalogs/types/skill.ts";
import type { Skill2DefinitionCatalog } from "./catalogs/types/skill2.ts";
import type { SoldiersDefinitionCatalog } from "./catalogs/types/soldiers.ts";
import type { SpLoadDefinitionCatalog } from "./catalogs/types/sp_load.ts";
import type { SpResourcesDefinitionCatalog } from "./catalogs/types/sp_resources.ts";
import type { SpResourcesBetDefinitionCatalog } from "./catalogs/types/sp_resources_bet.ts";
import type { SpResourcesInitDefinitionCatalog } from "./catalogs/types/sp_resources_init.ts";
import type { SpResourcesListDefinitionCatalog } from "./catalogs/types/sp_resources_list.ts";
import type { SpResourcesRoundDefinitionCatalog } from "./catalogs/types/sp_resources_round.ts";
import type { SpResourcesTypeDefinitionCatalog } from "./catalogs/types/sp_resources_type.ts";
import type { SpecialPushDefinitionCatalog } from "./catalogs/types/special_push.ts";
import type { StatusCopyDefinitionCatalog } from "./catalogs/types/status - Copy.ts";
import type { StatusDefinitionCatalog } from "./catalogs/types/status.ts";
import type { StorySettingDefinitionCatalog } from "./catalogs/types/story_setting.ts";
import type { SubcityRewardDefinitionCatalog } from "./catalogs/types/subcity_reward.ts";
import type { SuitDefinitionCatalog } from "./catalogs/types/suit.ts";
import type { SuitequipmentDefinitionCatalog } from "./catalogs/types/suitequipment.ts";
import type { SvipDefinitionCatalog } from "./catalogs/types/svip.ts";
import type { SvipShopBuildingDefinitionCatalog } from "./catalogs/types/svip_shop_building.ts";
import type { TargetQuestDefinitionCatalog } from "./catalogs/types/target_quest.ts";
import type { TerritoryDefinitionCatalog } from "./catalogs/types/territory.ts";
import type { TerritoryEffectDefinitionCatalog } from "./catalogs/types/territory_effect.ts";
import type { TimeGiftDefinitionCatalog } from "./catalogs/types/time_gift.ts";
import type { TotemDefinitionCatalog } from "./catalogs/types/totem.ts";
import type { TowerDefinitionCatalog } from "./catalogs/types/tower.ts";
import type { TradeDefinitionCatalog } from "./catalogs/types/trade.ts";
import type { TrainDefinitionCatalog } from "./catalogs/types/train.ts";
import type { TreasureDefinitionCatalog } from "./catalogs/types/treasure.ts";
import type { TrialDefinitionCatalog } from "./catalogs/types/trial.ts";
import type { VipDefinitionCatalog } from "./catalogs/types/vip.ts";
import type { VoteServerDefinitionCatalog } from "./catalogs/types/vote_server.ts";
import type { WaBuildDefinitionCatalog } from "./catalogs/types/wa_build.ts";
import type { WaMonsterDefinitionCatalog } from "./catalogs/types/wa_monster.ts";
import type { WaRewardSDefinitionCatalog } from "./catalogs/types/wa_reward_s.ts";
import type { WagAreaDefinitionCatalog } from "./catalogs/types/wag_area.ts";
import type { WagBuildDefinitionCatalog } from "./catalogs/types/wag_build.ts";
import type { WagMonsterDefinitionCatalog } from "./catalogs/types/wag_monster.ts";
import type { WagReRankDefinitionCatalog } from "./catalogs/types/wag_re_rank.ts";
import type { WagReTeamDefinitionCatalog } from "./catalogs/types/wag_re_team.ts";
import type { WagRoleDefinitionCatalog } from "./catalogs/types/wag_role.ts";
import type { WapMatchDefinitionCatalog } from "./catalogs/types/wap_match.ts";
import type { WapReRankDefinitionCatalog } from "./catalogs/types/wap_re_rank.ts";
import type { WbKillDefinitionCatalog } from "./catalogs/types/wb_kill.ts";
import type { WbRewardDefinitionCatalog } from "./catalogs/types/wb_reward.ts";
import type { WbSkillDefinitionCatalog } from "./catalogs/types/wb_skill.ts";
import type { WebCheckDefinitionCatalog } from "./catalogs/types/webCheck.ts";
import type { WishDefinitionCatalog } from "./catalogs/types/wish.ts";
import type { WkBuildDefinitionCatalog } from "./catalogs/types/wk_build.ts";
import type { WkPersonRewardDefinitionCatalog } from "./catalogs/types/wk_person_reward.ts";
import type { WkQuestDefinitionCatalog } from "./catalogs/types/wk_quest.ts";
import type { WkRewardDefinitionCatalog } from "./catalogs/types/wk_reward.ts";
import type { WkScoreDefinitionCatalog } from "./catalogs/types/wk_score.ts";
import type { WkServerDefinitionCatalog } from "./catalogs/types/wk_server.ts";
import type { WonderDefinitionCatalog } from "./catalogs/types/wonder.ts";
import type { WorldLevelDefinitionCatalog } from "./catalogs/types/world_level.ts";
import type { WorldbossDefinitionCatalog } from "./catalogs/types/worldboss.ts";
import type { WrExpDefinitionCatalog } from "./catalogs/types/wr_exp.ts";
import type { WrRankDefinitionCatalog } from "./catalogs/types/wr_rank.ts";
import type { WrSeverDefinitionCatalog } from "./catalogs/types/wr_sever.ts";
import type { WrSkillDefinitionCatalog } from "./catalogs/types/wr_skill.ts";
import type { WrTroopsPointDefinitionCatalog } from "./catalogs/types/wr_troops_point.ts";

export interface GameplayCatalogDefinitions
{
    [GameplayCatalog.Catalog3thAnniversary]: Catalog3thAnniversaryDefinitionCatalog;
    [GameplayCatalog.Catalog3thAnniversaryControl]: Catalog3thAnniversaryControlDefinitionCatalog;
    [GameplayCatalog.ArenaMap]: TileMapDefinition;
    [GameplayCatalog.CivilizationInjury]: CivilizationInjuryDefinitionCatalog;
    [GameplayCatalog.CrossThroneMap]: TileMapDefinition;
    [GameplayCatalog.SeaWorldmap]: TileMapDefinition;
    [GameplayCatalog.Ab]: AbDefinitionCatalog;
    [GameplayCatalog.Ability]: AbilityDefinitionCatalog;
    [GameplayCatalog.Accumulate]: AccumulateDefinitionCatalog;
    [GameplayCatalog.Achievement]: AchievementDefinitionCatalog;
    [GameplayCatalog.Action]: ActionDefinitionCatalog;
    [GameplayCatalog.Activity]: ActivityDefinitionCatalog;
    [GameplayCatalog.ActivityEvent]: ActivityEventDefinitionCatalog;
    [GameplayCatalog.ActivityPage]: ActivityPageDefinitionCatalog;
    [GameplayCatalog.ActivityPanel]: ActivityPanelDefinitionCatalog;
    [GameplayCatalog.AddUserEquip]: AddUserEquipDefinitionCatalog;
    [GameplayCatalog.AddUserGoods]: AddUserGoodsDefinitionCatalog;
    [GameplayCatalog.Affairs]: AffairsDefinitionCatalog;
    [GameplayCatalog.AllianceBoss]: AllianceBossDefinitionCatalog;
    [GameplayCatalog.AllianceBossControl]: AllianceBossControlDefinitionCatalog;
    [GameplayCatalog.AllianceBossReward]: AllianceBossRewardDefinitionCatalog;
    [GameplayCatalog.AllianceBuilding]: AllianceBuildingDefinitionCatalog;
    [GameplayCatalog.AllianceBuildingSkill]: AllianceBuildingSkillDefinitionCatalog;
    [GameplayCatalog.AllianceMission]: AllianceMissionDefinitionCatalog;
    [GameplayCatalog.AllianceQuest]: AllianceQuestDefinitionCatalog;
    [GameplayCatalog.AllianceQuestColorran]: AllianceQuestColorranDefinitionCatalog;
    [GameplayCatalog.AllianceTeleport]: AllianceTeleportDefinitionCatalog;
    [GameplayCatalog.Alliancescience]: AlliancescienceDefinitionCatalog;
    [GameplayCatalog.Allianceshop]: AllianceshopDefinitionCatalog;
    [GameplayCatalog.Area]: AreaDefinitionCatalog;
    [GameplayCatalog.Arena]: ArenaDefinitionCatalog;
    [GameplayCatalog.ArenaRank]: ArenaRankDefinitionCatalog;
    [GameplayCatalog.Arms]: ArmsDefinitionCatalog;
    [GameplayCatalog.Army]: ArmyDefinitionCatalog;
    [GameplayCatalog.ArmyUpBase]: ArmyUpBaseDefinitionCatalog;
    [GameplayCatalog.ArmyUpEffect]: ArmyUpEffectDefinitionCatalog;
    [GameplayCatalog.ArmyUpWhole]: ArmyUpWholeDefinitionCatalog;
    [GameplayCatalog.AttributeRandom]: AttributeRandomDefinitionCatalog;
    [GameplayCatalog.Auction]: AuctionDefinitionCatalog;
    [GameplayCatalog.AutoUpdata]: AutoUpdataDefinitionCatalog;
    [GameplayCatalog.Bank]: BankDefinitionCatalog;
    [GameplayCatalog.Banlist]: BanlistDefinitionCatalog;
    [GameplayCatalog.Barbarion]: BarbarionDefinitionCatalog;
    [GameplayCatalog.BestowTitle]: BestowTitleDefinitionCatalog;
    [GameplayCatalog.Bet]: BetDefinitionCatalog;
    [GameplayCatalog.BocaiDragon]: BocaiDragonDefinitionCatalog;
    [GameplayCatalog.BoxOrdinary]: BoxOrdinaryDefinitionCatalog;
    [GameplayCatalog.BoxVip]: BoxVipDefinitionCatalog;
    [GameplayCatalog.BrResourceRefresh]: BrResourceRefreshDefinitionCatalog;
    [GameplayCatalog.BuildingStar]: BuildingStarDefinitionCatalog;
    [GameplayCatalog.BuildingStarup]: BuildingStarupDefinitionCatalog;
    [GameplayCatalog.Cargo]: CargoDefinitionCatalog;
    [GameplayCatalog.Characters]: CharactersDefinitionCatalog;
    [GameplayCatalog.ChatbgColor]: ChatbgColorDefinitionCatalog;
    [GameplayCatalog.Checkpoint]: CheckpointDefinitionCatalog;
    [GameplayCatalog.City]: CityDefinitionCatalog;
    [GameplayCatalog.Civilization]: CivilizationDefinitionCatalog;
    [GameplayCatalog.CivilizationFeature]: CivilizationFeatureDefinitionCatalog;
    [GameplayCatalog.CivilizationFortress]: CivilizationFortressDefinitionCatalog;
    [GameplayCatalog.Clean]: CleanDefinitionCatalog;
    [GameplayCatalog.Comeback]: ComebackDefinitionCatalog;
    [GameplayCatalog.Compensation]: CompensationDefinitionCatalog;
    [GameplayCatalog.ContinuedCost]: ContinuedCostDefinitionCatalog;
    [GameplayCatalog.Convert]: ConvertDefinitionCatalog;
    [GameplayCatalog.CrossFightWorld]: TileMapDefinition;
    [GameplayCatalog.CrossThroneMaster]: TileMapDefinition;
    [GameplayCatalog.CsmodAutoUpgrade]: BuildingStarupDefinitionCatalog;
    [GameplayCatalog.CsmodSettings]: CsmodSettingsDefinitionCatalog;
    [GameplayCatalog.DailyLogin]: DailyLoginDefinitionCatalog;
    [GameplayCatalog.DailyQuest]: DailyQuestDefinitionCatalog;
    [GameplayCatalog.DailyRecharge]: DailyRechargeDefinitionCatalog;
    [GameplayCatalog.DailyReward]: DailyRewardDefinitionCatalog;
    [GameplayCatalog.DailyTaskBox]: DailyTaskBoxDefinitionCatalog;
    [GameplayCatalog.DailyTaskReward]: DailyTaskRewardDefinitionCatalog;
    [GameplayCatalog.DeepLink]: DeepLinkDefinitionCatalog;
    [GameplayCatalog.DefeatNotice]: DefeatNoticeDefinitionCatalog;
    [GameplayCatalog.Defensor]: DefensorDefinitionCatalog;
    [GameplayCatalog.DelExchange]: DelExchangeDefinitionCatalog;
    [GameplayCatalog.DgRefinement]: DgRefinementDefinitionCatalog;
    [GameplayCatalog.DianjiReward]: DianjiRewardDefinitionCatalog;
    [GameplayCatalog.DiscountMall]: DiscountMallDefinitionCatalog;
    [GameplayCatalog.Dragon]: DragonDefinitionCatalog;
    [GameplayCatalog.DragonBattleWorld]: TileMapDefinition;
    [GameplayCatalog.DragonBase]: DragonBaseDefinitionCatalog;
    [GameplayCatalog.DragonCommunicate]: DragonCommunicateDefinitionCatalog;
    [GameplayCatalog.DragonCrystalCondition]: DragonCrystalConditionDefinitionCatalog;
    [GameplayCatalog.DragonDetail]: DragonDetailDefinitionCatalog;
    [GameplayCatalog.DragonEgg]: DragonDefinitionCatalog;
    [GameplayCatalog.DragonExp]: DragonDefinitionCatalog;
    [GameplayCatalog.DragonFood]: DragonFoodDefinitionCatalog;
    [GameplayCatalog.DragonGift]: DragonGiftDefinitionCatalog;
    [GameplayCatalog.DragonNew]: DragonNewDefinitionCatalog;
    [GameplayCatalog.DragonSkill]: DragonSkillDefinitionCatalog;
    [GameplayCatalog.DragonSkillExp]: DragonSkillExpDefinitionCatalog;
    [GameplayCatalog.DragonTalent]: DragonTalentDefinitionCatalog;
    [GameplayCatalog.DragonTalentExp]: DragonTalentExpDefinitionCatalog;
    [GameplayCatalog.DragonTowerBuff]: DragonTowerBuffDefinitionCatalog;
    [GameplayCatalog.DragonTowerCoord]: DragonTowerCoordDefinitionCatalog;
    [GameplayCatalog.DragonTowerLayer]: DragonTowerLayerDefinitionCatalog;
    [GameplayCatalog.DragonTowerMonster]: DragonTowerMonsterDefinitionCatalog;
    [GameplayCatalog.DragonTravel]: DragonTravelDefinitionCatalog;
    [GameplayCatalog.DragonWords]: DragonWordsDefinitionCatalog;
    [GameplayCatalog.DrawRandom]: DrawRandomDefinitionCatalog;
    [GameplayCatalog.Drconfig]: DrconfigDefinitionCatalog;
    [GameplayCatalog.Drconfig7260]: Drconfig7260DefinitionCatalog;
    [GameplayCatalog.Drconfig9100]: Drconfig7260DefinitionCatalog;
    [GameplayCatalog.Drconfig9140]: Drconfig9140DefinitionCatalog;
    [GameplayCatalog.Drconfig9150]: Drconfig9140DefinitionCatalog;
    [GameplayCatalog.Drconfig9160]: Drconfig9140DefinitionCatalog;
    [GameplayCatalog.Drconfig9170]: Drconfig9140DefinitionCatalog;
    [GameplayCatalog.Drconfig9180]: Drconfig9140DefinitionCatalog;
    [GameplayCatalog.Drconfig9260]: Drconfig9260DefinitionCatalog;
    [GameplayCatalog.Drconfig9270]: Drconfig9260DefinitionCatalog;
    [GameplayCatalog.Effect]: EffectDefinitionCatalog;
    [GameplayCatalog.EffectRequirement]: EffectRequirementDefinitionCatalog;
    [GameplayCatalog.Egg]: EggDefinitionCatalog;
    [GameplayCatalog.Emulator]: EmulatorDefinitionCatalog;
    [GameplayCatalog.Endowment]: EndowmentDefinitionCatalog;
    [GameplayCatalog.EquipStrength]: EquipStrengthDefinitionCatalog;
    [GameplayCatalog.Equipment]: EquipmentDefinitionCatalog;
    [GameplayCatalog.EquipmentRandom]: EquipmentRandomDefinitionCatalog;
    [GameplayCatalog.EquipmentRandomPower]: EquipmentRandomPowerDefinitionCatalog;
    [GameplayCatalog.EquipmentBagSuitFilter]: EquipmentBagSuitFilterDefinitionCatalog;
    [GameplayCatalog.EquipmentRank]: EquipmentRankDefinitionCatalog;
    [GameplayCatalog.EquipmentSmelt]: EquipmentSmeltDefinitionCatalog;
    [GameplayCatalog.EquipmentStrength]: EquipmentStrengthDefinitionCatalog;
    [GameplayCatalog.EquipmentStrengthenMove]: EquipmentStrengthenMoveDefinitionCatalog;
    [GameplayCatalog.EquipmentStrengthenRemove]: EquipmentStrengthenRemoveDefinitionCatalog;
    [GameplayCatalog.EquipmentstrengthRandom]: EquipStrengthDefinitionCatalog;
    [GameplayCatalog.EquipmentstrengthRandomPower]: EquipmentRandomPowerDefinitionCatalog;
    [GameplayCatalog.Event]: AutomationCatalog;
    [GameplayCatalog.Events]: EventsDefinitionCatalog;
    [GameplayCatalog.EverydayRecharge]: EverydayRechargeDefinitionCatalog;
    [GameplayCatalog.Exchange]: ExchangeDefinitionCatalog;
    [GameplayCatalog.ExchangeCycle]: ExchangeCycleDefinitionCatalog;
    [GameplayCatalog.ExchangeFieldType]: ExchangeFieldTypeDefinitionCatalog;
    [GameplayCatalog.Explore]: ExploreDefinitionCatalog;
    [GameplayCatalog.FbShare]: FbShareDefinitionCatalog;
    [GameplayCatalog.FieldMonster]: FieldMonsterDefinitionCatalog;
    [GameplayCatalog.ForeignCivilizationBase]: ForeignCivilizationBaseDefinitionCatalog;
    [GameplayCatalog.ForeignCivilizationUp]: ForeignCivilizationUpDefinitionCatalog;
    [GameplayCatalog.Fragment]: FragmentDefinitionCatalog;
    [GameplayCatalog.FunctionOnCopy]: FunctionOnCopyDefinitionCatalog;
    [GameplayCatalog.FunctionOn]: FunctionOnDefinitionCatalog;
    [GameplayCatalog.FunctionOn7210]: FunctionOn7210DefinitionCatalog;
    [GameplayCatalog.FunctionOn9170]: FunctionOn9170DefinitionCatalog;
    [GameplayCatalog.FunctionOn9180]: FunctionOn9180DefinitionCatalog;
    [GameplayCatalog.FunctionOnLuaUI]: FunctionOnLuaUIDefinitionCatalog;
    [GameplayCatalog.FunctionStar]: FunctionStarDefinitionCatalog;
    [GameplayCatalog.General]: GeneralDefinitionCatalog;
    [GameplayCatalog.GeneralAb]: GeneralAbDefinitionCatalog;
    [GameplayCatalog.GeneralAwake]: GeneralAwakeDefinitionCatalog;
    [GameplayCatalog.GeneralAwakenChallengeReward]: GeneralAwakenChallengeRewardDefinitionCatalog;
    [GameplayCatalog.GeneralBase]: GeneralBaseDefinitionCatalog;
    [GameplayCatalog.GeneralBaseSkillTree]: GeneralBaseSkillTreeDefinitionCatalog;
    [GameplayCatalog.GeneralCalledTask]: GeneralCalledTaskDefinitionCatalog;
    [GameplayCatalog.GeneralDetail]: GeneralDetailDefinitionCatalog;
    [GameplayCatalog.GeneralDraw]: GeneralDrawDefinitionCatalog;
    [GameplayCatalog.GeneralDrawNewMain]: GeneralDrawNewMainDefinitionCatalog;
    [GameplayCatalog.GeneralDrawRate]: GeneralDrawRateDefinitionCatalog;
    [GameplayCatalog.GeneralLevel]: GeneralLevelDefinitionCatalog;
    [GameplayCatalog.GeneralMaxNum]: GeneralMaxNumDefinitionCatalog;
    [GameplayCatalog.GeneralOfficial]: GeneralOfficialDefinitionCatalog;
    [GameplayCatalog.GeneralRandomEffect]: GeneralRandomEffectDefinitionCatalog;
    [GameplayCatalog.GeneralRandomNum]: GeneralRandomNumDefinitionCatalog;
    [GameplayCatalog.GeneralRank]: GeneralRankDefinitionCatalog;
    [GameplayCatalog.GeneralRepeat]: GeneralRepeatDefinitionCatalog;
    [GameplayCatalog.GeneralSale]: GeneralSaleDefinitionCatalog;
    [GameplayCatalog.GeneralSkill]: GeneralSkillDefinitionCatalog;
    [GameplayCatalog.GeneralStation]: GeneralStationDefinitionCatalog;
    [GameplayCatalog.GeneralTalent]: GeneralTalentDefinitionCatalog;
    [GameplayCatalog.GeoTreasureTask]: GeoTreasureTaskDefinitionCatalog;
    [GameplayCatalog.GetGeneral]: GetGeneralDefinitionCatalog;
    [GameplayCatalog.Gift]: GiftDefinitionCatalog;
    [GameplayCatalog.Gold]: GoldDefinitionCatalog;
    [GameplayCatalog.GoldPrice]: GoldPriceDefinitionCatalog;
    [GameplayCatalog.GoldReward]: GoldRewardDefinitionCatalog;
    [GameplayCatalog.GoldenEgg]: GoldenEggDefinitionCatalog;
    [GameplayCatalog.GoldenEggStep]: GoldenEggStepDefinitionCatalog;
    [GameplayCatalog.GoldenRoulette]: GoldenRouletteDefinitionCatalog;
    [GameplayCatalog.Goods]: GoodsDefinitionCatalog;
    [GameplayCatalog.Grade]: GradeDefinitionCatalog;
    [GameplayCatalog.GrowthFund]: GrowthFundDefinitionCatalog;
    [GameplayCatalog.Heap]: HeapDefinitionCatalog;
    [GameplayCatalog.Heritage]: HeritageDefinitionCatalog;
    [GameplayCatalog.Hero]: HeroDefinitionCatalog;
    [GameplayCatalog.HeroChallengeLayer]: HeroChallengeLayerDefinitionCatalog;
    [GameplayCatalog.HeroChallengeMonster]: HeroChallengeMonsterDefinitionCatalog;
    [GameplayCatalog.HeroRoulette]: HeroRouletteDefinitionCatalog;
    [GameplayCatalog.Heroactivity]: HeroactivityDefinitionCatalog;
    [GameplayCatalog.Heroevent]: HeroeventDefinitionCatalog;
    [GameplayCatalog.Hotgoods]: HotgoodsDefinitionCatalog;
    [GameplayCatalog.Hotstore]: HotstoreDefinitionCatalog;
    [GameplayCatalog.House]: HouseDefinitionCatalog;
    [GameplayCatalog.Inspire]: InspireDefinitionCatalog;
    [GameplayCatalog.IsopenUid]: IsopenUidDefinitionCatalog;
    [GameplayCatalog.Item]: ItemDefinitionCatalog;
    [GameplayCatalog.KingdomBuilding]: KingdomBuildingDefinitionCatalog;
    [GameplayCatalog.KingdomBuildingBuff]: KingdomBuildingBuffDefinitionCatalog;
    [GameplayCatalog.Kingdomshop]: KingdomshopDefinitionCatalog;
    [GameplayCatalog.Kingdomskill]: KingdomskillDefinitionCatalog;
    [GameplayCatalog.Kingdon1]: Kingdon1DefinitionCatalog;
    [GameplayCatalog.Kingdon2]: Kingdon2DefinitionCatalog;
    [GameplayCatalog.KnightTitle]: KnightTitleDefinitionCatalog;
    [GameplayCatalog.Landing]: LandingDefinitionCatalog;
    [GameplayCatalog.LifeTreeS]: LifeTreeSDefinitionCatalog;
    [GameplayCatalog.LordDetails]: LordDetailsDefinitionCatalog;
    [GameplayCatalog.LordImage]: LordImageDefinitionCatalog;
    [GameplayCatalog.LordImageXml]: LordImageXmlDefinitionCatalog;
    [GameplayCatalog.Lottery]: LotteryDefinitionCatalog;
    [GameplayCatalog.LuckDraw]: LuckDrawDefinitionCatalog;
    [GameplayCatalog.LuckyDay]: LuckyDayDefinitionCatalog;
    [GameplayCatalog.LuckyEffect]: LuckyEffectDefinitionCatalog;
    [GameplayCatalog.LuckyEgg]: LuckyEggDefinitionCatalog;
    [GameplayCatalog.LuckyReturnExchange]: LuckyReturnExchangeDefinitionCatalog;
    [GameplayCatalog.MagicRush]: MagicRushDefinitionCatalog;
    [GameplayCatalog.Mail]: MailDefinitionCatalog;
    [GameplayCatalog.Mark]: MarkDefinitionCatalog;
    [GameplayCatalog.Market]: MarketDefinitionCatalog;
    [GameplayCatalog.Material]: MaterialDefinitionCatalog;
    [GameplayCatalog.MergeActivity]: MergeActivityDefinitionCatalog;
    [GameplayCatalog.MiracleBuff]: MiracleBuffDefinitionCatalog;
    [GameplayCatalog.Monarch]: MonarchDefinitionCatalog;
    [GameplayCatalog.MonarchTitleKingdom]: MonarchTitleKingdomDefinitionCatalog;
    [GameplayCatalog.MonarchTitleLord]: MonarchTitleLordDefinitionCatalog;
    [GameplayCatalog.MonsterSiege]: MonsterSiegeDefinitionCatalog;
    [GameplayCatalog.MonsterSiegeReward]: MonsterSiegeRewardDefinitionCatalog;
    [GameplayCatalog.NeutralServerWorld]: TileMapDefinition;
    [GameplayCatalog.NeutralServerBuilding]: NeutralServerBuildingDefinitionCatalog;
    [GameplayCatalog.NeutralServerReward]: NeutralServerRewardDefinitionCatalog;
    [GameplayCatalog.NeutralServerScore]: NeutralServerScoreDefinitionCatalog;
    [GameplayCatalog.NewBank]: NewBankDefinitionCatalog;
    [GameplayCatalog.NewContinuedCost]: ContinuedCostDefinitionCatalog;
    [GameplayCatalog.NewDailyTask]: NewDailyTaskDefinitionCatalog;
    [GameplayCatalog.NewExchange]: NewExchangeDefinitionCatalog;
    [GameplayCatalog.NewRecallQuest]: NewRecallQuestDefinitionCatalog;
    [GameplayCatalog.NewSprInfo]: NewSprInfoDefinitionCatalog;
    [GameplayCatalog.NewSprRound]: NewSprRoundDefinitionCatalog;
    [GameplayCatalog.NewWkPersonReward]: NewWkPersonRewardDefinitionCatalog;
    [GameplayCatalog.NewWkReward]: NewWkRewardDefinitionCatalog;
    [GameplayCatalog.NewWkScore]: NewWkScoreDefinitionCatalog;
    [GameplayCatalog.NewbeeCastleReward]: NewbeeCastleRewardDefinitionCatalog;
    [GameplayCatalog.NewbieItems]: NewbieItemsDefinitionCatalog;
    [GameplayCatalog.NewcomerTreviFountain]: NewcomerTreviFountainDefinitionCatalog;
    [GameplayCatalog.Newplayer]: NewplayerDefinitionCatalog;
    [GameplayCatalog.NewsCastleLV]: NewsCastleLVDefinitionCatalog;
    [GameplayCatalog.NewsHeap]: NewsHeapDefinitionCatalog;
    [GameplayCatalog.NotiTimezone]: NotiTimezoneDefinitionCatalog;
    [GameplayCatalog.Npc]: NpcDefinitionCatalog;
    [GameplayCatalog.Office]: OfficeDefinitionCatalog;
    [GameplayCatalog.OnlineReward]: OnlineRewardDefinitionCatalog;
    [GameplayCatalog.Overlord]: OverlordDefinitionCatalog;
    [GameplayCatalog.P6Arms]: P6ArmsDefinitionCatalog;
    [GameplayCatalog.Package]: PackageDefinitionCatalog;
    [GameplayCatalog.PayLottery]: PayLotteryDefinitionCatalog;
    [GameplayCatalog.PayReward]: PayRewardDefinitionCatalog;
    [GameplayCatalog.PayServercontrol]: PayServercontrolDefinitionCatalog;
    [GameplayCatalog.PayUserReward]: PayUserRewardDefinitionCatalog;
    [GameplayCatalog.Paycard]: PaycardDefinitionCatalog;
    [GameplayCatalog.PfCheck]: PfCheckDefinitionCatalog;
    [GameplayCatalog.PlayerData]: PlayerDataDefinitionCatalog;
    [GameplayCatalog.PlayerName]: PlayerNameDefinitionCatalog;
    [GameplayCatalog.Position]: PositionDefinitionCatalog;
    [GameplayCatalog.PositionUnlock]: PositionUnlockDefinitionCatalog;
    [GameplayCatalog.PowerRandom]: PowerRandomDefinitionCatalog;
    [GameplayCatalog.Princess]: PrincessDefinitionCatalog;
    [GameplayCatalog.PrincessQuest]: PrincessQuestDefinitionCatalog;
    [GameplayCatalog.Quest]: QuestDefinitionCatalog;
    [GameplayCatalog.QuestMark]: QuestMarkDefinitionCatalog;
    [GameplayCatalog.QuestPhase]: QuestPhaseDefinitionCatalog;
    [GameplayCatalog.QuickBuilding]: QuickBuildingDefinitionCatalog;
    [GameplayCatalog.QuickScience]: QuickScienceDefinitionCatalog;
    [GameplayCatalog.Rank]: RankDefinitionCatalog;
    [GameplayCatalog.Recall]: RecallDefinitionCatalog;
    [GameplayCatalog.RecallActivity]: RecallActivityDefinitionCatalog;
    [GameplayCatalog.RecallQuest]: RecallQuestDefinitionCatalog;
    [GameplayCatalog.Recruit]: RecruitDefinitionCatalog;
    [GameplayCatalog.ReforgeRandom]: ReforgeRandomDefinitionCatalog;
    [GameplayCatalog.ReputationAction]: ReputationActionDefinitionCatalog;
    [GameplayCatalog.ReputationClassifylimit]: ReputationClassifylimitDefinitionCatalog;
    [GameplayCatalog.ReputationLevel]: ReputationLevelDefinitionCatalog;
    [GameplayCatalog.Resdential]: ResdentialDefinitionCatalog;
    [GameplayCatalog.ResouceLife]: ResouceLifeDefinitionCatalog;
    [GameplayCatalog.Resource2]: ResouceLifeDefinitionCatalog;
    [GameplayCatalog.Resource3]: Resource3DefinitionCatalog;
    [GameplayCatalog.Resources]: ResourcesDefinitionCatalog;
    [GameplayCatalog.Reward]: RewardDefinitionCatalog;
    [GameplayCatalog.RewardAdd]: RewardAddDefinitionCatalog;
    [GameplayCatalog.Role]: RoleDefinitionCatalog;
    [GameplayCatalog.Safe]: SafeDefinitionCatalog;
    [GameplayCatalog.SagaTowerScienceBase]: SagaTowerScienceBaseDefinitionCatalog;
    [GameplayCatalog.SagaTowerScienceUp]: SagaTowerScienceUpDefinitionCatalog;
    [GameplayCatalog.Science]: ScienceDefinitionCatalog;
    [GameplayCatalog.ScienceRace]: ScienceRaceDefinitionCatalog;
    [GameplayCatalog.ScienceRaceType]: ScienceRaceTypeDefinitionCatalog;
    [GameplayCatalog.ScienceType]: ScienceTypeDefinitionCatalog;
    [GameplayCatalog.Score]: ScoreDefinitionCatalog;
    [GameplayCatalog.Serverlist]: ServerlistDefinitionCatalog;
    [GameplayCatalog.Serverpos]: ServerposDefinitionCatalog;
    [GameplayCatalog.Servers]: ServersDefinitionCatalog;
    [GameplayCatalog.ServersConfig]: ServersConfigDefinitionCatalog;
    [GameplayCatalog.Servertransfer]: ServertransferDefinitionCatalog;
    [GameplayCatalog.Setting]: SettingDefinitionCatalog;
    [GameplayCatalog.ShopNew]: ShopNewDefinitionCatalog;
    [GameplayCatalog.ShopNew7210]: ShopNew7210DefinitionCatalog;
    [GameplayCatalog.ShopNew926]: ShopNew926DefinitionCatalog;
    [GameplayCatalog.SignIn]: SignInDefinitionCatalog;
    [GameplayCatalog.SignIn2]: SignIn2DefinitionCatalog;
    [GameplayCatalog.SingleCharge]: SingleChargeDefinitionCatalog;
    [GameplayCatalog.Sk]: SkDefinitionCatalog;
    [GameplayCatalog.Skill]: SkillDefinitionCatalog;
    [GameplayCatalog.Skill2]: Skill2DefinitionCatalog;
    [GameplayCatalog.Soldiers]: SoldiersDefinitionCatalog;
    [GameplayCatalog.SpLoad]: SpLoadDefinitionCatalog;
    [GameplayCatalog.SpResources]: SpResourcesDefinitionCatalog;
    [GameplayCatalog.SpResourcesBet]: SpResourcesBetDefinitionCatalog;
    [GameplayCatalog.SpResourcesInit]: SpResourcesInitDefinitionCatalog;
    [GameplayCatalog.SpResourcesList]: SpResourcesListDefinitionCatalog;
    [GameplayCatalog.SpResourcesRound]: SpResourcesRoundDefinitionCatalog;
    [GameplayCatalog.SpResourcesType]: SpResourcesTypeDefinitionCatalog;
    [GameplayCatalog.SpecialPush]: SpecialPushDefinitionCatalog;
    [GameplayCatalog.StatusCopy]: StatusCopyDefinitionCatalog;
    [GameplayCatalog.Status]: StatusDefinitionCatalog;
    [GameplayCatalog.StorySetting]: StorySettingDefinitionCatalog;
    [GameplayCatalog.SubcityReward]: SubcityRewardDefinitionCatalog;
    [GameplayCatalog.Suit]: SuitDefinitionCatalog;
    [GameplayCatalog.Suitequipment]: SuitequipmentDefinitionCatalog;
    [GameplayCatalog.Svip]: SvipDefinitionCatalog;
    [GameplayCatalog.SvipShopBuilding]: SvipShopBuildingDefinitionCatalog;
    [GameplayCatalog.TargetQuest]: TargetQuestDefinitionCatalog;
    [GameplayCatalog.Territory]: TerritoryDefinitionCatalog;
    [GameplayCatalog.TerritoryEffect]: TerritoryEffectDefinitionCatalog;
    [GameplayCatalog.TimeGift]: TimeGiftDefinitionCatalog;
    [GameplayCatalog.Totem]: TotemDefinitionCatalog;
    [GameplayCatalog.Tower]: TowerDefinitionCatalog;
    [GameplayCatalog.Trade]: TradeDefinitionCatalog;
    [GameplayCatalog.Train]: TrainDefinitionCatalog;
    [GameplayCatalog.Treasure]: TreasureDefinitionCatalog;
    [GameplayCatalog.Trial]: TrialDefinitionCatalog;
    [GameplayCatalog.TriggerActivity]: AutomationCatalog;
    [GameplayCatalog.TriggerExchange]: AutomationCatalog;
    [GameplayCatalog.TriggerVar]: AutomationCatalog;
    [GameplayCatalog.Trigger]: AutomationCatalog;
    [GameplayCatalog.UpgradeReward]: LordImageXmlDefinitionCatalog;
    [GameplayCatalog.Variable]: VariableCatalog;
    [GameplayCatalog.Vip]: VipDefinitionCatalog;
    [GameplayCatalog.VoteServer]: VoteServerDefinitionCatalog;
    [GameplayCatalog.WaBuild]: WaBuildDefinitionCatalog;
    [GameplayCatalog.WaMonster]: WaMonsterDefinitionCatalog;
    [GameplayCatalog.WaRewardS]: WaRewardSDefinitionCatalog;
    [GameplayCatalog.WagArea]: WagAreaDefinitionCatalog;
    [GameplayCatalog.WagBuild]: WagBuildDefinitionCatalog;
    [GameplayCatalog.WagMonster]: WagMonsterDefinitionCatalog;
    [GameplayCatalog.WagReRank]: WagReRankDefinitionCatalog;
    [GameplayCatalog.WagReTeam]: WagReTeamDefinitionCatalog;
    [GameplayCatalog.WagRole]: WagRoleDefinitionCatalog;
    [GameplayCatalog.WapMatch]: WapMatchDefinitionCatalog;
    [GameplayCatalog.WapReRank]: WapReRankDefinitionCatalog;
    [GameplayCatalog.WapReTeam]: WagReTeamDefinitionCatalog;
    [GameplayCatalog.WbKill]: WbKillDefinitionCatalog;
    [GameplayCatalog.WbReward]: WbRewardDefinitionCatalog;
    [GameplayCatalog.WbSkill]: WbSkillDefinitionCatalog;
    [GameplayCatalog.Web]: WebRoutingCatalog;
    [GameplayCatalog.WebCheck]: WebCheckDefinitionCatalog;
    [GameplayCatalog.Wish]: WishDefinitionCatalog;
    [GameplayCatalog.WkBuild]: WkBuildDefinitionCatalog;
    [GameplayCatalog.WkPersonReward]: WkPersonRewardDefinitionCatalog;
    [GameplayCatalog.WkQuest]: WkQuestDefinitionCatalog;
    [GameplayCatalog.WkReward]: WkRewardDefinitionCatalog;
    [GameplayCatalog.WkScore]: WkScoreDefinitionCatalog;
    [GameplayCatalog.WkServer]: WkServerDefinitionCatalog;
    [GameplayCatalog.Wonder]: WonderDefinitionCatalog;
    [GameplayCatalog.World]: TileMapDefinition;
    [GameplayCatalog.WorldLevel]: WorldLevelDefinitionCatalog;
    [GameplayCatalog.Worldboss]: WorldbossDefinitionCatalog;
    [GameplayCatalog.WrExp]: WrExpDefinitionCatalog;
    [GameplayCatalog.WrRank]: WrRankDefinitionCatalog;
    [GameplayCatalog.WrSever]: WrSeverDefinitionCatalog;
    [GameplayCatalog.WrSkill]: WrSkillDefinitionCatalog;
    [GameplayCatalog.WrTroopsPoint]: WrTroopsPointDefinitionCatalog;
}

export const catalogDefinitions: {
    readonly [Id in keyof GameplayCatalogDefinitions]: () => Promise<
        GameplayCatalogDefinitions[Id]
    >;
} = {
    [GameplayCatalog.Catalog3thAnniversary]: async () =>
        (await import("./catalogs/data/3th_anniversary.ts")).catalog,
    [GameplayCatalog.Catalog3thAnniversaryControl]: async () =>
        (await import("./catalogs/data/3th_anniversary_control.ts")).catalog,
    [GameplayCatalog.ArenaMap]: async () => (await import("./catalogs/data/ArenaMap.ts")).catalog,
    [GameplayCatalog.CivilizationInjury]: async () =>
        (await import("./catalogs/data/Civilization_injury.ts")).catalog,
    [GameplayCatalog.CrossThroneMap]: async () =>
        (await import("./catalogs/data/CrossThroneMap.ts")).catalog,
    [GameplayCatalog.SeaWorldmap]: async () =>
        (await import("./catalogs/data/SeaWorldmap.ts")).catalog,
    [GameplayCatalog.Ab]: async () => (await import("./catalogs/data/ab.ts")).catalog,
    [GameplayCatalog.Ability]: async () => (await import("./catalogs/data/ability.ts")).catalog,
    [GameplayCatalog.Accumulate]: async () =>
        (await import("./catalogs/data/accumulate.ts")).catalog,
    [GameplayCatalog.Achievement]: async () =>
        (await import("./catalogs/data/achievement.ts")).catalog,
    [GameplayCatalog.Action]: async () => (await import("./catalogs/data/action.ts")).catalog,
    [GameplayCatalog.Activity]: async () => (await import("./catalogs/data/activity.ts")).catalog,
    [GameplayCatalog.ActivityEvent]: async () =>
        (await import("./catalogs/data/activity_event.ts")).catalog,
    [GameplayCatalog.ActivityPage]: async () =>
        (await import("./catalogs/data/activity_page.ts")).catalog,
    [GameplayCatalog.ActivityPanel]: async () =>
        (await import("./catalogs/data/activity_panel.ts")).catalog,
    [GameplayCatalog.AddUserEquip]: async () =>
        (await import("./catalogs/data/add_user_equip.ts")).catalog,
    [GameplayCatalog.AddUserGoods]: async () =>
        (await import("./catalogs/data/add_user_goods.ts")).catalog,
    [GameplayCatalog.Affairs]: async () => (await import("./catalogs/data/affairs.ts")).catalog,
    [GameplayCatalog.AllianceBoss]: async () =>
        (await import("./catalogs/data/alliance_boss.ts")).catalog,
    [GameplayCatalog.AllianceBossControl]: async () =>
        (await import("./catalogs/data/alliance_boss_control.ts")).catalog,
    [GameplayCatalog.AllianceBossReward]: async () =>
        (await import("./catalogs/data/alliance_boss_reward.ts")).catalog,
    [GameplayCatalog.AllianceBuilding]: async () =>
        (await import("./catalogs/data/alliance_building.ts")).catalog,
    [GameplayCatalog.AllianceBuildingSkill]: async () =>
        (await import("./catalogs/data/alliance_building_skill.ts")).catalog,
    [GameplayCatalog.AllianceMission]: async () =>
        (await import("./catalogs/data/alliance_mission.ts")).catalog,
    [GameplayCatalog.AllianceQuest]: async () =>
        (await import("./catalogs/data/alliance_quest.ts")).catalog,
    [GameplayCatalog.AllianceQuestColorran]: async () =>
        (await import("./catalogs/data/alliance_quest_colorran.ts")).catalog,
    [GameplayCatalog.AllianceTeleport]: async () =>
        (await import("./catalogs/data/alliance_teleport.ts")).catalog,
    [GameplayCatalog.Alliancescience]: async () =>
        (await import("./catalogs/data/alliancescience.ts")).catalog,
    [GameplayCatalog.Allianceshop]: async () =>
        (await import("./catalogs/data/allianceshop.ts")).catalog,
    [GameplayCatalog.Area]: async () => (await import("./catalogs/data/area.ts")).catalog,
    [GameplayCatalog.Arena]: async () => (await import("./catalogs/data/arena.ts")).catalog,
    [GameplayCatalog.ArenaRank]: async () =>
        (await import("./catalogs/data/arena_rank.ts")).catalog,
    [GameplayCatalog.Arms]: async () => (await import("./catalogs/data/arms.ts")).catalog,
    [GameplayCatalog.Army]: async () => (await import("./catalogs/data/army.ts")).catalog,
    [GameplayCatalog.ArmyUpBase]: async () =>
        (await import("./catalogs/data/army_up_base.ts")).catalog,
    [GameplayCatalog.ArmyUpEffect]: async () =>
        (await import("./catalogs/data/army_up_effect.ts")).catalog,
    [GameplayCatalog.ArmyUpWhole]: async () =>
        (await import("./catalogs/data/army_up_whole.ts")).catalog,
    [GameplayCatalog.AttributeRandom]: async () =>
        (await import("./catalogs/data/attribute_random.ts")).catalog,
    [GameplayCatalog.Auction]: async () => (await import("./catalogs/data/auction.ts")).catalog,
    [GameplayCatalog.AutoUpdata]: async () =>
        (await import("./catalogs/data/auto_updata.ts")).catalog,
    [GameplayCatalog.Bank]: async () => (await import("./catalogs/data/bank.ts")).catalog,
    [GameplayCatalog.Banlist]: async () => (await import("./catalogs/data/banlist.ts")).catalog,
    [GameplayCatalog.Barbarion]: async () => (await import("./catalogs/data/barbarion.ts")).catalog,
    [GameplayCatalog.BestowTitle]: async () =>
        (await import("./catalogs/data/bestow_title.ts")).catalog,
    [GameplayCatalog.Bet]: async () => (await import("./catalogs/data/bet.ts")).catalog,
    [GameplayCatalog.BocaiDragon]: async () =>
        (await import("./catalogs/data/bocai_dragon.ts")).catalog,
    [GameplayCatalog.BoxOrdinary]: async () =>
        (await import("./catalogs/data/box_ordinary.ts")).catalog,
    [GameplayCatalog.BoxVip]: async () => (await import("./catalogs/data/box_vip.ts")).catalog,
    [GameplayCatalog.BrResourceRefresh]: async () =>
        (await import("./catalogs/data/br_resource_refresh.ts")).catalog,
    [GameplayCatalog.BuildingStar]: async () =>
        (await import("./catalogs/data/building_star.ts")).catalog,
    [GameplayCatalog.BuildingStarup]: async () =>
        (await import("./catalogs/data/building_starup.ts")).catalog,
    [GameplayCatalog.Cargo]: async () => (await import("./catalogs/data/cargo.ts")).catalog,
    [GameplayCatalog.Characters]: async () =>
        (await import("./catalogs/data/characters.ts")).catalog,
    [GameplayCatalog.ChatbgColor]: async () =>
        (await import("./catalogs/data/chatbg_color.ts")).catalog,
    [GameplayCatalog.Checkpoint]: async () =>
        (await import("./catalogs/data/checkpoint.ts")).catalog,
    [GameplayCatalog.City]: async () => (await import("./catalogs/data/city.ts")).catalog,
    [GameplayCatalog.Civilization]: async () =>
        (await import("./catalogs/data/civilization.ts")).catalog,
    [GameplayCatalog.CivilizationFeature]: async () =>
        (await import("./catalogs/data/civilization_feature.ts")).catalog,
    [GameplayCatalog.CivilizationFortress]: async () =>
        (await import("./catalogs/data/civilization_fortress.ts")).catalog,
    [GameplayCatalog.Clean]: async () => (await import("./catalogs/data/clean.ts")).catalog,
    [GameplayCatalog.Comeback]: async () => (await import("./catalogs/data/comeback.ts")).catalog,
    [GameplayCatalog.Compensation]: async () =>
        (await import("./catalogs/data/compensation.ts")).catalog,
    [GameplayCatalog.ContinuedCost]: async () =>
        (await import("./catalogs/data/continued_cost.ts")).catalog,
    [GameplayCatalog.Convert]: async () => (await import("./catalogs/data/convert.ts")).catalog,
    [GameplayCatalog.CrossFightWorld]: async () =>
        (await import("./catalogs/data/crossFightWorld.ts")).catalog,
    [GameplayCatalog.CrossThroneMaster]: async () =>
        (await import("./catalogs/data/CrossThroneMap.ts")).catalog,
    [GameplayCatalog.CsmodAutoUpgrade]: async () =>
        (await import("./catalogs/data/building_starup.ts")).catalog,
    [GameplayCatalog.CsmodSettings]: async () =>
        (await import("./catalogs/data/csmod_settings.ts")).catalog,
    [GameplayCatalog.DailyLogin]: async () =>
        (await import("./catalogs/data/daily_login.ts")).catalog,
    [GameplayCatalog.DailyQuest]: async () =>
        (await import("./catalogs/data/daily_quest.ts")).catalog,
    [GameplayCatalog.DailyRecharge]: async () =>
        (await import("./catalogs/data/daily_recharge.ts")).catalog,
    [GameplayCatalog.DailyReward]: async () =>
        (await import("./catalogs/data/daily_reward.ts")).catalog,
    [GameplayCatalog.DailyTaskBox]: async () =>
        (await import("./catalogs/data/daily_task_box.ts")).catalog,
    [GameplayCatalog.DailyTaskReward]: async () =>
        (await import("./catalogs/data/daily_task_reward.ts")).catalog,
    [GameplayCatalog.DeepLink]: async () => (await import("./catalogs/data/deep_link.ts")).catalog,
    [GameplayCatalog.DefeatNotice]: async () =>
        (await import("./catalogs/data/defeatNotice.ts")).catalog,
    [GameplayCatalog.Defensor]: async () => (await import("./catalogs/data/defensor.ts")).catalog,
    [GameplayCatalog.DelExchange]: async () =>
        (await import("./catalogs/data/del_exchange.ts")).catalog,
    [GameplayCatalog.DgRefinement]: async () =>
        (await import("./catalogs/data/dg_refinement.ts")).catalog,
    [GameplayCatalog.DianjiReward]: async () =>
        (await import("./catalogs/data/dianji_reward.ts")).catalog,
    [GameplayCatalog.DiscountMall]: async () =>
        (await import("./catalogs/data/discount_mall.ts")).catalog,
    [GameplayCatalog.Dragon]: async () => (await import("./catalogs/data/dragon.ts")).catalog,
    [GameplayCatalog.DragonBattleWorld]: async () =>
        (await import("./catalogs/data/dragonBattleWorld.ts")).catalog,
    [GameplayCatalog.DragonBase]: async () =>
        (await import("./catalogs/data/dragon_base.ts")).catalog,
    [GameplayCatalog.DragonCommunicate]: async () =>
        (await import("./catalogs/data/dragon_communicate.ts")).catalog,
    [GameplayCatalog.DragonCrystalCondition]: async () =>
        (await import("./catalogs/data/dragon_crystal_condition.ts")).catalog,
    [GameplayCatalog.DragonDetail]: async () =>
        (await import("./catalogs/data/dragon_detail.ts")).catalog,
    [GameplayCatalog.DragonEgg]: async () => (await import("./catalogs/data/dragon.ts")).catalog,
    [GameplayCatalog.DragonExp]: async () => (await import("./catalogs/data/dragon.ts")).catalog,
    [GameplayCatalog.DragonFood]: async () =>
        (await import("./catalogs/data/dragon_food.ts")).catalog,
    [GameplayCatalog.DragonGift]: async () =>
        (await import("./catalogs/data/dragon_gift.ts")).catalog,
    [GameplayCatalog.DragonNew]: async () =>
        (await import("./catalogs/data/dragon_new.ts")).catalog,
    [GameplayCatalog.DragonSkill]: async () =>
        (await import("./catalogs/data/dragon_skill.ts")).catalog,
    [GameplayCatalog.DragonSkillExp]: async () =>
        (await import("./catalogs/data/dragon_skill_exp.ts")).catalog,
    [GameplayCatalog.DragonTalent]: async () =>
        (await import("./catalogs/data/dragon_talent.ts")).catalog,
    [GameplayCatalog.DragonTalentExp]: async () =>
        (await import("./catalogs/data/dragon_talent_exp.ts")).catalog,
    [GameplayCatalog.DragonTowerBuff]: async () =>
        (await import("./catalogs/data/dragon_tower_buff.ts")).catalog,
    [GameplayCatalog.DragonTowerCoord]: async () =>
        (await import("./catalogs/data/dragon_tower_coord.ts")).catalog,
    [GameplayCatalog.DragonTowerLayer]: async () =>
        (await import("./catalogs/data/dragon_tower_layer.ts")).catalog,
    [GameplayCatalog.DragonTowerMonster]: async () =>
        (await import("./catalogs/data/dragon_tower_monster.ts")).catalog,
    [GameplayCatalog.DragonTravel]: async () =>
        (await import("./catalogs/data/dragon_travel.ts")).catalog,
    [GameplayCatalog.DragonWords]: async () =>
        (await import("./catalogs/data/dragon_words.ts")).catalog,
    [GameplayCatalog.DrawRandom]: async () =>
        (await import("./catalogs/data/drawRandom.ts")).catalog,
    [GameplayCatalog.Drconfig]: async () => (await import("./catalogs/data/drconfig.ts")).catalog,
    [GameplayCatalog.Drconfig7260]: async () =>
        (await import("./catalogs/data/drconfig7.26.0.ts")).catalog,
    [GameplayCatalog.Drconfig9100]: async () =>
        (await import("./catalogs/data/drconfig7.26.0.ts")).catalog,
    [GameplayCatalog.Drconfig9140]: async () =>
        (await import("./catalogs/data/drconfig9.14.0.ts")).catalog,
    [GameplayCatalog.Drconfig9150]: async () =>
        (await import("./catalogs/data/drconfig9.14.0.ts")).catalog,
    [GameplayCatalog.Drconfig9160]: async () =>
        (await import("./catalogs/data/drconfig9.14.0.ts")).catalog,
    [GameplayCatalog.Drconfig9170]: async () =>
        (await import("./catalogs/data/drconfig9.14.0.ts")).catalog,
    [GameplayCatalog.Drconfig9180]: async () =>
        (await import("./catalogs/data/drconfig9.14.0.ts")).catalog,
    [GameplayCatalog.Drconfig9260]: async () =>
        (await import("./catalogs/data/drconfig9.26.0.ts")).catalog,
    [GameplayCatalog.Drconfig9270]: async () =>
        (await import("./catalogs/data/drconfig9.26.0.ts")).catalog,
    [GameplayCatalog.Effect]: async () => (await import("./catalogs/data/effect.ts")).catalog,
    [GameplayCatalog.EffectRequirement]: async () =>
        (await import("./catalogs/data/effect_requirement.ts")).catalog,
    [GameplayCatalog.Egg]: async () => (await import("./catalogs/data/egg.ts")).catalog,
    [GameplayCatalog.Emulator]: async () => (await import("./catalogs/data/emulator.ts")).catalog,
    [GameplayCatalog.Endowment]: async () => (await import("./catalogs/data/endowment.ts")).catalog,
    [GameplayCatalog.EquipStrength]: async () =>
        (await import("./catalogs/data/equip_strength.ts")).catalog,
    [GameplayCatalog.Equipment]: async () => (await import("./catalogs/data/equipment.ts")).catalog,
    [GameplayCatalog.EquipmentRandom]: async () =>
        (await import("./catalogs/data/equipmentRandom.ts")).catalog,
    [GameplayCatalog.EquipmentRandomPower]: async () =>
        (await import("./catalogs/data/equipmentRandomPower.ts")).catalog,
    [GameplayCatalog.EquipmentBagSuitFilter]: async () =>
        (await import("./catalogs/data/equipment_bag_suit_filter.ts")).catalog,
    [GameplayCatalog.EquipmentRank]: async () =>
        (await import("./catalogs/data/equipment_rank.ts")).catalog,
    [GameplayCatalog.EquipmentSmelt]: async () =>
        (await import("./catalogs/data/equipment_smelt.ts")).catalog,
    [GameplayCatalog.EquipmentStrength]: async () =>
        (await import("./catalogs/data/equipment_strength.ts")).catalog,
    [GameplayCatalog.EquipmentStrengthenMove]: async () =>
        (await import("./catalogs/data/equipment_strengthen_move.ts")).catalog,
    [GameplayCatalog.EquipmentStrengthenRemove]: async () =>
        (await import("./catalogs/data/equipment_strengthen_remove.ts")).catalog,
    [GameplayCatalog.EquipmentstrengthRandom]: async () =>
        (await import("./catalogs/data/equip_strength.ts")).catalog,
    [GameplayCatalog.EquipmentstrengthRandomPower]: async () =>
        (await import("./catalogs/data/equipmentRandomPower.ts")).catalog,
    [GameplayCatalog.Event]: async () => (await import("./catalogs/data/event.ts")).catalog,
    [GameplayCatalog.Events]: async () => (await import("./catalogs/data/events.ts")).catalog,
    [GameplayCatalog.EverydayRecharge]: async () =>
        (await import("./catalogs/data/everyday_recharge.ts")).catalog,
    [GameplayCatalog.Exchange]: async () => (await import("./catalogs/data/exchange.ts")).catalog,
    [GameplayCatalog.ExchangeCycle]: async () =>
        (await import("./catalogs/data/exchange_cycle.ts")).catalog,
    [GameplayCatalog.ExchangeFieldType]: async () =>
        (await import("./catalogs/data/exchange_field_type.ts")).catalog,
    [GameplayCatalog.Explore]: async () => (await import("./catalogs/data/explore.ts")).catalog,
    [GameplayCatalog.FbShare]: async () => (await import("./catalogs/data/fb_share.ts")).catalog,
    [GameplayCatalog.FieldMonster]: async () =>
        (await import("./catalogs/data/field_monster.ts")).catalog,
    [GameplayCatalog.ForeignCivilizationBase]: async () =>
        (await import("./catalogs/data/foreign_civilization_base.ts")).catalog,
    [GameplayCatalog.ForeignCivilizationUp]: async () =>
        (await import("./catalogs/data/foreign_civilization_up.ts")).catalog,
    [GameplayCatalog.Fragment]: async () => (await import("./catalogs/data/fragment.ts")).catalog,
    [GameplayCatalog.FunctionOnCopy]: async () =>
        (await import("./catalogs/data/function_on - Copy.ts")).catalog,
    [GameplayCatalog.FunctionOn]: async () =>
        (await import("./catalogs/data/function_on.ts")).catalog,
    [GameplayCatalog.FunctionOn7210]: async () =>
        (await import("./catalogs/data/function_on7.21.0.ts")).catalog,
    [GameplayCatalog.FunctionOn9170]: async () =>
        (await import("./catalogs/data/function_on9.17.0.ts")).catalog,
    [GameplayCatalog.FunctionOn9180]: async () =>
        (await import("./catalogs/data/function_on9.18.0.ts")).catalog,
    [GameplayCatalog.FunctionOnLuaUI]: async () =>
        (await import("./catalogs/data/function_on_luaUI.ts")).catalog,
    [GameplayCatalog.FunctionStar]: async () =>
        (await import("./catalogs/data/function_star.ts")).catalog,
    [GameplayCatalog.General]: async () => (await import("./catalogs/data/general.ts")).catalog,
    [GameplayCatalog.GeneralAb]: async () =>
        (await import("./catalogs/data/general_ab.ts")).catalog,
    [GameplayCatalog.GeneralAwake]: async () =>
        (await import("./catalogs/data/general_awake.ts")).catalog,
    [GameplayCatalog.GeneralAwakenChallengeReward]: async () =>
        (await import("./catalogs/data/general_awaken_challenge_reward.ts")).catalog,
    [GameplayCatalog.GeneralBase]: async () =>
        (await import("./catalogs/data/general_base.ts")).catalog,
    [GameplayCatalog.GeneralBaseSkillTree]: async () =>
        (await import("./catalogs/data/general_base_skill_tree.ts")).catalog,
    [GameplayCatalog.GeneralCalledTask]: async () =>
        (await import("./catalogs/data/general_called_task.ts")).catalog,
    [GameplayCatalog.GeneralDetail]: async () =>
        (await import("./catalogs/data/general_detail.ts")).catalog,
    [GameplayCatalog.GeneralDraw]: async () =>
        (await import("./catalogs/data/general_draw.ts")).catalog,
    [GameplayCatalog.GeneralDrawNewMain]: async () =>
        (await import("./catalogs/data/general_draw_new_main.ts")).catalog,
    [GameplayCatalog.GeneralDrawRate]: async () =>
        (await import("./catalogs/data/general_draw_rate.ts")).catalog,
    [GameplayCatalog.GeneralLevel]: async () =>
        (await import("./catalogs/data/general_level.ts")).catalog,
    [GameplayCatalog.GeneralMaxNum]: async () =>
        (await import("./catalogs/data/general_max_num.ts")).catalog,
    [GameplayCatalog.GeneralOfficial]: async () =>
        (await import("./catalogs/data/general_official.ts")).catalog,
    [GameplayCatalog.GeneralRandomEffect]: async () =>
        (await import("./catalogs/data/general_random_effect.ts")).catalog,
    [GameplayCatalog.GeneralRandomNum]: async () =>
        (await import("./catalogs/data/general_random_num.ts")).catalog,
    [GameplayCatalog.GeneralRank]: async () =>
        (await import("./catalogs/data/general_rank.ts")).catalog,
    [GameplayCatalog.GeneralRepeat]: async () =>
        (await import("./catalogs/data/general_repeat.ts")).catalog,
    [GameplayCatalog.GeneralSale]: async () =>
        (await import("./catalogs/data/general_sale.ts")).catalog,
    [GameplayCatalog.GeneralSkill]: async () =>
        (await import("./catalogs/data/general_skill.ts")).catalog,
    [GameplayCatalog.GeneralStation]: async () =>
        (await import("./catalogs/data/general_station.ts")).catalog,
    [GameplayCatalog.GeneralTalent]: async () =>
        (await import("./catalogs/data/general_talent.ts")).catalog,
    [GameplayCatalog.GeoTreasureTask]: async () =>
        (await import("./catalogs/data/geo_treasure_task.ts")).catalog,
    [GameplayCatalog.GetGeneral]: async () =>
        (await import("./catalogs/data/get_general.ts")).catalog,
    [GameplayCatalog.Gift]: async () => (await import("./catalogs/data/gift.ts")).catalog,
    [GameplayCatalog.Gold]: async () => (await import("./catalogs/data/gold.ts")).catalog,
    [GameplayCatalog.GoldPrice]: async () =>
        (await import("./catalogs/data/gold_price.ts")).catalog,
    [GameplayCatalog.GoldReward]: async () =>
        (await import("./catalogs/data/gold_reward.ts")).catalog,
    [GameplayCatalog.GoldenEgg]: async () =>
        (await import("./catalogs/data/golden_egg.ts")).catalog,
    [GameplayCatalog.GoldenEggStep]: async () =>
        (await import("./catalogs/data/golden_egg_step.ts")).catalog,
    [GameplayCatalog.GoldenRoulette]: async () =>
        (await import("./catalogs/data/golden_roulette.ts")).catalog,
    [GameplayCatalog.Goods]: async () => (await import("./catalogs/data/goods.ts")).catalog,
    [GameplayCatalog.Grade]: async () => (await import("./catalogs/data/grade.ts")).catalog,
    [GameplayCatalog.GrowthFund]: async () =>
        (await import("./catalogs/data/growth_fund.ts")).catalog,
    [GameplayCatalog.Heap]: async () => (await import("./catalogs/data/heap.ts")).catalog,
    [GameplayCatalog.Heritage]: async () => (await import("./catalogs/data/heritage.ts")).catalog,
    [GameplayCatalog.Hero]: async () => (await import("./catalogs/data/hero.ts")).catalog,
    [GameplayCatalog.HeroChallengeLayer]: async () =>
        (await import("./catalogs/data/hero_challenge_layer.ts")).catalog,
    [GameplayCatalog.HeroChallengeMonster]: async () =>
        (await import("./catalogs/data/hero_challenge_monster.ts")).catalog,
    [GameplayCatalog.HeroRoulette]: async () =>
        (await import("./catalogs/data/hero_roulette.ts")).catalog,
    [GameplayCatalog.Heroactivity]: async () =>
        (await import("./catalogs/data/heroactivity.ts")).catalog,
    [GameplayCatalog.Heroevent]: async () => (await import("./catalogs/data/heroevent.ts")).catalog,
    [GameplayCatalog.Hotgoods]: async () => (await import("./catalogs/data/hotgoods.ts")).catalog,
    [GameplayCatalog.Hotstore]: async () => (await import("./catalogs/data/hotstore.ts")).catalog,
    [GameplayCatalog.House]: async () => (await import("./catalogs/data/house.ts")).catalog,
    [GameplayCatalog.Inspire]: async () => (await import("./catalogs/data/inspire.ts")).catalog,
    [GameplayCatalog.IsopenUid]: async () =>
        (await import("./catalogs/data/isopen_uid.ts")).catalog,
    [GameplayCatalog.Item]: async () => (await import("./catalogs/data/item.ts")).catalog,
    [GameplayCatalog.KingdomBuilding]: async () =>
        (await import("./catalogs/data/kingdom_building.ts")).catalog,
    [GameplayCatalog.KingdomBuildingBuff]: async () =>
        (await import("./catalogs/data/kingdom_building_buff.ts")).catalog,
    [GameplayCatalog.Kingdomshop]: async () =>
        (await import("./catalogs/data/kingdomshop.ts")).catalog,
    [GameplayCatalog.Kingdomskill]: async () =>
        (await import("./catalogs/data/kingdomskill.ts")).catalog,
    [GameplayCatalog.Kingdon1]: async () => (await import("./catalogs/data/kingdon_1.ts")).catalog,
    [GameplayCatalog.Kingdon2]: async () => (await import("./catalogs/data/kingdon_2.ts")).catalog,
    [GameplayCatalog.KnightTitle]: async () =>
        (await import("./catalogs/data/knight_title.ts")).catalog,
    [GameplayCatalog.Landing]: async () => (await import("./catalogs/data/landing.ts")).catalog,
    [GameplayCatalog.LifeTreeS]: async () =>
        (await import("./catalogs/data/life_treeS.ts")).catalog,
    [GameplayCatalog.LordDetails]: async () =>
        (await import("./catalogs/data/lordDetails.ts")).catalog,
    [GameplayCatalog.LordImage]: async () =>
        (await import("./catalogs/data/lord_image.ts")).catalog,
    [GameplayCatalog.LordImageXml]: async () =>
        (await import("./catalogs/data/lord_image.xml.ts")).catalog,
    [GameplayCatalog.Lottery]: async () => (await import("./catalogs/data/lottery.ts")).catalog,
    [GameplayCatalog.LuckDraw]: async () => (await import("./catalogs/data/luck_draw.ts")).catalog,
    [GameplayCatalog.LuckyDay]: async () => (await import("./catalogs/data/lucky_day.ts")).catalog,
    [GameplayCatalog.LuckyEffect]: async () =>
        (await import("./catalogs/data/lucky_effect.ts")).catalog,
    [GameplayCatalog.LuckyEgg]: async () => (await import("./catalogs/data/lucky_egg.ts")).catalog,
    [GameplayCatalog.LuckyReturnExchange]: async () =>
        (await import("./catalogs/data/lucky_return_exchange.ts")).catalog,
    [GameplayCatalog.MagicRush]: async () =>
        (await import("./catalogs/data/magic_rush.ts")).catalog,
    [GameplayCatalog.Mail]: async () => (await import("./catalogs/data/mail.ts")).catalog,
    [GameplayCatalog.Mark]: async () => (await import("./catalogs/data/mark.ts")).catalog,
    [GameplayCatalog.Market]: async () => (await import("./catalogs/data/market.ts")).catalog,
    [GameplayCatalog.Material]: async () => (await import("./catalogs/data/material.ts")).catalog,
    [GameplayCatalog.MergeActivity]: async () =>
        (await import("./catalogs/data/merge_activity.ts")).catalog,
    [GameplayCatalog.MiracleBuff]: async () =>
        (await import("./catalogs/data/miracle_buff.ts")).catalog,
    [GameplayCatalog.Monarch]: async () => (await import("./catalogs/data/monarch.ts")).catalog,
    [GameplayCatalog.MonarchTitleKingdom]: async () =>
        (await import("./catalogs/data/monarch_title_kingdom.ts")).catalog,
    [GameplayCatalog.MonarchTitleLord]: async () =>
        (await import("./catalogs/data/monarch_title_lord.ts")).catalog,
    [GameplayCatalog.MonsterSiege]: async () =>
        (await import("./catalogs/data/monster_siege.ts")).catalog,
    [GameplayCatalog.MonsterSiegeReward]: async () =>
        (await import("./catalogs/data/monster_siege_reward.ts")).catalog,
    [GameplayCatalog.NeutralServerWorld]: async () =>
        (await import("./catalogs/data/dragonBattleWorld.ts")).catalog,
    [GameplayCatalog.NeutralServerBuilding]: async () =>
        (await import("./catalogs/data/neutralServer_building.ts")).catalog,
    [GameplayCatalog.NeutralServerReward]: async () =>
        (await import("./catalogs/data/neutralServer_reward.ts")).catalog,
    [GameplayCatalog.NeutralServerScore]: async () =>
        (await import("./catalogs/data/neutralServer_score.ts")).catalog,
    [GameplayCatalog.NewBank]: async () => (await import("./catalogs/data/new_bank.ts")).catalog,
    [GameplayCatalog.NewContinuedCost]: async () =>
        (await import("./catalogs/data/continued_cost.ts")).catalog,
    [GameplayCatalog.NewDailyTask]: async () =>
        (await import("./catalogs/data/new_daily_task.ts")).catalog,
    [GameplayCatalog.NewExchange]: async () =>
        (await import("./catalogs/data/new_exchange.ts")).catalog,
    [GameplayCatalog.NewRecallQuest]: async () =>
        (await import("./catalogs/data/new_recall_quest.ts")).catalog,
    [GameplayCatalog.NewSprInfo]: async () =>
        (await import("./catalogs/data/new_spr_info.ts")).catalog,
    [GameplayCatalog.NewSprRound]: async () =>
        (await import("./catalogs/data/new_spr_round.ts")).catalog,
    [GameplayCatalog.NewWkPersonReward]: async () =>
        (await import("./catalogs/data/new_wk_person_reward.ts")).catalog,
    [GameplayCatalog.NewWkReward]: async () =>
        (await import("./catalogs/data/new_wk_reward.ts")).catalog,
    [GameplayCatalog.NewWkScore]: async () =>
        (await import("./catalogs/data/new_wk_score.ts")).catalog,
    [GameplayCatalog.NewbeeCastleReward]: async () =>
        (await import("./catalogs/data/newbee_castle_reward.ts")).catalog,
    [GameplayCatalog.NewbieItems]: async () =>
        (await import("./catalogs/data/newbie_items.ts")).catalog,
    [GameplayCatalog.NewcomerTreviFountain]: async () =>
        (await import("./catalogs/data/newcomer_trevi_fountain.ts")).catalog,
    [GameplayCatalog.Newplayer]: async () => (await import("./catalogs/data/newplayer.ts")).catalog,
    [GameplayCatalog.NewsCastleLV]: async () =>
        (await import("./catalogs/data/news_castleLV.ts")).catalog,
    [GameplayCatalog.NewsHeap]: async () => (await import("./catalogs/data/news_heap.ts")).catalog,
    [GameplayCatalog.NotiTimezone]: async () =>
        (await import("./catalogs/data/noti_timezone.ts")).catalog,
    [GameplayCatalog.Npc]: async () => (await import("./catalogs/data/npc.ts")).catalog,
    [GameplayCatalog.Office]: async () => (await import("./catalogs/data/office.ts")).catalog,
    [GameplayCatalog.OnlineReward]: async () =>
        (await import("./catalogs/data/onlineReward.ts")).catalog,
    [GameplayCatalog.Overlord]: async () => (await import("./catalogs/data/overlord.ts")).catalog,
    [GameplayCatalog.P6Arms]: async () => (await import("./catalogs/data/p6_arms.ts")).catalog,
    [GameplayCatalog.Package]: async () => (await import("./catalogs/data/package.ts")).catalog,
    [GameplayCatalog.PayLottery]: async () =>
        (await import("./catalogs/data/pay_lottery.ts")).catalog,
    [GameplayCatalog.PayReward]: async () =>
        (await import("./catalogs/data/pay_reward.ts")).catalog,
    [GameplayCatalog.PayServercontrol]: async () =>
        (await import("./catalogs/data/pay_servercontrol.ts")).catalog,
    [GameplayCatalog.PayUserReward]: async () =>
        (await import("./catalogs/data/pay_user_reward.ts")).catalog,
    [GameplayCatalog.Paycard]: async () => (await import("./catalogs/data/paycard.ts")).catalog,
    [GameplayCatalog.PfCheck]: async () => (await import("./catalogs/data/pf_check.ts")).catalog,
    [GameplayCatalog.PlayerData]: async () =>
        (await import("./catalogs/data/playerData.ts")).catalog,
    [GameplayCatalog.PlayerName]: async () =>
        (await import("./catalogs/data/playerName.ts")).catalog,
    [GameplayCatalog.Position]: async () => (await import("./catalogs/data/position.ts")).catalog,
    [GameplayCatalog.PositionUnlock]: async () =>
        (await import("./catalogs/data/position_unlock.ts")).catalog,
    [GameplayCatalog.PowerRandom]: async () =>
        (await import("./catalogs/data/powerRandom.ts")).catalog,
    [GameplayCatalog.Princess]: async () => (await import("./catalogs/data/princess.ts")).catalog,
    [GameplayCatalog.PrincessQuest]: async () =>
        (await import("./catalogs/data/princess_quest.ts")).catalog,
    [GameplayCatalog.Quest]: async () => (await import("./catalogs/data/quest.ts")).catalog,
    [GameplayCatalog.QuestMark]: async () =>
        (await import("./catalogs/data/quest_mark.ts")).catalog,
    [GameplayCatalog.QuestPhase]: async () =>
        (await import("./catalogs/data/quest_phase.ts")).catalog,
    [GameplayCatalog.QuickBuilding]: async () =>
        (await import("./catalogs/data/quick_building.ts")).catalog,
    [GameplayCatalog.QuickScience]: async () =>
        (await import("./catalogs/data/quick_science.ts")).catalog,
    [GameplayCatalog.Rank]: async () => (await import("./catalogs/data/rank.ts")).catalog,
    [GameplayCatalog.Recall]: async () => (await import("./catalogs/data/recall.ts")).catalog,
    [GameplayCatalog.RecallActivity]: async () =>
        (await import("./catalogs/data/recall_activity.ts")).catalog,
    [GameplayCatalog.RecallQuest]: async () =>
        (await import("./catalogs/data/recall_quest.ts")).catalog,
    [GameplayCatalog.Recruit]: async () => (await import("./catalogs/data/recruit.ts")).catalog,
    [GameplayCatalog.ReforgeRandom]: async () =>
        (await import("./catalogs/data/reforgeRandom.ts")).catalog,
    [GameplayCatalog.ReputationAction]: async () =>
        (await import("./catalogs/data/reputation_action.ts")).catalog,
    [GameplayCatalog.ReputationClassifylimit]: async () =>
        (await import("./catalogs/data/reputation_classifylimit.ts")).catalog,
    [GameplayCatalog.ReputationLevel]: async () =>
        (await import("./catalogs/data/reputation_level.ts")).catalog,
    [GameplayCatalog.Resdential]: async () =>
        (await import("./catalogs/data/resdential.ts")).catalog,
    [GameplayCatalog.ResouceLife]: async () =>
        (await import("./catalogs/data/resouce_life.ts")).catalog,
    [GameplayCatalog.Resource2]: async () =>
        (await import("./catalogs/data/resouce_life.ts")).catalog,
    [GameplayCatalog.Resource3]: async () => (await import("./catalogs/data/resource3.ts")).catalog,
    [GameplayCatalog.Resources]: async () => (await import("./catalogs/data/resources.ts")).catalog,
    [GameplayCatalog.Reward]: async () => (await import("./catalogs/data/reward.ts")).catalog,
    [GameplayCatalog.RewardAdd]: async () =>
        (await import("./catalogs/data/reward_add.ts")).catalog,
    [GameplayCatalog.Role]: async () => (await import("./catalogs/data/role.ts")).catalog,
    [GameplayCatalog.Safe]: async () => (await import("./catalogs/data/safe.ts")).catalog,
    [GameplayCatalog.SagaTowerScienceBase]: async () =>
        (await import("./catalogs/data/saga_tower_science_base.ts")).catalog,
    [GameplayCatalog.SagaTowerScienceUp]: async () =>
        (await import("./catalogs/data/saga_tower_science_up.ts")).catalog,
    [GameplayCatalog.Science]: async () => (await import("./catalogs/data/science.ts")).catalog,
    [GameplayCatalog.ScienceRace]: async () =>
        (await import("./catalogs/data/scienceRace.ts")).catalog,
    [GameplayCatalog.ScienceRaceType]: async () =>
        (await import("./catalogs/data/scienceRaceType.ts")).catalog,
    [GameplayCatalog.ScienceType]: async () =>
        (await import("./catalogs/data/scienceType.ts")).catalog,
    [GameplayCatalog.Score]: async () => (await import("./catalogs/data/score.ts")).catalog,
    [GameplayCatalog.Serverlist]: async () =>
        (await import("./catalogs/data/serverlist.ts")).catalog,
    [GameplayCatalog.Serverpos]: async () => (await import("./catalogs/data/serverpos.ts")).catalog,
    [GameplayCatalog.Servers]: async () => (await import("./catalogs/data/servers.ts")).catalog,
    [GameplayCatalog.ServersConfig]: async () =>
        (await import("./catalogs/data/servers_config.ts")).catalog,
    [GameplayCatalog.Servertransfer]: async () =>
        (await import("./catalogs/data/servertransfer.ts")).catalog,
    [GameplayCatalog.Setting]: async () => (await import("./catalogs/data/setting.ts")).catalog,
    [GameplayCatalog.ShopNew]: async () => (await import("./catalogs/data/shop_new.ts")).catalog,
    [GameplayCatalog.ShopNew7210]: async () =>
        (await import("./catalogs/data/shop_new7.21.0.ts")).catalog,
    [GameplayCatalog.ShopNew926]: async () =>
        (await import("./catalogs/data/shop_new_9.26.ts")).catalog,
    [GameplayCatalog.SignIn]: async () => (await import("./catalogs/data/sign_in.ts")).catalog,
    [GameplayCatalog.SignIn2]: async () => (await import("./catalogs/data/sign_in_2.ts")).catalog,
    [GameplayCatalog.SingleCharge]: async () =>
        (await import("./catalogs/data/single_charge.ts")).catalog,
    [GameplayCatalog.Sk]: async () => (await import("./catalogs/data/sk.ts")).catalog,
    [GameplayCatalog.Skill]: async () => (await import("./catalogs/data/skill.ts")).catalog,
    [GameplayCatalog.Skill2]: async () => (await import("./catalogs/data/skill2.ts")).catalog,
    [GameplayCatalog.Soldiers]: async () => (await import("./catalogs/data/soldiers.ts")).catalog,
    [GameplayCatalog.SpLoad]: async () => (await import("./catalogs/data/sp_load.ts")).catalog,
    [GameplayCatalog.SpResources]: async () =>
        (await import("./catalogs/data/sp_resources.ts")).catalog,
    [GameplayCatalog.SpResourcesBet]: async () =>
        (await import("./catalogs/data/sp_resources_bet.ts")).catalog,
    [GameplayCatalog.SpResourcesInit]: async () =>
        (await import("./catalogs/data/sp_resources_init.ts")).catalog,
    [GameplayCatalog.SpResourcesList]: async () =>
        (await import("./catalogs/data/sp_resources_list.ts")).catalog,
    [GameplayCatalog.SpResourcesRound]: async () =>
        (await import("./catalogs/data/sp_resources_round.ts")).catalog,
    [GameplayCatalog.SpResourcesType]: async () =>
        (await import("./catalogs/data/sp_resources_type.ts")).catalog,
    [GameplayCatalog.SpecialPush]: async () =>
        (await import("./catalogs/data/special_push.ts")).catalog,
    [GameplayCatalog.StatusCopy]: async () =>
        (await import("./catalogs/data/status - Copy.ts")).catalog,
    [GameplayCatalog.Status]: async () => (await import("./catalogs/data/status.ts")).catalog,
    [GameplayCatalog.StorySetting]: async () =>
        (await import("./catalogs/data/story_setting.ts")).catalog,
    [GameplayCatalog.SubcityReward]: async () =>
        (await import("./catalogs/data/subcity_reward.ts")).catalog,
    [GameplayCatalog.Suit]: async () => (await import("./catalogs/data/suit.ts")).catalog,
    [GameplayCatalog.Suitequipment]: async () =>
        (await import("./catalogs/data/suitequipment.ts")).catalog,
    [GameplayCatalog.Svip]: async () => (await import("./catalogs/data/svip.ts")).catalog,
    [GameplayCatalog.SvipShopBuilding]: async () =>
        (await import("./catalogs/data/svip_shop_building.ts")).catalog,
    [GameplayCatalog.TargetQuest]: async () =>
        (await import("./catalogs/data/target_quest.ts")).catalog,
    [GameplayCatalog.Territory]: async () => (await import("./catalogs/data/territory.ts")).catalog,
    [GameplayCatalog.TerritoryEffect]: async () =>
        (await import("./catalogs/data/territory_effect.ts")).catalog,
    [GameplayCatalog.TimeGift]: async () => (await import("./catalogs/data/time_gift.ts")).catalog,
    [GameplayCatalog.Totem]: async () => (await import("./catalogs/data/totem.ts")).catalog,
    [GameplayCatalog.Tower]: async () => (await import("./catalogs/data/tower.ts")).catalog,
    [GameplayCatalog.Trade]: async () => (await import("./catalogs/data/trade.ts")).catalog,
    [GameplayCatalog.Train]: async () => (await import("./catalogs/data/train.ts")).catalog,
    [GameplayCatalog.Treasure]: async () => (await import("./catalogs/data/treasure.ts")).catalog,
    [GameplayCatalog.Trial]: async () => (await import("./catalogs/data/trial.ts")).catalog,
    [GameplayCatalog.TriggerActivity]: async () =>
        (await import("./catalogs/data/trigger-activity.ts")).catalog,
    [GameplayCatalog.TriggerExchange]: async () =>
        (await import("./catalogs/data/trigger-exchange.ts")).catalog,
    [GameplayCatalog.TriggerVar]: async () =>
        (await import("./catalogs/data/trigger-var.ts")).catalog,
    [GameplayCatalog.Trigger]: async () => (await import("./catalogs/data/trigger.ts")).catalog,
    [GameplayCatalog.UpgradeReward]: async () =>
        (await import("./catalogs/data/lord_image.xml.ts")).catalog,
    [GameplayCatalog.Variable]: async () => (await import("./catalogs/data/variable.ts")).catalog,
    [GameplayCatalog.Vip]: async () => (await import("./catalogs/data/vip.ts")).catalog,
    [GameplayCatalog.VoteServer]: async () =>
        (await import("./catalogs/data/vote_server.ts")).catalog,
    [GameplayCatalog.WaBuild]: async () => (await import("./catalogs/data/wa_build.ts")).catalog,
    [GameplayCatalog.WaMonster]: async () =>
        (await import("./catalogs/data/wa_monster.ts")).catalog,
    [GameplayCatalog.WaRewardS]: async () =>
        (await import("./catalogs/data/wa_reward_s.ts")).catalog,
    [GameplayCatalog.WagArea]: async () => (await import("./catalogs/data/wag_area.ts")).catalog,
    [GameplayCatalog.WagBuild]: async () => (await import("./catalogs/data/wag_build.ts")).catalog,
    [GameplayCatalog.WagMonster]: async () =>
        (await import("./catalogs/data/wag_monster.ts")).catalog,
    [GameplayCatalog.WagReRank]: async () =>
        (await import("./catalogs/data/wag_re_rank.ts")).catalog,
    [GameplayCatalog.WagReTeam]: async () =>
        (await import("./catalogs/data/wag_re_team.ts")).catalog,
    [GameplayCatalog.WagRole]: async () => (await import("./catalogs/data/wag_role.ts")).catalog,
    [GameplayCatalog.WapMatch]: async () => (await import("./catalogs/data/wap_match.ts")).catalog,
    [GameplayCatalog.WapReRank]: async () =>
        (await import("./catalogs/data/wap_re_rank.ts")).catalog,
    [GameplayCatalog.WapReTeam]: async () =>
        (await import("./catalogs/data/wag_re_team.ts")).catalog,
    [GameplayCatalog.WbKill]: async () => (await import("./catalogs/data/wb_kill.ts")).catalog,
    [GameplayCatalog.WbReward]: async () => (await import("./catalogs/data/wb_reward.ts")).catalog,
    [GameplayCatalog.WbSkill]: async () => (await import("./catalogs/data/wb_skill.ts")).catalog,
    [GameplayCatalog.Web]: async () => (await import("./catalogs/data/web.ts")).catalog,
    [GameplayCatalog.WebCheck]: async () => (await import("./catalogs/data/webCheck.ts")).catalog,
    [GameplayCatalog.Wish]: async () => (await import("./catalogs/data/wish.ts")).catalog,
    [GameplayCatalog.WkBuild]: async () => (await import("./catalogs/data/wk_build.ts")).catalog,
    [GameplayCatalog.WkPersonReward]: async () =>
        (await import("./catalogs/data/wk_person_reward.ts")).catalog,
    [GameplayCatalog.WkQuest]: async () => (await import("./catalogs/data/wk_quest.ts")).catalog,
    [GameplayCatalog.WkReward]: async () => (await import("./catalogs/data/wk_reward.ts")).catalog,
    [GameplayCatalog.WkScore]: async () => (await import("./catalogs/data/wk_score.ts")).catalog,
    [GameplayCatalog.WkServer]: async () => (await import("./catalogs/data/wk_server.ts")).catalog,
    [GameplayCatalog.Wonder]: async () => (await import("./catalogs/data/wonder.ts")).catalog,
    [GameplayCatalog.World]: async () => (await import("./catalogs/data/SeaWorldmap.ts")).catalog,
    [GameplayCatalog.WorldLevel]: async () =>
        (await import("./catalogs/data/world_level.ts")).catalog,
    [GameplayCatalog.Worldboss]: async () => (await import("./catalogs/data/worldboss.ts")).catalog,
    [GameplayCatalog.WrExp]: async () => (await import("./catalogs/data/wr_exp.ts")).catalog,
    [GameplayCatalog.WrRank]: async () => (await import("./catalogs/data/wr_rank.ts")).catalog,
    [GameplayCatalog.WrSever]: async () => (await import("./catalogs/data/wr_sever.ts")).catalog,
    [GameplayCatalog.WrSkill]: async () => (await import("./catalogs/data/wr_skill.ts")).catalog,
    [GameplayCatalog.WrTroopsPoint]: async () =>
        (await import("./catalogs/data/wr_troops_point.ts")).catalog,
};

export async function loadCatalog<Id extends keyof GameplayCatalogDefinitions>(
    id: Id,
): Promise<GameplayCatalogDefinitions[Id]>
{
    return catalogDefinitions[id]();
}
