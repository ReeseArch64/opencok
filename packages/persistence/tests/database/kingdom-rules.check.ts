import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { connectMongoDB } from "../../src/mongoose";
import { migrationMongoConnections } from "../../src/migrations/support/mongo-connections";
import { cityInitialConfigurationSchema } from "../../src/schemas/global/city-initial-configuration";
import { RealmAuthority, KingdomRuleSet } from "../../src/models";
import { BuildingType } from "../../src/enums/building-type";

const options = persistenceOptions();
const database = kingdomDatabase(randomInt(1_000_000_000, 2_000_000_000));
const admin = createPostgresDataSource("global", options.postgres);
admin.setOptions({ database: "postgres", entities: [], migrations: [] });
const source = createPostgresDataSource(database, options.postgres);
const mongo = await connectMongoDB(options.mongodbUri, { dbName: database });
let ownsDatabase = false;
let ownsMongo = false;

async function rejectsSql(
    statement: string,
    parameters: unknown[] = [],
    code = "23514",
): Promise<void>
{
    await assert.rejects(
        source.query(statement, parameters),
        (error: { driverError?: { code?: string; }; }) => error.driverError?.code === code,
    );
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
    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    const now = new Date("2026-11-01T00:00:00Z");
    const instanceId = randomUUID();
    await source.manager.insert(RealmAuthority, {
        ownerEpoch: "9007199254740993",
        instanceId,
        acquiredAt: now,
    });
    const authority = await source.manager.findOneByOrFail(RealmAuthority, { id: 1 });
    assert.equal(authority.ownerEpoch, "9007199254740993");
    await rejectsSql("INSERT INTO realm_authority VALUES (2, 1, $1, $2)", [instanceId, now]);
    await rejectsSql(
        "INSERT INTO realm_authority VALUES (1, 1, $1, $2)",
        [instanceId, now],
        "23505",
    );
    await rejectsSql("UPDATE realm_authority SET owner_epoch = owner_epoch - 1");
    await rejectsSql("UPDATE realm_authority SET instance_id = $1", [randomUUID()]);
    await rejectsSql("UPDATE realm_authority SET owner_epoch = owner_epoch + 2");
    await rejectsSql(
        "UPDATE realm_authority SET owner_epoch = owner_epoch + 1, acquired_at = acquired_at - interval '1 second'",
    );
    await rejectsSql("DELETE FROM realm_authority");
    const acquisitions = await Promise.all([
        source.query(
            "UPDATE realm_authority SET owner_epoch = owner_epoch + 1, instance_id = $1 WHERE owner_epoch = $2 RETURNING owner_epoch",
            [randomUUID(), authority.ownerEpoch],
        ),
        source.query(
            "UPDATE realm_authority SET owner_epoch = owner_epoch + 1, instance_id = $1 WHERE owner_epoch = $2 RETURNING owner_epoch",
            [randomUUID(), authority.ownerEpoch],
        ),
    ]);
    assert.equal(acquisitions.reduce((sum, result) => sum + result[1], 0), 1);
    const Initial = mongo.model("CityInitialConfiguration", cityInitialConfigurationSchema);
    await Initial.createCollection();
    await Initial.createIndexes();
    const initial = {
        schemaVersion: 1 as const,
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
        buildings: [{ buildingType: BuildingType.Castle, position: 0, level: 1 }],
    };
    const publication = await Initial.create(initial);
    await assert.rejects(Initial.create(initial), /duplicate key/);
    await assert.rejects(
        Initial.create({ ...initial, configurationVersion: 2, publicId: publication.publicId }),
        /duplicate key/,
    );
    await Initial.create({ ...initial, configurationVersion: 2 });
    await assert.rejects(Initial.deleteMany({}).exec(), /imutáveis/);
    await source.manager.insert(KingdomRuleSet, {
        stateVersion: "1",
        buildingConfigurationVersion: 1,
        troopConfigurationVersion: 1,
        troopTrainingConfigurationVersion: 1,
        marchConfigurationVersion: 1,
        resourceDepositConfigurationVersion: 1,
        cityInitialConfigurationVersion: 1,
        cityInitialConfigurationPublicId: String(publication.publicId),
        activatedAt: now,
    });
    await rejectsSql("UPDATE kingdom_rule_sets SET troop_configuration_version = 2");
    await rejectsSql(
        "UPDATE kingdom_rule_sets SET state_version = state_version + 1, march_configuration_version = 0",
    );
    await rejectsSql("UPDATE kingdom_rule_sets SET state_version = state_version + 2");
    await rejectsSql(
        "UPDATE kingdom_rule_sets SET state_version = state_version + 1, activated_at = activated_at - interval '1 second'",
    );
    await rejectsSql("DELETE FROM kingdom_rule_sets");
    const activations = await Promise.all([
        source.query(
            "UPDATE kingdom_rule_sets SET state_version = state_version + 1 WHERE state_version = 1 RETURNING state_version",
        ),
        source.query(
            "UPDATE kingdom_rule_sets SET state_version = state_version + 1 WHERE state_version = 1 RETURNING state_version",
        ),
    ]);
    assert.equal(activations.reduce((sum, result) => sum + result[1], 0), 1);
    await assert.rejects(
        source.transaction(async manager => {
            await manager.query("UPDATE kingdom_rule_sets SET state_version = state_version + 1");
            await manager.query("UPDATE realm_authority SET owner_epoch = owner_epoch + 1");
            throw new Error("rollback");
        }),
        /rollback/,
    );
    assert.equal(
        (await source.manager.findOneByOrFail(KingdomRuleSet, { id: 1 })).stateVersion,
        "2",
    );
    await source.destroy();
    await source.initialize();
    assert.equal(
        (await source.manager.findOneByOrFail(RealmAuthority, { id: 1 })).ownerEpoch,
        "9007199254740994",
    );
    assert.equal(
        (await source.manager.findOneByOrFail(KingdomRuleSet, { id: 1 }))
            .cityInitialConfigurationPublicId,
        String(publication.publicId),
    );
    assert.equal(
        (await Initial.findById(publication._id).orFail()).resources.wood,
        "9007199254740993",
    );
    await source.undoLastMigration({ transaction: "all" });
    assert.equal(
        (await source.query("SELECT to_regclass('realm_authority') AS name"))[0].name,
        null,
    );
    await source.runMigrations({ transaction: "all" });
    assert.deepEqual((await source.driver.createSchemaBuilder().log()).upQueries, []);
    console.info(
        "Kingdom rules checks passed: exact epochs, concurrent CAS, rollback, restart, immutable catalogs, migration rollback/reapply and zero schema drift",
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
