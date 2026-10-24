import type { Row } from "./rows.ts";

export type DonationRankingKind =
  | "all"
  | "today"
  | "week"
  | "resource-day"
  | "resource-week"
  | "resource-history";
export interface CommunityRankingSnapshot {
  profile: Row | undefined;
  rows: readonly Row[];
  ownItems?: number;
}
export interface DonationScore {
  uid: string;
  score: number;
}
