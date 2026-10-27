import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class DateMasamune extends Hero {
  public readonly identity = HeroIdentity.DateMasamune;
  public readonly name = "Date Masamune";
  public readonly gender = HeroGender.Male;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.DateMasamuneFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.DateMasamuneFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 5,
    initialSkills: [HeroSkill.DateMasamuneTrainingCapacityI],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.DateMasamuneFragment, quantity: 6000 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.DateMasamuneFragment, quantity: 15000 },
        skills: [HeroSkill.DateMasamuneMedicalFacilitiesI],
      },
      {
        stars: 4,
        cost: { item: HeroItem.DateMasamuneFragment, quantity: 30000 },
        skills: [HeroSkill.DateMasamuneTrainSoldiersI],
      },
      {
        stars: 5,
        cost: { item: HeroItem.DateMasamuneFragment, quantity: 60000 },
        skills: [HeroSkill.DateMasamuneRecruitmentMobilization],
      },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.DateMasamuneCombat];
  public readonly refinement = this.standardRefinement(HeroItem.DateMasamuneFragment, [
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
