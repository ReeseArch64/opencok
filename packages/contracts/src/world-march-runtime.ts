import type { Row } from "./rows";
import type { MarchLifecycle } from "./world-march-lifecycle";
export interface RuntimeMarch extends MarchLifecycle {
  troubleItem?: string;
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
  cityFootprint?: readonly number[];
  civilizationFootprint?: readonly number[];
  randomDestination?: number;
  world: Row;
  points: readonly Row[];
  marches: readonly Row[];
  checkpoints: readonly Row[];
}
export interface WorldMutationWrite {
  troubleDeliveries?: readonly import("./trouble").TroubleDelivery[];
  companionPushes?: readonly { command: string; body: Uint8Array }[];
  world?: Row;
  points?: readonly Row[];
  marches?: readonly Row[];
  deletedMarches?: readonly string[];
  checkpoints?: readonly Row[];
}
