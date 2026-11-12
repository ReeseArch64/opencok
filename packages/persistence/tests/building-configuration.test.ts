import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { buildingConfigurationModel } from "../src/models/global/building-configuration";
import { BuildingType } from "../src/enums/building-type";
import { CharacterResource } from "../src/enums/character-resource";

const connection = new Mongoose().createConnection().useDb("global");
const Configuration = buildingConfigurationModel(connection);
const costs = {
    wood: "0",
    food: "0",
    stone: "0",
    iron: "0",
    silver: "0",
    gold: "0",
    crystals: "0",
};
const castle = {
    schemaVersion: 1,
    configurationVersion: 1,
    buildingType: BuildingType.Castle,
    level: 1,
    maxInstances: 1,
    constructionSeconds: 60,
    costs,
    requiredBuildings: [],
};

test("building catalog accepts only the selected buildings with matching production", async () => {
    await expect(new Configuration(castle).validate()).resolves.toBeUndefined();
    for (
        const [buildingType, resource] of [
            [BuildingType.Farm, CharacterResource.Food],
            [BuildingType.Sawmill, CharacterResource.Wood],
            [BuildingType.Quarry, CharacterResource.Stone],
            [BuildingType.IronMine, CharacterResource.Iron],
        ]
    )
    {
        await expect(new Configuration({
            ...castle,
            buildingType,
            production: { resource, perHour: "9007199254740993", capacity: "9223372036854775807" },
        }).validate()).resolves.toBeUndefined();
    }
    for (
        const patch of [
            { buildingType: "hospital" },
            { buildingType: BuildingType.Farm },
            {
                buildingType: BuildingType.Sawmill,
                production: { resource: "food", perHour: "1", capacity: "2" },
            },
            { production: { resource: "wood", perHour: "1", capacity: "2" } },
            { maxInstances: 2 },
            { schemaVersion: 2 },
            { configurationVersion: 0 },
            { level: 1.5 },
            { constructionSeconds: -1 },
            { requiredBuildings: undefined },
            { requiredBuildings: [{ buildingType: "hospital", level: 1 }] },
            {
                requiredBuildings: [
                    { buildingType: "farm", level: 1 },
                    { buildingType: "farm", level: 2 },
                ],
            },
        ]
    )
    {
        await expect(new Configuration({ ...castle, ...patch }).validate()).rejects.toThrow();
    }
});

test("catalog quantities preserve exact bigint strings and reject unsafe numeric inputs", async () => {
    for (
        const wood of [
            "-1",
            "01",
            "1.5",
            "9223372036854775808",
            "1".repeat(100),
            1,
            9007199254740992,
            null,
            undefined,
        ]
    )
    {
        await expect(new Configuration({ ...castle, costs: { ...costs, wood } }).validate()).rejects
            .toThrow();
    }
    const document = new Configuration({
        ...castle,
        costs: { ...costs, wood: "9007199254740993" },
    });
    await document.validate();
    expect(document.costs.wood).toBe("9007199254740993");
    expect(() => new Configuration({ ...castle, unexpected: true })).toThrow();
    await expect(new Configuration({ ...castle, costs: { ...costs, extra: "0" } }).validate())
        .rejects.toThrow();
});

test("building model is scoped globally and publications retain their accepted rule fields", async () => {
    expect(() => buildingConfigurationModel(connection.useDb("kingdom_1"))).toThrow("global");
    const document = Configuration.hydrate(new Configuration(castle).toObject());
    document.configurationVersion = 2;
    document.costs.wood = "500";
    document.requiredBuildings.push({ buildingType: "farm", level: 1 });
    expect(document.configurationVersion).toBe(1);
    expect(document.costs.wood).toBe("0");
    await expect(document.save()).rejects.toThrow();
    await expect(Configuration.updateOne({}, { $set: { level: 2 } }).exec()).rejects.toThrow(
        "imutáveis",
    );
    await expect(Configuration.deleteMany({}).exec()).rejects.toThrow("imutáveis");
    await expect(Configuration.bulkWrite([
        { updateOne: { filter: {}, update: { $set: { level: 2 } } } },
    ])).rejects.toThrow("imutáveis");
    expect(connection.readyState).toBe(0);
});
