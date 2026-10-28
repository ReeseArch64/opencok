import { HeroItem } from "@opencok/enums/hero-item";
import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { validateHeroDefinition } from "../validations/hero-definition.ts";

export abstract class Hero implements HeroDefinition
{
    public abstract readonly identity: HeroDefinition["identity"];
    public abstract readonly name: string;
    public abstract readonly gender: HeroDefinition["gender"];
    public abstract readonly recruitment: HeroDefinition["recruitment"];
    public abstract readonly progression: HeroDefinition["progression"];
    public abstract readonly stars: HeroDefinition["stars"];
    public abstract readonly talentTrees: HeroDefinition["talentTrees"];
    public readonly assignments: HeroDefinition["assignments"] = {
        canLoot: true,
        minimumLootLevel: 5,
        canGarrison: true,
        canBattle: true,
        canUseLordExperience: true,
    };
    public abstract readonly refinement: HeroDefinition["refinement"];

    public validate(): void
    {
        validateHeroDefinition(this);
    }

    protected freeBreakthroughs(
        item: HeroItem,
        stages: number,
    ): HeroDefinition["progression"]["breakthroughs"]
    {
        return Array.from({ length: stages }, (_, index) => ({
            stage: index + 1,
            cost: { item, quantity: 0 },
        }));
    }

    protected standardRefinement(
        fragment: HeroItem,
        slots: HeroDefinition["refinement"]["slots"],
    ): HeroDefinition["refinement"]
    {
        return {
            valueRollCostPerAttribute: { item: fragment, quantity: 20 },
            unlockItem: HeroItem.HeroBadge,
            typeRollPrices: [
                { attributes: 1, gold: 1000 },
                { attributes: 2, gold: 1000 },
                { attributes: 3, gold: 1000 },
                { attributes: 4, gold: 1000 },
                { attributes: 5, gold: 1000 },
            ],
            lockedAttributePrices: [
                { lockedAttributes: 1, gold: 1000 },
                { lockedAttributes: 2, gold: 3000 },
                { lockedAttributes: 3, gold: 7000 },
                { lockedAttributes: 4, gold: 15000 },
            ],
            slots,
        };
    }
}
