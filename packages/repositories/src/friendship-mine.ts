import type { InventoryPreparation } from "@opencok/economy/repositories/inventory-transaction";
import { and, eq } from "drizzle-orm";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { createMutationExecutor } from "./mutation.ts";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";
import { readFriendshipBinding } from "./reconnect-mine.ts";
import type { FriendshipMineExecutor, MineHelper } from "@opencok/contracts/friendship-mine";
import { text, num, long } from "@opencok/contracts/rows";
import type { RealmAuthority } from "./realm-authority.ts";
import type { DatabaseConnection } from "@opencok/drizzle/contracts/database";
import type { FriendshipMine } from "@opencok/contracts/reconnect";

export function createFriendshipMineExecutor(
    database: {
        kingdom: Pick<DatabaseConnection<"kingdom">, "db">;
        databases: { global: Pick<DatabaseConnection<"global">, "db">; };
    },
    authority: RealmAuthority,
    initial: () => FriendshipMine,
    now = Date.now,
    preparation?: InventoryPreparation,
): FriendshipMineExecutor
{
    const execute = createMutationExecutor(database.kingdom.db, authority, now);

    return async (command, plan) => {
        const binding = await readFriendshipBinding(
            database.databases.global.db,
            authority.kingdomId,
            command.owner,
        );

        if (!binding)
        {
            throw new Error("Friendship binding required");
        }

        return execute(command, async (tx) => {
            await preparation?.before?.(tx, command.owner, BigInt(now()));
            await tx
                .insert(user_mine)
                .values({ uid: command.owner, fId: binding, ...initial() })
                .onConflictDoNothing();
            const [mine] = await tx
                .select()
                .from(user_mine)
                .where(and(eq(user_mine.uid, command.owner), eq(user_mine.fId, binding)))
                .for("update");

            if (!mine)
            {
                throw new Error("Friendship mine unavailable");
            }

            const helpers: unknown = mine.helpInfo?.length
                ? JSON.parse(mine.helpInfo.toString("utf8"))
                : [];

            if (
                !Array.isArray(helpers)
                || helpers.length > 50
                || helpers.some(
                    (helper) =>
                        !helper
                        || typeof helper.gUid !== "string"
                        || typeof helper.name !== "string"
                        || !Number.isSafeInteger(helper.time),
                )
            )
            {
                throw new Error("Invalid mine helper history");
            }

            return executeRealmInventoryTransaction(
                tx,
                command.owner,
                (inventory) =>
                    plan(inventory, {
                        binding,
                        mine,
                        helpers: helpers as MineHelper[],
                        async save(row, history)
                        {
                            if (text(row, "uid") !== command.owner || history.length > 50)
                            {
                                throw new Error("Foreign mine mutation");
                            }

                            await tx
                                .update(user_mine)
                                .set({
                                    itemId: num(row, "itemId"),
                                    level: num(row, "level"),
                                    exp: num(row, "exp"),
                                    miner: num(row, "miner"),
                                    mineTime: long(row, "mineTime"),
                                    call: num(row, "call"),
                                    helpInfo: Buffer.from(JSON.stringify(history)),
                                })
                                .where(
                                    and(
                                        eq(user_mine.uid, command.owner),
                                        eq(user_mine.fId, binding),
                                    ),
                                );
                        },
                    }),
                command.command,
            );
        });
    };
}
