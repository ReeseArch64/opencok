import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class WarsongMaster extends Hero {
  public readonly identity = HeroIdentity.WarsongMaster;
  public readonly name = "Warsong Master";
  public readonly gender = HeroGender.Male;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.WarsongMasterFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 100,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 1,
    breakthroughs: this.freeBreakthroughs(HeroItem.WarsongMasterFragment, 5),
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 3,
    initialSkills: [HeroSkill.WarsongMasterBoulder],
    upgrades: [
      { stars: 2, cost: { item: HeroItem.WarsongMasterFragment, quantity: 6000 }, skills: [] },
      {
        stars: 3,
        cost: { item: HeroItem.WarsongMasterFragment, quantity: 15000 },
        skills: [HeroSkill.WarsongMasterBravery],
      },
      { stars: 4, cost: { item: HeroItem.WarsongMasterFragment, quantity: 30000 }, skills: [] },
      { stars: 5, cost: { item: HeroItem.WarsongMasterFragment, quantity: 60000 }, skills: [] },
    ],
  };
  public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.WarsongMasterCombat];
  public readonly refinement = this.standardRefinement(HeroItem.WarsongMasterFragment, [
    {
      position: 1,
      refinementItemQuantity: 1,
      requiredLevel: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 2,
      refinementItemQuantity: 1,
      requiredLevel: 1,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
    },
    {
      position: 3,
      refinementItemQuantity: 1,
      requiredLevel: 30,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
    },
    {
      position: 4,
      refinementItemQuantity: 0,
      unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
    },
    { position: 5, refinementItemQuantity: 0 },
  ]);
}
