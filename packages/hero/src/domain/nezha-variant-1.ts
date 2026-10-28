import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class NezhaVariant1 extends Hero
{
    public readonly identity = HeroIdentity.NezhaVariant1;
    public readonly name = "Nezha";
    public readonly gender = HeroGender.Male;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.NezhaVariant1Fragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.NezhaVariant1Fragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 5,
        initialSkills: [HeroSkill.NezhaVariant1ThreeHeadsAndSixArms],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.NezhaVariant1Fragment, quantity: 300 }, skills: [] },
            {
                stars: 3,
                cost: { item: HeroItem.NezhaVariant1Fragment, quantity: 450 },
                skills: [HeroSkill.NezhaVariant1DivineBlessing],
            },
            {
                stars: 4,
                cost: { item: HeroItem.NezhaVariant1Fragment, quantity: 1500 },
                skills: [HeroSkill.NezhaVariant1FirePike],
            },
            {
                stars: 5,
                cost: { item: HeroItem.NezhaVariant1Fragment, quantity: 3000 },
                skills: [HeroSkill.NezhaVariant1DivineBlessing2],
            },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [
        HeroTalentTree.NezhaVariant1Combat,
    ];
    public readonly refinement = this.standardRefinement(HeroItem.NezhaVariant1Fragment, [
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
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        { position: 5, refinementItemQuantity: 0 },
    ]);
}
