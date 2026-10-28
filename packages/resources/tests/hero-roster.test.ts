import { expect, test } from "bun:test";
import { HeroIdentity } from "@opencok/enums/hero-identity";
import { HeroItem } from "@opencok/enums/hero-item";
import { heroRoster } from "@opencok/hero/domain/roster";
import { Bernard } from "@opencok/hero/domain/bernard";
import { HeroDefinitionMapper } from "@opencok/hero/mappings/hero-definition";
import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import { heroDefinitions, heroDefinitionByIdentity } from "../src/heroes/roster.ts";
import { catalog } from "../src/catalogs/data/general_base.ts";
import expected from "./fixtures/hero-roster.json";

const mapper = new HeroDefinitionMapper(heroCatalogBindings);

test("every reference hero has exactly one concrete named class and catalog entry", () => {
    expect(heroRoster).toHaveLength(expected.length);
    expect(expected).toHaveLength(109);
    expect(new Set(heroRoster.map((hero) => hero.identity)).size).toBe(expected.length);
    expect(new Set(heroRoster.map((hero) => hero.constructor)).size).toBe(expected.length);
    expect(Object.keys(heroCatalogBindings.heroes)).toHaveLength(expected.length);
    expect(Object.values(HeroIdentity).map(String)).toEqual(expected.map((hero) => hero.identity));
    expect(catalog.records).toEqual(heroDefinitions);

    for (const [index, reference] of expected.entries())
    {
        const hero = heroRoster[index]!;
        expect(String(hero.identity)).toBe(reference.identity);
        expect(hero.name).toBe(reference.name);
        expect(hero.constructor.name).not.toBe("Hero");
        expect(heroDefinitions[index]).toEqual(reference.definition);
        expect(Number(heroCatalogBindings.heroes[hero.identity].generalId)).toBe(
            reference.nativeId,
        );
    }
});

test("unknown heroes and repeated client names preserve distinct stable identities", () => {
    expect(
        heroRoster.filter((hero) => hero.name.startsWith("unknown-")).map((hero) => hero.identity),
    ).toEqual([HeroIdentity.Unknown1, HeroIdentity.Unknown2]);
    const variants = heroRoster.filter((hero) => hero.name === "Nezha");
    expect(variants).toHaveLength(5);
    expect(new Set(variants.map((hero) => hero.identity)).size).toBe(5);
    expect(new Set(variants.map((hero) => hero.stars.initialSkills[0])).size).toBe(5);
});

test("ordinary heroes author mechanics directly without losing dormant or absent settings", () => {
    const original = new Bernard();
    const changed = Object.assign(new Bernard(), {
        recruitment: {
            ...original.recruitment,
            cost: { ...original.recruitment.cost, quantity: 42 },
        },
        progression: { ...original.progression, talentPointDivisor: 2 },
        stars: {
            ...original.stars,
            upgrades: original.stars.upgrades.map((step) => ({
                ...step,
                cost: { ...step.cost, quantity: 123 },
            })),
        },
    });
    const result = mapper.toDefinition(changed);
    expect(result.needPieces).toEqual([211128, 42]);
    expect(result.talentPointDivisor).toBe(2);
    expect(result.starGoods.every((entry) => entry[1] === 123)).toBe(true);
    expect(result.baseSkill).toEqual([53900, 53901]);
    expect(result.baseStar).toBe(2);
    expect(result).not.toHaveProperty("baseSkill2");
    expect(heroDefinitionByIdentity[HeroIdentity.Yulia].unlockLevel).toBe(0);
    expect(heroDefinitionByIdentity[HeroIdentity.NezhaVariant3].unlockStar).toEqual([
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
    ]);
    const ironGuard = heroRoster.find((hero) => hero.identity === HeroIdentity.IronBloodedGuard)!;
    expect(ironGuard.recruitment.cost.item).toBe(HeroItem.IronBloodedGuardFragment);
    expect(ironGuard.refinement.valueRollCostPerAttribute.item).toBe(HeroItem.SaitoKichyoFragment);
});

test("newly authored star skills are not suppressed by an originally omitted catalog field", () => {
    const original = new Bernard();
    const hero = Object.assign(new Bernard(), {
        stars: {
            ...original.stars,
            upgrades: original.stars.upgrades.map((step) =>
                step.stars === 2 ? { ...step, skills: [original.stars.initialSkills[0]!] } : step
            ),
        },
    });
    expect(mapper.toDefinition(hero).baseSkill2).toBe(53900);
});
