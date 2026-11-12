import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Mongoose, Types } from "mongoose";
import { FindByPublicIdWorldRepository } from "../src/repositories/world/find-by-public-id";
import { ListWorldRepository } from "../src/repositories/world/list";
import { World } from "../src/models/kingdom/world";
import {
    worldObjectCreateValidator,
    worldObjectUpdateValidator,
    worldResourceDepositCreateValidator,
    worldResourceDepositUpdateValidator,
    validateWorldObjectBounds,
    validateWorldResourceDepositState,
} from "../src/validators/sql-entities";
import { worldCellValidator } from "../src/validators/world-cell";
import { worldPopulationResourceRuleValidator } from "../src/validators/world-population-resource-rule";
import { WorldObjectType } from "../src/enums/world-object-type";
import { ResourceType } from "../src/enums/resource-type";
import { ResourceDepositStatus } from "../src/enums/resource-deposit-status";
import { createWorldRegionRepositories } from "../src/factories/world-region-repositories";
import { createWorldLayoutRepositories } from "../src/factories/world-layout-repositories";
import { createWorldObjectCellRepositories } from "../src/factories/world-object-cell-repositories";
import { createWorldRepositories } from "../src/factories/world-repositories";
import { createKingdomRepositories } from "../src/factories/kingdom-repositories";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { WorldRegionValidator } from "../src/validators/world-region";
import { worldRegionModel } from "../src/models/kingdom/world-region";
import { worldLayoutModel } from "../src/models/kingdom/world-layout";
import { WorldLayoutValidator } from "../src/validators/world-layout";
import { WorldRegionType } from "../src/enums/world-region-type";
import { postgresCacheCodec, mongoCacheCodec } from "../src/cache/codecs";

const publicId = randomUUID();

test("read operations validate input, normalize UUIDs and bound pagination before accessing the store", async () => {
    let calls = 0;
    let received: unknown;
    const store = {
        findByPublicId: async (id: string) => {
            calls++;
            received = id;
            return null;
        },
        list: async (query: { offset: number; limit: number; }) => {
            calls++;
            received = query;
            return { ...query, items: [] as World[], hasMore: false };
        },
    };
    const find = new FindByPublicIdWorldRepository(store);
    const list = new ListWorldRepository(store);
    await expect(find.execute("invalid")).rejects.toThrow();
    await expect(list.execute({ limit: 201 })).rejects.toThrow();
    await expect(list.execute({ offset: -1 })).rejects.toThrow();
    expect(calls).toBe(0);
    expect(await find.execute(publicId.toUpperCase())).toBeNull();
    expect(received).toBe(publicId);
    await list.execute({});
    expect(received).toEqual({ offset: 0, limit: 50 });
});

test("SQL partial updates preserve omitted fields and reject identity and immutable deposit configuration", () => {
    expect(worldObjectUpdateValidator.parse({ cellX: 10 })).toEqual({ cellX: 10 });
    expect(worldResourceDepositUpdateValidator.parse({ remainingQuantity: "1" })).toEqual({
        remainingQuantity: "1",
    });
    for (
        const input of [
            {},
            { id: 1 },
            { publicId },
            { remainingQuantity: "-1" },
            { initialQuantity: "20" },
            { configurationPublicId: publicId },
        ]
    )
    {
        expect(() => worldResourceDepositUpdateValidator.parse(input)).toThrow();
    }
    expect(() =>
        validateWorldObjectBounds(
            worldObjectCreateValidator.parse({
                objectType: WorldObjectType.Castle,
                cellX: 1200,
                cellY: 1,
                widthInCells: 2,
            }),
        )
    ).toThrow();
    const deposit = worldResourceDepositCreateValidator.parse({
        worldObjectId: 1,
        resourceType: ResourceType.Wood,
        configurationPublicId: publicId,
        initialQuantity: "10",
        remainingQuantity: "10",
    });
    expect(() => validateWorldResourceDepositState(deposit)).not.toThrow();
    expect(() => validateWorldResourceDepositState({ ...deposit, remainingQuantity: "11" }))
        .toThrow();
    expect(() => validateWorldResourceDepositState({ ...deposit, remainingQuantity: "0" }))
        .toThrow();
    expect(() =>
        validateWorldResourceDepositState({
            ...deposit,
            remainingQuantity: "0",
            depositStatus: ResourceDepositStatus.Depleted,
            depletedAt: new Date(),
        })
    ).not.toThrow();
});

test("embedded schemas have standalone typed validators", () => {
    expect(worldCellValidator.parse({ columnIndex: 0, rowIndex: 1199 })).toEqual({
        columnIndex: 0,
        rowIndex: 1199,
    });
    expect(() => worldCellValidator.parse({ columnIndex: 1200, rowIndex: 0 })).toThrow();
    expect(() =>
        worldPopulationResourceRuleValidator.parse({
            configurationPublicId: publicId,
            targetActiveDeposits: 0,
        })
    ).toThrow();
});

