import type { WorldResourceOwnerSnapshot } from "./world-point-detail";
import type { Row } from "./rows";
import type { PlayerEffectSnapshot } from "./power";
import type { ActivityEconomy } from "./timed-activity";

export interface CityProgressionState {
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
  tasks: readonly Row[];
  achievements: readonly Row[];
  equipment: readonly Row[];
  glory: Row;
}

export interface CityProgressionWrite {
  buildings?: readonly Row[];
  deletedBuildings?: readonly string[];
  sciences?: readonly Row[];
  armies?: readonly Row[];
  hospital?: readonly Row[];
  forts?: readonly Row[];
  queues?: readonly Row[];
  profile?: { level: number; exp: number };
  statistics?: { power: bigint; buildingPower: bigint; armyCure: number };
  buildingExperience?: { currentMax: bigint; historyMax: bigint };
}

export interface CityProgressionStore {
  getState(): Promise<CityProgressionState>;
  update(write: CityProgressionWrite, economy: ActivityEconomy): Promise<void>;
}

export interface ProgressionActivityData {
  schema: 1;
  kind: "upgrade" | "destroy" | "research" | "train" | "heal" | "fort";
  costs: Record<string, string>;
  items: Record<string, number>;
  target?: { level: number; star: number; progress: number };
  units?: Record<string, number>;
}
