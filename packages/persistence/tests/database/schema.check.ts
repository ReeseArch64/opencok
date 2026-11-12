import assert from "node:assert/strict";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { persistenceOptions } from "../../scripts/options";

const options = persistenceOptions();

for (const database of ["global", "kingdom_1"] as const)
{
    const source = createPostgresDataSource(database, options.postgres);
    try
    {
        await source.initialize();
        const drift = await source.driver.createSchemaBuilder().log();
        assert.deepEqual(
            drift.upQueries.map(query => query.query),
            [],
            `Full ${database} schema differs from current models`,
        );
    }
    finally
    {
        if (source.isInitialized)
        {
            await source.destroy();
        }
    }
}

console.info("Full global and kingdom schema checks passed");
