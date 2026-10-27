import type { Row } from "./rows";
import type { MarchLifecycle } from "./world-march-lifecycle";
export interface RuntimeMarch extends MarchLifecycle {
  scoutHonour?: boolean;
  scoutTargetOwner?: string;
  scoutReport?: string;
  treasureUUID?: string;
  treasureReward?: string;
  troubleItem?: string;
  sharedReward?: string;
  sharedRewardCounts?: readonly { id: string; count: number }[];
  capacity: number;
  gatheredBefore?: number;
  segments?: readonly { sp: number; dp: number; mt: number }[];
  collectRate: number;
  marchSpeed: number;
  targetType: number;
  targetResource: number;
  troopIds: Readonly<Record<string, string>>;
}
export interface WorldMutationState {
  mapSize?: number;
  scoutTargets?: ReadonlyMap<number, import("./world-scout-report").WorldScoutTarget>;
  sharedMarches?: readonly Row[];
  sharedCheckpoints?: readonly Row[];
  sharedProfiles?: readonly Row[];
  sharedArmies?: readonly Row[];
  sharedDragons?: readonly Row[];
  sharedGeneralSkills?: readonly Row[];
  targetMarchCount?: number;
  treasures?: readonly Row[];
  cityBosses?: readonly Row[];
  cityFootprint?: readonly number[];
  civilizationFootprint?: readonly number[];
  world: Row;
  points: readonly Row[];
  marches: readonly Row[];
  checkpoints: readonly Row[];
}
export interface WorldMutationWrite {
  scoutMails?: readonly import("./world-scout-report").WorldScoutMail[];
  sharedTimings?: readonly {
    id: string;
    owner: string;
    target: number;
    expectedVersion: number;
    version: number;
    dueAt: bigint;
    payload: Uint8Array;
  }[];
  barbarianActors?: import("./world-monsters").WorldBarbarianActorWrite;
  treasures?: readonly Row[];
  deletedTreasures?: readonly string[];
  troubleDeliveries?: readonly import("./trouble").TroubleDelivery[];
  companionPushes?: readonly { command: string; body: Uint8Array }[];
  world?: Row;
  points?: readonly Row[];
  marches?: readonly Row[];
  deletedMarches?: readonly string[];
  checkpoints?: readonly Row[];
}
