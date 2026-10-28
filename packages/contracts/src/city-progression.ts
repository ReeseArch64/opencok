import type { QuestState, QuestWrite } from "@opencok/tasks/contracts/progression";
export type { QuestState, QuestWrite } from "@opencok/tasks/contracts/progression";
export type { ProgressionActivityData } from "@opencok/economy/contracts/progression-activity";
import type { GeneralWrite } from "@opencok/hero/contracts/generals";
import type { GeneralRoster } from "@opencok/hero/contracts/generals";
import type { GeneralRankingWeights } from "@opencok/hero/contracts/generals";
import type { WorldResourceOwnerSnapshot } from "./world-point-detail";
import type { Row } from "./rows";
import type { PlayerEffectSnapshot } from "./power";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";

export interface DragonProgressionState
{
    talents: readonly Row[];
    dragons: readonly Row[];
    skills: readonly Row[];
    marches: readonly Row[];
    switchedAt: bigint;
}

export interface DragonProgressionWrite
{
    talents?: readonly Row[];
    dragons?: readonly Row[];
    skills?: readonly Row[];
    deletedSkills?: readonly string[];
}

export interface CityProgressionState
{
    activityReward?: import("./activity-reward").ActivityRewardReader;
    comeback?: import("./comeback").ComebackState;
    branchCity?: Row | null;
    hotItem?: import("./hot-item").HotItemState;
    worldMonsters?: import("./world-monsters").WorldMonsterReader;
    campaignProfile?: Row;
    costRankAward?: import("./continued-cost-rewards").CostRankAwardReader;
    expeditionAward?: import("./expedition-stage-rewards").ExpeditionAwardReader;
    expeditionScore?: import("./new-expedition").ExpeditionScoreReader;
    heroRankingAward?: import("@opencok/hero/contracts/hero-ranking-rewards").HeroRankAwardReader;
    heroScore?: import("@opencok/hero/contracts/hero-score").HeroScoreReader;
    olympic?: import("./olympic").OlympicState;
    cupBetting?: import("./cup-betting").CupBettingState;
    groupBuy?: import("./groupbuy").GroupBuyState;
    continuedCost?: import("./continued-cost").ContinuedCostReader;
    trouble?: import("./trouble").TroubleState;
    cosmeticTarget?: import("./city-cosmetics").CosmeticTargetState;
    prayer?: import("./prayer").PrayerState;
    recallTask?: import("./recall-task").RecallTaskState;
    regionalRecall?: import("./regional-recall").RegionalRecallState;
    allianceHeart?: import("./alliance-heart").AllianceHeartState;
    playerItemGifts?: import("./player-item-gifts").PlayerItemGiftState;
    seasonalExchange?: import("./seasonal-exchange").SeasonalExchangeState;
    fragmentExchange?: readonly Row[];
    monsterExchange?: readonly Row[];
    vipBox?: import("./vip-box").VipBoxState;
    targetTask?: import("./target-task").TargetTaskState;
    redPackets?: import("./paid-gifts").RedPacketReader;
    militaryAward?: import("./military-rank-awards").MilitaryRankAwardReader;
    rechargeFeedback?: import("./recharge-feedback").RechargeFeedbackReader;
    goldEggs?: import("./gold-eggs").GoldEggsReader;
    eggActivity?: import("./egg-activity").EggActivityState;
    normalRecharge?: import("./normal-recharge").NormalRechargeState;
    rechargeActivity?: import("./recharge-activity").RechargeActivityState;
    ordinaryBoxServer?: { openedAt: bigint; };
    sevenDayCycle?: import("./seven-day-cycle").SevenDayCycleState;
    dailyInvestment?: import("./daily-investment").DailyInvestmentState;
    castleLevelEvent?: import("./castle-level-event").CastleLevelEventState;
    luckyDay?: { day?: Row; server?: Row; };
    dragonTower?: import("./dragon-tower").DragonTowerState;
    expedition?: import("./new-expedition").ExpeditionState;
    arena?: import("./arena").ArenaState;
    anniversaryStatistics?: { statistics: Row; alliance: Row; times: Row; };
    campaignVariables?: readonly Row[];
    lottery?: { record?: Row; history: readonly Row[]; };
    totems?: import("./totem").TotemProgressionState;
    civilizationCastle?: Row;
    civilizationCastleTarget?: { castle: Row; profile: Row; };
    worldMutation?: import("./world-march-runtime").WorldMutationState;
    dragons?: DragonProgressionState;
    minstrel?: Row;
    civilizationSciences?: readonly Row[];
    generalRoster?: GeneralRoster;
    quests?: QuestState;
    abilityPages?: readonly Row[];
    suitDecompositions?: readonly Row[];
    profile: Row;
    resource: Row;
    statistics: Row;
    buildingExperience: Row;
    buildings: readonly Row[];
    sciences: readonly Row[];
    armies: readonly Row[];
    hospital: readonly Row[];
    forts: readonly Row[];
    queues: readonly Row[];
    effects: PlayerEffectSnapshot;
    newGenerals: WorldResourceOwnerSnapshot["newGenerals"];
    skills: readonly Row[];
    tasks: readonly Row[];
    achievements: readonly Row[];
    equipment: readonly Row[];
    glory: Row;
}

