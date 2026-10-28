import { planInventoryGrants } from "@opencok/services/inventory";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createShopRepository } from "@opencok/shop/repositories/shops";
import { createTradeExecutor } from "@opencok/shop/repositories/trade";
import { ShopService } from "@opencok/shop/services/shops";
import { TradeService } from "@opencok/shop/services/trade";
import { loadRules } from "@opencok/resources/rules";
import { sfs } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";

export async function shopHarness()
{
    const pg = new DisposablePostgres();
    let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
    try
    {
        const admin = await pg.start();
        await admin.query("CREATE DATABASE \"shop_recovery\"");
        await admin.end();
        db = createDatabase("kingdom", { ...pg.options, database: "shop_recovery", max: 8 });
        await migrate(db.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
                    .pathname,
        });
        await db.db.insert(userprofile).values({
            uid: "buyer",
            name: "Buyer",
            country: "BR",
            serverId: 1,
            level: 1,
            exp: 0,
            gold: 100n,
            appVersion: "12.06.0",
        });
        await db.db.insert(user_resource).values({
            uid: "buyer",
            wood: 0n,
            stone: 0n,
            iron: 0n,
            food: 0n,
            silver: 0,
            chip: 0,
            diamond: 0,
            dragon_food: 0,
            dragon_gold: 0,
            lastUpdateTime: 0n,
        });
        await db.db.insert(user_item).values({
            uuid: "source",
            ownerId: "buyer",
            itemId: "200300",
            count: 8,
            value: 0,
            vanishTime: 0n,
        });
        const rules = await loadRules();
        rules.shops.clear();
        rules.trades.clear();
        const offer = {
            id: "offer",
            onsale: "1",
            item_id: "200301",
            sale_type: "10",
            value1_type: "1",
            value1: "10",
            buy_times_daily: "0",
        };
        rules.shops.set(offer.id, offer);
        rules.trades.set("trade", {
            id: "trade",
            pool_num: "1",
            castle_level: "0",
            recycle_item: "200300",
            range: "1",
            rate: "1",
            num: "2",
            exchange_item: "200301",
            exchange_num: "3",
            exchange_rate: "1",
            premium: "1",
        });
        const clock = { now: Date.UTC(2026, 0, 5, 12) };
        const now = () => clock.now;
        const authority = await acquireRealmAuthority(db.db, 1, () => true);
        const shops = new ShopService(
            createShopRepository(db.db, authority, now),
            rules,
            planInventoryGrants,
        );
        const trade = new TradeService(
            createTradeExecutor(db.db, authority, now),
            rules,
            planInventoryGrants,
        );
        let database = db;
        return {
            pg,
            get db()
            {
                return database;
            },
            rules,
            offer,
            clock,
            now,
            authority,
            shops,
            trade,
            buy: (id = randomUUID()) =>
                shops.command("buyer", "shoppingMall.buy", {
                    id: sfs.string(offer.id),
                    num: sfs.int(1),
                    operationId: sfs.string(id),
                }),
            exchange: (id = randomUUID()) =>
                trade.command("buyer", "trade.exchange", { operationId: sfs.string(id) }),
            snapshot: async () =>
                Object.fromEntries(
                    await Promise.all(
                        [
                            "userprofile",
                            "user_resource",
                            "user_item",
                            "shopping_mall",
                            "shop_stock",
                            "npc_trade",
                            "command_receipt",
                            "economy_posting",
                            "mutation_outbox",
                        ].map(async (table) => [
                            table,
                            (
                                await database.pool.query(
                                    `select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text), '[]'::jsonb) as rows from opencok_kingdom.${table} t`,
                                )
                            ).rows[0].rows,
                        ]),
                    ),
                ),
            restart: async () => {
                await database.close();
                await pg.restart();
                database = createDatabase("kingdom", {
                    ...pg.options,
                    database: "shop_recovery",
                    max: 8,
                });
            },
            close: async () => {
                await database.close();
                await pg.stop();
            },
        };
    }
    catch (error)
    {
        await db?.close();
        await pg.stop();
        throw error;
    }
}
