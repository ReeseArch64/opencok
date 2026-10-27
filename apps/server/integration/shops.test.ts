import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { shopping_mall } from "@opencok/drizzle/schema/opencok_kingdom/shopping_mall";
import { shop_stock } from "@opencok/drizzle/schema/opencok_kingdom/shop_stock";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createShopRepository } from "@opencok/repositories/shops";
import { createTradeExecutor } from "@opencok/repositories/trade";
import { TradeService } from "@opencok/services/trade";
import { npc_trade } from "@opencok/drizzle/schema/opencok_kingdom/npc_trade";
import { ShopService } from "@opencok/services/shops";
import { loadRules } from "@opencok/resources/rules";
import { sfs } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

test("shops serialize stock and account limits with debit, delivery, receipt, rollback and epoch fencing", async () => {
  const pg = new DisposablePostgres();
  const databases: ReturnType<typeof createDatabase<"kingdom">>[] = [];
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "shops"');
    await admin.end();
    const open = () => {
      const database = createDatabase("kingdom", { ...pg.options, database: "shops", max: 8 });
      databases.push(database);
      return database;
    };
    const first = open();
    await migrate(first.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    for (const uid of ["buyer", "other"]) {
      await first.db
        .insert(userprofile)
        .values({ uid, name: uid, country: "BR", serverId: 1, exp: 0, level: 1, gold: 100n });
      await first.db.insert(user_resource).values({
        uid,
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
    }
    const rules = await loadRules();
    rules.shops.clear();
    const rule = {
      id: "test",
      onsale: "1",
      item_id: "200300",
      sale_type: "10",
      value1_type: "1",
      value1: "10",
      buy_times_daily: "2",
      total_times: "3",
    };
    rules.shops.set("test", rule);
    let now = 86400000;
    const authority = await acquireRealmAuthority(first.db, 1, () => true);
    let service = new ShopService(
      createShopRepository(first.db, authority, () => now),
      rules,
    );
    const buy = (owner = "buyer", operationId = randomUUID(), id = "test", count = 1) =>
      service.command(owner, "shoppingMall.buy", {
        id: sfs.string(id),
        num: sfs.int(count),
        operationId: sfs.string(operationId),
      });
    const balance = async (owner = "buyer") =>
      (await first.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!.gold;
    const operation = randomUUID();
    const replies = await Promise.all(Array.from({ length: 8 }, () => buy("buyer", operation)));
    expect(replies.every((reply) => reply.body.gold!.value === 90n)).toBe(true);
    expect(await balance()).toBe(90n);
    expect((await first.db.select().from(user_item))[0]!.count).toBe(1);
    expect((await first.db.select().from(shop_stock))[0]!.purchased).toBe(1n);
    await expect(buy("buyer", operation, "test", 2)).rejects.toThrow();
    expect((await buy()).body.shoppingMallItems).toEqual(sfs.object({}));
    await expect(buy()).rejects.toThrow();
    const raced = await Promise.allSettled([buy(), buy(), buy("other"), buy("other")]);
    expect(raced.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect((await first.db.select().from(shop_stock))[0]!.purchased).toBe(3n);
    expect(
      (await first.db.select().from(user_item)).reduce((sum, item) => sum + item.count, 0),
    ).toBe(3);
    expect((await first.db.select().from(shopping_mall)).every((row) => row.buyDaily! <= 2)).toBe(
      true,
    );
    expect(await first.db.select().from(command_receipt)).toHaveLength(3);
    now += 86400000;
    await expect(buy()).rejects.toThrow();
    rules.shops.set("cycle", {
      ...rule,
      id: "cycle",
      total_times: "0",
      buy_times_refresh: "2",
      begin_time: "0",
      times_refresh: "1",
      buy_times_refresh_count: "1",
    });
    await buy("buyer", randomUUID(), "cycle");
    await expect(buy("buyer", randomUUID(), "cycle")).rejects.toThrow();
    now += 86400000;
    await buy("buyer", randomUUID(), "cycle");
    rules.shops.set("weekly", {
      ...rule,
      id: "weekly",
      total_times: "0",
      onsale_type: "2",
      begin_time: "2",
      sale_life: "2",
    });
    now = Date.UTC(2026, 0, 5);
    await buy("buyer", randomUUID(), "weekly");
    const afterWeekly = await balance();
    now += 2 * 3600000;
    await expect(buy("buyer", randomUUID(), "weekly")).rejects.toThrow();
    now += 86400000;
    await expect(buy("buyer", randomUUID(), "weekly")).rejects.toThrow();
    expect(await balance()).toBe(afterWeekly);
    expect(
      (await first.db.select().from(shop_stock).where(eq(shop_stock.id, "weekly")))[0]!.purchased,
    ).toBe(1n);
    rules.shops.set("failure", { ...rule, id: "failure", total_times: "0" });
    await first.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_shop_receipt() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''synthetic rollback''; END'`,
    );
    await first.db.execute(
      sql`CREATE TRIGGER reject_shop_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_shop_receipt()`,
    );
    const before = await balance();
    await expect(buy("buyer", randomUUID(), "failure")).rejects.toThrow();
    expect(await balance()).toBe(before);
    expect(
      await first.db.select().from(shop_stock).where(eq(shop_stock.id, "failure")),
    ).toHaveLength(0);
    await first.db.execute(
      sql`DROP TRIGGER reject_shop_receipt ON opencok_kingdom.command_receipt`,
    );
    rules.shops.set("cost", { ...rule, id: "cost", value1: "2147483647" });
    await expect(buy("buyer", randomUUID(), "cost")).rejects.toThrow();
    expect(await balance()).toBe(before);
    rules.trades.clear();
    rules.trades.set("trade", {
      id: "trade",
      pool_num: "1",
      castle_level: "0",
      recycle_item: "200300",
      range: "1",
      rate: "1",
      num: "1",
      exchange_item: "200301",
      exchange_num: "2",
      exchange_rate: "1",
    });
    const tradeService = new TradeService(
      createTradeExecutor(first.db, authority, () => now),
      rules,
    );
    const offered = await tradeService.command("buyer", "trade.info", {});
    expect(offered.body.trade).toEqual(sfs.string("200300;1|200301;2"));
    const sourceCount = (
      await first.db.select().from(user_item).where(eq(user_item.ownerId, "buyer"))
    )
      .filter((item) => item.itemId === "200300")
      .reduce((sum, item) => sum + item.count, 0);
    const tradeId = randomUUID();
    const tradeReplies = await Promise.all(
      Array.from({ length: 8 }, () =>
        tradeService.command("buyer", "trade.exchange", { operationId: sfs.string(tradeId) }),
      ),
    );
    expect(tradeReplies.every((reply) => reply.body.addItem)).toBe(true);
    expect(
      (await first.db.select().from(user_item).where(eq(user_item.ownerId, "buyer")))
        .filter((item) => item.itemId === "200300")
        .reduce((sum, item) => sum + item.count, 0),
    ).toBe(sourceCount - 1);
    expect(
      (await first.db.select().from(user_item).where(eq(user_item.itemId, "200301")))[0]!.count,
    ).toBe(2);
    expect((await first.db.select().from(npc_trade))[0]!.num).toBe(1);
    await tradeService.command("buyer", "trade.exchange", {});
    expect(
      (await first.db.select().from(user_item).where(eq(user_item.itemId, "200301")))[0]!.count,
    ).toBe(2);
    await expect(tradeService.command("buyer", "trade.info", {})).rejects.toThrow();
    now += 86400000;
    await tradeService.command("buyer", "trade.info", {});
    await tradeService.command("buyer", "trade.cancel", {});
    expect((await first.db.select().from(npc_trade))[0]!.trade).toBe("");
    expect((await first.db.select().from(npc_trade))[0]!.num).toBe(0);
    const repo = createShopRepository(first.db, authority, () => now);
    let lost = true;
    const unreliable = new ShopService(
      {
        ...repo,
        execute: async (...args) => {
          const result = await repo.execute(...args);
          if (lost) {
            lost = false;
            throw new Error("synthetic lost reply");
          }
          return result;
        },
      },
      rules,
    );
    const lostRequest = {
      id: sfs.string("failure"),
      num: sfs.int(1),
      operationId: sfs.string(randomUUID()),
    };
    await expect(unreliable.command("buyer", "shoppingMall.buy", lostRequest)).rejects.toThrow(
      "synthetic lost reply",
    );
    const committedBalance = await balance();
    await unreliable.command("buyer", "shoppingMall.buy", lostRequest);
    expect(await balance()).toBe(committedBalance);
    expect(
      (await first.db.select().from(shop_stock).where(eq(shop_stock.id, "failure")))[0]!.purchased,
    ).toBe(1n);
    await first.close();
    databases.splice(databases.indexOf(first), 1);
    await pg.restart();
    const reopened = open();
    const nextAuthority = await acquireRealmAuthority(reopened.db, 1, () => true);
    service = new ShopService(
      createShopRepository(reopened.db, nextAuthority, () => now),
      rules,
    );
    expect((await buy("buyer", operation)).body.gold!.value).toBe(90n);
    const stale = new ShopService(
      createShopRepository(reopened.db, authority, () => now),
      rules,
    );
    await expect(
      stale.command("buyer", "shoppingMall.buy", { id: sfs.string("failure"), num: sfs.int(1) }),
    ).rejects.toThrow();
    expect(
      (await reopened.db.select().from(shop_stock).where(eq(shop_stock.id, "test")))[0]!.purchased,
    ).toBe(3n);
  } finally {
    for (const db of databases) await db.close();
    await pg.stop();
  }
}, 120000);
