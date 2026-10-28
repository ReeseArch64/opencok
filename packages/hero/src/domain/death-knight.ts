import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class DeathKnight extends Hero
{
    public readonly identity = HeroIdentity.DeathKnight;
    public readonly name = "Death Knight";
    public readonly gender = HeroGender.Female;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.DeathKnightFragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.DeathKnightFragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 3,
        initialSkills: [HeroSkill.DeathKnightThrust],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.DeathKnightFragment, quantity: 6000 }, skills: [] },
            {
                stars: 3,
                cost: { item: HeroItem.DeathKnightFragment, quantity: 15000 },
                skills: [HeroSkill.DeathKnightIronCavalry],
            },
            { stars: 4, cost: { item: HeroItem.DeathKnightFragment, quantity: 30000 }, skills: [] },
            { stars: 5, cost: { item: HeroItem.DeathKnightFragment, quantity: 60000 }, skills: [] },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.DeathKnightCombat];
    public readonly refinement = this.standardRefinement(HeroItem.DeathKnightFragment, [
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
