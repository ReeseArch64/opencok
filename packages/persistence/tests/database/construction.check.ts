import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { connectMongoDB } from "../../src/mongoose";
import { migrationMongoConnections } from "../../src/migrations/support/mongo-connections";
import { buildingConfigurationSchema } from "../../src/schemas/global/building-configuration";
import { BuildingType } from "../../src/enums/building-type";
import { CharacterResource } from "../../src/enums/character-resource";
import { ConstructionJobStatus } from "../../src/enums/construction-job-status";
import { WorldObjectType } from "../../src/enums/world-object-type";
import {
    City,
    Character,
    CharacterResources,
    World,
    WorldObject,
    CityBuilding,
    CommandReceipt,
    ConstructionJob,
    EconomyPosting,
    MutationOutbox,
} from "../../src/models";

const options = persistenceOptions();
const database = kingdomDatabase(randomInt(1_000_000_000, 2_000_000_000));
const admin = createPostgresDataSource("global", options.postgres);
admin.setOptions({ database: "postgres", entities: [], migrations: [] });
const source = createPostgresDataSource(database, options.postgres);
const mongo = await connectMongoDB(options.mongodbUri, { dbName: database });
let ownsDatabase = false;
let ownsMongo = false;
let checks = 0;

async function rejectsSql(statement: string, parameters: unknown[], code: string): Promise<void>
{
    await assert.rejects(
        source.query(statement, parameters),
        (error: { driverError?: { code?: string; }; }) => error.driverError?.code === code,
    );
    checks++;
}

