import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { cityInitialConfigurationModel } from "../src/models/global/city-initial-configuration";
import { BuildingType } from "../src/enums/building-type";

const connection = new Mongoose().createConnection().useDb("global");
const Initial = cityInitialConfigurationModel(connection);
const publication = {
    schemaVersion: 1,
    configurationVersion: 1,
    resources: {
        wood: "9007199254740993",
        food: "0",
        stone: "0",
        iron: "0",
        silver: "0",
        gold: "0",
        crystals: "0",
    },
    buildings: [
        { buildingType: BuildingType.Castle, position: 0, level: 1 },
        { buildingType: BuildingType.Farm, position: 1, level: 1 },
        { buildingType: BuildingType.Farm, position: 2, level: 1 },
    ],
};

test("initial cities require exact resources, one castle and distinct occupied positions", async () => {
    const document = new Initial(publication);
    await document.validate();
    expect(document.resources.wood).toBe("9007199254740993");
    for (
        const buildings of [
            [],
            publication.buildings.slice(1),
            [...publication.buildings, {
                buildingType: BuildingType.Castle,
                position: 3,
                level: 1,
            }],
            [...publication.buildings, {
                buildingType: BuildingType.Barracks,
                position: 1,
                level: 1,
            }],
            [{ buildingType: BuildingType.Castle, position: -1, level: 1 }],
            [{ buildingType: BuildingType.Castle, position: 0.5, level: 1 }],
            [{ buildingType: BuildingType.Castle, position: 0, level: 0 }],
            [{ buildingType: "unknown", position: 0, level: 1 }],
        ]
    )
    {
        await expect(new Initial({ ...publication, buildings }).validate()).rejects.toThrow();
    }
    for (
        const resources of [
            undefined,
            { wood: "1" },
            { ...publication.resources, wood: "-1" },
            { ...publication.resources, wood: "9223372036854775808" },
            { ...publication.resources, wood: 1 },
        ]
    )
    {
        await expect(new Initial({ ...publication, resources }).validate()).rejects.toThrow();
    }
    await expect(new Initial({ ...publication, buildings: undefined }).validate()).rejects
        .toThrow();
    expect(() => new Initial({ ...publication, troops: [] })).toThrow();
});

test("initial city publications are global and cannot be edited or removed", async () => {
    expect(cityInitialConfigurationModel(connection)).toBe(Initial);
    expect(() => cityInitialConfigurationModel(connection.useDb("kingdom_1"))).toThrow("global");
    const document = Initial.hydrate(new Initial(publication).toObject());
    document.resources.wood = "0";
    document.buildings[0]!.level = 2;
    expect(document.resources.wood).toBe(publication.resources.wood);
    expect(document.buildings[0]!.level).toBe(1);
    for (
        const operation of [
            () => Initial.updateOne({}, { $set: { resources: publication.resources } }).exec(),
            () => Initial.deleteMany({}).exec(),
            () => Initial.bulkWrite([{ deleteMany: { filter: {} } }]),
        ]
    )
    {
        await expect(operation()).rejects.toThrow("imutáveis");
    }
    const changed = Initial.hydrate(new Initial(publication).toObject());
    changed.buildings.push({ buildingType: BuildingType.Sawmill, position: 3, level: 1 });
    await expect(changed.save()).rejects.toThrow("imutáveis");
});
