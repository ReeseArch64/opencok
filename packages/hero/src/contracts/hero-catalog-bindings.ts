import type { HeroCatalogValueShape } from "@opencok/enums/hero-catalog-value-shape";
import type { HeroIdentity } from "@opencok/enums/hero-identity";
import type { HeroGender } from "@opencok/enums/hero-gender";
import type { HeroItem } from "@opencok/enums/hero-item";
import type { HeroSkill } from "@opencok/enums/hero-skill";
import type { HeroTalentTree } from "@opencok/enums/hero-talent-tree";

export interface HeroCatalogBindings
{
    readonly heroes: Readonly<
        Record<
            HeroIdentity,
            {
                readonly generalId: number;
                readonly nameTextId: number;
                readonly talentGroupId: number;
                readonly experienceColumnSet: number;
                readonly fragmentSaleId?: number;
                readonly publishTalentPointDivisor: boolean;
                readonly shape: Readonly<
                    Record<
                        | "baseSkill"
                        | "baseSkill2"
                        | "baseSkill3"
                        | "baseSkill4"
                        | "baseSkill5"
                        | "generalAb"
                        | "unlockLevel"
                        | "unlockStar"
                        | "unlockGoodsNum",
                        HeroCatalogValueShape
                    >
                >;
            }
        >
    >;
    readonly genders: Readonly<Record<HeroGender, number>>;
    readonly items: Readonly<Record<HeroItem, number>>;
    readonly skills: Readonly<Record<HeroSkill, number>>;
    readonly talentTrees: Readonly<Record<HeroTalentTree, number>>;
}
