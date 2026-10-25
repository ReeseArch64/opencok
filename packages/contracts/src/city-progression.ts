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
