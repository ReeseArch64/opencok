import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class MoTianxuan extends Hero {
  public readonly identity = HeroIdentity.MoTianxuan;
  public readonly name = "Mo Tianxuan";
  public readonly gender = HeroGender.Male;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.MoTianxuanFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.MoTianxuanFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 5,
    initialSkills: [HeroSkill.MoTianxuanLiteraryTactic],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.MoTianxuanFragment, quantity: 300 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.MoTianxuanFragment, quantity: 600 },
        skills: [HeroSkill.MoTianxuanTurnInkIntoSoldiersII],
      },
      {
        stars: 4,
        cost: { item: HeroItem.MoTianxuanFragment, quantity: 1500 },
        skills: [HeroSkill.MoTianxuanJadePen],
      },
      {
        stars: 5,
        cost: { item: HeroItem.MoTianxuanFragment, quantity: 3000 },
        skills: [HeroSkill.MoTianxuanBrushOfGod],
      },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.MoTianxuanCombat];
  public readonly refinement = this.standardRefinement(HeroItem.MoTianxuanFragment, [
    {
      position: 1,
      refinementItemQuantity: 1,
      requiredLevel: 1,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 2,
      refinementItemQuantity: 1,
      requiredLevel: 1,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 3,
      refinementItemQuantity: 1,
      requiredLevel: 30,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
    },
    {
      position: 4,
      refinementItemQuantity: 0,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
    },
    { position: 5, refinementItemQuantity: 0 },
  ]);
}
