import type { Row } from "./rows";
export interface ExpeditionPhase {
  stage: number;
  startTime: bigint;
  endTime: bigint;
}
export interface ExpeditionManifest {
  serverId: number;
  periodId: string;
  matchServerId: number;
  startTime: bigint;
  stages: readonly { stage: number; durationMs: bigint }[];
}
export interface ExpeditionState {
  clock?: Row;
  lastMergeMillis?: bigint;
  projectionOnly?: boolean;
  period?: Row;
  phase?: ExpeditionPhase;
  progress: readonly Row[];
  allianceScore: number;
  kingdomScore: number;
  rank: number;
  records?: readonly Row[];
  taxRecords?: readonly Row[];
  distributions?: readonly Row[];
}
