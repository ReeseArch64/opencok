import type { InventoryPreparation } from "@opencok/economy/repositories/inventory-transaction";
import { and, asc, eq, gt, inArray, ne, sql } from "drizzle-orm";
import { post_box } from "@opencok/drizzle/schema/opencok_kingdom/post_box";
import { post_relation } from "@opencok/drizzle/schema/opencok_kingdom/post_relation";
import { post_mail } from "@opencok/drizzle/schema/opencok_kingdom/post_mail";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { user_auth } from "@opencok/drizzle/schema/opencok_kingdom/user_auth";
import type { PostboxExecutor } from "@opencok/contracts/postbox";
import { text, num, long } from "@opencok/contracts/rows";
import { createMutationExecutor } from "./mutation.ts";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";
import type { RealmAuthority } from "./realm-authority.ts";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function createPostboxExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now,
    preparation?: InventoryPreparation,
): PostboxExecutor
{
    const execute = createMutationExecutor(db, authority, now);

    return (input, plan) =>
        execute(input, async (tx) => {
            const owner = input.owner;
            await preparation?.before?.(tx, owner, BigInt(now()));
            const cutoff = BigInt(now() - 30 * 86_400_000);
            const [mixed] = await tx.select().from(user_mixed_info).where(
                eq(user_mixed_info.uid, owner),
            );
            await tx.execute(
                sql`select pg_advisory_xact_lock(hashtextextended('postbox:distribution',0))`,
            );

            return executeRealmInventoryTransaction(
                tx,
                owner,
                (inventory) =>
                    plan(inventory, {
                        mixed: mixed ?? {},
                        async takeBox()
                        {
                            const [row] = await tx
                                .select()
                                .from(post_box)
                                .where(and(ne(post_box.from, owner), gt(post_box.time, cutoff)))
                                .orderBy(asc(post_box.time), asc(post_box.uid))
                                .limit(1)
                                .for("update", { skipLocked: true });

                            if (!row)
                            {
                                return null;
                            }

                            await tx.delete(post_box).where(eq(post_box.uid, row.uid));

                            return row;
                        },
                        async putBox(row)
                        {
                            await tx.insert(post_box).values({
                                uid: text(row, "uid"),
                                from: owner,
                                name: text(row, "name"),
                                publicValue: num(row, "publicValue"),
                                contents: row.contents as Buffer,
                                seal: text(row, "seal"),
                                time: long(row, "time"),
                            });
                        },
                        async relation(id)
                        {
                            const [row] = await tx
                                .select()
                                .from(post_relation)
                                .where(
                                    and(
                                        eq(post_relation.uid, id),
                                        gt(post_relation.time, cutoff),
                                        sql`${owner}=ANY(string_to_array(${post_relation.players},'|'))`,
                                    ),
                                );

                            return row ?? null;
                        },
                        async relations(ids)
                        {
                            if (!ids.length)
                            {
                                return [];
                            }

                            return tx
                                .select()
                                .from(post_relation)
                                .where(
                                    and(
                                        inArray(post_relation.uid, ids),
                                        gt(post_relation.time, cutoff),
                                        sql`${owner}=ANY(string_to_array(${post_relation.players},'|'))`,
                                    ),
                                )
                                .limit(100);
                        },
                        async saveRelation(row)
                        {
                            await tx
                                .insert(post_relation)
                                .values({
                                    uid: text(row, "uid"),
                                    players: text(row, "players"),
                                    publicValue: text(row, "publicValue"),
                                    time: long(row, "time"),
                                })
                                .onConflictDoUpdate({
                                    target: post_relation.uid,
                                    set: { publicValue: text(row, "publicValue") },
                                });
                        },
                        async unread()
                        {
                            return tx
                                .select()
                                .from(post_mail)
                                .where(
                                    and(
                                        eq(post_mail.toUser, owner),
                                        gt(post_mail.createTime, cutoff),
                                    ),
                                )
                                .orderBy(asc(post_mail.createTime))
                                .limit(100);
                        },
                        async mails(ids)
                        {
                            return ids.length
                                ? tx
                                    .select()
                                    .from(post_mail)
                                    .where(
                                        and(
                                            inArray(post_mail.uid, ids),
                                            eq(post_mail.toUser, owner),
                                            gt(post_mail.createTime, cutoff),
                                        ),
                                    )
                                    .limit(100)
                                : [];
                        },
                        async putMail(row)
                        {
                            await tx.insert(post_mail).values({
                                uid: text(row, "uid"),
                                boxId: text(row, "boxId"),
                                toUser: text(row, "toUser"),
                                fromUser: text(row, "fromUser"),
                                fromName: text(row, "fromName"),
                                contents: row.contents as Buffer,
                                seal: text(row, "seal"),
                                createTime: long(row, "createTime"),
                            });
                        },
                        async removeMails(ids)
                        {
                            if (ids.length)
                            {
                                await tx
                                    .delete(post_mail)
                                    .where(
                                        and(
                                            inArray(post_mail.uid, ids),
                                            eq(post_mail.toUser, owner),
                                        ),
                                    );
                            }
                        },
                        async updateMixed(values)
                        {
                            await tx
                                .insert(user_mixed_info)
                                .values({ uid: owner, mdata: "", ...values })
                                .onConflictDoUpdate({ target: user_mixed_info.uid, set: values });
                        },
                        async grantSeal(id, expiresAt)
                        {
                            await tx
                                .insert(user_auth)
                                .values({ uid: owner, sealId: id, seal: expiresAt })
                                .onConflictDoUpdate({
                                    target: user_auth.uid,
                                    set: { sealId: id, seal: expiresAt },
                                });
                        },
                    }),
                input.command,
            );
        });
}
