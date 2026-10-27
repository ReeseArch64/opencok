import type { HeroIdentity } from "@opencok/enums/hero-identity";
import type { HeroGender } from "@opencok/enums/hero-gender";
import type { HeroItem } from "@opencok/enums/hero-item";
import type { HeroSkill } from "@opencok/enums/hero-skill";
import type { HeroTalentTree } from "@opencok/enums/hero-talent-tree";

export interface HeroCatalogBindings {
  readonly heroes: Readonly<
    Record<
      HeroIdentity,
      {
        readonly generalId: number;
        readonly nameTextId: number;
        readonly talentGroupId: number;
        readonly experienceColumnSet: number;
      }
    >
  >;
  readonly genders: Readonly<Record<HeroGender, number>>;
  readonly items: Readonly<Record<HeroItem, number>>;
  readonly skills: Readonly<Record<HeroSkill, number>>;
  readonly talentTrees: Readonly<Record<HeroTalentTree, number>>;
}
