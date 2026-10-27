import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class JoanOfArc extends Hero {
  public readonly identity = HeroIdentity.JoanOfArc;
  public readonly name = "Joan of Arc";
  public readonly gender = HeroGender.Female;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.JoanOfArcFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.JoanOfArcFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 5,
    initialSkills: [HeroSkill.JoanOfArcTemporaryTreatment],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.JoanOfArcFragment, quantity: 6000 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.JoanOfArcFragment, quantity: 15000 },
        skills: [HeroSkill.JoanOfArcTemporaryTreatment2],
      },
      {
        stars: 4,
        cost: { item: HeroItem.JoanOfArcFragment, quantity: 30000 },
        skills: [HeroSkill.JoanOfArcHerbologyI],
      },
      {
        stars: 5,
        cost: { item: HeroItem.JoanOfArcFragment, quantity: 60000 },
        skills: [HeroSkill.JoanOfArcTemporaryTreatment3],
      },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.JoanOfArcCombat];
  public readonly refinement = this.standardRefinement(HeroItem.JoanOfArcFragment, [
    {
      position: 1,
      refinementItemQuantity: 0,
      requiredLevel: 1,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 2,
      refinementItemQuantity: 0,
      requiredLevel: 1,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 3,
      refinementItemQuantity: 0,
      requiredLevel: 30,
      requiredStars: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
    },
    {
      position: 4,
      refinementItemQuantity: 0,
      requiredStars: 3,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
    },
    { position: 5, refinementItemQuantity: 0 },
  ]);
}
