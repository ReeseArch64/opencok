import type { Pool } from "pg";
import {
    serviceRoleIdentifier,
    serviceRolePasswordVerifier,
} from "@opencok/drizzle/service-role-credentials";
import { schedulerReadColumns } from "@opencok/queues/repositories/scheduler-permissions";

export interface SchedulerRoleProvisioning
{
    kingdom: Pool;
    kingdomId: number;
    role: string;
    password: string;
}

export async function provisionSchedulerRole(config: SchedulerRoleProvisioning): Promise<void>
{
    const role = serviceRoleIdentifier(config.role);
    const password = serviceRolePasswordVerifier(config.password);
    if (
        !Number.isInteger(config.kingdomId) || config.kingdomId < 1
        || config.kingdomId > 2147483647
    )
    {
        throw new Error("Invalid scheduler kingdom");
    }
    const client = await config.kingdom.connect();
    try
    {
        await client.query("BEGIN");
        const schema = await client.query<{ safe: boolean; }>(
            "SELECT NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='scheduler_access' AND nspowner <> (SELECT oid FROM pg_roles WHERE rolname=current_user)) AS safe",
        );
        if (!schema.rows[0]?.safe)
        {
            throw new Error("Scheduler access schema has a different owner");
        }
        await client.query("CREATE SCHEMA IF NOT EXISTS scheduler_access");
        await client.query(
            "CREATE TABLE IF NOT EXISTS scheduler_access.binding (role_name name PRIMARY KEY, kingdom_id integer NOT NULL CHECK (kingdom_id>0), database_kind text NOT NULL CHECK (database_kind='kingdom'))",
        );
        const binding = await client.query<{ safe: boolean; }>(
            "SELECT c.relkind='r' AND c.relowner=n.nspowner AND NOT c.relrowsecurity AND NOT c.relforcerowsecurity AS safe FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='scheduler_access' AND c.relname='binding'",
        );
        if (binding.rows.length !== 1 || !binding.rows[0]?.safe)
        {
            throw new Error("Untrusted scheduler binding table");
        }
        await client.query(
            `CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD '${password}'`,
        );
        await client.query(
            "INSERT INTO scheduler_access.binding(role_name,kingdom_id,database_kind) VALUES($1,$2,'kingdom')",
            [config.role, config.kingdomId],
        );
        const database = await client.query<{ name: string; }>("SELECT current_database() AS name");
        const name = `"${database.rows[0]!.name.replaceAll("\"", "\"\"")}"`;
        await client.query(`GRANT CONNECT ON DATABASE ${name} TO ${role}`);
        await client.query(`GRANT USAGE ON SCHEMA opencok_kingdom,scheduler_access TO ${role}`);
        for (const [table, columns] of Object.entries(schedulerReadColumns))
        {
            const names = columns.map((column) => `"${column}"`).join(",");
            await client.query(`GRANT SELECT (${names}) ON ${table} TO ${role}`);
        }
        await client.query("COMMIT");
    }
    catch
    {
        await client.query("ROLLBACK").catch(() => undefined);

        throw new Error("Scheduler role provisioning failed; inspect operator-owned role state");
    }
    finally
    {
        client.release();
    }
}
