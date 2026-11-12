import type { EntityManager } from "typeorm";

export async function advanceIdentity(
    manager: EntityManager,
    table: "kingdoms" | "worlds" | "world_objects",
): Promise<void>
{
    await manager.query(
        `SELECT setval(pg_get_serial_sequence('public.${table}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.${table}), (SELECT last_value FROM public.${table}_id_seq)), true)`,
    );
}
