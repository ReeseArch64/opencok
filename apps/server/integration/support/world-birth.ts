import type { createDatabase } from "@opencok/drizzle";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { worldBirthIdentity } from "@opencok/repositories/world-birth";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import { initialWorldBirth, worldBirthRules } from "@opencok/rules/world-birth";
import type { Rules } from "@opencok/rules/game";

export async function seedSyntheticWorldBirth(
    db: ReturnType<typeof createDatabase<"kingdom">>["db"],
    authority: RealmAuthority,
    rules: Rules,
    phase: 0 | 1 | 2 = 2,
)
{
    await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
        const state = initialWorldBirth(worldBirthRules(rules), authority.epoch);
        state.phase = phase;
        const counts = await tx
            .select({ area: worldpoint.bornAreaId, count: sql<number>`count(*)::integer` })
            .from(worldpoint)
            .where(
                and(
                    eq(worldpoint.worldId, 0),
                    eq(worldpoint.pointType, 1),
                    isNotNull(worldpoint.bornAreaId),
                ),
            )
            .groupBy(worldpoint.bornAreaId);
        state.counts = Object.fromEntries(counts.map((row) => [String(row.area), row.count]));
        await tx
            .insert(trigger_var)
            .values({ ...worldBirthIdentity, value: JSON.stringify(state), refreshtime: 0n });
    });
}
