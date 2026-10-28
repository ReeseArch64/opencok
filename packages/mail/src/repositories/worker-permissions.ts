import { sql } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

interface ColumnAccess extends Record<string, unknown>
{
    schema: string;
    table: string;
    column: string;
    readable: boolean;
    writable: boolean;
    insertable: boolean;
    referenceable: boolean;
    grantable: boolean;
}

interface TableAccess extends Record<string, unknown>
{
    schema: string;
    table: string;
    deletable: boolean;
    unsafe: boolean;
}

const queueUpdates = new Map([
    ["mail_gift_opening", "openedAt"],
    ["mail_chat_read_intent", "requestedAt"],
]);

async function checkDatabasePermissions(
    db: DatabaseClient<"kingdom"> | DatabaseClient<"global">,
    kind: "kingdom" | "global",
    kingdomId: number,
): Promise<string>
{
    const identity = await db.execute<{ login: string; unsafe: boolean; }>(sql`
        SELECT current_user AS login,
            session_user <> current_user OR r.rolsuper OR r.rolcreatedb OR r.rolcreaterole
            OR r.rolreplication OR r.rolbypassrls OR NOT r.rolcanlogin
            OR EXISTS (SELECT 1 FROM pg_auth_members WHERE member = r.oid)
            OR EXISTS (SELECT 1 FROM pg_database d WHERE d.datdba = r.oid
                OR has_database_privilege(r.oid, d.oid, 'CREATE'))
            OR EXISTS (SELECT 1 FROM pg_namespace n
                WHERE n.nspname !~ '^pg_(temp|toast_temp)_[0-9]+$'
                AND (n.nspowner = r.oid OR has_schema_privilege(r.oid, n.oid, 'CREATE')))
            OR EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
                WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
                AND (p.proowner = r.oid OR (p.prosecdef
                    AND has_function_privilege(r.oid, p.oid, 'EXECUTE'))))
            OR EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
                AND n.nspname <> 'pg_toast' AND n.nspname !~ '^pg_(temp|toast_temp)_[0-9]+$'
                AND (c.relowner = r.oid OR (c.relkind = 'S'
                    AND has_sequence_privilege(r.oid, c.oid, 'SELECT, UPDATE, USAGE'))))
            AS unsafe
        FROM pg_roles r WHERE r.rolname = current_user
    `);
    if (identity.rows.length !== 1 || identity.rows[0]!.unsafe)
    {
        throw new Error("Unsafe mail worker database role");
    }

    const bindingOwner = await db.execute<{ trusted: boolean; }>(sql`
        SELECT c.relkind = 'r' AND c.relowner = n.nspowner AND NOT c.relrowsecurity
            AND NOT c.relforcerowsecurity AS trusted
        FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'mail_worker_access' AND c.relname = 'binding'
    `);
    if (bindingOwner.rows.length !== 1 || !bindingOwner.rows[0]!.trusted)
    {
        throw new Error("Untrusted mail worker database binding");
    }

    const binding = await db.execute<{ kingdomId: number; kind: string; }>(sql`
        SELECT kingdom_id AS "kingdomId", database_kind AS kind
        FROM mail_worker_access.binding WHERE role_name = current_user
    `);
    if (
        binding.rows.length !== 1 || binding.rows[0]!.kingdomId !== kingdomId
        || binding.rows[0]!.kind !== kind
    )
    {
        throw new Error("Mail worker database binding mismatch");
    }

    const tables = await db.execute<TableAccess>(sql`
        SELECT n.nspname AS schema, c.relname AS table,
            has_table_privilege(c.oid, 'DELETE') AS deletable,
            has_table_privilege(c.oid, 'INSERT, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN')
            OR has_table_privilege(c.oid,
                'SELECT WITH GRANT OPTION, UPDATE WITH GRANT OPTION, DELETE WITH GRANT OPTION')
            AS unsafe
        FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r', 'p', 'v', 'm', 'f')
            AND n.nspname NOT IN ('pg_catalog', 'information_schema')
            AND n.nspname <> 'pg_toast' AND n.nspname !~ '^pg_(temp|toast_temp)_[0-9]+$'
    `);
    const columns = await db.execute<ColumnAccess>(sql`
        SELECT n.nspname AS schema, c.relname AS table, a.attname AS column,
            has_column_privilege(c.oid, a.attnum, 'SELECT') AS readable,
            has_column_privilege(c.oid, a.attnum, 'UPDATE') AS writable,
            has_column_privilege(c.oid, a.attnum, 'INSERT') AS insertable,
            has_column_privilege(c.oid, a.attnum, 'REFERENCES') AS referenceable,
            has_column_privilege(c.oid, a.attnum,
                'SELECT WITH GRANT OPTION, UPDATE WITH GRANT OPTION') AS grantable
        FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE a.attnum > 0 AND NOT a.attisdropped AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
            AND n.nspname NOT IN ('pg_catalog', 'information_schema')
            AND n.nspname <> 'pg_toast' AND n.nspname !~ '^pg_(temp|toast_temp)_[0-9]+$'
    `);
    const isQueue = (schema: string, table: string) =>
        kind === "kingdom" && schema === "opencok_kingdom" && queueUpdates.has(table);
    const required = kind === "kingdom"
        ? ["opencok_kingdom.mail_gift_opening", "opencok_kingdom.mail_chat_read_intent"]
        : ["opencok_global.mail_gift_log"];
    for (const name of [...required, "mail_worker_access.binding"])
    {
        if (!tables.rows.some((row) => `${row.schema}.${row.table}` === name))
        {
            throw new Error("Mail worker database schema unavailable");
        }
    }
    for (const row of tables.rows)
    {
        if (row.unsafe || row.deletable !== isQueue(row.schema, row.table))
        {
            throw new Error("Unsafe mail worker table permissions");
        }
    }
    for (const row of columns.rows)
    {
        const queue = isQueue(row.schema, row.table);
        const projection = kind === "global" && row.schema === "opencok_global"
            && row.table === "mail_gift_log";
        const readable = queue || (row.schema === "mail_worker_access" && row.table === "binding")
            || (projection && ["uid", "sendTime", "toUid"].includes(row.column));
        const writable = (queue && queueUpdates.get(row.table) === row.column)
            || (projection && ["isOpened", "receiveTime"].includes(row.column));
        if (
            row.readable !== readable || row.writable !== writable || row.insertable
            || row.referenceable || row.grantable
        )
        {
            throw new Error("Unsafe mail worker column permissions");
        }
    }

    return identity.rows[0]!.login;
}

export async function checkMailWorkerPermissions(
    kingdom: DatabaseClient<"kingdom">,
    global: DatabaseClient<"global">,
    kingdomId: number,
): Promise<void>
{
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    {
        throw new Error("Invalid mail worker kingdom");
    }
    const kingdomRole = await checkDatabasePermissions(kingdom, "kingdom", kingdomId);
    const globalRole = await checkDatabasePermissions(global, "global", kingdomId);
    if (kingdomRole === globalRole)
    {
        throw new Error("Mail worker database roles must be distinct");
    }
}