export interface CityProgressionWrite
{
    legacyGeneralLevel?: number;
    activityRewardClaim?: import("./activity-reward").ActivityRewardWrite;
    comeback?: import("./comeback").ComebackWrite;
    branchCityOpenState?: number;
    hotItem?: import("./hot-item").HotItemWrite;
    costRankAward?: string;
    expeditionAward?: string;
    heroRankingAward?: import("@opencok/hero/contracts/hero-ranking-rewards").HeroRankAwardWrite;
    heroScore?: import("@opencok/hero/contracts/hero-score").HeroScoreWrite;
    olympic?: import("./olympic").OlympicWrite;
    cupBetting?: import("./cup-betting").CupBettingWrite;
    groupBuy?: import("./groupbuy").GroupBuyWrite;
    specialEventPurchase?: Row;
    continuedCostHide?: number;
    continuedCost?: { row: Row; logs: readonly number[]; };
    troubleHistory?: import("./trouble").TroubleHistoryWrite;
    cosmeticTarget?: import("./city-cosmetics").CosmeticTargetWrite;
    cosmeticChanges?: readonly import("./city-cosmetics").CosmeticStatusChange[];
    prayer?: import("./prayer").PrayerWrite;
    recallTask?: import("./recall-task").RecallTaskWrite;
    regionalRecall?: import("./regional-recall").RegionalRecallWrite;
    allianceHeart?: import("./alliance-heart").AllianceHeartWrite;
    playerItemGifts?: import("./player-item-gifts").PlayerItemGiftWrite;
    seasonalExchange?: import("./rows").Row;
    fragmentExchange?: readonly Row[];
    monsterExchange?: readonly Row[];
    vipBox?: import("./vip-box").VipBoxWrite;
    targetTask?: import("./target-task").TargetTaskWrite;
    redPackets?: import("./paid-gifts").RedPacketWrite;
    militaryAward?: import("./military-rank-awards").MilitaryRankAwardWrite;
    rechargeFeedback?: readonly import("./recharge-feedback").RechargeFeedbackClaim[];
    rechargeActivity?: import("./recharge-activity").RechargeActivityWrite;
    ordinaryBox?: import("./ordinary-box").OrdinaryBoxWrite;
    sevenDayCycle?: import("./seven-day-cycle").SevenDayCycleWrite;
    goldEggs?: import("./gold-eggs").GoldEggsWrite;
    eggActivity?: import("./egg-activity").EggActivityWrite;
    normalRecharge?: import("./normal-recharge").NormalRechargeWrite;
    shippingInvestment?: import("./shipping-investment").ShippingInvestmentWrite;
    dailyInvestment?: Row;
    castleLevelEvent?: readonly import("./castle-level-event").CastleLevelEventRow[];
    castleLevelEnrollments?: readonly number[];
    luckyDay?: Row;
    dragonTower?: import("./dragon-tower").DragonTowerWrite;
    expedition?: readonly Row[];
    arena?: import("./arena").ArenaWrite;
    campaignVariables?: readonly Row[];
    lottery?: { record: Row; history?: readonly Row[]; };
    totems?: import("./totem").TotemProgressionWrite;
    civilizationCastle?: Row;
    worldMutation?: import("./world-march-runtime").WorldMutationWrite;
    dragons?: DragonProgressionWrite;
    minstrel?: Row;
    civilizationSciences?: readonly Row[];
    generalRoster?: GeneralWrite;
    equipment?: readonly Row[];
    deletedEquipment?: readonly string[];
    suitDecompositions?: readonly Row[];
    equipmentSelection?: string;
    materialBackup?: number;
    materialAcceleration?: { materialCdNum: number; materialCdTime: bigint; };
    queueUpdates?: readonly Row[];
    vip?: Row;
    states?: readonly Row[];
    deletedStates?: readonly number[];
    generals?: readonly Row[];
    abilityPages?: readonly Row[];
    quests?: QuestWrite;
    buildings?: readonly Row[];
    deletedBuildings?: readonly string[];
    sciences?: readonly Row[];
    skills?: readonly Row[];
    armies?: readonly Row[];
    hospital?: readonly Row[];
    forts?: readonly Row[];
    queues?: readonly Row[];
    profile?: { level: number; exp: number; };
    statistics?: {
        power: bigint;
        buildingPower: bigint;
        armyCure: number;
        detectNum?: number;
        questPower?: number;
    };
    buildingExperience?: { currentMax: bigint; historyMax: bigint; };
}

export interface CityProgressionStore
{
    birthPoint?(
        rules: import("./world-birth").WorldBirthRules,
        mode?: import("./world-birth").WorldBirthMode,
    ): Promise<import("./world-birth").WorldBirthPlacement>;
    treasurePoints?(ids: readonly number[]): Promise<readonly Row[]>;
    getState(
        command?: string,
        ranking?: GeneralRankingWeights,
        request?: Uint8Array,
    ): Promise<CityProgressionState>;
    update(write: CityProgressionWrite, economy: ActivityEconomy): Promise<void>;
}
