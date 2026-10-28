import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class NezhaVariant4 extends Hero
{
    public readonly identity = HeroIdentity.NezhaVariant4;
    public readonly name = "Nezha";
    public readonly gender = HeroGender.Male;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: false,
        cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 1,
        talentPointDivisor: 1,
        breakthroughs: [
            { stage: 1, cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 0 } },
            { stage: 2, cost: { item: HeroItem.NezhaVariant3Fragment, quantity: 0 } },
            { stage: 3, cost: { item: HeroItem.NezhaVariant3Fragment, quantity: 0 } },
            { stage: 4, cost: { item: HeroItem.NezhaVariant3Fragment, quantity: 0 } },
            { stage: 5, cost: { item: HeroItem.NezhaVariant3Fragment, quantity: 0 } },
        ],
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 3,
        initialSkills: [HeroSkill.NezhaVariant4CraneSwordArray],
        upgrades: [
            {
                stars: 2,
                cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 3000 },
                skills: [HeroSkill.NezhaVariant4SlashTheWay],
            },
            {
                stars: 3,
                cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 6000 },
                skills: [HeroSkill.NezhaVariant4SoundsOfBlade],
            },
            {
                stars: 4,
                cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 10000 },
                skills: [HeroSkill.NezhaVariant4AuraOfBlade],
            },
            {
                stars: 5,
                cost: { item: HeroItem.NezhaVariant4Fragment, quantity: 20000 },
                skills: [HeroSkill.NezhaVariant4SwordOfInfinity],
            },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [];
    public readonly refinement = this.standardRefinement(HeroItem.NezhaVariant4Fragment, [
        {
            position: 1,
            refinementItemQuantity: 0,
            requiredLevel: 50,
            requiredStars: 6,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        {
            position: 2,
            refinementItemQuantity: 0,
            requiredLevel: 50,
            requiredStars: 6,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        {
            position: 3,
            refinementItemQuantity: 0,
            requiredLevel: 50,
            requiredStars: 6,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        {
            position: 4,
            refinementItemQuantity: 0,
            requiredStars: 6,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 100 },
        },
        { position: 5, refinementItemQuantity: 0 },
    ]);
}
