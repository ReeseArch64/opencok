import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { connectMongoDB } from "../../src/mongoose";
import { migrationMongoConnections } from "../../src/migrations/support/mongo-connections";
import { troopConfigurationSchema } from "../../src/schemas/global/troop-configuration";
import { marchConfigurationSchema } from "../../src/schemas/global/march-configuration";
import { TroopType } from "../../src/enums/troop-type";
import { BuildingType } from "../../src/enums/building-type";
import { CharacterResource } from "../../src/enums/character-resource";
import { ResourceType } from "../../src/enums/resource-type";
import { WorldObjectType } from "../../src/enums/world-object-type";
import { WorldMarchStatus } from "../../src/enums/world-march-status";
import { GatheringJobStatus } from "../../src/enums/gathering-job-status";
import { MarchCheckpointStatus } from "../../src/enums/march-checkpoint-status";
import {
    World,
    WorldObject,
    Character,
    City,
    CityBuilding,
    CharacterResources,
    BuildingProduction,
    CharacterTroops,
    WorldResourceDeposit,
    CommandReceipt,
    WorldMarch,
    WorldMarchTroop,
    WorldMarchCheckpoint,
    GatheringJob,
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
        displayName: "Gatherer",
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
    await manager.save(CharacterResources, { characterId: character.id });
    const farm = await manager.save(CityBuilding, {
        cityId: city.id,
        buildingType: BuildingType.Farm,
        position: 1,
        level: 1,
    });
    const startedAt = new Date("2026-11-01T00:00:00Z");
    const arrivesAt = new Date("2026-11-01T00:01:00Z");
    const completesAt = new Date("2026-11-01T00:02:00Z");
    const returnsAt = new Date("2026-11-01T00:03:00Z");
    const productionInput = {
        buildingId: farm.id,
        cityId: city.id,
        characterId: character.id,
        buildingType: BuildingType.Farm,
        resource: CharacterResource.Food,
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
        settledAt: startedAt,
        perHour: "9007199254740993",
        capacity: "9223372036854775807",
    };
    const production = await manager.save(BuildingProduction, { ...productionInput });
    assert.equal(production.perHour, "9007199254740993");
    await assert.rejects(manager.insert(BuildingProduction, productionInput), /duplicate key/);
    await rejectsSql("UPDATE building_productions SET amount=-1 WHERE id=$1", [production.id]);
    await rejectsSql("UPDATE building_productions SET amount=1,capacity=0 WHERE id=$1", [
        production.id,
    ]);
    await rejectsSql("UPDATE building_productions SET remainder=3600000 WHERE id=$1", [
        production.id,
    ]);
    await rejectsSql(
        "UPDATE building_productions SET settled_at=settled_at-interval '1 second' WHERE id=$1",
        [production.id],
    );
    await rejectsSql("UPDATE building_productions SET resource='wood' WHERE id=$1", [
        production.id,
    ]);
    await rejectsSql("UPDATE building_productions SET character_id=$1 WHERE id=$2", [
        other.id,
        production.id,
    ]);
    const secondFarm = await manager.save(CityBuilding, {
        cityId: city.id,
        buildingType: BuildingType.Farm,
        position: 2,
        level: 1,
    });
    await assert.rejects(
        manager.insert(BuildingProduction, {
            ...productionInput,
            buildingId: secondFarm.id,
            characterId: other.id,
        }),
        /building_production_owner/,
    );
    checks += 3;

    for (const troopType of Object.values(TroopType))
    {
        for (let tier = 1; tier <= 10; tier++)
        {
            await manager.save(CharacterTroops, {
                characterId: character.id,
                troopType,
                tier,
                available: "100",
            });
        }
    }
    assert.equal(await manager.count(CharacterTroops), 40);
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
    for (const tier of [0, 11])
    {
        await assert.rejects(
            manager.insert(CharacterTroops, {
                characterId: other.id,
                troopType: TroopType.Cavalry,
                tier,
            }),
            /character_troops_tier/,
        );
    }
    await rejectsSql("UPDATE character_troops SET available=-1 WHERE id=$1", [troops.id]);
    await rejectsSql("UPDATE character_troops SET marching=-1 WHERE id=$1", [troops.id]);
    await assert.rejects(
        manager.insert(CharacterTroops, {
            characterId: character.id,
            troopType: TroopType.Infantry,
            tier: 1,
        }),
        /duplicate key/,
    );
    checks += 4;

    const depositObject = await manager.save(WorldObject, {
        objectType: WorldObjectType.WoodResource,
        cellX: 21,
        cellY: 21,
    });
    const deposit = await manager.save(WorldResourceDeposit, {
        worldObjectId: depositObject.id,
        resourceType: ResourceType.Wood,
        configurationPublicId: randomUUID(),
        initialQuantity: "1000",
        remainingQuantity: "1000",
    });
    const receiptInput = {
        characterId: character.id,
        requestId: randomUUID(),
        command: "march.start",
        request: Buffer.from("request"),
        response: Buffer.from("accepted"),
        ownerEpoch: "1",
    };
    const receipt = await manager.save(CommandReceipt, { ...receiptInput });
    const marchInput = {
        cityId: city.id,
        characterId: character.id,
        startReceiptId: receipt.id,
        depositId: deposit.id,
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
        originX: 20,
        originY: 20,
        targetX: 21,
        targetY: 21,
        carryCapacity: "100",
        startedAt,
        arrivesAt,
        dueAt: arrivesAt,
    };
    const march = await manager.save(WorldMarch, { ...marchInput });
    await assert.rejects(manager.insert(WorldMarch, marchInput), /duplicate key/);
    await rejectsSql("UPDATE world_marches SET target_x=0 WHERE id=$1", [march.id]);
    await rejectsSql(
        "UPDATE world_marches SET arrives_at=started_at-interval '1 second' WHERE id=$1",
        [march.id],
    );
    await rejectsSql("UPDATE world_marches SET march_status='gathering' WHERE id=$1", [march.id]);
    await manager.save(WorldMarchTroop, {
        marchId: march.id,
        characterId: character.id,
        characterTroopsId: troops.id,
        quantity: "10",
        configurationPublicId: randomUUID(),
        configurationVersion: 1,
    });
    await assert.rejects(
        manager.insert(WorldMarchTroop, {
            marchId: march.id,
            characterId: character.id,
            characterTroopsId: foreignTroops.id,
            quantity: "10",
            configurationPublicId: randomUUID(),
            configurationVersion: 1,
        }),
        /world_march_troop_owner/,
    );
    await rejectsSql("UPDATE world_march_troops SET quantity=20 WHERE march_id=$1", [march.id]);
    const checkpoint = await manager.save(WorldMarchCheckpoint, {
        marchId: march.id,
        characterId: character.id,
        marchVersion: "1",
        marchStatus: WorldMarchStatus.Outbound,
        dueAt: arrivesAt,
    });
    await assert.rejects(
        manager.insert(WorldMarchCheckpoint, {
            marchId: march.id,
            characterId: character.id,
            marchVersion: "2",
            marchStatus: WorldMarchStatus.Outbound,
            dueAt: arrivesAt,
        }),
        /Checkpoint must match/,
    );
    await assert.rejects(
        manager.insert(WorldMarchCheckpoint, {
            marchId: march.id,
            characterId: character.id,
            marchVersion: "1",
            marchStatus: WorldMarchStatus.Outbound,
            dueAt: arrivesAt,
        }),
        /duplicate key/,
    );
    checks += 4;

    await manager.update(CharacterTroops, troops.id, {
        available: "90",
        marching: "10",
        stateVersion: "1",
    });
    const arrivalReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        requestId: randomUUID(),
        command: "march.arrive",
    });
    await source.transaction(async transaction => {
        await transaction.update(WorldMarchCheckpoint, checkpoint.id, {
            checkpointStatus: MarchCheckpointStatus.Completed,
            processedAt: arrivesAt,
            receiptId: arrivalReceipt.id,
        });
        await transaction.update(WorldMarch, march.id, {
            marchStatus: WorldMarchStatus.Gathering,
            dueAt: completesAt,
            stateVersion: "2",
        });
        await transaction.save(WorldMarchCheckpoint, {
            marchId: march.id,
            characterId: character.id,
            marchVersion: "2",
            marchStatus: WorldMarchStatus.Gathering,
            dueAt: completesAt,
        });
    });
    await rejectsSql(
        "UPDATE world_march_checkpoints SET checkpoint_status='pending',processed_at=NULL,receipt_id=NULL WHERE id=$1",
        [checkpoint.id],
    );
    const jobInput = {
        marchId: march.id,
        characterId: character.id,
        depositId: deposit.id,
        resourceType: ResourceType.Wood,
        perHour: "6000",
        capacity: "100",
        startedAt: arrivesAt,
        settledAt: arrivesAt,
        completesAt,
    };
    await assert.rejects(
        manager.insert(GatheringJob, { ...jobInput, resourceType: ResourceType.Food }),
        /Gathering deposit must/,
    );
    await assert.rejects(
        manager.insert(GatheringJob, { ...jobInput, capacity: "101" }),
        /Gathering must start/,
    );
    checks += 2;
    const job = await manager.save(GatheringJob, { ...jobInput });
    await assert.rejects(manager.insert(GatheringJob, jobInput), /duplicate key/);
    await rejectsSql("UPDATE gathering_jobs SET collected_quantity=101 WHERE id=$1", [job.id]);
    await rejectsSql(
        "UPDATE gathering_jobs SET settled_at=started_at-interval '1 second' WHERE id=$1",
        [job.id],
    );
    await rejectsSql("UPDATE gathering_jobs SET resource_type='food' WHERE id=$1", [job.id]);
    const secondReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        requestId: randomUUID(),
    });
    const secondMarch = await manager.save(WorldMarch, {
        ...marchInput,
        startReceiptId: secondReceipt.id,
    });
    await manager.update(WorldMarch, secondMarch.id, {
        marchStatus: WorldMarchStatus.Gathering,
        dueAt: completesAt,
        stateVersion: "2",
    });
    await assert.rejects(
        manager.insert(GatheringJob, { ...jobInput, marchId: secondMarch.id }),
        /duplicate key/,
    );
    checks += 2;

    await manager.update(BuildingProduction, production.id, {
        amount: "9007199254740993",
        remainder: "3599999",
        settledAt: completesAt,
        stateVersion: "1",
    });
    await rejectsSql("UPDATE building_productions SET state_version=0 WHERE id=$1", [
        production.id,
    ]);
    await source.destroy();
    await source.initialize();
    const retainedProduction = await manager.findOneByOrFail(BuildingProduction, {
        id: production.id,
    });
    assert.equal(retainedProduction.amount, "9007199254740993");
    assert.equal(retainedProduction.remainder, "3599999");
    assert.deepEqual(retainedProduction.settledAt, completesAt);
    checks += 3;
    assert.equal(
        (await manager.findOneByOrFail(WorldMarch, { id: march.id })).marchStatus,
        WorldMarchStatus.Gathering,
    );
    assert.equal(
        await manager.countBy(WorldMarchCheckpoint, {
            marchId: march.id,
            checkpointStatus: MarchCheckpointStatus.Pending,
        }),
        1,
    );
    const finishReceipt = await manager.save(CommandReceipt, {
        ...receiptInput,
        requestId: randomUUID(),
        command: "gathering.complete",
    });
    await source.transaction(async transaction => {
        await transaction.update(WorldResourceDeposit, deposit.id, { remainingQuantity: "900" });
        await transaction.update(GatheringJob, job.id, {
            collectedQuantity: "100",
            settledAt: completesAt,
            completedAt: completesAt,
            jobStatus: GatheringJobStatus.Completed,
        });
        await transaction.update(
            WorldMarchCheckpoint,
            { marchId: march.id, marchVersion: "2" },
            {
                checkpointStatus: MarchCheckpointStatus.Completed,
                processedAt: completesAt,
                receiptId: finishReceipt.id,
            },
        );
        await transaction.update(WorldMarch, march.id, {
            marchStatus: WorldMarchStatus.Returning,
            returnStartedAt: completesAt,
            returnsAt,
            dueAt: returnsAt,
            stateVersion: "3",
        });
        await transaction.save(WorldMarchCheckpoint, {
            marchId: march.id,
            characterId: character.id,
            marchVersion: "3",
            marchStatus: WorldMarchStatus.Returning,
            dueAt: returnsAt,
        });
    });
    await rejectsSql(
        "UPDATE gathering_jobs SET job_status='gathering',completed_at=NULL WHERE id=$1",
        [job.id],
    );
    await rejectsSql("UPDATE gathering_jobs SET collected_quantity=99 WHERE id=$1", [job.id]);
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "0",
    );
    assert.equal(
        (await manager.findOneByOrFail(WorldResourceDeposit, { id: deposit.id })).remainingQuantity,
        "900",
    );
    checks += 4;

    const completionRequestId = randomUUID();
    async function deliver(fail: boolean): Promise<void>
    {
        await source.transaction(async transaction => {
            const completion = await transaction.save(CommandReceipt, {
                ...receiptInput,
                requestId: completionRequestId,
                command: "march.complete",
            });
            await transaction.update(WorldMarch, march.id, {
                marchStatus: WorldMarchStatus.Completed,
                completedAt: returnsAt,
                completionReceiptId: completion.id,
                stateVersion: "4",
            });
            await transaction.update(
                WorldMarchCheckpoint,
                { marchId: march.id, marchVersion: "3" },
                {
                    checkpointStatus: MarchCheckpointStatus.Completed,
                    processedAt: returnsAt,
                    receiptId: completion.id,
                },
            );
            await transaction.update(CharacterTroops, troops.id, {
                available: "100",
                marching: "0",
                stateVersion: "2",
            });
            await transaction.update(
                CharacterResources,
                { characterId: character.id },
                { wood: "100" },
            );
            await transaction.save(EconomyPosting, {
                receiptId: completion.id,
                entry: 0,
                characterId: character.id,
                resource: CharacterResource.Wood,
                before: "0",
                delta: "100",
                after: "100",
                reason: "gathering.return",
            });
            if (fail)
            {
                throw new Error("forced rollback");
            }
        });
    }
    await assert.rejects(deliver(true), /forced rollback/);
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "0",
    );
    assert.equal(
        (await manager.findOneByOrFail(CharacterTroops, { id: troops.id })).marching,
        "10",
    );
    assert.equal(
        (await manager.findOneByOrFail(WorldMarch, { id: march.id })).marchStatus,
        WorldMarchStatus.Returning,
    );
    const competing = await Promise.allSettled([deliver(false), deliver(false)]);
    assert.equal(competing.filter(result => result.status === "fulfilled").length, 1);
    assert.equal(await manager.count(EconomyPosting), 1);
    assert.equal(
        (await manager.findOneByOrFail(CharacterResources, { characterId: character.id })).wood,
        "100",
    );
    assert.equal(
        (await manager.findOneByOrFail(CharacterTroops, { id: troops.id })).available,
        "100",
    );
    await rejectsSql(
        "UPDATE world_marches SET march_status='returning',completed_at=NULL,completion_receipt_id=NULL WHERE id=$1",
        [march.id],
    );
    await rejectsSql("DELETE FROM world_marches WHERE id=$1", [march.id]);
    checks += 8;

    const Troop = mongo.model("TroopConfiguration", troopConfigurationSchema);
    const March = mongo.model("MarchConfiguration", marchConfigurationSchema);
    await Troop.createCollection();
    await Troop.createIndexes();
    await March.createCollection();
    await March.createIndexes();
    const troopPublication = {
        schemaVersion: 1 as const,
        configurationVersion: 1,
        troopType: TroopType.Infantry,
        tier: 1,
        speedCellsPerHour: 30,
        carryCapacity: "9007199254740993",
    };
    const published = await Troop.create(troopPublication);
    await assert.rejects(Troop.create(troopPublication), /duplicate key/);
    await Troop.create({ ...troopPublication, configurationVersion: 2 });
    assert.equal((await Troop.findById(published._id).orFail()).carryCapacity, "9007199254740993");
    await assert.rejects(Troop.deleteMany({}).exec(), /imutáveis/);
    const marchPublication = {
        schemaVersion: 1 as const,
        configurationVersion: 1,
        maxActiveMarches: 1,
        maxTroopsPerMarch: 1000,
        gatheringRates: [{ resourceType: ResourceType.Wood, perTroopPerHour: "100" }],
    };
    const publishedMarch = await March.create(marchPublication);
    await assert.rejects(March.create(marchPublication), /duplicate key/);
    publishedMarch.gatheringRates.push({ resourceType: ResourceType.Food, perTroopPerHour: "1" });
    await assert.rejects(publishedMarch.save(), /imutáveis/);
    checks += 5;

    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    while ((await source.query("SELECT to_regclass('world_marches') AS name"))[0].name != null)
    {
        await source.undoLastMigration({ transaction: "all" });
    }
    assert.equal((await source.query("SELECT to_regclass('world_marches') AS name"))[0].name, null);
    assert.notEqual(
        (await source.query("SELECT to_regclass('city_buildings') AS name"))[0].name,
        null,
    );
    await source.runMigrations({ transaction: "all" });
    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    checks += 4;
    console.info(
        `${checks} basic gathering persistence checks passed; restart, concurrent retry, rollback/reapply and zero schema drift verified`,
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
