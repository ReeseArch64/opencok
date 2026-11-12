import assert from "node:assert/strict";
import { randomInt } from "node:crypto";
import { persistenceOptions } from "../../scripts/options";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { connectRedis } from "../../src/redis";
import { KingdomAccessStatus as Status } from "../../src/enums/kingdom-access-status";
import {
    KingdomAccessStatusStore,
    kingdomAccessStatusKey,
} from "../../src/stores/kingdom-access-status";
import { CreateKingdomRegistry1794438000000 } from "../../src/migrations/global/1794438000000-CreateKingdomRegistry";
import { AddKingdomFullStatus1794438003000 } from "../../src/migrations/global/1794438003000-AddKingdomFullStatus";
import { MoveKingdomAccessStatusToRedis1794438008000 } from "../../src/migrations/global/1794438008000-MoveKingdomAccessStatusToRedis";
import { migrationRedisUris } from "../../src/migrations/support/redis-uri";

const options = persistenceOptions();
const database = `redis_status_check_${process.pid}_${Date.now()}`;
const admin = createPostgresDataSource("global", options.postgres);
admin.setOptions({ database: "postgres", entities: [], migrations: [] });
const source = createPostgresDataSource("global", options.postgres);
source.setOptions({
    database,
    migrations: [CreateKingdomRegistry1794438000000, AddKingdomFullStatus1794438003000],
});
const redis = await connectRedis(options.redisUrl);
const store = new KingdomAccessStatusStore(redis);
const first = randomInt(1_000_000_000, 2_000_000_000);
const ids = [first, first + 1, first + 2];
const ownedKeys: string[] = [];
let created = false;
try
{
    for (const id of ids)
    {
        const key = kingdomAccessStatusKey(id);
        assert.equal(
            await redis.send("SET", [key, "closed", "NX", "EX", "120"]),
            "OK",
            "Fixture key already exists",
        );
        ownedKeys.push(key);
    }
    assert.equal(await store.get(first), Status.Closed);
    await store.set(first, Status.Open, 1);
    assert.equal(await store.get(first), Status.Open);
    assert.equal(await store.get(first + 1), Status.Closed);
    assert.ok((await redis.ttl(kingdomAccessStatusKey(first))) > 0);
    // Expiração real no Redis, sem usar relógio simulado.
    await Bun.sleep(1100);
    assert.equal(await store.get(first), Status.Closed);
    await store.set(first, Status.Full);
    await store.clear(first);
    assert.equal(await store.get(first), Status.Closed);
    await redis.set(kingdomAccessStatusKey(first), "invalid");
    assert.equal(await store.get(first), Status.Closed);
    await store.clear(first);

    await admin.initialize();
    await admin.query(`CREATE DATABASE "${database}"`);
    created = true;
    await source.initialize();
    await source.runMigrations({ transaction: "all" });
    for (const [index, id] of ids.entries())
    {
        await source.query(
            `INSERT INTO kingdoms(id, display_name, access_status, deleted_at) VALUES ($1, 'Redis fixture', $2, $3)`,
            [id, index === 0 ? Status.Open : Status.Maintenance, index === 2 ? new Date() : null],
        );
    }
    await store.set(first + 1, Status.Full);
    await store.clear(first + 2);
    await source.destroy();
    source.setOptions({
        migrations: [
            CreateKingdomRegistry1794438000000,
            AddKingdomFullStatus1794438003000,
            MoveKingdomAccessStatusToRedis1794438008000,
        ],
    });
    await source.initialize();

    // Falhar na conexão Redis deve manter o schema e o histórico SQL.
    migrationRedisUris.set(source, "redis://127.0.0.1:1");
    await assert.rejects(source.runMigrations({ transaction: "all" }));
    assert.equal(
        (await source.query("SELECT access_status FROM kingdoms WHERE id = $1", [first]))[0]
            .access_status,
        Status.Open,
    );
    migrationRedisUris.set(source, options.redisUrl);
    assert.equal((await source.runMigrations({ transaction: "all" })).length, 1);
    assert.equal(await store.get(first), Status.Open);
    assert.equal(await store.get(first + 1), Status.Full);
    assert.equal(await redis.get(kingdomAccessStatusKey(first + 2)), null);
    assert.equal((await source.runMigrations({ transaction: "all" })).length, 0);
    assert.equal(
        (await source.query(
            `SELECT count(*) FROM information_schema.columns WHERE table_name = 'kingdoms' AND column_name = 'access_status'`,
        ))[0].count,
        "0",
    );
    const drift = await source.driver.createSchemaBuilder().log();
    assert.equal(drift.upQueries.length, 0, "Schema differs from the current Kingdom model");
    await store.clear(first);
    await source.undoLastMigration({ transaction: "all" });
    const restored = await source.query("SELECT access_status FROM kingdoms ORDER BY id");
    assert.deepEqual(restored.map((row: { access_status: string; }) => row.access_status), [
        Status.Closed,
        Status.Full,
        Status.Closed,
    ]);
    console.info(
        "Redis TTL, isolation, migration failure, transfer, retry, rollback and schema checks passed",
    );
}
finally
{
    migrationRedisUris.delete(source);
    if (source.isInitialized)
    {
        await source.destroy();
    }
    if (created)
    {
        await admin.query(`DROP DATABASE "${database}"`);
    }
    if (admin.isInitialized)
    {
        await admin.destroy();
    }
    try
    {
        for (const key of ownedKeys)
        {
            await redis.del(key);
        }
    }
    finally
    {
        redis.close();
    }
}
