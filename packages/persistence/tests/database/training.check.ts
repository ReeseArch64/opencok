import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { connectMongoDB } from "../../src/mongoose";
import { migrationMongoConnections } from "../../src/migrations/support/mongo-connections";
import { troopTrainingConfigurationSchema } from "../../src/schemas/global/troop-training-configuration";
import { buildingConfigurationSchema } from "../../src/schemas/global/building-configuration";
import { BuildingType } from "../../src/enums/building-type";
import { TroopType } from "../../src/enums/troop-type";
import { CharacterResource } from "../../src/enums/character-resource";
import { WorldObjectType } from "../../src/enums/world-object-type";
import { TrainingJobStatus } from "../../src/enums/training-job-status";
import {
    World,
    WorldObject,
    Character,
    City,
    CityBuilding,
    BuildingProduction,
    CharacterResources,
    CharacterTroops,
    TrainingJob,
    CommandReceipt,
    EconomyPosting,
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

async function rejectsSql(statement: string, parameters: unknown[], code = "23514"): Promise<void>
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
    assert.ok(!databases.databases.some(entry => entry.name === database));
    ownsMongo = true;
    await source.initialize();
    migrationMongoConnections.set(source, mongo);
    await source.runMigrations({ transaction: "all" });
    const manager = source.manager;
    await manager.save(World, {});
    const character = await manager.save(Character, {
        accountPublicId: randomUUID(),
        displayName: "Trainer",
    });
    const other = await manager.save(Character, {
        accountPublicId: randomUUID(),
        displayName: "Other",
    });
    const castle = await manager.save(WorldObject, {
        objectType: WorldObjectType.Castle,
        cellX: 20,
        cellY: 20,
    });
    const city = await manager.save(City, { characterId: character.id, worldObjectId: castle.id });
    await manager.save(CharacterResources, { characterId: character.id, wood: "1000" });
    const farm = await manager.save(CityBuilding, {
        cityId: city.id,
        buildingType: BuildingType.Farm,
        position: 0,
        level: 1,
    });
    const startedAt = new Date("2026-11-01T00:00:00Z");
    const completesAt = new Date("2026-11-01T00:00:20Z");
    const production = await manager.save(BuildingProduction, {
        buildingId: farm.id,
        cityId: city.id,
        characterId: character.id,
        buildingType: BuildingType.Farm,
        resource: CharacterResource.Food,
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
        settledAt: startedAt,
        perHour: "100",
        capacity: "1000",
        amount: "23",
        remainder: "100",
    });
    while (
        (await source.query("SELECT name FROM typeorm_migrations ORDER BY id DESC LIMIT 1"))[0].name
        !== "CreateTrainingPersistence1794438015000"
    )
    {
        await source.undoLastMigration({ transaction: "all" });
    }
    await source.undoLastMigration({ transaction: "all" });
    const baseTypes = await source.query("SELECT enum_range(NULL::building_type)::text AS values");
    assert.equal(baseTypes[0].values, "{castle,farm,sawmill,quarry,iron_mine}");
    assert.equal(
        (await manager.findOneByOrFail(BuildingProduction, { id: production.id })).amount,
        "23",
    );
    assert.equal(
        (await manager.findOneByOrFail(CityBuilding, { id: farm.id })).buildingType,
        BuildingType.Farm,
    );
    await source.runMigrations({ transaction: "all" });
    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    checks += 4;

    const military = [
        [BuildingType.Barracks, TroopType.Infantry],
        [BuildingType.Stable, TroopType.Cavalry],
        [BuildingType.ArcheryRange, TroopType.Archer],
        [BuildingType.SiegeWorkshop, TroopType.Siege],
    ] as const;
    const buildings: CityBuilding[] = [];
    for (const [position, [buildingType]] of military.entries())
    {
        buildings.push(
            await manager.save(CityBuilding, {
                cityId: city.id,
                buildingType,
                position: position + 1,
                level: 10,
            }),
        );
    }
    const barracks = buildings[0];
    assert.ok(barracks);
    for (const troopType of Object.values(TroopType))
    {
        for (let tier = 1; tier <= 10; tier++)
        {
            await manager.save(CharacterTroops, { characterId: character.id, troopType, tier });
        }
    }
    const troops = await manager.findOneByOrFail(CharacterTroops, {
        characterId: character.id,
        troopType: TroopType.Infantry,
        tier: 1,
    });
    const foreignTroops = await manager.save(CharacterTroops, {
        characterId: other.id,
        troopType: TroopType.Infantry,
        tier: 1,
    });
    const cavalry = await manager.findOneByOrFail(CharacterTroops, {
        characterId: character.id,
        troopType: TroopType.Cavalry,
        tier: 1,
    });
    const receiptInput = {
        characterId: character.id,
        command: "training.start",
        request: Buffer.from("request"),
        response: Buffer.from("accepted"),
        ownerEpoch: "1",
    };
    const jobInput = {
        buildingId: barracks.id,
        cityId: city.id,
        characterId: character.id,
        buildingType: BuildingType.Barracks,
        characterTroopsId: troops.id,
        troopType: TroopType.Infantry,
        tier: 1,
        quantity: "10",
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
        requiredBuildingLevel: 1,
        maxBatchSize: 100,
        trainingSecondsPerUnit: 2,
        startedAt,
        completesAt,
    };
    async function start(requestId: string): Promise<TrainingJob>
    {
        return source.transaction(async transaction => {
            const receipt = await transaction.save(CommandReceipt, { ...receiptInput, requestId });
            const balances = await transaction.query(
                "WITH balance AS (UPDATE character_resources SET wood=wood-100 WHERE character_id=$1 AND wood>=100 RETURNING wood) SELECT wood FROM balance",
                [character.id],
            );
            assert.equal(balances.length, 1);
            const after = String(balances[0].wood);
            await transaction.save(EconomyPosting, {
                receiptId: receipt.id,
                entry: 0,
                characterId: character.id,
                resource: CharacterResource.Wood,
                before: String(BigInt(after) + 100n),
                delta: "-100",
                after,
                reason: "training.start",
            });
            return transaction.save(TrainingJob, { ...jobInput, startReceiptId: receipt.id });
        });
    }
    const starts = await Promise.allSettled([start(randomUUID()), start(randomUUID())]);
    assert.equal(starts.filter(result => result.status === "fulfilled").length, 1);
    for (const result of starts)
    {
        if (result.status === "rejected")
        {
            assert.match(String(result.reason), /training_job_pending_building/);
        }
    }
    const job = await manager.findOneByOrFail(TrainingJob, { buildingId: barracks.id });
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "900",
    );
    assert.equal(await manager.count(EconomyPosting), 1);
    assert.equal(await manager.count(CommandReceipt), 1);
    assert.equal(job.quantity, "10");
    checks += 5;
    const receipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        requestId: randomUUID(),
    });
    for (
        const patch of [
            { quantity: "0" },
            { quantity: "101" },
            { tier: 0 },
            { tier: 11 },
            { requiredBuildingLevel: 11 },
            { maxBatchSize: 0 },
            { trainingSecondsPerUnit: 0 },
            { completesAt: startedAt },
            { characterId: other.id },
            { characterTroopsId: foreignTroops.id },
            { buildingId: farm.id, buildingType: BuildingType.Farm },
            { troopType: TroopType.Cavalry, characterTroopsId: cavalry.id },
            { buildingType: BuildingType.Stable },
        ]
    )
    {
        await assert.rejects(
            manager.insert(TrainingJob, { ...jobInput, startReceiptId: receipt.id, ...patch }),
        );
        checks++;
    }
    await manager.update(CityBuilding, barracks.id, { archivedAt: new Date() });
    await assert.rejects(
        manager.insert(TrainingJob, { ...jobInput, startReceiptId: receipt.id }),
        /active owned building/,
    );
    await manager.update(CityBuilding, barracks.id, { archivedAt: null });
    await manager.update(TrainingJob, job.id, { deletedAt: new Date() });
    await assert.rejects(
        manager.insert(TrainingJob, { ...jobInput, startReceiptId: receipt.id }),
        /duplicate key/,
    );
    await manager.update(TrainingJob, job.id, { deletedAt: null });
    await rejectsSql("UPDATE training_jobs SET quantity=20 WHERE id=$1", [job.id]);
    await rejectsSql(
        "UPDATE training_jobs SET completes_at=completes_at+interval '1 second' WHERE id=$1",
        [job.id],
    );
    await rejectsSql("UPDATE training_jobs SET job_status='completed' WHERE id=$1", [job.id]);
    await rejectsSql(
        "UPDATE training_jobs SET job_status='completed',completed_at=started_at,completion_receipt_id=$1 WHERE id=$2",
        [receipt.id, job.id],
    );
    const foreignReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        characterId: other.id,
        requestId: randomUUID(),
    });
    await rejectsSql(
        "UPDATE training_jobs SET job_status='completed',completed_at=completes_at,completion_receipt_id=$1 WHERE id=$2",
        [foreignReceipt.id, job.id],
        "23503",
    );
    await rejectsSql("DELETE FROM training_jobs WHERE id=$1", [job.id]);
    checks += 2;

    await source.destroy();
    await source.initialize();
    const resumed = await manager.findOneByOrFail(TrainingJob, { id: job.id });
    assert.equal(resumed.jobStatus, TrainingJobStatus.Pending);
    assert.deepEqual(resumed.completesAt, completesAt);
    assert.equal(
        (await manager.findOneByOrFail(CharacterTroops, { id: troops.id })).available,
        "0",
    );
    checks += 3;
    async function complete(requestId: string, fail = false): Promise<void>
    {
        await source.transaction(async transaction => {
            const completion = await transaction.save(CommandReceipt, {
                ...receiptInput,
                command: "training.complete",
                requestId,
            });
            await transaction.update(TrainingJob, job.id, {
                jobStatus: TrainingJobStatus.Completed,
                completedAt: completesAt,
                completionReceiptId: completion.id,
            });
            await transaction.query(
                "UPDATE character_troops SET available=available+$1,state_version=state_version+1 WHERE id=$2",
                [job.quantity, troops.id],
            );
            if (fail)
            {
                throw new Error("forced rollback");
            }
        });
    }
    await assert.rejects(complete(randomUUID(), true), /forced rollback/);
    assert.equal(
        (await manager.findOneByOrFail(CharacterTroops, { id: troops.id })).available,
        "0",
    );
    assert.equal(
        (await manager.findOneByOrFail(TrainingJob, { id: job.id })).jobStatus,
        TrainingJobStatus.Pending,
    );
    const completions = await Promise.allSettled([complete(randomUUID()), complete(randomUUID())]);
    assert.equal(completions.filter(result => result.status === "fulfilled").length, 1);
    for (const result of completions)
    {
        if (result.status === "rejected")
        {
            assert.match(String(result.reason), /Completed training cannot be reopened/);
        }
    }
    assert.equal(
        (await manager.findOneByOrFail(CharacterTroops, { id: troops.id })).available,
        "10",
    );
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "900",
    );
    assert.equal(await manager.count(EconomyPosting), 1);
    await rejectsSql(
        "UPDATE training_jobs SET job_status='pending',completed_at=NULL,completion_receipt_id=NULL WHERE id=$1",
        [job.id],
    );
    checks += 7;

    for (const [index, [buildingType, troopType]] of military.entries())
    {
        const trainingBuilding = buildings[index];
        assert.ok(trainingBuilding);
        const tierTen = await manager.findOneByOrFail(CharacterTroops, {
            characterId: character.id,
            troopType,
            tier: 10,
        });
        const startReceipt = await manager.save(CommandReceipt, {
            ...receiptInput,
            requestId: randomUUID(),
        });
        const next = await manager.save(TrainingJob, {
            ...jobInput,
            buildingId: trainingBuilding.id,
            buildingType,
            characterTroopsId: tierTen.id,
            troopType,
            tier: 10,
            startReceiptId: startReceipt.id,
        });
        assert.equal(next.jobStatus, TrainingJobStatus.Pending);
        checks++;
    }
    while (
        (await source.query("SELECT name FROM typeorm_migrations ORDER BY id DESC LIMIT 1"))[0].name
        !== "CreateTrainingPersistence1794438015000"
    )
    {
        await source.undoLastMigration({ transaction: "all" });
    }
    await assert.rejects(
        source.undoLastMigration({ transaction: "all" }),
        /explicit handling of existing military buildings/,
    );
    await source.runMigrations({ transaction: "all" });
    assert.equal(await manager.count(TrainingJob), 5);
    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    checks += 3;

    const Training = mongo.model("TroopTrainingConfiguration", troopTrainingConfigurationSchema);
    const Building = mongo.model("BuildingConfiguration", buildingConfigurationSchema);
    await Training.createCollection();
    await Training.createIndexes();
    await Building.createCollection();
    await Building.createIndexes();
    const unitCosts = {
        wood: "9007199254740993",
        food: "0",
        stone: "0",
        iron: "0",
        silver: "0",
        gold: "0",
        crystals: "0",
    };
    const configuration = {
        schemaVersion: 1 as const,
        configurationVersion: 1,
        troopType: TroopType.Infantry,
        tier: 1,
        requiredBuildingLevel: 1,
        trainingSecondsPerUnit: 2,
        unitCosts,
    };
    const publication = await Training.create(configuration);
    await assert.rejects(Training.create(configuration), /duplicate key/);
    await Training.create({ ...configuration, configurationVersion: 2 });
    assert.equal(
        (await Training.findById(publication._id).orFail()).unitCosts.wood,
        "9007199254740993",
    );
    await assert.rejects(
        Training.updateOne({}, { $set: { trainingSecondsPerUnit: 1 } }).exec(),
        /imutáveis/,
    );
    await assert.rejects(Training.deleteMany({}).exec(), /imutáveis/);
    const barracksConfiguration = await Building.create({
        schemaVersion: 1,
        configurationVersion: 1,
        buildingType: BuildingType.Barracks,
        level: 1,
        maxInstances: 1,
        constructionSeconds: 60,
        costs: unitCosts,
        requiredBuildings: [],
        training: { troopType: TroopType.Infantry, maxBatchSize: 100 },
    });
    assert.equal(barracksConfiguration.production, null);
    assert.equal(barracksConfiguration.training?.maxBatchSize, 100);
    checks += 6;
    console.info(
        `${checks} training persistence checks passed; concurrent start/completion, restart, rollback/reapply, enum preservation and zero schema drift verified`,
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
