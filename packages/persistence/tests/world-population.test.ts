import { expect, test } from "bun:test";
import { Mongoose, Types } from "mongoose";
import { worldPopulationConfigurationModel } from "@opencok/persistence/models/kingdom/world-population-configuration";
import { worldRegionModel } from "@opencok/persistence/models/kingdom/world-region";

const connection = new Mongoose().createConnection().useDb("kingdom_1");
const Population = worldPopulationConfigurationModel(connection, 1);
const Region = worldRegionModel(connection, 1);
const uuid = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
const valid = {
    worldRegionId: new Types.ObjectId(),
    configurationVersion: 1,
    maximumActiveDeposits: 10,
    populationCheckIntervalSeconds: 60,
    resourceRules: [{ configurationPublicId: uuid, targetActiveDeposits: 5 }],
};
test("population publications validate targets, limits and unique resource references", async () => {
    await expect(new Population(valid).validate()).resolves.toBeUndefined();
    for (
        const invalid of [
            { maximumActiveDeposits: 4 },
            { maximumActiveDeposits: 0 },
            { configurationVersion: 0 },
            { populationCheckIntervalSeconds: 0 },
            { populationCheckIntervalSeconds: 1.5 },
            { resourceRules: [] },
            {
                resourceRules: [
                    { configurationPublicId: uuid, targetActiveDeposits: 0 },
                ],
            },
            {
                resourceRules: [
                    { configurationPublicId: uuid, targetActiveDeposits: 1 },
                    { configurationPublicId: uuid, targetActiveDeposits: 1 },
                ],
            },
            {
                resourceRules: [
                    { configurationPublicId: "invalid", targetActiveDeposits: 1 },
                ],
            },
        ]
    )
    {
        await expect(
            new Population({ ...valid, ...invalid }).validate(),
        ).rejects.toThrow();
    }
    expect(() => worldPopulationConfigurationModel(connection, 2)).toThrow();
    expect(() => new Population({ ...valid, weight: 50 })).toThrow();
});
test("activation is optional and belongs only to resource areas", async () => {
    const region = {
        worldPublicId: uuid,
        displayName: "Teste",
        regionType: "resource_area",
        minimumCellX: 1,
        minimumCellY: 1,
        maximumCellX: 10,
        maximumCellY: 10,
    };
    await expect(
        new Region({
            ...region,
            activePopulationConfigurationId: new Types.ObjectId(),
        }).validate(),
    ).resolves.toBeUndefined();
    await expect(
        new Region({
            ...region,
            regionType: "protected_area",
            activePopulationConfigurationId: new Types.ObjectId(),
        }).validate(),
    ).rejects.toThrow();
    await expect(
        new Region({ ...region, regionType: "protected_area" }).validate(),
    ).resolves.toBeUndefined();
    expect(connection.readyState).toBe(0);
});
