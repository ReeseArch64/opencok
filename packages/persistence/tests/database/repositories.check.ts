import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { connectMongoDB } from "../../src/mongoose";
import { connectRedis } from "../../src/redis";
import { migrationMongoConnections } from "../../src/migrations/support/mongo-connections";
import { createWorldRepositories } from "../../src/factories/world-repositories";
import { createWorldObjectRepositories } from "../../src/factories/world-object-repositories";
import { createWorldObjectCellRepositories } from "../../src/factories/world-object-cell-repositories";
import { createWorldResourceDepositRepositories } from "../../src/factories/world-resource-deposit-repositories";
import { createWorldRegionRepositories } from "../../src/factories/world-region-repositories";
import { createWorldLayoutRepositories } from "../../src/factories/world-layout-repositories";
import { createWorldPopulationConfigurationRepositories } from "../../src/factories/world-population-configuration-repositories";
import { createWorldResourceSpawnJobRepositories } from "../../src/factories/world-resource-spawn-job-repositories";
import { RedisEntityCache } from "../../src/cache/redis-entity-cache";
import { repositoryConfig } from "../../src/config/repositories";
import { WorldObjectType } from "../../src/enums/world-object-type";
import { ResourceType } from "../../src/enums/resource-type";
import { ResourceDepositStatus } from "../../src/enums/resource-deposit-status";
import { WorldRegionType } from "../../src/enums/world-region-type";
import { ResourceSpawnJobStatus } from "../../src/enums/resource-spawn-job-status";
import { worldLayoutModel } from "../../src/models/kingdom/world-layout";
import { worldRegionModel } from "../../src/models/kingdom/world-region";
import { MongoEntityStore } from "../../src/class/mongo-entity-store";
import type { WorldRegion } from "../../src/types/world-region";
import type { CreateWorldRegion, UpdateWorldRegion } from "../../src/types/world-region-input";