try
{
    await admin.initialize();
    await admin.query(`CREATE DATABASE "${database}"`);
    ownsDatabase = true;
    const databases = await mongo.db!.admin().listDatabases({ nameOnly: true });
    assert.ok(
        !databases.databases.some(entry => entry.name === database),
        "Fixture MongoDB already exists",
    );
    ownsMongo = true;
    await source.initialize();
    migrationMongoConnections.set(source, mongo);
    await source.runMigrations({ transaction: "all" });

    const manager = source.manager;
    await manager.save(World, {});
    const character = await manager.save(Character, {
        accountPublicId: randomUUID(),
        displayName: "Builder",
    });
    const other = await manager.save(Character, {
        accountPublicId: randomUUID(),
        displayName: "Other",
    });
    const object = await manager.save(WorldObject, {
        objectType: WorldObjectType.Castle,
        cellX: 20,
        cellY: 20,
    });
    const otherObject = await manager.save(WorldObject, {
        objectType: WorldObjectType.Castle,
        cellX: 30,
        cellY: 30,
    });
    const city = await manager.save(City, { characterId: character.id, worldObjectId: object.id });
    const otherCity = await manager.save(City, {
        characterId: other.id,
        worldObjectId: otherObject.id,
    });
    const castle = await manager.save(CityBuilding, {
        cityId: city.id,
        buildingType: BuildingType.Castle,
        position: 0,
    });
    const farm = await manager.save(CityBuilding, {
        cityId: city.id,
        buildingType: BuildingType.Farm,
        position: 1,
    });
    for (
        const [position, buildingType] of [
            BuildingType.Sawmill,
            BuildingType.Quarry,
            BuildingType.IronMine,
        ].entries()
    )
    {
        await manager.save(CityBuilding, { cityId: city.id, buildingType, position: position + 2 });
    }
    await manager.save(CharacterResources, { characterId: character.id, wood: "9007199254740993" });
    await rejectsSql(
        "INSERT INTO city_buildings(city_id,building_type,position) VALUES ($1,'castle',9)",
        [city.id],
        "23505",
    );
    await rejectsSql(
        "INSERT INTO city_buildings(city_id,building_type,position) VALUES ($1,'farm',0)",
        [city.id],
        "23505",
    );
    await rejectsSql(
        "INSERT INTO city_buildings(city_id,building_type,position) VALUES ($1,'barracks',9)",
        [city.id],
        "22P02",
    );
    await rejectsSql(
        "INSERT INTO city_buildings(city_id,building_type,position) VALUES ($1,'farm',-1)",
        [city.id],
        "23514",
    );

    const receiptInput = {
        characterId: character.id,
        requestId: randomUUID(),
        command: "construction.start",
        request: Buffer.from("request"),
        response: Buffer.from("confirmed"),
        ownerEpoch: "1",
    };
    const receipt = await manager.save(CommandReceipt, { ...receiptInput });
    const otherReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        characterId: other.id,
    });
    await assert.rejects(manager.insert(CommandReceipt, receiptInput), /duplicate key/);
    const replay = await manager.findOneByOrFail(CommandReceipt, {
        characterId: character.id,
        requestId: receiptInput.requestId,
    });
    assert.equal(replay.id, receipt.id);
    assert.deepEqual(replay.response, receiptInput.response);
    checks += 3;
    await rejectsSql("UPDATE command_receipts SET response=$1 WHERE id=$2", [
        Buffer.from("different"),
        receipt.id,
    ], "23514");
    await rejectsSql("DELETE FROM command_receipts WHERE id=$1", [otherReceipt.id], "23514");

    const startedAt = new Date("2026-01-01T00:00:00Z");
    const completesAt = new Date("2026-01-01T00:01:00Z");
    const jobInput = {
        buildingId: farm.id,
        cityId: city.id,
        characterId: character.id,
        startReceiptId: receipt.id,
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
        fromLevel: 0,
        targetLevel: 1,
        startedAt,
        completesAt,
    };
    const job = await manager.save(ConstructionJob, { ...jobInput });
    await rejectsSql(
        "UPDATE construction_jobs SET character_id=$1 WHERE id=$2",
        [other.id, job.id],
        "23503",
    );
    await rejectsSql(
        "UPDATE construction_jobs SET city_id=$1 WHERE id=$2",
        [otherCity.id, job.id],
        "23503",
    );
    await rejectsSql("UPDATE construction_jobs SET start_receipt_id=$1 WHERE id=$2", [
        otherReceipt.id,
        job.id,
    ], "23503");
    await rejectsSql("UPDATE construction_jobs SET target_level=3 WHERE id=$1", [job.id], "23514");
    await rejectsSql(
        "UPDATE construction_jobs SET completes_at=started_at-interval '1 second' WHERE id=$1",
        [job.id],
        "23514",
    );
    await rejectsSql(
        "UPDATE construction_jobs SET job_status='completed' WHERE id=$1",
        [job.id],
        "23514",
    );
    await rejectsSql(
        "UPDATE construction_jobs SET job_status='completed',completed_at=started_at WHERE id=$1",
        [job.id],
        "23514",
    );
    const nextReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        requestId: randomUUID(),
    });
    await assert.rejects(
        manager.save(ConstructionJob, { ...jobInput, startReceiptId: nextReceipt.id }),
        /duplicate key/,
    );
    await manager.update(ConstructionJob, job.id, { deletedAt: new Date() });
    await assert.rejects(
        manager.save(ConstructionJob, { ...jobInput, startReceiptId: nextReceipt.id }),
        /duplicate key/,
    );
    await manager.update(ConstructionJob, job.id, {
        deletedAt: null,
        jobStatus: ConstructionJobStatus.Completed,
        completedAt: completesAt,
    });
    await manager.update(CityBuilding, farm.id, { level: 1, stateVersion: "1" });
    await rejectsSql(
        "UPDATE construction_jobs SET job_status='pending',completed_at=NULL WHERE id=$1",
        [job.id],
        "23514",
    );
    await rejectsSql(
        "UPDATE construction_jobs SET completed_at=completed_at+interval '1 second' WHERE id=$1",
        [job.id],
        "23514",
    );
    const nextJob = await manager.save(ConstructionJob, {
        ...jobInput,
        startReceiptId: nextReceipt.id,
        fromLevel: 1,
        targetLevel: 2,
    });
    assert.equal(nextJob.jobStatus, ConstructionJobStatus.Pending);
    checks += 3;

    const posting = {
        receiptId: receipt.id,
        entry: 0,
        characterId: character.id,
        resource: CharacterResource.Wood,
        before: "9007199254740993",
        delta: "-100",
        after: "9007199254740893",
        reason: "construction",
    };
    await manager.save(EconomyPosting, { ...posting });
    assert.equal(
        (await manager.findOneByOrFail(EconomyPosting, { receiptId: receipt.id, entry: 0 })).before,
        "9007199254740993",
    );
    await assert.rejects(manager.insert(EconomyPosting, posting), /duplicate key/);
    await assert.rejects(
        manager.insert(EconomyPosting, { ...posting, entry: 1, after: "0" }),
        /economy_posting_balance/,
    );
    await rejectsSql("DELETE FROM economy_postings WHERE receipt_id=$1", [receipt.id], "23514");
    await rejectsSql("UPDATE economy_postings SET reason='changed' WHERE receipt_id=$1", [
        receipt.id,
    ], "23514");
    checks += 3;

    const intent = await manager.save(MutationOutbox, {
        receiptId: receipt.id,
        eventIndex: 0,
        eventType: "construction.started",
        payload: Buffer.from("event"),
    });
    assert.equal(intent.publishedAt, null);
    await rejectsSql("UPDATE mutation_outbox SET payload=$1 WHERE receipt_id=$2", [
        Buffer.from("different"),
        receipt.id,
    ], "23514");
    await rejectsSql("DELETE FROM mutation_outbox WHERE receipt_id=$1", [receipt.id], "23514");
    await manager.update(
        MutationOutbox,
        { receiptId: receipt.id, eventIndex: 0 },
        { attemptCount: 1, nextAttemptAt: new Date(Date.now() + 1000) },
    );
    await rejectsSql(
        "UPDATE mutation_outbox SET attempt_count=0 WHERE receipt_id=$1",
        [receipt.id],
        "23514",
    );
    await source.query("UPDATE mutation_outbox SET published_at=now() WHERE receipt_id=$1", [
        receipt.id,
    ]);
    await rejectsSql("UPDATE mutation_outbox SET published_at=NULL WHERE receipt_id=$1", [
        receipt.id,
    ], "23514");
    checks++;

    const rollbackRequest = randomUUID();
    await assert.rejects(
        source.transaction(async transaction => {
            const rollbackReceipt = await transaction.save(CommandReceipt, {
                ...receiptInput,
                requestId: rollbackRequest,
            });
            await transaction.update(
                CharacterResources,
                { characterId: character.id },
                { wood: "9007199254740893" },
            );
            await transaction.save(EconomyPosting, { ...posting, receiptId: rollbackReceipt.id });
            await transaction.save(MutationOutbox, {
                receiptId: rollbackReceipt.id,
                eventIndex: 0,
                eventType: "test.rollback",
                payload: Buffer.from("rollback"),
            });
            await transaction.save(ConstructionJob, {
                ...jobInput,
                buildingId: castle.id,
                startReceiptId: rollbackReceipt.id,
            });
            throw new Error("forced rollback");
        }),
        /forced rollback/,
    );
    assert.equal(await manager.countBy(CommandReceipt, { requestId: rollbackRequest }), 0);
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "9007199254740993",
    );
    assert.equal(await manager.countBy(ConstructionJob, { buildingId: castle.id }), 0);
    assert.equal(await manager.count(EconomyPosting), 1);
    assert.equal(await manager.count(MutationOutbox), 1);
    checks += 5;

    const Configuration = mongo.model("BuildingConfiguration", buildingConfigurationSchema);
    await Configuration.createCollection();
    await Configuration.createIndexes();
    const configuration = {
        schemaVersion: 1,
        configurationVersion: 1,
        buildingType: BuildingType.Castle,
        level: 1,
        maxInstances: 1,
        constructionSeconds: 60,
        costs: {
            wood: "9007199254740993",
            food: "0",
            stone: "0",
            iron: "0",
            silver: "0",
            gold: "0",
            crystals: "0",
        },
        requiredBuildings: [],
    };
    const publication = await Configuration.create(configuration);
    await assert.rejects(Configuration.create(configuration), /duplicate key/);
    await Configuration.create({ ...configuration, configurationVersion: 2 });
    publication.requiredBuildings.push({ buildingType: BuildingType.Farm, level: 1 });
    await assert.rejects(publication.save(), /imutáveis/);
    await assert.rejects(
        Configuration.updateOne({ _id: publication._id }, { $set: { "costs.wood": "0" } }).exec(),
        /imutáveis/,
    );
    const retained = await Configuration.findById(publication._id).orFail();
    assert.equal(retained.costs.wood, "9007199254740993");
    assert.equal(retained.requiredBuildings.length, 0);
    checks += 5;

    const drift = await source.driver.createSchemaBuilder().log();
    assert.deepEqual(
        drift.upQueries.map(query => query.query),
        [],
        "Applied schema differs from models",
    );
    await source.undoLastMigration({ transaction: "all" });
    assert.equal(
        (await source.query("SELECT to_regclass('city_buildings') AS table_name"))[0].table_name,
        null,
    );
    await source.runMigrations({ transaction: "all" });
    assert.equal((await source.driver.createSchemaBuilder().log()).upQueries.length, 0);
    checks += 3;
    console.info(
        `${checks} construction persistence checks passed; migration rollback/reapply verified; zero schema drift`,
    );
}
finally
{
    migrationMongoConnections.delete(source);
    if (source.isInitialized)
    {
        await source.destroy();
    }
    if (ownsMongo)
    {
        await mongo.dropDatabase();
    }
    await mongo.close();
    if (ownsDatabase)
    {
        await admin.query(`DROP DATABASE "${database}"`);
    }
    if (admin.isInitialized)
    {
        await admin.destroy();
    }
}
