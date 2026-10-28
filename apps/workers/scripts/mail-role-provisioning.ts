import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import type { Pool, PoolClient } from "pg";

export interface MailRoleProvisioning
{
    kingdom: Pool;
    global: Pool;
    kingdomId: number;
    kingdomRole: string;
    globalRole: string;
    password: string;
}

function identifier(value: string): string
{
    if (!/^[a-z][a-z0-9_]{0,62}$/.test(value))
    {
        throw new Error("Invalid mail worker role name");
    }

    return `"${value}"`;
}

function verifier(password: string): string
{
    if (!/^[!-~]{24,256}$/.test(password))
    {
        throw new Error("Mail worker password must contain 24 to 256 printable ASCII characters");
    }
    const salt = randomBytes(16);
    const salted = pbkdf2Sync(password, salt, 4096, 32, "sha256");
    const client = createHmac("sha256", salted).update("Client Key").digest();
    const stored = createHash("sha256").update(client).digest("base64");
    const server = createHmac("sha256", salted).update("Server Key").digest("base64");

    return `SCRAM-SHA-256$4096:${salt.toString("base64")}$${stored}:${server}`;
}

async function provisionDatabase(
    client: PoolClient,
    kind: "kingdom" | "global",
    kingdomId: number,
    roleName: string,
    passwordVerifier: string,
): Promise<void>
{
    const role = identifier(roleName);
    const owned = await client.query<{ safe: boolean; }>(
        "SELECT NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'mail_worker_access' AND nspowner <> (SELECT oid FROM pg_roles WHERE rolname = current_user)) AS safe",
    );
    if (!owned.rows[0]?.safe)
    {
        throw new Error("Mail worker access schema has a different owner");
    }
    await client.query("CREATE SCHEMA IF NOT EXISTS mail_worker_access");
    await client.query(
        "CREATE TABLE IF NOT EXISTS mail_worker_access.binding (role_name name PRIMARY KEY, kingdom_id integer NOT NULL CHECK (kingdom_id > 0), database_kind text NOT NULL CHECK (database_kind IN ('kingdom', 'global')))",
    );
    const binding = await client.query<{ safe: boolean; }>(
        "SELECT c.relkind = 'r' AND c.relowner = n.nspowner AND NOT c.relrowsecurity AND NOT c.relforcerowsecurity AS safe FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='mail_worker_access' AND c.relname='binding'",
    );
    if (binding.rows.length !== 1 || !binding.rows[0]!.safe)
    {
        throw new Error("Mail worker binding table has an unexpected owner or type");
    }
    await client.query(
        `CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD '${passwordVerifier}'`,
    );
    await client.query(
        "INSERT INTO mail_worker_access.binding (role_name, kingdom_id, database_kind) VALUES ($1,$2,$3)",
        [roleName, kingdomId, kind],
    );
    const database = await client.query<{ name: string; }>("SELECT current_database() AS name");
    const databaseName = `"${database.rows[0]!.name.replaceAll("\"", "\"\"")}"`;
    await client.query(`GRANT CONNECT ON DATABASE ${databaseName} TO ${role}`);
    await client.query(`GRANT USAGE ON SCHEMA mail_worker_access TO ${role}`);
    await client.query(`GRANT SELECT ON mail_worker_access.binding TO ${role}`);
    if (kind === "kingdom")
    {
        await client.query(`GRANT USAGE ON SCHEMA opencok_kingdom TO ${role}`);
        await client.query(
            `GRANT SELECT, DELETE ON opencok_kingdom.mail_gift_opening, opencok_kingdom.mail_chat_read_intent TO ${role}`,
        );
        await client.query(
            `GRANT UPDATE ("openedAt") ON opencok_kingdom.mail_gift_opening TO ${role}`,
        );
        await client.query(
            `GRANT UPDATE ("requestedAt") ON opencok_kingdom.mail_chat_read_intent TO ${role}`,
        );
    }
    else
    {
        await client.query(`GRANT USAGE ON SCHEMA opencok_global TO ${role}`);
        await client.query(
            `GRANT SELECT (uid, "sendTime", "toUid"), UPDATE ("isOpened", "receiveTime") ON opencok_global.mail_gift_log TO ${role}`,
        );
    }
}

export async function provisionMailWorkerRoles(config: MailRoleProvisioning): Promise<void>
{
    identifier(config.kingdomRole);
    identifier(config.globalRole);
    if (
        config.kingdomRole === config.globalRole || !Number.isInteger(config.kingdomId)
        || config.kingdomId < 1 || config.kingdomId > 2147483647
    )
    {
        throw new Error("Invalid mail worker role binding");
    }
    const passwordVerifier = verifier(config.password);
    const kingdom = await config.kingdom.connect();
    let global: PoolClient | undefined;
    try
    {
        global = await config.global.connect();
        await kingdom.query("BEGIN");
        await global.query("BEGIN");
        await provisionDatabase(
            kingdom,
            "kingdom",
            config.kingdomId,
            config.kingdomRole,
            passwordVerifier,
        );
        await provisionDatabase(
            global,
            "global",
            config.kingdomId,
            config.globalRole,
            passwordVerifier,
        );
        await global.query("COMMIT");
        await kingdom.query("COMMIT");
    }
    catch
    {
        await kingdom.query("ROLLBACK").catch(() => undefined);
        await global?.query("ROLLBACK").catch(() => undefined);

        throw new Error("Mail worker role provisioning failed; inspect operator-owned role state");
    }
    finally
    {
        kingdom.release();
        global?.release();
    }
}
