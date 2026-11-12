import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { troopConfigurationModel } from "../src/models/global/troop-configuration";
import { marchConfigurationModel } from "../src/models/global/march-configuration";
import { TroopType } from "../src/enums/troop-type";

const connection = new Mongoose().createConnection().useDb("global");
const Troop = troopConfigurationModel(connection);
const March = marchConfigurationModel(connection);
const troop = {
    schemaVersion: 1,
    configurationVersion: 1,
    troopType: TroopType.Infantry,
    tier: 1,
    speedCellsPerHour: 30,
    carryCapacity: "9007199254740993",
};
const march = {
    schemaVersion: 1,
    configurationVersion: 1,
    maxActiveMarches: 1,
    maxTroopsPerMarch: 1000,
    gatheringRates: [{ resourceType: "wood", perTroopPerHour: "100" }],
};

test("basic troop catalog supports four troop types at T1 through T10 only", async () => {
    for (const troopType of Object.values(TroopType))
    {
        for (let tier = 1; tier <= 10; tier++)
        {
            await expect(new Troop({ ...troop, troopType, tier }).validate()).resolves
                .toBeUndefined();
        }
    }
    for (
        const patch of [
            { tier: 0 },
            { tier: 11 },
            { tier: 1.5 },
            { troopType: "dragon" },
            { speedCellsPerHour: 0 },
            { speedCellsPerHour: 0.5 },
            { schemaVersion: 2 },
            { configurationVersion: 0 },
        ]
    )
    {
        await expect(new Troop({ ...troop, ...patch }).validate()).rejects.toThrow();
    }
    expect(new Troop(troop).carryCapacity).toBe("9007199254740993");
    for (
        const carryCapacity of ["0", "-1", "01", "1.5", "9223372036854775808", 1, 9007199254740992]
    )
    {
        await expect(new Troop({ ...troop, carryCapacity }).validate()).rejects.toThrow();
    }
    expect(() => new Troop({ ...troop, attack: 100 })).toThrow();
});

test("march limits and gathering rates require explicit valid configuration", async () => {
    await expect(new March(march).validate()).resolves.toBeUndefined();
    for (
        const patch of [
            { maxActiveMarches: 0 },
            { maxTroopsPerMarch: 1.5 },
            { gatheringRates: undefined },
            { gatheringRates: [] },
            { gatheringRates: [march.gatheringRates[0], march.gatheringRates[0]] },
            { gatheringRates: [{ resourceType: "unknown", perTroopPerHour: "1" }] },
            { gatheringRates: [{ resourceType: "wood", perTroopPerHour: "0" }] },
            { gatheringRates: [{ resourceType: "wood", perTroopPerHour: 100 }] },
        ]
    )
    {
        await expect(new March({ ...march, ...patch }).validate()).rejects.toThrow();
    }
});

test("troop and march publications bind globally and reject mutations before I/O", async () => {
    expect(troopConfigurationModel(connection)).toBe(Troop);
    expect(marchConfigurationModel(connection)).toBe(March);
    for (const factory of [troopConfigurationModel, marchConfigurationModel])
    {
        expect(() => factory(connection.useDb("kingdom_1"))).toThrow("global");
    }
    for (
        const operation of [
            () => Troop.updateOne({}, { $set: { configurationVersion: 2 } }).exec(),
            () => March.updateOne({}, { $set: { configurationVersion: 2 } }).exec(),
            () => Troop.deleteMany({}).exec(),
            () => March.deleteMany({}).exec(),
            () => Troop.bulkWrite([{ deleteMany: { filter: {} } }]),
            () => March.bulkWrite([{ deleteMany: { filter: {} } }]),
        ]
    )
    {
        await expect(operation()).rejects.toThrow("imutáveis");
    }
    const document = March.hydrate(new March(march).toObject());
    document.gatheringRates.push({ resourceType: "food", perTroopPerHour: "1" });
    await expect(document.save()).rejects.toThrow("imutáveis");
    expect(connection.readyState).toBe(0);
});
