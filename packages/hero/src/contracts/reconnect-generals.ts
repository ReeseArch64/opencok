import type { GeneralPreview } from "@opencok/hero/contracts/profile-generals";

export interface OwnGeneralSnapshot extends Omit<GeneralPreview, "plusSkillPoint"> {
  abilityIndex: number;
}
