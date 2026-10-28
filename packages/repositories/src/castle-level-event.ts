import { and, eq, sql } from "drizzle-orm";
import { castle_leveling_0 } from "@opencok/drizzle/schema/opencok_kingdom/castle_leveling_0";
import { castle_leveling_1 } from "@opencok/drizzle/schema/opencok_kingdom/castle_leveling_1";
import { castle_exchange } from "@opencok/drizzle/schema/opencok_kingdom/castle_exchange";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import type {
    CastleLevelEventRow,
    CastleLevelEventState,
} from "@opencok/contracts/castle-level-event";
import { long } from "@opencok/contracts/rows";
import { castleEventShard } from "@opencok/rules/castle-level-event";
import { cityInteger } from "@opencok/rules/city-progression";
import type { MutationTransaction } from "./mutation";

const shards = [castle_leveling_0, castle_leveling_1] as const;

export async function readCastleLevelEvent(
    tx: MutationTransaction,
    owner: string,
): Promise<CastleLevelEventState>
{
    const rows: CastleLevelEventRow[] = [];
    const counts = new Map<number, number>();

    for (const [shard, table] of shards.entries())
    {
        const owned = await tx.select().from(table).where(eq(table.uid, owner)).limit(65).for(
            "update",
        );

        if (owned.length > 64)
        {
            throw new Error("Too many castle event entitlements");
        }

        for (const row of owned)
        {
            if (rows.some((other) => other.level === row.level))
            {
                throw new Error("Ambiguous castle event entitlement");
            }

            rows.push({ ...row, shard });
        }

        const totals = await tx
            .select({ level: table.level, count: sql<number>`count(*)::integer` })
            .from(table)
            .groupBy(table.level);

        for (const row of totals)
        {
            counts.set(row.level, (counts.get(row.level) ?? 0) + row.count);
        }
    }

    const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));
    const exchanges = await tx
        .select({ id: castle_exchange.id })
        .from(castle_exchange)
        .where(eq(castle_exchange.uid, owner))
        .limit(1025);

    if (exchanges.length > 1024)
    {
        throw new Error("Too many castle event exchanges");
    }

    return {
        rows,
        counts,
        exchanges: exchanges.map((row) => row.id),
        serverOpenTime: long(server ?? {}, "activityTime"),
    };
}

export async function writeCastleLevelEvent(
    tx: MutationTransaction,
    owner: string,
    rows: readonly CastleLevelEventRow[],
    enrollments: readonly number[],
)
{
    if (rows.length > 64 || enrollments.length > 64)
    {
        throw new Error("Too many castle event writes");
    }

    for (const row of rows)
    {
        if (row.uid !== owner || ![0, 1].includes(row.shard))
        {
            throw new Error("Invalid castle event owner");
        }

        const table = shards[row.shard]!;
        const value = {
            lv_reward: cityInteger(row.lv_reward),
            ...Object.fromEntries(
                Array.from({ length: 7 }, (_, i) => [
                    `share_reward_${i}`,
                    cityInteger(row[`share_reward_${i}`]),
                ]),
            ),
        };
        const updated = await tx
            .update(table)
            .set(value)
            .where(and(eq(table.uid, owner), eq(table.level, cityInteger(row.level, 1))))
            .returning({ uid: table.uid });

        if (updated.length !== 1)
        {
            throw new Error("Missing castle event entitlement");
        }
    }

    for (const level of new Set(enrollments))
    {
        let exists = false;

        for (const table of shards)
        {
            const [row] = await tx
                .select({ uid: table.uid })
                .from(table)
                .where(and(eq(table.uid, owner), eq(table.level, cityInteger(level, 1))));
            exists ||= !!row;
        }

        if (!exists)
        {
            await tx.insert(shards[castleEventShard(owner)]!).values({ uid: owner, level });
        }
    }
}
