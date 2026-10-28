import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Rufus extends Hero
{
    public readonly identity = HeroIdentity.Rufus;
    public readonly name = "Rufus";
    public readonly gender = HeroGender.Male;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.RufusFragment, quantity: 6000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.RufusFragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 2,
        maximum: 2,
        initialSkills: [HeroSkill.RufusResourcesGatheringI, HeroSkill.RufusBusinessMethods],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.RufusFragment, quantity: 6000 }, skills: [] },
            {
                stars: 3,
                cost: { item: HeroItem.RufusFragment, quantity: 15000 },
                skills: [HeroSkill.RufusGoldPanning],
            },
            { stars: 4, cost: { item: HeroItem.RufusFragment, quantity: 30000 }, skills: [] },
            { stars: 5, cost: { item: HeroItem.RufusFragment, quantity: 60000 }, skills: [] },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [
        HeroTalentTree.RufusCombat,
        HeroTalentTree.RufusDevelopment,
        HeroTalentTree.RufusSupport,
    ];
    public readonly refinement = this.standardRefinement(HeroItem.RufusFragment, [
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
            unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        },
        { position: 5, refinementItemQuantity: 0 },
    ]);
}
