import type { Row } from "./rows";

export interface ActivityRewardReader {
  alliance(id: string): Promise<{ member?: Row; alliance?: Row }>;
  owned(actId: string): Promise<{ entitlement: Row; announcement?: Row } | undefined>;
}

export interface ActivityRewardWrite {
  kingdomId: number;
  actId: string;
  member?: { allianceId: string; point: number; accPoint: number };
  alliance?: { id: string; points: bigint };
}
