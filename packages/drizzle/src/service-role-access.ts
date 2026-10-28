import { sql } from "drizzle-orm";
import type { DatabaseClient } from "./contracts/database";

export interface ServiceColumnAccess extends Record<string, unknown>
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

export interface ServiceTableAccess extends Record<string, unknown>
{
    schema: string;
    table: string;
    deletable: boolean;
    unsafe: boolean;
}

export async function inspectServiceRoleAccess(
    db: DatabaseClient<"kingdom"> | DatabaseClient<"global">,
    bindingSchema: string,
    kingdomId: number,
    kind: "kingdom" | "global",
)
{
    if (
        !/^[a-z][a-z0-9_]{0,62}$/.test(bindingSchema)
        || !Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647
    )
    {
        throw new Error("Invalid database service binding");
    }
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
        throw new Error("Unsafe database service role");
    }

    const bindingOwner = await db.execute<{ trusted: boolean; }>(sql`
        SELECT c.relkind = 'r' AND c.relowner = n.nspowner AND NOT c.relrowsecurity
            AND NOT c.relforcerowsecurity AS trusted
        FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = ${bindingSchema} AND c.relname = 'binding'
    `);
    if (bindingOwner.rows.length !== 1 || !bindingOwner.rows[0]!.trusted)
    {
        throw new Error("Untrusted database service binding");
    }

    const binding = await db.execute<{ kingdomId: number; kind: string; }>(sql`
        SELECT kingdom_id AS "kingdomId", database_kind AS kind
        FROM ${sql.identifier(bindingSchema)}.binding WHERE role_name = current_user
    `);
    if (
        binding.rows.length !== 1 || binding.rows[0]!.kingdomId !== kingdomId
        || binding.rows[0]!.kind !== kind
    )
    {
        throw new Error("Database service binding mismatch");
    }

    const tables = await db.execute<ServiceTableAccess>(sql`
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
    const columns = await db.execute<ServiceColumnAccess>(sql`
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

    return { login: identity.rows[0]!.login, tables: tables.rows, columns: columns.rows };
}
