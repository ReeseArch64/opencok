import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Judith extends Hero {
  public readonly identity = HeroIdentity.Judith;
  public readonly name = "Judith";
  public readonly gender = HeroGender.Female;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.JudithFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.JudithFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 3,
    initialSkills: [HeroSkill.JudithInTheNameOfLove],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.JudithFragment, quantity: 6000 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.JudithFragment, quantity: 15000 },
        skills: [HeroSkill.JudithRoseOfThorns],
      },
      { stars: 4, cost: { item: HeroItem.JudithFragment, quantity: 30000 }, skills: [] },
      { stars: 5, cost: { item: HeroItem.JudithFragment, quantity: 60000 }, skills: [] },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.JudithCombat];
  public readonly refinement = this.standardRefinement(HeroItem.JudithFragment, [
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
      refinementItemQuantity: 1,
      requiredLevel: 1,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
    },
    { position: 5, refinementItemQuantity: 0 },
  ]);
}
