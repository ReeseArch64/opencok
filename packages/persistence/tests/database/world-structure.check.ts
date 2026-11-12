import { checkMongoWorldDocuments } from "./mongo-world-documents.check";
import assert from "node:assert/strict";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { persistenceOptions } from "../../scripts/options";

const source = createPostgresDataSource(
    "kingdom_1",
    persistenceOptions().postgres,
);
await source.initialize();
const runner = source.createQueryRunner();
await runner.connect();
await runner.startTransaction();
let checks = 0;
async function reject(sql: string, code: string, parameters: unknown[] = [])
{
    await runner.query("SAVEPOINT invalid_case");
    let actual: string | undefined;
    try
    {
        await runner.query(sql, parameters);
    }
    catch (error)
    {
        actual = (error as { driverError?: { code?: string; }; }).driverError
            ?.code;
    }
    await runner.query("ROLLBACK TO SAVEPOINT invalid_case");
    assert.equal(actual, code, sql);
    checks++;
}
async function count(sql: string, parameters: unknown[] = [])
{
    return Number((await runner.query(sql, parameters))[0].count);
}
try
{
    const baseline = await count("SELECT count(*) FROM world_objects");
    await reject(
        `INSERT INTO world_objects(object_type,cell_x,cell_y) VALUES ('castle',567,570)`,
        "23505",
    );
    assert.equal(await count("SELECT count(*) FROM world_objects"), baseline);
    await reject(
        "UPDATE world_objects SET cell_x=570,cell_y=570 WHERE id=2",
        "23505",
    );
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND cell_x=567 AND cell_y=570 AND archived_at IS NULL AND deleted_at IS NULL",
        ),
        1,
    );
    await runner.query("UPDATE world_objects SET cell_x=569 WHERE id=2");
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND cell_x=569 AND archived_at IS NULL AND deleted_at IS NULL",
        ),
        1,
    );
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND cell_x=567 AND archived_at IS NOT NULL",
        ),
        1,
    );
    await runner.query("UPDATE world_objects SET archived_at=now() WHERE id=2");
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND archived_at IS NULL AND deleted_at IS NULL",
        ),
        0,
    );
    const replacement = (
        await runner.query(
            `INSERT INTO world_objects(object_type,cell_x,cell_y) VALUES ('wood_resource',569,570) RETURNING id`,
        )
    )[0].id;
    await reject(
        "UPDATE world_objects SET archived_at=NULL WHERE id=2",
        "23505",
    );
    await runner.query(
        "UPDATE world_objects SET deleted_at=now() WHERE id=$1",
        [replacement],
    );
    await runner.query("UPDATE world_objects SET archived_at=NULL WHERE id=2");
    await runner.query("UPDATE world_objects SET deleted_at=now() WHERE id=2");
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND archived_at IS NULL AND deleted_at IS NULL",
        ),
        0,
    );
    await runner.query("UPDATE world_objects SET deleted_at=NULL WHERE id=2");
    assert.equal(
        await count(
            "SELECT count(*) FROM world_object_cells WHERE world_object_id=2 AND archived_at IS NULL AND deleted_at IS NULL",
        ),
        1,
    );
    await reject(
        "DELETE FROM world_object_cells WHERE world_object_id=2",
        "23514",
    );
    checks += 7;
}
finally
{
    await runner.rollbackTransaction();
    await runner.release();
}
try
{
    const drift = await source.driver.createSchemaBuilder().log();
    assert.equal(
        drift.upQueries.length,
        0,
        "Applied schema differs from models",
    );
    console.info(
        `${checks} database checks passed; test data rolled back; zero schema drift`,
    );
}
finally
{
    await source.destroy();
}

const mongoChecks = await checkMongoWorldDocuments(persistenceOptions());
console.info(
    `${mongoChecks} MongoDB validation, concurrency and transfer checks passed; fixtures removed`,
);
