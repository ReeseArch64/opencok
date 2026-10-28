import { eq } from "drizzle-orm";
import { npc_trade } from "@opencok/drizzle/schema/opencok_kingdom/npc_trade";
import type { TradeExecutor } from "@opencok/shop/contracts/trade";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { RealmAuthority } from "@opencok/repositories/realm-authority";
import { createMutationExecutor } from "@opencok/repositories/mutation";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";

export function createTradeExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now,
): TradeExecutor
{
    const execute = createMutationExecutor(db, authority, now);

    return (input, plan) =>
        execute(input, async (tx) => {
            const [row] = await tx
                .select()
                .from(npc_trade)
                .where(eq(npc_trade.uid, input.owner))
                .for("update");
            const timestamp = now();
            const trade =
                row && (row.time ?? 0n) / 86400000n === BigInt(Math.floor(timestamp / 86400000))
                    ? {
                        trade: row.trade,
                        time: row.time ?? 0n,
                        num: row.num ?? 0,
                        superValue: row.superValue ?? 0,
                    }
                    : { trade: "", time: BigInt(timestamp), num: 0, superValue: 0 };

            return executeRealmInventoryTransaction(
                tx,
                input.owner,
                async (inventory) => {
                    const result = await plan(inventory, trade, timestamp);

                    if (
                        result.trade.trade.length > 100
                        || !Number.isInteger(result.trade.num)
                        || result.trade.num < 0
                        || result.trade.num > 2147483647
                        || ![0, 1].includes(result.trade.superValue)
                    )
                    {
                        throw new Error("Invalid trade state");
                    }

                    await tx
                        .insert(npc_trade)
                        .values({ uid: input.owner, ...result.trade })
                        .onConflictDoUpdate({ target: npc_trade.uid, set: result.trade });

                    return result.inventory;
                },
                input.command,
            );
        });
}
