import type { Row } from "./rows.ts";
import type { GeneralPreview } from "./profile.ts";

export interface ReconnectBaseState {
  profile: Row | undefined;
  armies: readonly Row[];
  generals: readonly Row[];
  skills: readonly Row[];
}

export interface OwnGeneralSnapshot extends Omit<GeneralPreview, "plusSkillPoint"> {
  abilityIndex: number;
}
