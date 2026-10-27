import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Yulia extends Hero {
  public readonly identity = HeroIdentity.Yulia;
  public readonly name = "Yulia";
  public readonly gender = HeroGender.Female;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.YuliaFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.YuliaFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 4,
    initialSkills: [HeroSkill.YuliaKeepGoing],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.YuliaFragment, quantity: 3000 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.YuliaFragment, quantity: 6000 },
        skills: [HeroSkill.YuliaEconomize],
      },
      {
        stars: 4,
        cost: { item: HeroItem.YuliaFragment, quantity: 18000 },
        skills: [HeroSkill.YuliaAlchemy],
      },
      { stars: 5, cost: { item: HeroItem.YuliaFragment, quantity: 36000 }, skills: [] },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.YuliaCombat];
  public readonly refinement = this.standardRefinement(HeroItem.YuliaFragment, [
    { position: 1, refinementItemQuantity: 0 },
    { position: 2, refinementItemQuantity: 0 },
    { position: 3, refinementItemQuantity: 0 },
    { position: 4, refinementItemQuantity: 0 },
    { position: 5, refinementItemQuantity: 0 },
  ]);
}
