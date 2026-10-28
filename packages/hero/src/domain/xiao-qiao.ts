import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroGender } from "@opencok/enums/hero-gender";
import { HeroItem } from "@opencok/enums/hero-item";
import { HeroSkill } from "@opencok/enums/hero-skill";
import { HeroTalentTree } from "@opencok/enums/hero-talent-tree";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { Hero } from "./hero.ts";

export class XiaoQiao extends Hero
{
    public readonly identity = HeroIdentity.XiaoQiao;
    public readonly name = "Xiao Qiao";
    public readonly gender = HeroGender.Female;
    public readonly recruitment: HeroDefinition["recruitment"] = {
        available: true,
        cost: { item: HeroItem.XiaoQiaoFragment, quantity: 3000 },
        initialQuality: 1,
    };
    public readonly progression: HeroDefinition["progression"] = {
        initialLevel: 1,
        maximumLevel: 100,
        automatedGrantLevelLimit: 100,
        talentPointDivisor: 1,
        breakthroughs: this.freeBreakthroughs(HeroItem.XiaoQiaoFragment, 5),
    };
    public readonly stars: HeroDefinition["stars"] = {
        initial: 1,
        maximum: 5,
        initialSkills: [HeroSkill.XiaoQiaoTrainingCapacityI],
        upgrades: [
            { stars: 2, cost: { item: HeroItem.XiaoQiaoFragment, quantity: 6000 }, skills: [] },
            {
                stars: 3,
                cost: { item: HeroItem.XiaoQiaoFragment, quantity: 15000 },
                skills: [HeroSkill.XiaoQiaoMedicalFacilitiesI],
            },
            {
                stars: 4,
                cost: { item: HeroItem.XiaoQiaoFragment, quantity: 30000 },
                skills: [HeroSkill.XiaoQiaoTrainSoldiersI],
            },
            {
                stars: 5,
                cost: { item: HeroItem.XiaoQiaoFragment, quantity: 60000 },
                skills: [HeroSkill.XiaoQiaoRecruitmentMobilization],
            },
        ],
    };
    public readonly talentTrees: HeroDefinition["talentTrees"] = [HeroTalentTree.XiaoQiaoCombat];
    public readonly refinement = this.standardRefinement(HeroItem.XiaoQiaoFragment, [
        {
            position: 1,
            refinementItemQuantity: 0,
            requiredLevel: 1,
            requiredStars: 1,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
        },
        {
            position: 2,
            refinementItemQuantity: 0,
            requiredLevel: 1,
            requiredStars: 1,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 0 },
        },
        {
            position: 3,
            refinementItemQuantity: 0,
            requiredLevel: 30,
            requiredStars: 1,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        },
        {
            position: 4,
            refinementItemQuantity: 0,
            requiredStars: 3,
            unlockCost: { item: HeroItem.HeroBadge, quantity: 1 },
        },
        { position: 5, refinementItemQuantity: 0 },
    ]);
}
