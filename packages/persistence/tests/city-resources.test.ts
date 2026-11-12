import { expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { City, CharacterResources, Character, WorldObject } from "../src/models";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { createCityRepositories } from "../src/factories/city-repositories";
import { createCharacterResourcesRepositories } from "../src/factories/character-resources-repositories";
import { cityCreateValidator } from "../src/validators/city";
import {
    characterResourcesCreateValidator,
    characterResourcesUpdateValidator,
} from "../src/validators/character-resources";
import { WorldObjectType } from "../src/enums/world-object-type";

class MetadataSource extends DataSource
{
    async prepare()
    {
        await this.buildMetadatas();
    }
}

test("cities enforce one owner, one castle and a castle-only composite reference", async () => {
    const source = new MetadataSource(createPostgresDataSource("kingdom_1").options);
    await source.prepare();
    const city = source.getMetadata(City);
    expect(
        city.indices.filter(index => index.isUnique).map(index =>
            index.columns.map(column => column.propertyName)
        ),
    )
        .toEqual([["id", "characterId"], ["worldObjectId"], ["characterId"]]);
    expect(
        city.foreignKeys.find(key => key.name === "city_character")?.referencedEntityMetadata
            .target,
    ).toBe(Character);
    const castle = city.foreignKeys.find(key => key.name === "city_castle")!;
    expect(castle.referencedEntityMetadata.target).toBe(WorldObject);
    expect(castle.columns.map(column => column.propertyName)).toEqual([
        "worldObjectId",
        "castleObjectType",
    ]);
    expect(castle.referencedColumns.map(column => column.propertyName)).toEqual([
        "id",
        "objectType",
    ]);
    expect(city.findColumnWithPropertyName("castleObjectType")?.default).toBe(
        WorldObjectType.Castle,
    );
    expect(city.checks.find(check => check.name === "city_castle_type")?.expression).toBe(
        "\"castle_object_type\" = 'castle'",
    );
    for (const field of ["characterId", "worldObjectId"])
    {
        expect(city.findColumnWithPropertyName(field)?.isUpdate).toBe(false);
    }
    const resources = source.getMetadata(CharacterResources);
    expect(resources.foreignKeys[0]?.referencedEntityMetadata.target).toBe(Character);
    expect(
        resources.indices.find(index => index.name === "character_resources_character_unique")
            ?.isUnique,
    ).toBe(true);
});

test("resource balances start at zero and preserve exact bigint quantities", () => {
    expect(characterResourcesCreateValidator.parse({ characterId: 1 })).toEqual({
        characterId: 1,
        wood: "0",
        food: "0",
        stone: "0",
        iron: "0",
        silver: "0",
        gold: "0",
        crystals: "0",
    });
    expect(characterResourcesUpdateValidator.parse({ wood: "9223372036854775807" }))
        .toEqual({ wood: "9223372036854775807" });
    for (
        const input of [
            {},
            { characterId: 2 },
            { gold: "-1" },
            { food: "01" },
            { iron: "1.5" },
            { wood: "9223372036854775808" },
            { crystals: 10 },
            { stone: null },
            { silver: undefined },
            { paidGold: "10" },
        ]
    )
    {
        expect(() => characterResourcesUpdateValidator.parse(input)).toThrow();
    }
    for (
        const input of [
            { characterId: 0, worldObjectId: 1 },
            { characterId: 1, worldObjectId: -1 },
            { characterId: 1, worldObjectId: 1, castleObjectType: "wood_resource" },
        ]
    )
    {
        expect(() => cityCreateValidator.parse(input)).toThrow();
    }
});

test("city and resource factories isolate kingdoms and preserve ownership", () => {
    const global = createPostgresDataSource("global");
    const kingdom = createPostgresDataSource("kingdom_1");
    for (const factory of [createCityRepositories, createCharacterResourcesRepositories])
    {
        expect(() => factory(global.manager, 1)).toThrow("banco incorreto");
        expect(() => factory(kingdom.manager, 2)).toThrow("banco incorreto");
    }
    const cities = createCityRepositories(kingdom.manager, 1);
    expect(cities.create).toBeDefined();
    expect("update" in cities).toBe(false);
    const resources = createCharacterResourcesRepositories(kingdom.manager, 1);
    expect(resources.update).toBeDefined();
});
