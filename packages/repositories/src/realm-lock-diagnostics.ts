import { sql } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export interface RealmLockDiagnostic
{
    pid: number;
    blockers: number[];
    mode: string;
    granted: boolean;
    transactionAgeMs: number;
    waitAgeMs: number;
}

export async function readRealmLockDiagnostics(
    db: Pick<DatabaseClient<"kingdom">, "execute">,
): Promise<readonly RealmLockDiagnostic[]>
{
    const result = await db.execute(sql`
        WITH participants AS (
            SELECT DISTINCT pid FROM pg_locks
            WHERE database = (SELECT oid FROM pg_database WHERE datname = current_database())
                AND relation = to_regclass('opencok_kingdom.realm_authority')
        )
        SELECT l.pid, pg_blocking_pids(l.pid) AS blockers, l.mode, l.granted,
            COALESCE(EXTRACT(EPOCH FROM (clock_timestamp() - a.xact_start)) * 1000, 0)::float8 AS "transactionAgeMs",
            COALESCE(EXTRACT(EPOCH FROM (clock_timestamp() - l.waitstart)) * 1000, 0)::float8 AS "waitAgeMs"
        FROM pg_locks AS l
        JOIN pg_stat_activity AS a ON a.pid = l.pid
        WHERE l.pid IN (SELECT pid FROM participants)
            AND (l.relation = to_regclass('opencok_kingdom.realm_authority') OR NOT l.granted)
        ORDER BY l.granted, l.pid, l.mode
        LIMIT 64
    `);

    return result.rows as unknown as RealmLockDiagnostic[];
}
