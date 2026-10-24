import type { Row } from "./rows.ts";

export interface RoutedPublicProfile {
  state: PublicProfileState;
  kingdomId: number;
}

export interface PublicProfileState {
  profile: Row | undefined;
  statistics: Row | undefined;
  vip: Row | undefined;
  lord: Row | undefined;
  mixed: Row | undefined;
  military: Row | undefined;
  office: Row | undefined;
  flowers: Row | undefined;
  alliance: PublicAllianceState | undefined;
  taverns: readonly Row[];
  generals: readonly Row[];
  skills: readonly Row[];
  equipment: readonly Row[];
  honors: readonly Row[];
  completedAchievements: number;
}

export interface PublicAllianceState {
  alliance: Row;
  leader: Row;
  totals: Row;
  sciences: readonly Row[];
  video: Row | undefined;
  withEffects: boolean;
}

export type GeneralAbility = Readonly<Record<string, string | number | null>>;

export interface GeneralPreview {
  uuid: string;
  generalId: string;
  level: number;
  status: number;
  attack: number;
  defence: number;
  plusSkillPoint: number;
  ability: readonly GeneralAbility[];
  skills: readonly Row[];
}
