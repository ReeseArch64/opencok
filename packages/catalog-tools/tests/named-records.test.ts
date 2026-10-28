import { expect, test } from "bun:test";
import { heroRoster } from "@opencok/hero/domain/roster";
import { dragonRoster } from "@opencok/dragon/domain/roster";
import { dragonCatalogBindings } from "@opencok/constants/dragon-catalog-bindings";
import { DragonDefinitionMapper } from "@opencok/dragon/mappings/dragon-definition";
import expected from "../../resources/tests/fixtures/hero-roster.json";
import { namedHeroRecord, namedHeroDefinition } from "../src/mappings/named-hero-records";
import { namedDragonRecord, namedDragonDefinition } from "../src/mappings/named-dragon-records";

test("imports preserve all maintained named Hero and Dragon definitions", () => {
    for (const [index, reference] of expected.entries())
    {
        const hero = heroRoster[index]!;
        expect(namedHeroDefinition({ id: reference.nativeId })).toEqual(reference.definition);
        expect(namedHeroRecord("general_base", { id: reference.nativeId })?.expression).toContain(
            `HeroIdentity.${hero.constructor.name}`,
        );
    }
    const mapper = new DragonDefinitionMapper(dragonCatalogBindings);
    for (const dragon of dragonRoster)
    {
        if (!dragon.server)
        {
            continue;
        }
        const nativeId = dragonCatalogBindings.dragons[dragon.identity];
        expect(namedDragonDefinition({ id: nativeId })).toEqual(mapper.toDefinition(dragon));
        expect(namedDragonRecord("dragon_base", { id: nativeId })?.expression).toContain(
            `DragonIdentity.${dragon.constructor.name}`,
        );
    }
});

test("catalog imports retain named hero authorship and reject unmodeled heroes", () => {
    expect(namedHeroRecord("general_base", { id: 53571, levelMax: 48 })?.expression).toBe(
        "heroDefinitionByIdentity[HeroIdentity.Mulan]",
    );
    expect(namedHeroRecord("general_base", { id: 53572 })?.expression).toBe(
        "heroDefinitionByIdentity[HeroIdentity.Unknown1]",
    );
    expect(() => namedHeroRecord("general_base", { id: 999999 })).toThrow(
        "requires a named definition",
    );
    expect(namedHeroRecord("general_skill", { id: 53571 })).toBeUndefined();
});

test("imports reject client-only and unmodeled Dragons", () => {
    expect(() => namedDragonRecord("dragon_base", { id: 109013 })).toThrow(
        "named server configuration",
    );
    expect(() => namedDragonRecord("dragon_base", { id: 999999 })).toThrow(
        "named server configuration",
    );
    expect(namedDragonRecord("dragon_skill", { id: 109000 })).toBeUndefined();
});
