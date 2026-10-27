import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Mulan extends Hero {
  public readonly identity = HeroIdentity.Mulan;
  public readonly name = "Hua Mulan";
  public readonly gender = HeroGender.Female;
  public readonly recruitment: HeroDefinition["recruitment"] = {
    available: true,
    cost: { item: HeroItem.MulanFragment, quantity: 3000 },
    initialQuality: 1,
  };
  public readonly progression: HeroDefinition["progression"] = {
    initialLevel: 1,
    maximumLevel: 99,
    automatedGrantLevelLimit: 100,
    talentPointDivisor: 10,
    breakthroughs: [
      { stage: 1, cost: { item: HeroItem.MulanFragment, quantity: 0 } },
      { stage: 2, cost: { item: HeroItem.MulanFragment, quantity: 0 } },
      { stage: 3, cost: { item: HeroItem.MulanFragment, quantity: 0 } },
      { stage: 4, cost: { item: HeroItem.MulanFragment, quantity: 0 } },
      { stage: 5, cost: { item: HeroItem.MulanFragment, quantity: 0 } },
    ],
  };
  public readonly stars: HeroDefinition["stars"] = {
    initial: 1,
    maximum: 5,
    initialSkill: HeroSkill.MulanFormation,
    upgrades: [
      {
        stars: 2,
        cost: { item: HeroItem.MulanFragment, quantity: 6000 },
        skill: HeroSkill.InfantryBasicAttack,
      },
      {
        stars: 3,
        cost: { item: HeroItem.MulanFragment, quantity: 15000 },
        skill: HeroSkill.InfantryDamage,
      },
      {
        stars: 4,
        cost: { item: HeroItem.MulanFragment, quantity: 30000 },
        skill: HeroSkill.InfantryStrikingDistance,
      },
      {
        stars: 5,
        cost: { item: HeroItem.MulanFragment, quantity: 60000 },
        skill: HeroSkill.InfantryBasicPuncture,
      },
    ],
  };
  public readonly talentTrees = [
    HeroTalentTree.MulanVanguard,
    HeroTalentTree.MulanOffensive,
    HeroTalentTree.MulanSpear,
  ];
  public readonly assignments = {
    canLoot: true,
    minimumLootLevel: 5,
    canGarrison: true,
    canBattle: true,
    canUseLordExperience: true,
  };
  public readonly refinement: HeroDefinition["refinement"] = {
    valueRollCostPerAttribute: { item: HeroItem.MulanFragment, quantity: 20 },
    typeRollPrices: [
      { attributes: 1, gold: 1000 },
      { attributes: 2, gold: 1000 },
      { attributes: 3, gold: 1000 },
      { attributes: 4, gold: 1000 },
      { attributes: 5, gold: 1000 },
    ],
    lockedAttributePrices: [
      { lockedAttributes: 1, gold: 1000 },
      { lockedAttributes: 2, gold: 3000 },
      { lockedAttributes: 3, gold: 7000 },
      { lockedAttributes: 4, gold: 15000 },
    ],
    slots: [
      {
        position: 1,
        requiredLevel: 1,
        requiredStars: 1,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
        refinementItemQuantity: 1,
      },
      {
        position: 2,
        requiredLevel: 1,
        requiredStars: 2,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
        refinementItemQuantity: 1,
      },
      {
        position: 3,
        requiredLevel: 30,
        requiredStars: 3,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        refinementItemQuantity: 1,
      },
      {
        position: 4,
        requiredLevel: 1,
        requiredStars: 4,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        refinementItemQuantity: 0,
      },
      {
        position: 5,
        requiredLevel: 1,
        requiredStars: 5,
        unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        refinementItemQuantity: 0,
      },
    ],
  };
}