const options = persistenceOptions();
const kingdomId = randomInt(1_000_000_000, 2_000_000_000);
const database = kingdomDatabase(kingdomId);
const admin = createPostgresDataSource("global", options.postgres);
admin.setOptions({ database: "postgres", entities: [], migrations: [] });
const source = createPostgresDataSource(database, options.postgres);
const redis = await connectRedis(options.redisUrl);
const mongo = await connectMongoDB(options.mongodbUri, { dbName: database });
const namespace = `${database}:race-check`;
const cacheErrors: unknown[] = [];
const cache = {
    client: redis,
    ttlSeconds: 60,
    onError: (error: unknown) => cacheErrors.push(error),
};
let ownsDatabase = false;
let ownsMongo = false;
try
{
    await admin.initialize();
    await admin.query(`CREATE DATABASE "${database}"`);
    ownsDatabase = true;
    // Não tocar em um banco MongoDB pré-existente, mesmo numa colisão de ID.
    const databases = await mongo.db!.admin().listDatabases({ nameOnly: true });
    assert.ok(
        !databases.databases.some(entry => entry.name === database),
        "Fixture MongoDB already exists",
    );
    ownsMongo = true;
    await source.initialize();
    migrationMongoConnections.set(source, mongo);
    await source.runMigrations({ transaction: "all" });

    const worlds = createWorldRepositories(source.manager, kingdomId, { cache });
    const world = await worlds.create.execute({});
    assert.equal(world.id, 1);
    await worlds.findByPublicId.execute(world.publicId);
    const cachedWorld = await worlds.findByPublicId.execute(world.publicId);
    assert.ok(cachedWorld?.createdAt instanceof Date);
    assert.equal(cachedWorld.publicId, world.publicId);
    await worlds.update.execute({
        publicId: world.publicId,
        patch: { activeTerrainLayoutVersion: 2 },
    });
    assert.equal(
        (await worlds.findByPublicId.execute(world.publicId))?.activeTerrainLayoutVersion,
        2,
    );

    const objects = createWorldObjectRepositories(source.manager, kingdomId, { cache });
    const cells = createWorldObjectCellRepositories(source.manager, kingdomId);
    const object = await objects.create.execute({
        objectType: WorldObjectType.WoodResource,
        cellX: 30,
        cellY: 30,
        widthInCells: 2,
        heightInCells: 2,
        level: 5,
    });
    assert.equal((await cells.list.execute({})).items.length, 4);
    assert.equal((await objects.list.execute({ limit: 1 })).hasMore, false);
    await objects.findByPublicId.execute(object.publicId);
    await objects.update.execute({ publicId: object.publicId, patch: { cellX: 40 } });
    const moved = await objects.findByPublicId.execute(object.publicId);
    assert.equal(moved?.cellX, 40);
    assert.equal(moved?.widthInCells, 2);
    assert.equal(moved?.level, 5);
    assert.ok((await cells.list.execute({})).items.every(cell => cell.cellX >= 40));
    await assert.rejects(
        objects.update.execute({ publicId: object.publicId, patch: { cellX: 1200 } }),
    );
    assert.equal((await objects.findByPublicId.execute(object.publicId))?.cellX, 40);
    await assert.rejects(source.manager.transaction(async manager => {
        assert.throws(() => createWorldObjectRepositories(manager, kingdomId, { cache }));
        const transactional = createWorldObjectRepositories(manager, kingdomId);
        await transactional.update.execute({ publicId: object.publicId, patch: { level: 10 } });
        throw new Error("Rollback fixture");
    }));
    assert.equal(
        (await createWorldObjectRepositories(source.manager, kingdomId).findByPublicId.execute(
            object.publicId,
        ))?.level,
        5,
    );

    const deposits = createWorldResourceDepositRepositories(source.manager, kingdomId, { cache });
    const configurationPublicId = randomUUID();
    const deposit = await deposits.create.execute({
        worldObjectId: object.id,
        resourceType: ResourceType.Wood,
        configurationPublicId,
        initialQuantity: "10",
        remainingQuantity: "10",
    });
    await deposits.findByPublicId.execute(deposit.publicId);
    assert.equal(
        (await deposits.findByPublicId.execute(deposit.publicId))?.remainingQuantity,
        "10",
    );
    await deposits.update.execute({
        publicId: deposit.publicId,
        patch: {
            remainingQuantity: "0",
            depositStatus: ResourceDepositStatus.Depleted,
            depletedAt: new Date(),
        },
    });
    await deposits.findByPublicId.execute(deposit.publicId);
    assert.ok(
        (await deposits.findByPublicId.execute(deposit.publicId))?.depletedAt instanceof Date,
    );

    await worldLayoutModel(mongo, kingdomId).createCollection();
    await worldLayoutModel(mongo, kingdomId).createIndexes();
    const layouts = createWorldLayoutRepositories(mongo, kingdomId, { cache });
    const layout = await layouts.create.execute({
        worldPublicId: world.publicId,
        layoutVersion: 1,
        templateWidthInCells: 4,
        templateHeightInCells: 4,
    });
    await layouts.findByPublicId.execute(String(layout.publicId));
    assert.equal(
        String((await layouts.findByPublicId.execute(String(layout.publicId)))?.worldPublicId),
        world.publicId,
    );
    await assert.rejects(
        layouts.create.execute({
            worldPublicId: world.publicId,
            layoutVersion: 1,
            templateWidthInCells: 4,
            templateHeightInCells: 4,
        }),
    );

    const regions = createWorldRegionRepositories(mongo, kingdomId, { cache });
    const region = await regions.create.execute({
        worldPublicId: world.publicId,
        displayName: "Área",
        regionType: WorldRegionType.ResourceArea,
        minimumCellX: 1,
        minimumCellY: 1,
        maximumCellX: 100,
        maximumCellY: 100,
    });
    const regionPublicId = String(region.publicId);
    await regions.findByPublicId.execute(regionPublicId);
    const cachedRegion = await regions.findByPublicId.execute(regionPublicId);
    assert.equal(String(cachedRegion?._id), String(region._id));
    assert.equal(String(cachedRegion?.worldPublicId), world.publicId);
    await assert.rejects(
        regions.update.execute({ publicId: regionPublicId, patch: { minimumCellX: 101 } }),
    );
    await regions.update.execute({ publicId: regionPublicId, patch: { displayName: "Alterada" } });
    assert.equal((await regions.findByPublicId.execute(regionPublicId))?.displayName, "Alterada");

    // As duas escritas leem a mesma versão; apenas uma pode persistir.
    let reads = 0;
    let release!: () => void;
    const barrier = new Promise<void>(resolve => {
        release = resolve;
    });
    class ContendedStore extends MongoEntityStore<WorldRegion, CreateWorldRegion, UpdateWorldRegion>
    {
        override async findByPublicId(publicId: string)
        {
            const document = await super.findByPublicId(publicId);
            if (++reads === 2)
            {
                release();
            }
            await barrier;
            return document;
        }
    }
    const contended = new ContendedStore(worldRegionModel(mongo, kingdomId));
    const updates = await Promise.allSettled([
        contended.update(regionPublicId, { displayName: "Primeira" }),
        contended.update(regionPublicId, { displayName: "Segunda" }),
    ]);
    assert.equal(updates.filter(update => update.status === "fulfilled").length, 1);
    assert.equal(updates.filter(update => update.status === "rejected").length, 1);

    const populations = createWorldPopulationConfigurationRepositories(mongo, kingdomId);
    const population = await populations.create.execute({
        worldRegionId: region._id,
        configurationVersion: 1,
        maximumActiveDeposits: 10,
        populationCheckIntervalSeconds: 60,
        resourceRules: [{ configurationPublicId, targetActiveDeposits: 5 }],
    });
    assert.ok(await populations.findByPublicId.execute(String(population.publicId)));
    await regions.update.execute({
        publicId: regionPublicId,
        patch: { activePopulationConfigurationId: population._id },
    });
    const jobs = createWorldResourceSpawnJobRepositories(mongo, kingdomId, { cache });
    const eligibleAt = new Date(Date.now() - 1_000);
    const job = await jobs.create.execute({
        worldRegionId: region._id,
        configurationPublicId,
        eligibleAt,
    });
    const jobPublicId = String(job.publicId);
    await assert.rejects(
        jobs.update.execute({
            publicId: jobPublicId,
            patch: { jobStatus: ResourceSpawnJobStatus.Processing },
        }),
    );
    const claimedAt = new Date();
    await jobs.update.execute({
        publicId: jobPublicId,
        patch: {
            jobStatus: ResourceSpawnJobStatus.Processing,
            claimedAt,
            claimExpiresAt: new Date(Date.now() + 60_000),
            attemptCount: 1,
        },
    });
    assert.equal(
        (await jobs.findByPublicId.execute(jobPublicId))?.jobStatus,
        ResourceSpawnJobStatus.Processing,
    );
    await jobs.update.execute({
        publicId: jobPublicId,
        patch: {
            jobStatus: ResourceSpawnJobStatus.Completed,
            claimExpiresAt: null,
            completedAt: new Date(),
            spawnedWorldObjectPublicId: object.publicId,
        },
    });
    assert.ok(await jobs.softDelete.execute(jobPublicId));
    assert.equal(await jobs.findByPublicId.execute(jobPublicId), null);
    assert.equal((await jobs.list.execute({})).items.length, 0);
    assert.equal(await jobs.softDelete.execute(jobPublicId), false);

    const raceId = randomUUID();
    const raceCache = new RedisEntityCache<{ name: string; }>(namespace, {
        encode: JSON.stringify,
        decode: JSON.parse,
    }, cache);
    let loaded!: () => void;
    let finish!: () => void;
    const started = new Promise<void>(resolve => {
        loaded = resolve;
    });
    const paused = new Promise<void>(resolve => {
        finish = resolve;
    });
    const loading = raceCache.remember(raceId, async () => {
        loaded();
        await paused;
        return { name: "stale" };
    });
    await started;
    await raceCache.invalidate(raceId);
    finish();
    await loading;
    assert.deepEqual(await raceCache.remember(raceId, async () => ({ name: "fresh" })), {
        name: "fresh",
    });
    assert.deepEqual(
        await raceCache.remember(raceId, async () => {
            throw new Error("Must use cache");
        }),
        { name: "fresh" },
    );
    assert.deepEqual(cacheErrors, []);

    assert.ok(await objects.softDelete.execute(object.publicId));
    assert.equal(await objects.findByPublicId.execute(object.publicId), null);
    assert.equal((await cells.list.execute({})).items.length, 0);
    console.info(
        "Repository SQL/Mongo CRUD, transactions, triggers, BSON cache, invalidation and concurrency checks passed",
    );
}
finally
{
    migrationMongoConnections.delete(source);
    if (source.isInitialized)
    {
        await source.destroy();
    }
    if (ownsDatabase)
    {
        await admin.query(`DROP DATABASE "${database}"`);
    }
    if (admin.isInitialized)
    {
        await admin.destroy();
    }
    if (ownsMongo)
    {
        await mongo.dropDatabase();
    }
    await mongo.close();
    try
    {
        let cursor = "0";
        do
        {
            const reply = await redis.send("SCAN", [
                cursor,
                "MATCH",
                `${repositoryConfig.cacheKeyPrefix}:${database}:*`,
                "COUNT",
                "100",
            ]) as [string, string[]];
            cursor = reply[0];
            if (reply[1].length)
            {
                await redis.send("DEL", reply[1]);
            }
        }
        while (cursor !== "0");
    }
    finally
    {
        redis.close();
    }
}
