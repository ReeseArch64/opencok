import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";

export const heroCatalogBindings = {
  heroes: {
    [HeroIdentity.Mulan]: {
      generalId: 53571,
      nameTextId: 169493,
      talentGroupId: 72,
      experienceColumnSet: 0,
    },
  },
  genders: { [HeroGender.Female]: 2, [HeroGender.Male]: 1 },
  items: { [HeroItem.MulanFragment]: 213293, [HeroItem.HeroBadge]: 211453 },
  skills: {
    [HeroSkill.MulanFormation]: 54228,
    [HeroSkill.InfantryBasicAttack]: 54229,
    [HeroSkill.InfantryDamage]: 54230,
    [HeroSkill.InfantryStrikingDistance]: 54231,
    [HeroSkill.InfantryBasicPuncture]: 54232,
  },
  talentTrees: {
    [HeroTalentTree.MulanVanguard]: 41020011,
    [HeroTalentTree.MulanOffensive]: 53571201,
    [HeroTalentTree.MulanSpear]: 53571202,
  },
} as const;
