import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class TheQueenOfWar extends Hero
{
    public readonly identity = HeroIdentity.TheQueenOfWar;
    public readonly name = "The Queen of War";
    public readonly gender = HeroGender.Female;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.TheQueenOfWarFragment, quantity: 6000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.TheQueenOfWarFragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 2,
        maximum: 4,
        initialSkills: [HeroSkill.TheQueenOfWarSwiftAndFierce, HeroSkill.TheQueenOfWarHeavyShell],
        upgrades: [
            {
                stars: 2,
                cost: { item: HeroItem.TheQueenOfWarFragment, quantity: 6000 },
                skills: [],
            },
            {
                stars: 3,
                cost: { item: HeroItem.TheQueenOfWarFragment, quantity: 15000 },
                skills: [HeroSkill.TheQueenOfWarHeavyArmor],
            },
            {
                stars: 4,
                cost: { item: HeroItem.TheQueenOfWarFragment, quantity: 30000 },
                skills: [HeroSkill.TheQueenOfWarAmbush],
            },
            {
                stars: 5,
                cost: { item: HeroItem.TheQueenOfWarFragment, quantity: 60000 },
                skills: [],
            },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [
        HeroTalentTree.TheQueenOfWarCombat,
        HeroTalentTree.TheQueenOfWarDevelopment,
        HeroTalentTree.TheQueenOfWarSupport,
    ];
    public readonly refinement = this.standardRefinement(HeroItem.TheQueenOfWarFragment, [
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
            requiredStars: 3,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        {
            position: 5,
            refinementItemQuantity: 1,
            requiredLevel: 1,
            requiredStars: 1,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
    ]);
}
