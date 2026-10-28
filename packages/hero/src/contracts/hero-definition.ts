import type { HeroIdentity } from "@opencok/enums/hero-identity";
import type { HeroGender } from "@opencok/enums/hero-gender";
import type { HeroItem } from "@opencok/enums/hero-item";
import type { HeroSkill } from "@opencok/enums/hero-skill";
import type { HeroTalentTree } from "@opencok/enums/hero-talent-tree";

export interface HeroItemCost
{
    readonly item: HeroItem;
    readonly quantity: number;
}

export interface HeroDefinition
{
    readonly identity: HeroIdentity;
    readonly name: string;
    readonly gender: HeroGender;
    readonly recruitment: {
        readonly available: boolean;
        readonly cost: HeroItemCost;
        readonly initialQuality: number;
    };
    readonly progression: {
        readonly initialLevel: number;
        readonly maximumLevel: number;
        readonly automatedGrantLevelLimit: number;
        readonly talentPointDivisor: number;
        readonly breakthroughs: readonly { readonly stage: number; readonly cost: HeroItemCost; }[];
    };
    readonly stars: {
        readonly initial: number;
        readonly maximum: number;
        readonly initialSkills: readonly HeroSkill[];
        readonly upgrades: readonly {
            readonly stars: number;
            readonly cost: HeroItemCost;
            readonly skills: readonly HeroSkill[];
        }[];
    };
    readonly talentTrees: readonly HeroTalentTree[];
    readonly assignments: {
        readonly canLoot: boolean;
        readonly minimumLootLevel: number;
        readonly canGarrison: boolean;
        readonly canBattle: boolean;
        readonly canUseLordExperience: boolean;
    };
    readonly refinement: {
        readonly valueRollCostPerAttribute: HeroItemCost;
        readonly unlockItem: HeroItem;
        readonly typeRollPrices: readonly { readonly attributes: number; readonly gold: number; }[];
        readonly lockedAttributePrices: readonly {
            readonly lockedAttributes: number;
            readonly gold: number;
        }[];
        readonly slots: readonly {
            readonly position: number;
            readonly requiredLevel?: number;
            readonly requiredStars?: number;
            readonly unlockCost?: HeroItemCost;
            readonly refinementItemQuantity: number;
        }[];
    };
}
