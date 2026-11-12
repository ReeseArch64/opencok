import { expect, test } from "bun:test";
import { Mongoose, Types } from "mongoose";
import { worldRegionModel } from "@opencok/persistence/models/kingdom/world-region";
import { worldResourceSpawnJobModel } from "@opencok/persistence/models/kingdom/world-resource-spawn-job";

const connection = new Mongoose().createConnection().useDb("kingdom_1");
const Region = worldRegionModel(connection, 1);
const Job = worldResourceSpawnJobModel(connection, 1);
const uuid = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
const region = {
    worldPublicId: uuid,
    displayName: "Área de recursos",
    regionType: "resource_area",
    minimumCellX: 1,
    minimumCellY: 1,
    maximumCellX: 10,
    maximumCellY: 10,
};
const job = {
    worldRegionId: new Types.ObjectId(),
    configurationPublicId: uuid,
    eligibleAt: new Date(0),
};

test("MongoDB world models bind to the kingdom and validate region boundaries", async () => {
    await expect(new Region(region).validate()).resolves.toBeUndefined();
    for (
        const invalid of [
            { minimumCellX: 0 },
            { maximumCellX: 0 },
            { maximumCellX: 1201 },
            { minimumCellY: 1.5 },
            { displayName: " " },
            { regionType: "unknown" },
        ]
    )
    {
        await expect(
            new Region({ ...region, ...invalid }).validate(),
        ).rejects.toThrow();
    }
    expect(() => worldRegionModel(connection, 2)).toThrow();
    expect(() => new Region({ ...region, worldId: 1 })).toThrow();
});
test("job lifecycle guards preserve the SQL invariants in Mongoose", async () => {
    await expect(new Job(job).validate()).resolves.toBeUndefined();
    for (
        const invalid of [
            { jobStatus: "processing" },
            { jobStatus: "completed" },
            { jobStatus: "failed" },
            { attemptCount: -1 },
            { attemptCount: 0.5 },
            { claimExpiresAt: new Date() },
        ]
    )
    {
        await expect(
            new Job({ ...job, ...invalid }).validate(),
        ).rejects.toThrow();
    }
    await expect(
        new Job({
            ...job,
            jobStatus: "processing",
            attemptCount: 1,
            claimedAt: new Date(1),
            claimExpiresAt: new Date(2),
        }).validate(),
    ).resolves.toBeUndefined();
    await expect(
        new Job({
            ...job,
            jobStatus: "completed",
            attemptCount: 1,
            completedAt: new Date(1),
            spawnedWorldObjectPublicId: uuid,
        }).validate(),
    ).resolves.toBeUndefined();
    await expect(
        new Job({
            ...job,
            jobStatus: "failed",
            attemptCount: 1,
            lastError: "Teste",
        }).validate(),
    ).resolves.toBeUndefined();
    expect(connection.readyState).toBe(0);
});