test("factories isolate databases and expose only operations supported by the model", () => {
    const connection = new Mongoose().createConnection().useDb("kingdom_1");
    expect(() => createWorldRegionRepositories(connection, 2)).toThrow();
    const layout = createWorldLayoutRepositories(connection, 1);
    expect(Object.keys(layout).sort()).toEqual(["create", "findByPublicId", "list"]);
    const kingdom = createPostgresDataSource("kingdom_1");
    expect(Object.keys(createWorldObjectCellRepositories(kingdom.manager, 1)).sort()).toEqual([
        "findByPublicId",
        "list",
    ]);
    expect(() => createWorldRepositories(kingdom.manager, 2)).toThrow();
    expect(() => createKingdomRepositories(kingdom.manager)).toThrow();
    expect(connection.readyState).toBe(0);
    expect(kingdom.isInitialized).toBe(false);
});

test("Mongo validators reuse complete document hooks and reject managed fields before any I/O", async () => {
    const connection = new Mongoose().createConnection().useDb("kingdom_1");
    const model = worldRegionModel(connection, 1);
    const validator = new WorldRegionValidator(model);
    const input = {
        worldPublicId: publicId,
        displayName: "Area",
        regionType: WorldRegionType.ResourceArea,
        minimumCellX: 1,
        minimumCellY: 1,
        maximumCellX: 10,
        maximumCellY: 10,
    };
    await expect(validator.parse(input)).resolves.toBeDefined();
    for (
        const patch of [
            { publicId },
            { deletedAt: new Date() },
            { __v: 42 },
            { "displayName.value": "X" },
            { $set: {} },
            { minimumCellX: 20 },
        ]
    )
    {
        await expect(validator.parse({ ...input, ...patch })).rejects.toThrow();
    }
    await expect(validator.parse({ ...input, worldPublicId: 123 })).rejects.toThrow();
    const layout = new WorldLayoutValidator(worldLayoutModel(connection, 1));
    await expect(
        layout.parse({
            worldPublicId: publicId,
            layoutVersion: 1,
            templateWidthInCells: 2,
            templateHeightInCells: 2,
            blockedCells: [{ columnIndex: 2, rowIndex: 0 }],
        }),
    ).rejects.toThrow();
    expect(connection.readyState).toBe(0);
});

test("cache codecs preserve SQL dates, bigint strings and Mongo UUID/ObjectId/BSON types", async () => {
    const codec = postgresCacheCodec(() => new World());
    const date = new Date();
    const value = Object.assign(new World(), {
        publicId,
        id: 1,
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
        archivedAt: null,
    });
    const restored = codec.decode(codec.encode(value));
    expect(restored).toBeInstanceOf(World);
    expect(restored.createdAt).toEqual(date);
    expect(restored.createdAt).toBeInstanceOf(Date);
    const connection = new Mongoose().createConnection().useDb("kingdom_1");
    const model = worldRegionModel(connection, 1);
    const document = new model({
        worldPublicId: publicId,
        displayName: "Area",
        regionType: WorldRegionType.ResourceArea,
        minimumCellX: 1,
        minimumCellY: 1,
        maximumCellX: 10,
        maximumCellY: 10,
    });
    await document.validate();
    const mongoCodec = mongoCacheCodec(model);
    const hydrated = mongoCodec.decode(mongoCodec.encode(document));
    expect(String(hydrated.publicId)).toBe(String(document.publicId));
    expect(hydrated._id).toBeInstanceOf(Types.ObjectId);
    expect(hydrated.createdAt).toBeInstanceOf(Date);
    await expect(hydrated.validate()).resolves.toBeUndefined();
});

test("cache failures fall back to the store without swallowing database errors", async () => {
    const { RedisEntityCache } = await import("../src/cache/redis-entity-cache");
    const failures: unknown[] = [];
    const cache = new RedisEntityCache<{ name: string; }>("fixture", {
        encode: JSON.stringify,
        decode: JSON.parse,
    }, {
        client: {
            get: async () => {
                throw new Error("Redis indisponível");
            },
            send: async () => {
                throw new Error("Redis indisponível");
            },
        },
        onError: error => {
            failures.push(error);
        },
    });
    expect(await cache.remember(publicId, async () => ({ name: "banco" }))).toEqual({
        name: "banco",
    });
    await expect(cache.invalidate(publicId)).resolves.toBeUndefined();
    await expect(cache.remember(publicId, async () => {
        throw new Error("Banco indisponível");
    })).rejects.toThrow("Banco indisponível");
    expect(failures).toHaveLength(3);
});
