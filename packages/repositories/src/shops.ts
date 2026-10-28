import type { InventoryPlan } from "@opencok/contracts/inventory";
import type { MutationResult } from "@opencok/contracts/mutation";
import type { ShopPurchase } from "@opencok/contracts/shops";
import type { MutationTransaction } from "./mutation";
import { and, eq } from "drizzle-orm";
import { shopping_mall } from "@opencok/drizzle/schema/opencok_kingdom/shopping_mall";
import { shop_stock } from "@opencok/drizzle/schema/opencok_kingdom/shop_stock";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import type { ShopRepository } from "@opencok/contracts/shops";
import type { Database } from "./game.ts";
import type { RealmAuthority } from "./realm-authority.ts";
import { createMutationExecutor } from "./mutation.ts";
import { executeInventoryTransaction } from "./inventory.ts";

export function createShopRepository(
    db: Database["kingdom"]["db"],
    authority: RealmAuthority,
    now = Date.now,
    confirmed?: (
        tx: MutationTransaction,
        owner: string,
        purchase: ShopPurchase,
        inventory: InventoryPlan,
        now: number,
    ) => Promise<MutationResult | undefined>,
): ShopRepository
{
    const execute = createMutationExecutor(db, authority, now);

    return {
        async read(owner, select)
        {
            return db.transaction(
                async (tx) => {
                    const [profile] = await tx.select().from(userprofile).where(
                        eq(userprofile.uid, owner),
                    );

                    if (!profile)
                    {
                        throw new Error("Missing shop account");
                    }

                    const buildings = await tx
                        .select()
                        .from(user_building)
                        .where(eq(user_building.uid, owner));

                    return select({
                        inventory: {
                            profile,
                            resource: {},
                            items: [],
                            cooldowns: new Map(),
                            buildings,
                            effects: async () => {
                                throw new Error("Shop listing does not evaluate effects");
                            },
                        },
                        purchases: await tx.select().from(shopping_mall).where(
                            eq(shopping_mall.uid, owner),
                        ),
                        stock: await tx.select().from(shop_stock),
                        now: now(),
                    });
                },
                { isolationLevel: "repeatable read", accessMode: "read only" },
            );
        },
        execute(input, offer, plan)
        {
            if (!offer || offer.length > 40)
            {
                throw new Error("Invalid shop offer");
            }

            return execute(input, async (tx) => {
                await tx.insert(shop_stock).values({ id: offer }).onConflictDoNothing();
                const stock = await tx
                    .select()
                    .from(shop_stock)
                    .where(eq(shop_stock.id, offer))
                    .for("update");
                const purchases = await tx
                    .select()
                    .from(shopping_mall)
                    .where(and(eq(shopping_mall.uid, input.owner), eq(shopping_mall.id, offer)))
                    .for("update");
                const timestamp = now();
                let savedPurchase: ShopPurchase | undefined;

                return executeInventoryTransaction(
                    tx,
                    input.owner,
                    async (inventory) => {
                        const result = await plan({ inventory, purchases, stock, now: timestamp });

                        if (result.purchase)
                        {
                            const purchase = result.purchase;
                            savedPurchase = purchase;

                            if (
                                purchase.id !== offer
                                || !Number.isInteger(purchase.count)
                                || purchase.count <= 0
                                || purchase.count > 2147483647
                            )
                            {
                                throw new Error("Invalid shop purchase");
                            }

                            const values = {
                                buyDaily: purchase.daily,
                                buyTotal: purchase.total,
                                buyTime: BigInt(timestamp),
                                flushTotalTime: purchase.cycle,
                            };
                            await tx
                                .insert(shopping_mall)
                                .values({ uid: input.owner, id: offer, ...values })
                                .onConflictDoUpdate({
                                    target: [shopping_mall.uid, shopping_mall.id],
                                    set: values,
                                });
                            await tx
                                .update(shop_stock)
                                .set({ purchased: stock[0]!.purchased + BigInt(purchase.count) })
                                .where(eq(shop_stock.id, offer));
                        }

                        return result.inventory;
                    },
                    input.command,
                    undefined,
                    undefined,
                    (inventory) =>
                        savedPurchase && confirmed
                            ? confirmed(tx, input.owner, savedPurchase, inventory, timestamp)
                            : Promise.resolve(undefined),
                );
            });
        },
    };
}
