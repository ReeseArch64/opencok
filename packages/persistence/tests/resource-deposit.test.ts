import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { ResourceType } from "@opencok/persistence/enums/resource-type";
import { ResourceRespawnPolicy } from "@opencok/persistence/enums/resource-respawn-policy";
import { resourceDepositConfigurationModel } from "@opencok/persistence/models/global/resource-deposit-configuration";

const root = new Mongoose().createConnection();
const global = root.useDb("global");
const Configuration = resourceDepositConfigurationModel(global);
const valid = {
    resourceType: ResourceType.Wood,
    resourceLevel: 1,
    configurationVersion: 1,
    initialQuantity: 100,
    respawnPolicy: ResourceRespawnPolicy.Never,
};

test("resource configuration accepts only supported resources and exact positive quantities", async () => {
    await expect(new Configuration(valid).validate()).resolves.toBeUndefined();
    await expect(
        new Configuration({ ...valid, resourceLevel: 10 }).validate(),
    ).resolves.toBeUndefined();
    for (
        const change of [
            { resourceType: "castle" },
            { resourceType: "ancient_ruins" },
            { resourceLevel: 0 },
            { resourceLevel: 11 },
            { configurationVersion: 0 },
            { initialQuantity: 0 },
            { initialQuantity: 1.5 },
            { initialQuantity: Number.MAX_SAFE_INTEGER + 1 },
        ]
    )
    {
        await expect(
            new Configuration({ ...valid, ...change }).validate(),
        ).rejects.toThrow();
    }
});

test("respawn policy and delay must agree and time units are explicit", async () => {
    await expect(
        new Configuration({
            ...valid,
            respawnPolicy: ResourceRespawnPolicy.AfterDepletion,
            respawnDelaySeconds: 60,
        }).validate(),
    ).resolves.toBeUndefined();
    for (
        const change of [
            { respawnDelaySeconds: 60 },
            { respawnPolicy: ResourceRespawnPolicy.AfterDepletion },
            {
                respawnPolicy: ResourceRespawnPolicy.AfterDepletion,
                respawnDelaySeconds: 0,
            },
            {
                respawnPolicy: ResourceRespawnPolicy.AfterDepletion,
                respawnDelaySeconds: 1.5,
            },
            { respawnPolicy: "unknown" },
        ]
    )
    {
        await expect(
            new Configuration({ ...valid, ...change }).validate(),
        ).rejects.toThrow();
    }
});

test("catalog binds to global and rejects unexpected legacy fields", () => {
    expect(() => resourceDepositConfigurationModel(root.useDb("kingdom_1"))).toThrow();
    expect(resourceDepositConfigurationModel(global)).toBe(Configuration);
    expect(() => new Configuration({ ...valid, resInitValue: 100 })).toThrow();
    expect(global.readyState).toBe(0);
});
