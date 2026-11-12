import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { troopTrainingConfigurationModel } from "../src/models/global/troop-training-configuration";
import { buildingConfigurationModel } from "../src/models/global/building-configuration";
import { TroopType } from "../src/enums/troop-type";
import { BuildingType } from "../src/enums/building-type";

const connection = new Mongoose().createConnection().useDb("global");
const Training = troopTrainingConfigurationModel(connection);
const Building = buildingConfigurationModel(connection);
const unitCosts = {
    wood: "9007199254740993",
    food: "0",
    stone: "0",
    iron: "0",
    silver: "0",
    gold: "0",
    crystals: "0",
};
const training = {
    schemaVersion: 1,
    configurationVersion: 1,
    troopType: TroopType.Infantry,
    tier: 1,
    requiredBuildingLevel: 1,
    trainingSecondsPerUnit: 2,
    unitCosts,
};
const building = {
    schemaVersion: 1,
    configurationVersion: 1,
    buildingType: BuildingType.Barracks,
    level: 1,
    maxInstances: 1,
    constructionSeconds: 60,
    costs: unitCosts,
    requiredBuildings: [],
    training: { troopType: TroopType.Infantry, maxBatchSize: 100 },
};

test("training rules support T1 through T10 and require explicit costs, time and building level", async () => {
    for (const troopType of Object.values(TroopType))
    {
        for (let tier = 1; tier <= 10; tier++)
        {
            await expect(new Training({ ...training, troopType, tier }).validate()).resolves
                .toBeUndefined();
        }
    }
    for (
        const patch of [
            { tier: 0 },
            { tier: 11 },
            { tier: 1.5 },
            { troopType: "dragon" },
            { requiredBuildingLevel: 0 },
            { requiredBuildingLevel: undefined },
            { trainingSecondsPerUnit: 0 },
            { trainingSecondsPerUnit: 1.5 },
            { trainingSecondsPerUnit: undefined },
            { configurationVersion: 0 },
            { unitCosts: undefined },
            { unitCosts: { wood: "1" } },
        ]
    )
    {
        await expect(new Training({ ...training, ...patch }).validate()).rejects.toThrow();
    }
    for (const wood of ["-1", "01", "1.5", "9223372036854775808", 1, 9007199254740992])
    {
        await expect(new Training({ ...training, unitCosts: { ...unitCosts, wood } }).validate())
            .rejects.toThrow();
    }
    const document = new Training(training);
    await document.validate();
    expect(document.unitCosts.wood).toBe("9007199254740993");
    expect(() => new Training({ ...training, eventId: "event" })).toThrow();
    await expect(
        new Training({ ...training, unitCosts: { ...unitCosts, unknown: "1" } }).validate(),
    ).rejects.toThrow();
});

test("military buildings train their own troop type with an explicit batch capacity", async () => {
    for (
        const [buildingType, troopType] of [
            [BuildingType.Barracks, TroopType.Infantry],
            [BuildingType.Stable, TroopType.Cavalry],
            [BuildingType.ArcheryRange, TroopType.Archer],
            [BuildingType.SiegeWorkshop, TroopType.Siege],
        ]
    )
    {
        await expect(
            new Building({ ...building, buildingType, training: { troopType, maxBatchSize: 100 } })
                .validate(),
        ).resolves.toBeUndefined();
        await expect(new Building({ ...building, buildingType, training: null }).validate()).rejects
            .toThrow();
    }
    for (
        const patch of [
            { training: { troopType: TroopType.Cavalry, maxBatchSize: 100 } },
            { training: { troopType: TroopType.Infantry, maxBatchSize: 0 } },
            { training: { troopType: TroopType.Infantry, maxBatchSize: 1.5 } },
            { training: { troopType: TroopType.Infantry } },
            { production: { resource: "food", perHour: "1", capacity: "100" } },
            { buildingType: BuildingType.Castle },
            {
                buildingType: BuildingType.Farm,
                production: { resource: "food", perHour: "1", capacity: "100" },
            },
        ]
    )
    {
        await expect(new Building({ ...building, ...patch }).validate()).rejects.toThrow();
    }
    const document = Building.hydrate(new Building(building).toObject());
    document.set("training.maxBatchSize", 200);
    expect(document.training?.maxBatchSize).toBe(100);
});

test("training publications remain global and immutable", async () => {
    expect(troopTrainingConfigurationModel(connection)).toBe(Training);
    expect(() => troopTrainingConfigurationModel(connection.useDb("kingdom_1"))).toThrow("global");
    const document = Training.hydrate(new Training(training).toObject());
    document.unitCosts.wood = "0";
    expect(document.unitCosts.wood).toBe("9007199254740993");
    for (
        const operation of [
            () => Training.updateOne({}, { $set: { trainingSecondsPerUnit: 1 } }).exec(),
            () => Training.deleteMany({}).exec(),
            () => Training.bulkWrite([{ deleteMany: { filter: {} } }]),
        ]
    )
    {
        await expect(operation()).rejects.toThrow("imutáveis");
    }
    expect(connection.readyState).toBe(0);
});
