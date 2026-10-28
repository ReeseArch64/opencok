import { expect, test } from "bun:test";
import { DragonIdentity } from "@opencok/enums/dragon-identity";
import { DragonItem } from "@opencok/enums/dragon-item";
import { DragonCivilization } from "@opencok/enums/dragon-civilization";
import { dragonCatalogBindings } from "@opencok/constants/dragon-catalog-bindings";
import { dragonRoster } from "@opencok/dragon/domain/roster";
import { BlackDragon } from "@opencok/dragon/domain/black-dragon";
import { Scartha } from "@opencok/dragon/domain/scartha";
import { Vildrin } from "@opencok/dragon/domain/vildrin";
import { DragonDefinitionMapper } from "@opencok/dragon/mappings/dragon-definition";
import { dragonDefinitions, dragonDefinitionByIdentity } from "../src/dragons/roster.ts";
import { catalog } from "../src/catalogs/data/dragon_base.ts";
import { namedDragonDefinition, namedDragonRecord } from "../scripts/named-dragon-records.ts";
import expected from "./fixtures/dragon-roster.json";

const mapper = new DragonDefinitionMapper(dragonCatalogBindings);

test("the complete client roster has concrete dragon classes and preserves every server definition", () => {
    expect(dragonRoster).toHaveLength(14);
    expect(new Set(dragonRoster.map((dragon) => dragon.constructor)).size).toBe(14);
    expect(new Set(dragonRoster.map((dragon) => dragon.identity)).size).toBe(14);
    expect(dragonRoster.map((dragon) => dragon.identity)).toEqual(Object.values(DragonIdentity));
    expect(dragonDefinitions).toEqual(expected);
    expect(catalog.records).toEqual(expected);

    for (const dragon of dragonRoster)
    {
        dragon.validate();

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

test("client-only Vildrin is named without inventing playable server configuration", () => {
    const dragon = new Vildrin();
    expect(dragon.name).toBe("Vildrin, Sylvan Tutor");
    expect(dragon.server).toBeUndefined();
    expect(dragon.skillSlots).toHaveLength(10);
    expect(dragon.skillSlots.at(-1)?.maximumQualityRank).toBeUndefined();
    expect(dragonDefinitionByIdentity.has(DragonIdentity.Vildrin)).toBe(false);
    expect(() => mapper.toDefinition(dragon)).toThrow("no server configuration");
    expect(() => namedDragonRecord("dragon_base", { id: 109013 })).toThrow(
        "named server configuration",
    );
    expect(() => namedDragonRecord("dragon_base", { id: 999999 })).toThrow(
        "named server configuration",
    );
    expect(namedDragonRecord("dragon_skill", { id: 109000 })).toBeUndefined();
});

test("readable dragon mechanics drive projection without hidden balance literals", () => {
    const original = new Scartha();
    const changed = Object.assign(new Scartha(), {
        hatchingSeconds: 120,
        renameGoldCost: 75,
        sustainedFeeding: { bonusMultiplier: 3, bonusEveryFeedings: 4 },
        gifts: [DragonItem.GoldenBracelet, DragonItem.StainedGlass],
        reputation: { civilization: DragonCivilization.Yamato, minimumLevel: 4 },
        skillSlots: original.skillSlots.map((slot) => ({
            ...slot,
            unlockLevel: 12,
            maximumQualityRank: 4,
        })),
        interactions: original.interactions.map((interaction) => ({
            ...interaction,
            cooldownSeconds: 60,
            minimumFriendship: 10,
        })),
    });
    const projected = mapper.toDefinition(changed);
    expect(projected.hatchTime).toBe(120);
    expect(projected.nicknameCost).toBe(75);
    expect(projected.holdCrit).toEqual([3, 4]);
    expect(projected.gift).toEqual([210377, 210374]);
    expect(projected.reputationCondition).toEqual([3, 4]);
    expect(projected.skillUnlockLv).toEqual(Array(8).fill(12));
    expect(projected.skillSlotQuality).toEqual(Array(8).fill(4));
    expect(projected.communicateTime).toEqual([60, 60, 60, 60]);
    expect(projected.communicateCond).toEqual([10, 10, 10, 10]);
    expect(original.hatchingSeconds).toBe(3600);
});

test("invalid interaction ordering, quality and feeding configuration fail before projection", () => {
    const original = new BlackDragon();
    const mutations = [
        { interactions: [...original.interactions].reverse() },
        { sustainedFeeding: { bonusMultiplier: 2, bonusEveryFeedings: 0 } },
        {
            skillSlots: original.skillSlots.map((slot) => ({
                ...slot,
                maximumQualityRank: undefined,
            })),
        },
        { renameGoldCost: -1 },
    ];

    for (const mutation of mutations)
    {
        expect(() => mapper.toDefinition(Object.assign(new BlackDragon(), mutation))).toThrow(
            "Invalid dragon definition",
        );
    }
});
