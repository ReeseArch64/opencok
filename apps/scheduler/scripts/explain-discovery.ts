import { resolve } from "node:path";
import { copyFile, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

const output = resolve(process.argv[2] ?? "/tmp/opencok-scheduler-plans");
await mkdir(output, { recursive: true });
const migrations =
    new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url).pathname;
const prior = await mkdtemp(resolve(tmpdir(), "opencok-scheduler-migrations-"));
const journal = JSON.parse(await readFile(resolve(migrations, "meta/_journal.json"), "utf8")) as {
    entries: { idx: number; tag: string; }[];
};
journal.entries = journal.entries.filter(entry => entry.idx < 45);
await mkdir(resolve(prior, "meta"));
await Bun.write(resolve(prior, "meta/_journal.json"), JSON.stringify(journal));
await Promise.all(
    journal.entries.map(entry =>
        copyFile(resolve(migrations, `${entry.tag}.sql`), resolve(prior, `${entry.tag}.sql`))
    ),
);
const pg = new DisposablePostgres();
const admin = await pg.start();
await admin.query("CREATE DATABASE plans");
const db = createDatabase("kingdom", { ...pg.options, database: "plans" });
try
{
    await migrate(db.db, {
        migrationsFolder: prior,
    });
    await db.pool.query(
        `INSERT INTO opencok_kingdom.timed_activity (id,"ownerId","queueId",type,"itemId","startedAt","dueAt",version,status,data)
      SELECT 'a-'||lpad(n::text,8,'0'),'owner-'||n,'q-'||lpad(n::text,8,'0'),CASE WHEN n%10=0 THEN 41 ELSE 0 END,'synthetic',1000,CASE WHEN n<=80000 THEN 2000 ELSE 9000 END,1,CASE WHEN n>90000 THEN 1 ELSE 0 END,'{}'::jsonb FROM generate_series(1,100000) n`,
    );
    await db.pool.query(
        `INSERT INTO opencok_kingdom.queue (uuid,"ownerId",qid,type,"itemId","startTime","endTime","updateTime")
      SELECT 'q-'||lpad(n::text,8,'0'),'owner-'||n,0,CASE WHEN n%100=0 THEN 0 ELSE 41 END,CASE WHEN n%2=0 THEN 'synthetic' ELSE '' END,1000,9223372036854775807,2000 FROM generate_series(1,120000) n`,
    );
    await db.pool.query("ANALYZE opencok_kingdom.timed_activity");
    await db.pool.query("ANALYZE opencok_kingdom.queue");
    const queries = {
        equalDeadlinePage:
            `SELECT id,"ownerId","queueId",type,"dueAt",version FROM opencok_kingdom.timed_activity WHERE status=0 AND type=ANY(ARRAY[0,1,2,3,6,8,9,10,11,12,17,19]) AND "dueAt"<=5000 AND ("dueAt",id)>(2000,'a-00070000') AND ("dueAt",id)<=(2000,'a-00080000') ORDER BY "dueAt",id LIMIT 64`,
        dueBound:
            `SELECT "dueAt",id FROM opencok_kingdom.timed_activity WHERE status=0 AND type=ANY(ARRAY[0,1,2,3,6,8,9,10,11,12,17,19]) AND "dueAt"<=5000 ORDER BY "dueAt" DESC,id DESC LIMIT 1`,
        sparseLegacy:
            `SELECT q.uuid,q."ownerId",q.type,q."itemId",q."startTime",q."updateTime" FROM opencok_kingdom.queue q LEFT JOIN opencok_kingdom.timed_activity a ON a."queueId"=q.uuid AND a.status=0 WHERE q.type=ANY(ARRAY[0,1,2,3,6,8,9,10,11,12,17,19]) AND a."queueId" IS NULL AND q."updateTime"<>9223372036854775807 AND q."itemId"<>'' AND q.uuid>'q-00100000' ORDER BY q.uuid LIMIT 64`,
    };
    const capture = async (name: string) => {
        const results: Record<string, unknown> = {};
        for (const [key, query] of Object.entries(queries))
        {
            results[key] = (await db.pool.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`))
                .rows[0]["QUERY PLAN"];
        }
        await Bun.write(
            resolve(output, `${name}.json`),
            JSON.stringify({ rows: { timed: 100000, queues: 120000 }, queries, results }, null, 2),
        );
    };
    await capture("existing-indexes");
    const fingerprint = async () =>
        (await db.pool.query(
            `SELECT md5(string_agg(row_to_json(a)::text,',' ORDER BY id)) AS fingerprint FROM opencok_kingdom.timed_activity a`,
        )).rows[0].fingerprint;
    const before = await fingerprint();
    await migrate(db.db, { migrationsFolder: migrations });
    const after = await fingerprint();
    if (before !== after)
    {
        throw new Error("Discovery index migration changed persisted activities");
    }
    await Bun.write(
        resolve(output, "migration-preservation.json"),
        JSON.stringify({ before, after, rows: 100000, unchanged: true }),
    );
    await capture("migrated-indexes");
    await db.pool.query(
        `CREATE INDEX scheduler_candidate_legacy ON opencok_kingdom.queue (uuid) INCLUDE ("ownerId",type,"itemId","startTime","updateTime") WHERE "updateTime"<>9223372036854775807 AND "itemId"<>''`,
    );
    await capture("candidate-indexes");
    process.stdout.write(JSON.stringify({ output }) + "\n");
}
finally
{
    await db.close();
    await admin.end();
    await pg.stop();
    await rm(prior, { recursive: true, force: true });
}
