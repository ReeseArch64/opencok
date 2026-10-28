import { inspectServiceRoleAccess } from "@opencok/drizzle/service-role-access";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export const schedulerReadColumns: Readonly<Record<string, readonly string[]>> = {
    "opencok_kingdom.queue": ["uuid", "ownerId", "type", "itemId", "startTime", "updateTime"],
    "opencok_kingdom.timed_activity": [
        "id",
        "ownerId",
        "queueId",
        "type",
        "dueAt",
        "version",
        "status",
    ],
    "scheduler_access.binding": ["role_name", "kingdom_id", "database_kind"],
};

export async function checkSchedulerPermissions(
    db: DatabaseClient<"kingdom">,
    kingdomId: number,
): Promise<void>
{
    const access = await inspectServiceRoleAccess(db, "scheduler_access", kingdomId, "kingdom");
    for (const [table, columns] of Object.entries(schedulerReadColumns))
    {
        for (const column of columns)
        {
            if (
                !access.columns.some((row) =>
                    `${row.schema}.${row.table}` === table
                    && row.column === column
                )
            )
            {
                throw new Error("Scheduler database schema unavailable");
            }
        }
    }
    for (const table of access.tables)
    {
        if (table.deletable || table.unsafe)
        {
            throw new Error("Unsafe scheduler table permissions");
        }
    }
    for (const column of access.columns)
    {
        const readable = schedulerReadColumns[`${column.schema}.${column.table}`]
            ?.includes(column.column) ?? false;
        if (
            column.readable !== readable || column.writable || column.insertable
            || column.referenceable || column.grantable
        )
        {
            throw new Error("Unsafe scheduler column permissions");
        }
    }
}
