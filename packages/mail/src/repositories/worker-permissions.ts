import { inspectServiceRoleAccess } from "@opencok/drizzle/service-role-access";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

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
    const access = await inspectServiceRoleAccess(db, "mail_worker_access", kingdomId, kind);
    const isQueue = (schema: string, table: string) =>
        kind === "kingdom" && schema === "opencok_kingdom" && queueUpdates.has(table);
    const required = kind === "kingdom"
        ? ["opencok_kingdom.mail_gift_opening", "opencok_kingdom.mail_chat_read_intent"]
        : ["opencok_global.mail_gift_log"];
    for (const name of [...required, "mail_worker_access.binding"])
    {
        if (!access.tables.some((row) => `${row.schema}.${row.table}` === name))
        {
            throw new Error("Mail worker database schema unavailable");
        }
    }
    for (const row of access.tables)
    {
        if (row.unsafe || row.deletable !== isQueue(row.schema, row.table))
        {
            throw new Error("Unsafe mail worker table permissions");
        }
    }
    for (const row of access.columns)
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

    return access.login;
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
