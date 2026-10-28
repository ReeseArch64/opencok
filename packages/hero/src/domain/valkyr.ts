import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Valkyr extends Hero
{
    public readonly identity = HeroIdentity.Valkyr;
    public readonly name = "Valkyr";
    public readonly gender = HeroGender.Female;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.ValkyrFragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.ValkyrFragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 1,
        initialSkills: [HeroSkill.ValkyrTemporaryTreatment],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.ValkyrFragment, quantity: 6000 }, skills: [] },
            {
                stars: 3,
                cost: { item: HeroItem.ValkyrFragment, quantity: 15000 },
                skills: [HeroSkill.ValkyrPhysicalFitness],
            },
            { stars: 4, cost: { item: HeroItem.ValkyrFragment, quantity: 30000 }, skills: [] },
            { stars: 5, cost: { item: HeroItem.ValkyrFragment, quantity: 60000 }, skills: [] },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [
        HeroTalentTree.ValkyrCombat,
        HeroTalentTree.ValkyrDevelopment,
        HeroTalentTree.ValkyrSupport,
    ];
    public readonly refinement = this.standardRefinement(HeroItem.ValkyrFragment, [
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
        { position: 3, refinementItemQuantity: 0, requiredStars: 1 },
        { position: 4, refinementItemQuantity: 0 },
        { position: 5, refinementItemQuantity: 0 },
    ]);
}
