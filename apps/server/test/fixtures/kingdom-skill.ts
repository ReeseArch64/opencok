import type { Rule } from "@opencok/rules/game";

export function kingdomSkill(patch: Rule = {}): Rule {
  return {
    id: "synthetic",
    skillCategory: "1",
    effectType: "0",
    cd: "0",
    effectTime: "0",
    releaseTimes: "0",
    useType: "0",
    costMaterial: "0",
    sucRatio: "1",
    showTab: "3",
    tabIndex: "0",
    value: "0",
    ...patch,
  };
}
