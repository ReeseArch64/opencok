import type { Row } from "./rows.ts";

export interface PublicProfileState {
  profile: Row | undefined;
  statistics: Row | undefined;
  vip: Row | undefined;
  lord: Row | undefined;
  mixed: Row | undefined;
  military: Row | undefined;
  office: Row | undefined;
  taverns: readonly Row[];
  generals: readonly Row[];
  equipment: readonly Row[];
  honors: readonly Row[];
  completedAchievements: number;
}
