import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, asc, eq, inArray, lte, sql } from "drizzle-orm";
import { special_event_purchase } from "@opencok/drizzle/schema/opencok_global/special_event_purchase";
import { exchange_time } from "@opencok/drizzle/schema/opencok_kingdom/exchange_time";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { text } from "@opencok/contracts/rows";
import type { SpecialEventStock, SpecialEventReservation } from "@opencok/contracts/special-event";
import type { DatabaseClient, DatabaseConnections } from "@opencok/drizzle/contracts/database";
import type { MutationTransaction } from "./mutation";

type Global = DatabaseClient<"global">;

function identity(value: string, limit: number)
{
    if (
        !value
        || value.length > limit
        || !value.trim()
        || !value.isWellFormed()
        || value.includes("\0")
    )
    {
        throw new Error("Invalid special event identity");
    }
}

function reservation(value: SpecialEventReservation)
{
    identity(value.eventId, 128);
    identity(value.ownerUid, 40);
    identity(value.exchangeId, 40);
    cityInteger(value.kingdomId, 1);
    cityAmount(value.start);
    cityAmount(value.end);
    cityAmount(value.reservedAt);

    if (value.start > value.end || value.reservedAt < value.start || value.reservedAt > value.end)
    {
        throw new Error("Invalid special event reservation period");
    }
}

export function createSpecialEventStock(db: Global): SpecialEventStock
{
    const table = special_event_purchase;
    const deadline = async (tx: Parameters<Parameters<Global["transaction"]>[0]>[0]) => {
        await tx.execute(sql`set local lock_timeout = '1000ms'`);
        await tx.execute(sql`set local statement_timeout = '3000ms'`);
    };
    const lock = async (tx: Parameters<Parameters<Global["transaction"]>[0]>[0], id: string) => {
        await tx.execute(sql`select pg_advisory_xact_lock(728216,hashtext(${id}))`);
    };

    return {
        async reserve(value, limit)
        {
            reservation(value);
            cityInteger(limit, 1);

            return db.transaction(async (tx) => {
                await deadline(tx);
                await lock(tx, value.exchangeId);
                const [old] = await tx
                    .select()
                    .from(table)
                    .where(eq(table.eventId, value.eventId))
                    .for("update");

                if (old)
                {
                    if (
                        old.ownerUid !== value.ownerUid
                        || old.kingdomId !== value.kingdomId
                        || old.exchangeId !== value.exchangeId
                        || old.periodStart !== value.start
                        || old.periodEnd !== value.end
                        || old.state === 2
                    )
                    {
                        throw new Error("Special event reservation conflict");
                    }

                    return old;
                }

                const day = value.reservedAt / 86400000n;
                const [daily] = await tx
                    .select({ id: table.eventId })
                    .from(table)
                    .where(
                        and(
                            eq(table.ownerUid, value.ownerUid),
                            eq(table.kingdomId, value.kingdomId),
                            eq(table.exchangeId, value.exchangeId),
                            eq(table.purchaseDay, day),
                            lte(table.state, 1),
                        ),
                    )
                    .limit(1);

                if (daily)
                {
                    throw new Error("Special event daily limit reached");
                }

                const [count] = await tx
                    .select({ total: sql<string>`count(*)::text` })
                    .from(table)
                    .where(
                        and(
                            eq(table.periodStart, value.start),
                            eq(table.exchangeId, value.exchangeId),
                            lte(table.state, 1),
                        ),
                    );

                if (BigInt(count!.total) >= BigInt(limit))
                {
                    throw new Error("Special event stock exhausted");
                }

                const [row] = await tx
                    .insert(table)
                    .values({
                        eventId: value.eventId,
                        ownerUid: value.ownerUid,
                        kingdomId: value.kingdomId,
                        exchangeId: value.exchangeId,
                        periodStart: value.start,
                        periodEnd: value.end,
                        reservedAt: value.reservedAt,
                        purchaseDay: day,
                    })
                    .returning();

                return row!;
            });
        },
        async find(eventId)
        {
            identity(eventId, 128);

            return (await db.select().from(table).where(eq(table.eventId, eventId)).limit(1))[0];
        },
        async confirm(eventId, at)
        {
            identity(eventId, 128);
            cityAmount(at);

            if (at <= 0n)
            {
                throw new Error("Invalid special event payment clock");
            }

            return db.transaction(async (tx) => {
                await deadline(tx);
                const [existing] = await tx.select().from(table).where(eq(table.eventId, eventId))
                    .limit(1);

                if (!existing)
                {
                    throw new Error("Missing special event reservation");
                }

                await lock(tx, existing.exchangeId);
                const [row] = await tx.select().from(table).where(eq(table.eventId, eventId)).for(
                    "update",
                );

                if (!row || row.state === 2 || at < row.periodStart || at > row.periodEnd)
                {
                    throw new Error("Invalid special event payment time or state");
                }

                if (row.state === 1)
                {
                    if (row.purchaseTime !== at)
                    {
                        throw new Error("Special event payment conflict");
                    }

                    return row;
                }

                const [confirmed] = await tx
                    .update(table)
                    .set({ state: 1, purchaseTime: at, purchaseDay: at / 86400000n })
                    .where(eq(table.eventId, eventId))
                    .returning();

                return confirmed!;
            });
        },
        async cancel(eventId)
        {
            identity(eventId, 128);
            await db.transaction(async (tx) => {
                await deadline(tx);
                const [row] = await tx.select().from(table).where(eq(table.eventId, eventId)).limit(
                    1,
                );

                if (!row)
                {
                    throw new Error("Missing special event reservation");
                }

                await lock(tx, row.exchangeId);
                const [current] = await tx
                    .select()
                    .from(table)
                    .where(eq(table.eventId, eventId))
                    .for("update");

                if (current!.state === 1)
                {
                    throw new Error("Cannot cancel a confirmed special event purchase");
                }

                await tx.update(table).set({ state: 2 }).where(eq(table.eventId, eventId));
            });
        },
        async counts(period, products)
        {
            if (products.length > 256)
            {
                throw new Error("Special event product bound exceeded");
            }

            if (!products.length)
            {
                return new Map();
            }

            const rows = await db
                .select({ id: table.exchangeId, total: sql<string>`count(*)::text` })
                .from(table)
                .where(
                    and(
                        eq(table.periodStart, period.start),
                        eq(table.state, 1),
                        inArray(table.exchangeId, [...products]),
                    ),
                )
                .groupBy(table.exchangeId);

            return new Map(rows.map((row) => [row.id, cityInteger(row.total)]));
        },
        async pending(kingdom, now)
        {
            cityInteger(kingdom, 1);
            cityAmount(now);

            return db
                .select()
                .from(table)
                .where(
                    and(
                        eq(table.kingdomId, kingdom),
                        eq(table.state, 1),
                        eq(table.deliveredAt, 0n),
                        lte(table.nextAttemptAt, now),
                    ),
                )
                .orderBy(asc(table.eventId))
                .limit(64);
        },
        async delivered(eventId, owner, kingdom, now)
        {
            identity(eventId, 128);
            identity(owner, 40);
            cityInteger(kingdom, 1);
            cityAmount(now);

            if (now <= 0n)
            {
                throw new Error("Invalid special event delivery time");
            }

            const changed = await db
                .update(table)
                .set({ deliveredAt: now })
                .where(
                    and(
                        eq(table.eventId, eventId),
                        eq(table.ownerUid, owner),
                        eq(table.kingdomId, kingdom),
                        eq(table.state, 1),
                    ),
                )
                .returning({ id: table.eventId });

            if (changed.length !== 1)
            {
                throw new Error("Foreign special event acknowledgment");
            }
        },
        async defer(eventId, now)
        {
            identity(eventId, 128);
            cityAmount(now);
            await db
                .update(table)
                .set({ nextAttemptAt: now })
                .where(
                    and(eq(table.eventId, eventId), eq(table.state, 1), eq(table.deliveredAt, 0n)),
                );
        },
    };
}

