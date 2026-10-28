import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class Unknown1 extends Hero
{
    public readonly identity = HeroIdentity.Unknown1;
    public readonly name = "unknown-1";
    public readonly gender = HeroGender.Male;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.Unknown1Fragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.Unknown1Fragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 4,
        initialSkills: [HeroSkill.Unknown1InitialSkill1],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.Unknown1Fragment, quantity: 6000 }, skills: [] },
            { stars: 3, cost: { item: HeroItem.Unknown1Fragment, quantity: 15000 }, skills: [] },
            { stars: 4, cost: { item: HeroItem.Unknown1Fragment, quantity: 30000 }, skills: [] },
            { stars: 5, cost: { item: HeroItem.Unknown1Fragment, quantity: 60000 }, skills: [] },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [
        HeroTalentTree.Unknown1TalentTree1,
    ];
    public readonly refinement = this.standardRefinement(HeroItem.Unknown1Fragment, [
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
