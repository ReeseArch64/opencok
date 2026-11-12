import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { getMetadataArgsStorage } from "typeorm";
import { databases } from "@opencok/persistence/config/databases";
import { kingdomDatabase } from "@opencok/persistence/factories/kingdom-database";
import { createPostgresDataSource } from "@opencok/persistence/factories/postgres-data-source";
import {
    City,
    CharacterResources,
    Account,
    CharacterProvisioning,
    Character,
    Kingdom,
    World,
    WorldObject,
    WorldResourceDeposit,
    WorldObjectCell,
    CityBuilding,
    ConstructionJob,
    CommandReceipt,
    EconomyPosting,
    MutationOutbox,
} from "@opencok/persistence";
import { worldLayoutModel } from "@opencok/persistence/models/kingdom/world-layout";

const mongoose = new Mongoose();
const connection = mongoose.createConnection().useDb("kingdom_1");
const Layout = worldLayoutModel(connection, 1);
const layout = {
    worldPublicId: "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd",
    layoutVersion: 1,
    templateWidthInCells: 57,
    templateHeightInCells: 57,
    blockedCells: [
        { columnIndex: 0, rowIndex: 0 },
        { columnIndex: 56, rowIndex: 56 },
    ],
};

test("database routing separates registry, kingdom and payment entities", () => {
    expect(databases).toEqual({
        chat: "chat",
        payments: "payments",
        global: "global",
    });
    expect(kingdomDatabase(1)).toBe("kingdom_1");
    expect(kingdomDatabase(2)).toBe("kingdom_2");
    for (const id of [0, -1, 1.5, NaN, Infinity, 2147483648])
    {
        expect(() => kingdomDatabase(id)).toThrow();
    }
    expect(createPostgresDataSource("global").options.entities).toEqual([
        Account,
        CharacterProvisioning,
        Kingdom,
    ]);
    expect(createPostgresDataSource("kingdom_1").options.entities).toEqual([
        City,
        CharacterResources,
        Character,
        World,
        WorldObject,
        WorldResourceDeposit,
        WorldObjectCell,
        CityBuilding,
        ConstructionJob,
        CommandReceipt,
        EconomyPosting,
        MutationOutbox,
    ]);
    expect(createPostgresDataSource("payments").options.entities).toEqual([]);
    for (
        const db of [
            "chat",
            "kingdom_0",
            "kingdom_01",
            "kingdom_1;DROP DATABASE global",
        ]
    )
    {
        expect(() => createPostgresDataSource(db as "kingdom_1")).toThrow();
    }
    for (const db of ["global", "kingdom_1", "payments"] as const)
    {
        const source = createPostgresDataSource(db);
        expect(source.isInitialized).toBe(false);
        expect(source.options.synchronize).toBe(false);
        expect(source.options.migrationsRun).toBe(false);
        expect(source.options.database).toBe(db);
    }
});

test("SQL entities declare bounded geometry and a world reference", () => {
    const metadata = getMetadataArgsStorage();
    expect(
        metadata.tables
            .filter((t) =>
                [
                    Kingdom,
                    World,
                    WorldObject,
                    WorldResourceDeposit,
                    WorldObjectCell,
                ].includes(t.target as typeof World)
            )
            .map((t) => t.name)
            .sort(),
    ).toEqual([
        "kingdoms",
        "world_object_cells",
        "world_objects",
        "world_resource_deposits",
        "worlds",
    ]);
    expect(
        metadata.checks
            .filter((c) => c.target === WorldObject)
            .map((c) => c.name),
    ).toContain("world_object_bounds");
    expect(metadata.foreignKeys.some((f) => f.target === WorldObject)).toBe(
        true,
    );
});

test("terrain template accepts its own coordinate system and rejects invalid cells", async () => {
    await expect(new Layout(layout).validate()).resolves.toBeUndefined();
    for (
        const blockedCells of [
            [{ columnIndex: 57, rowIndex: 0 }],
            [{ columnIndex: -1, rowIndex: 0 }],
            [{ columnIndex: 0.5, rowIndex: 0 }],
            [
                { columnIndex: 0, rowIndex: 0 },
                { columnIndex: 0, rowIndex: 0 },
            ],
        ]
    )
    {
        await expect(
            new Layout({ ...layout, blockedCells }).validate(),
        ).rejects.toThrow();
    }
    for (
        const invalid of [
            { worldPublicId: "invalid" },
            { layoutVersion: 0 },
            { layoutVersion: 1.5 },
            { templateWidthInCells: 0 },
            { templateHeightInCells: 1201 },
        ]
    )
    {
        await expect(
            new Layout({ ...layout, ...invalid }).validate(),
        ).rejects.toThrow();
    }
    expect(() => new Layout({ ...layout, balance: 100 })).toThrow();
});

test("layout models bind to the correct kingdom and do not create collections or indexes", () => {
    expect(worldLayoutModel(connection, 1)).toBe(Layout);
    expect(() => worldLayoutModel(connection, 2)).toThrow();
    expect(Layout.schema.options.autoCreate).toBe(false);
    expect(Layout.schema.options.autoIndex).toBe(false);
    expect(Layout.schema.indexes()).toEqual([
        [{ publicId: 1 }, { unique: true, name: "world_layout_public_id" }],
        [
            { worldPublicId: 1, layoutVersion: 1 },
            { unique: true, name: "world_layout_version" },
        ],
    ]);
    expect(connection.readyState).toBe(0);
});

test("MongoDB rejects ambiguous legacy field names in the reconstructed schema", async () => {
    for (
        const field of [
            "version",
            "templateColumns",
            "templateRows",
            "blocked",
        ]
    )
    {
        expect(() => new Layout({ ...layout, [field]: 1 })).toThrow();
    }
    await expect(
        new Layout({ ...layout, blockedCells: [{ x: 0, y: 0 }] }).validate(),
    ).rejects.toThrow();
});
