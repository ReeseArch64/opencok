import { MigrationExecutor } from "typeorm";
import { connectMongoDB } from "../src/mongoose";
import { migrationMongoConnections } from "../src/migrations/support/mongo-connections";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { persistenceOptions } from "./options";
import { migrationRedisUris } from "../src/migrations/support/redis-uri";

const options = persistenceOptions();
const admin = createPostgresDataSource("global", options.postgres);
admin.setOptions({ database: "postgres", entities: [], migrations: [] });
await admin.initialize();
const session = admin.createQueryRunner();
try
{
    await session.connect();
    await session.query(
        "SELECT pg_advisory_lock(hashtext('opencok.migrations'))",
    );
    for (const database of ["global", "kingdom_1"] as const)
    {
        const exists = await session.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [database],
        );
        if (exists.length === 0)
        {
            await session.query(`CREATE DATABASE "${database}"`);
        }
        const source = createPostgresDataSource(database, options.postgres);
        let mongo: Awaited<ReturnType<typeof connectMongoDB>> | undefined;
        try
        {
            await source.initialize();
            migrationRedisUris.set(source, options.redisUrl);
            const pending = await new MigrationExecutor(
                source,
            ).getPendingMigrations();
            if (
                pending.some(
                    (migration) =>
                        migration.name
                        === "MoveWorldDocumentsToMongo1794438007000",
                )
            )
            {
                mongo = await connectMongoDB(options.mongodbUri, {
                    dbName: database,
                });
                migrationMongoConnections.set(source, mongo);
            }
            const migrations = await source.runMigrations({
                transaction: "all",
            });
            console.info(
                `${database}: ${migrations.length} migração(ões) aplicada(s)`,
            );
        }
        finally
        {
            migrationRedisUris.delete(source);
            migrationMongoConnections.delete(source);
            if (mongo)
            {
                await mongo.close();
            }
            if (source.isInitialized)
            {
                await source.destroy();
            }
        }
    }
}
finally
{
    await session.query(
        "SELECT pg_advisory_unlock(hashtext('opencok.migrations'))",
    );
    await session.release();
    await admin.destroy();
}