export async function writeSpecialEventPurchase(
    tx: MutationTransaction,
    owner: string,
    row: import("@opencok/contracts/rows").Row,
)
{
    if (row.uid !== owner || text(row, "id").length > 40 || !text(row, "id"))
    {
        throw new Error("Foreign special event daily purchase");
    }

    const value = {
        uid: owner,
        id: text(row, "id"),
        beginTime: cityAmount(row.beginTime),
        buyTime: cityAmount(row.buyTime),
    };

    if (value.buyTime < value.beginTime)
    {
        throw new Error("Invalid special event daily purchase time");
    }

    await tx
        .insert(exchange_time)
        .values(value)
        .onConflictDoUpdate({
            target: [exchange_time.uid, exchange_time.id],
            set: { buyTime: sql`greatest(coalesce(${exchange_time.buyTime},0),${value.buyTime})` },
        });
}

export function createSpecialEventBuyer(
    databases: Pick<DatabaseConnections, "getKingdom">,
): import("@opencok/contracts/special-event").SpecialEventBuyer
{
    return {
        async purchaseTime(input)
        {
            identity(input.owner, 40);
            identity(input.exchangeId, 40);
            cityInteger(input.kingdomId, 1);
            const db = databases.getKingdom(input.kingdomId).db;
            const [profile] = await db
                .select({
                    uid: userprofile.uid,
                    realm: userprofile.serverId,
                })
                .from(userprofile)
                .where(eq(userprofile.uid, input.owner))
                .limit(1);

            if (!profile || profile.realm !== input.kingdomId)
            {
                throw new Error("Unavailable special event buyer");
            }

            const [purchase] = await db
                .select({ at: exchange_time.buyTime })
                .from(exchange_time)
                .where(
                    and(eq(exchange_time.uid, input.owner), eq(exchange_time.id, input.exchangeId)),
                )
                .limit(1);

            return purchase?.at ?? null;
        },
    };
}
