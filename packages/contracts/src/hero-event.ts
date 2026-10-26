import type { Row } from "./rows";
export interface HeroEventSelection {
  activityId?: string;
  eventId?: string;
  panels?: boolean;
}
export interface HeroEventSnapshot {
  profile?: Row;
  activities: readonly Row[];
  events: readonly Row[];
  scores: readonly Row[];
  castleLevel: number;
  alliancePower: bigint;
  scoreManagerRunning: boolean;
  lastMergeMillis: bigint;
}
