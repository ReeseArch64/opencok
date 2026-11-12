import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { resourceDepositConfigurationModel } from "@opencok/persistence/models/global/resource-deposit-configuration";
import configurations from "../src/seeds/data/resource-deposit-configurations.json";

const Configuration = resourceDepositConfigurationModel(
    new Mongoose().createConnection().useDb("global"),
);

test("every resource has ten valid levels and unique configuration identities", async () => {
    const keys = new Set<string>();
    for (const configuration of configurations)
    {
        await new Configuration(configuration).validate();
        const key =
            `${configuration.resourceType}:${configuration.resourceLevel}:${configuration.configurationVersion}`;
        expect(keys.has(key)).toBe(false);
        keys.add(key);
        expect(configuration.respawnDelaySeconds).toBe(
            (2 * configuration.resourceLevel - 1) * 3600,
        );
    }
    expect(configurations.length).toBe(60);
    for (
        const type of [
            "wood",
            "food",
            "iron",
            "mithril",
            "gold",
            "refined_iron",
        ]
    )
    {
        expect(
            configurations
                .filter((c) => c.resourceType === type)
                .map((c) => c.resourceLevel),
        ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
    expect(
        configurations.filter((c) => c.resourceType === "mithril"),
    ).toHaveLength(10);
    expect(
        configurations
            .filter((c) => c.resourceType === "refined_iron")
            .map((c) => c.resourceLevel),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("reference values preserve non-linear capacities from active XML entries", () => {
    const amount = (type: string, level: number) =>
        configurations.find(
            (c) => c.resourceType === type && c.resourceLevel === level,
        )?.initialQuantity;
    expect(amount("wood", 1)).toBe(35100);
    expect(amount("mithril", 1)).toBe(1463);
    expect(amount("food", 3)).toBe(93600);
    expect(amount("wood", 3)).toBe(108000);
    expect(amount("iron", 10)).toBe(113100);
    expect(amount("gold", 10)).toBe(244);
    expect(amount("refined_iron", 8)).toBe(5220000);
    expect(amount("refined_iron", 9)).toBe(6660000);
    expect(amount("refined_iron", 10)).toBe(8280000);
});
