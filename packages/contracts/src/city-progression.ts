import type { WorldResourceOwnerSnapshot } from "./world-point-detail";
import type { Row } from "./rows";
import type { PlayerEffectSnapshot } from "./power";
import type { ActivityEconomy } from "./timed-activity";

export interface QuestState {
  legacy: readonly Row[];
  fresh: Row;
  lord: Row;
  mixed: Row;
  signIn: Row;
  story: readonly Row[];
  daily: readonly Row[];
  alliance: Row;
}
export interface QuestWrite {
  mail?: readonly import("./files").AvatarSystemMail[];
  legacy?: readonly Row[];
  resetLegacy?: boolean;
  legacyPeriod?: bigint;
  dailyClaims?: string;
  fresh?: { day: number; signInTime: bigint };
  tasks?: readonly Row[];
  story?: readonly Row[];
  daily?: readonly Row[];
  resetDaily?: boolean;
  lord?: { newDailyTaskFlushTime: bigint; newDailyTaskBoxRewardState: number };
  signIn?: { day: number; lastRewardTime: bigint; reward: string };
  taskStage?: number;
  allianceTasks?: number;
  allianceBox?: { threshold: number; period: bigint };
}
export interface GeneralRankingWeights {
  normal: number;
  silver: number;
  gold: number;
  periodStart?: bigint;
}
export interface GeneralRoster {
  wheel?: Row;
  wheelRanks?: readonly Row[];
  tavern?: Row;
  prisoners?: readonly Row[];
  marches?: readonly Row[];
  drawHistory?: readonly Buffer[];
  generals: readonly Row[];
  purchases: readonly Row[];
  offices: readonly Row[];
  skills: readonly Row[];
  statuses: readonly Row[];
}
export interface GeneralWrite {
  wheel?: Row;
  tavern?: Row;
  legacy?: readonly Row[];
  deletedLegacy?: readonly string[];
  prisoners?: readonly Row[];
  worldResources?: readonly { pointId: number; type: number; level: number; amount: number }[];
  turntableAt?: bigint;
  refinementPeriod?: { count: number; time: bigint };
  deletedStatuses?: readonly { generalId: number; stateId: number }[];
  accelerations?: readonly { type: number; queueId: string; milliseconds: bigint }[];
  generals?: readonly Row[];
  purchases?: readonly Row[];
  offices?: readonly Row[];
  skills?: readonly Row[];
  statuses?: readonly Row[];
}
export interface DragonProgressionState {
  talents: readonly Row[];
  dragons: readonly Row[];
  skills: readonly Row[];
  marches: readonly Row[];
  switchedAt: bigint;
}
export interface DragonProgressionWrite {
  talents?: readonly Row[];
  dragons?: readonly Row[];
  skills?: readonly Row[];
  deletedSkills?: readonly string[];
}
export interface CityProgressionState {
  branchCity?: Row | null;
  hotItem?: import("./hot-item").HotItemState;
  campaignProfile?: Row;
  costRankAward?: import("./continued-cost-rewards").CostRankAwardReader;
  expeditionAward?: import("./expedition-stage-rewards").ExpeditionAwardReader;
  expeditionScore?: import("./new-expedition").ExpeditionScoreReader;
  heroRankingAward?: import("./hero-ranking-rewards").HeroRankAwardReader;
  heroScore?: import("./hero-score").HeroScoreReader;
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
  rechargeFeedback?: import("./recharge-feedback").RechargeFeedbackReader;
  rechargeActivity?: import("./recharge-activity").RechargeActivityState;
  ordinaryBoxServer?: { openedAt: bigint };
  sevenDayCycle?: import("./seven-day-cycle").SevenDayCycleState;
  dailyInvestment?: import("./daily-investment").DailyInvestmentState;
  castleLevelEvent?: import("./castle-level-event").CastleLevelEventState;
  luckyDay?: { day?: Row; server?: Row };
  dragonTower?: import("./dragon-tower").DragonTowerState;
  expedition?: import("./new-expedition").ExpeditionState;
  arena?: import("./arena").ArenaState;
  anniversaryStatistics?: { statistics: Row; alliance: Row; times: Row };
  campaignVariables?: readonly Row[];
  lottery?: { record?: Row; history: readonly Row[] };
  totems?: import("./totem").TotemProgressionState;
  civilizationCastle?: Row;
  civilizationCastleTarget?: { castle: Row; profile: Row };
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

export interface CityProgressionWrite {
  branchCityOpenState?: number;
  hotItem?: import("./hot-item").HotItemWrite;
  costRankAward?: string;
  expeditionAward?: string;
  heroRankingAward?: import("./hero-ranking-rewards").HeroRankAwardWrite;
  heroScore?: import("./hero-score").HeroScoreWrite;
  olympic?: import("./olympic").OlympicWrite;
  cupBetting?: import("./cup-betting").CupBettingWrite;
  groupBuy?: import("./groupbuy").GroupBuyWrite;
  specialEventPurchase?: Row;
  continuedCostHide?: number;
  continuedCost?: { row: Row; logs: readonly number[] };
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
  rechargeFeedback?: readonly import("./recharge-feedback").RechargeFeedbackClaim[];
  rechargeActivity?: import("./recharge-activity").RechargeActivityWrite;
  ordinaryBox?: import("./ordinary-box").OrdinaryBoxWrite;
  sevenDayCycle?: import("./seven-day-cycle").SevenDayCycleWrite;
  shippingInvestment?: import("./shipping-investment").ShippingInvestmentWrite;
  dailyInvestment?: Row;
  castleLevelEvent?: readonly import("./castle-level-event").CastleLevelEventRow[];
  castleLevelEnrollments?: readonly number[];
  luckyDay?: Row;
  dragonTower?: import("./dragon-tower").DragonTowerWrite;
  expedition?: readonly Row[];
  arena?: import("./arena").ArenaWrite;
  campaignVariables?: readonly Row[];
  lottery?: { record: Row; history?: readonly Row[] };
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
  materialAcceleration?: { materialCdNum: number; materialCdTime: bigint };
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
  profile?: { level: number; exp: number };
  statistics?: { power: bigint; buildingPower: bigint; armyCure: number };
  buildingExperience?: { currentMax: bigint; historyMax: bigint };
}

export interface CityProgressionStore {
  treasurePoints?(ids: readonly number[]): Promise<readonly Row[]>;
  getState(
    command?: string,
    ranking?: GeneralRankingWeights,
    request?: Uint8Array,
  ): Promise<CityProgressionState>;
  update(write: CityProgressionWrite, economy: ActivityEconomy): Promise<void>;
}

export interface ProgressionActivityData {
  schema: 1;
  kind:
    | "civilization"
    | "upgrade"
    | "destroy"
    | "research"
    | "train"
    | "heal"
    | "fort"
    | "equipment"
    | "material";
  costs: Record<string, string>;
  items: Record<string, number>;
  target?: { level: number; star: number; progress: number };
  units?: Record<string, number>;
}
