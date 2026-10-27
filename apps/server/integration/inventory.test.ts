import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { user_item_cd } from "@opencok/drizzle/schema/opencok_kingdom/user_item_cd";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { InventoryService } from "@opencok/services/inventory";
import type { Rule } from "@opencok/rules/game";
import { loadRules } from "@opencok/resources/rules";
import { sfs, fields, encode } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

const effects = { world: async () => new Map<number, number>(), emperor: async () => null };

test("inventory transactions preserve quantities, receipts, effects and fencing across retries and restarts", async () => {
  const pg = new DisposablePostgres();
  const databases: ReturnType<typeof createDatabase<"kingdom">>[] = [];
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "inventory"');
    await admin.end();
    const open = () => {
      const database = createDatabase("kingdom", { ...pg.options, database: "inventory", max: 5 });
      databases.push(database);
      return database;
    };
    const first = open();
    await migrate(first.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    for (const uid of ["inventory-owner", "inventory-other"]) {
      await first.db.insert(userprofile).values({
        uid,
        name: uid,
        serverId: 1,
        country: "BR",
        level: 1,
        exp: 0,
        gold: 10n,
        paidSpecialGold: 20n,
        paidGold: 50n,
      });
      await first.db.insert(user_resource).values({
        uid,
        wood: 100n,
        stone: 0n,
        iron: 0n,
        food: 100n,
        silver: 0,
        chip: 0,
        diamond: 0,
        dragon_food: 0,
        dragon_gold: 0,
        lastUpdateTime: 0n,
      });
    }
    const rules = await loadRules();
    for (const rule of [
      { id: "991001", type: "21", price: "10", useall: "1" },
      { id: "991002", type: "3", para1: "100", para2: "5", useall: "1", price: "2" },
      { id: "991003", type: "3", para1: "101", para2: "10", useall: "1", cd_time: "1" },
      { id: "991004", type: "13", para1: "991001", para2: "991004|991005", para3: "2|1" },
      { id: "991005", type: "0", overlap: "1" },
      { id: "991006", type: "4", price: "1", para1: "1" },
      { id: "991007", type: "21", time_type: "1", vanishTime: "1" },
      { id: "991008", type: "21", price: "10", sales: "2;15|5;30", useall: "1" },
    ] as Rule[])
      {rules.goods.set(rule.id!, rule);}
    rules.materials.set("991100", {
      id: "991100",
      material: "991004;1|991005;1",
      target: "991001;1",
    });
    let ready = true,
      clock = 1000000;
    const authority = await acquireRealmAuthority(first.db, 1, () => ready);
    const service = new InventoryService(
      createInventoryExecutor(first.db, authority),
      rules,
      effects,
      () => clock,
    );
    const command = (name: string, params: Record<string, ReturnType<typeof sfs.int>>) =>
      service.command("inventory-owner", name, {
        ...params,
        operationId: params.operationId ?? sfs.string(randomUUID()),
      });
    const items = async () =>
      first.db.select().from(user_item).where(eq(user_item.ownerId, "inventory-owner"));
    const profile = async () =>
      (await first.db.select().from(userprofile).where(eq(userprofile.uid, "inventory-owner")))[0]!;
    const grantId = randomUUID();
    const grants = await Promise.all(
      Array.from({ length: 5 }, () => service.grant("inventory-owner", grantId, "991004", 6)),
    );
    expect(grants.every((reply) => encode(reply).equals(encode(grants[0]!)))).toBe(true);
    expect((await items()).find((row) => row.itemId === "991004")?.count).toBe(6);
    await expect(service.grant("inventory-owner", grantId, "991004", 7)).rejects.toThrow(
      "conflict",
    );
    const purchaseId = randomUUID();
    const buys = await Promise.all(
      Array.from({ length: 4 }, () =>
        command("item.buy", {
          itemId: sfs.string("991001"),
          num: sfs.int(4),
          operationId: sfs.string(purchaseId),
        }),
      ),
    );
    expect(buys.every((reply) => encode(reply.body).equals(encode(buys[0]!.body)))).toBe(true);
    expect(fields(buys[0]!.body.item).count).toEqual(sfs.int(4));
    expect(buys[0]!.body.costGold).toEqual(sfs.int(40));
    expect((await profile()).gold).toBe(0n);
    expect((await profile()).paidSpecialGold).toBe(0n);
    expect((await profile()).paidGold).toBe(40n);
    const consumable = (await items()).find((row) => row.itemId === "991001")!;
    const spends = await Promise.allSettled(
      Array.from({ length: 2 }, () =>
        command("item.use", { uuid: sfs.string(consumable.uuid), num: sfs.int(3) }),
      ),
    );
    expect(spends.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect((await items()).find((row) => row.uuid === consumable.uuid)?.count).toBe(1);
    await expect(
      service.command("inventory-other", "item.use", {
        uuid: sfs.string(consumable.uuid),
        num: sfs.int(1),
      }),
    ).rejects.toThrow("E100166");
    const beforeFailure = await profile();
    const receiptCount = (await first.db.select().from(command_receipt)).length;
    await expect(
      command("item.buyUse", { itemId: sfs.string("991006"), num: sfs.int(1) }),
    ).rejects.toThrow();
    expect(await profile()).toEqual(beforeFailure);
    expect((await items()).some((row) => row.itemId === "991006")).toBe(false);
    expect(await first.db.select().from(command_receipt)).toHaveLength(receiptCount);
    await expect(
      command("item.compose", { itemId: sfs.string("991004"), pernum: sfs.int(2) }),
    ).rejects.toThrow("E100165");
    expect((await items()).find((row) => row.itemId === "991004")?.count).toBe(6);
    await service.grant("inventory-owner", randomUUID(), "991005", 1);
    await service.grant("inventory-owner", randomUUID(), "991005", 1);
    expect((await items()).filter((row) => row.itemId === "991005")).toHaveLength(2);
    const composed = await command("item.compose", {
      itemId: sfs.string("991004"),
      pernum: sfs.int(2),
    });
    expect(composed.body.itemId).toEqual(sfs.string("991001"));
    expect(composed.body.count).toEqual(sfs.int(3));
    expect((await items()).find((row) => row.itemId === "991004")?.count).toBe(2);
    await service.grant("inventory-owner", randomUUID(), "991005", 1);
    const secondRecipe = await command("item.compose2", { id: sfs.int(991100), count: sfs.int(1) });
    expect(secondRecipe.body.itemlist?.type).toBe(sfs.array().type);
    const expired = await service.grant("inventory-owner", randomUUID(), "991007", 1);
    clock += 60001;
    await expect(command("item.use", { uuid: expired.uuid!, num: sfs.int(1) })).rejects.toThrow(
      "E100166",
    );
    const renewed = await service.grant("inventory-owner", randomUUID(), "991007", 1);
    expect(renewed.uuid).not.toEqual(expired.uuid);
    const buyUse = await command("item.buyUse", { itemId: sfs.string("991002"), num: sfs.int(2) });
    expect(fields(buyUse.body.useRet).count).toEqual(sfs.int(0));
    expect(fields(fields(buyUse.body.useRet).itemEffectObj).delta).toEqual(sfs.int(10));
    const wood = await service.grant("inventory-owner", randomUUID(), "991003", 2);
    const useWood = await command("item.use", { uuid: wood.uuid!, num: sfs.int(1) });
    expect(
      useWood.pushes.find((push) => push.command === "push.city.refresh")?.body.wood_bind,
    ).toEqual(sfs.long(10));
    expect(await first.db.select().from(user_item_cd)).toHaveLength(1);
    await expect(command("item.use", { uuid: wood.uuid!, num: sfs.int(1) })).rejects.toThrow(
      "111160",
    );
    await expect(
      service.grant("inventory-owner", randomUUID(), "991004", 2147483647),
    ).rejects.toThrow();
    for (const count of [0, -1, 1.5, 2147483648])
      {await expect(
        command("item.buy", { itemId: sfs.string("991001"), num: sfs.int(count) }),
      ).rejects.toThrow();}
    const sale = await command("item.buy", { itemId: sfs.string("991008"), num: sfs.int(2) });
    expect(sale.body.costGold).toEqual(sfs.int(15));
    expect(fields(sale.body.item).count).toEqual(sfs.int(2));
    const legs = await first.db
      .select()
      .from(economy_posting)
      .where(eq(economy_posting.requestId, String(buyUse.body.operationId!.value)));
    expect(
      legs
        .filter((row) => row.reason === "inventory.purchase")
        .reduce((sum, row) => sum + row.delta, 0n),
    ).toBe(-4n);
    expect(
      legs
        .filter((row) => row.reason === "inventory.effect")
        .reduce((sum, row) => sum + row.delta, 0n),
    ).toBe(10n);
    expect(legs.filter((row) => row.asset.startsWith("item.")).map((row) => row.delta)).toEqual([
      2n,
      -2n,
    ]);
    expect(
      (await first.db.select().from(mutation_outbox)).every(
        (row) => row.eventType === "inventory.changed",
      ),
    ).toBe(true);
    rules.goods.set("991009", {
      id: "991009",
      type: "43",
      para1: "991001",
      para2: "991009",
      para3: "2",
    });
    const pieces = await service.grant("inventory-owner", randomUUID(), "991009", 4);
    const suite = await command("item.compose.suitequipment.store", {
      uuid: pieces.uuid!,
      num: sfs.int(2),
    });
    expect(suite.body.errorCode).toBeUndefined();
    expect((await items()).find((row) => row.itemId === "991009")?.count).toBe(0);
    const boosted = new InventoryService(
      createInventoryExecutor(first.db, authority),
      rules,
      { ...effects, world: async () => new Map([[100, 50]]) },
      () => clock,
    );
    const coins = await service.grant("inventory-owner", randomUUID(), "991002", 1);
    const bonus = await boosted.command("inventory-owner", "item.use", {
      uuid: coins.uuid!,
      num: sfs.int(1),
    });
    expect(fields(bonus.body.itemEffectObj).delta).toEqual(sfs.int(7));
    const realExecute = createInventoryExecutor(first.db, authority);
    let loseReply = true;
    const unreliable = new InventoryService(
      async (input, plan) => {
        const reply = await realExecute(input, plan);
        if (loseReply) {
          loseReply = false;
          throw new Error("Synthetic lost response after commit");
        }
        return reply;
      },
      rules,
      effects,
      () => clock,
    );
    const lostId = randomUUID();
    await expect(unreliable.grant("inventory-owner", lostId, "991004", 3)).rejects.toThrow(
      "lost response",
    );
    const recovered = await unreliable.grant("inventory-owner", lostId, "991004", 3);
    expect(recovered.count).toEqual(sfs.int(4));
    const saved = await profile();
    await first.db
      .update(userprofile)
      .set({ gold: 9223372036854775807n, paidGold: 0n, paidSpecialGold: 0n })
      .where(eq(userprofile.uid, "inventory-owner"));
    const overflowCoin = await service.grant("inventory-owner", randomUUID(), "991002", 1);
    await expect(
      command("item.use", { uuid: overflowCoin.uuid!, num: sfs.int(1) }),
    ).rejects.toThrow();
    expect((await items()).find((row) => row.uuid === overflowCoin.uuid!.value)?.count).toBe(1);
    await first.db
      .update(userprofile)
      .set({
        gold: saved.gold,
        paidGold: saved.paidGold,
        paidSpecialGold: saved.paidSpecialGold,
        pf: "dmm",
        dmmGold: 3n,
        dmmPaidSpecialGold: 5n,
        dmmPaidGold: 30n,
      })
      .where(eq(userprofile.uid, "inventory-owner"));
    const dmm = await command("item.buy", { itemId: sfs.string("991001"), num: sfs.int(1) });
    expect(dmm.body.remainGold).toEqual(sfs.long(28));
    expect((await profile()).gold).toBe(saved.gold);
    expect((await profile()).dmmGold).toBe(0n);
    expect((await profile()).dmmPaidSpecialGold).toBe(0n);
    expect((await profile()).dmmPaidGold).toBe(28n);
    await pg.restart();
    const second = open();
    const restarted = new InventoryService(
      createInventoryExecutor(second.db, authority),
      rules,
      effects,
    );
    const replay = await restarted.command("inventory-owner", "item.buy", {
      itemId: sfs.string("991001"),
      num: sfs.int(4),
      operationId: sfs.string(purchaseId),
    });
    expect(encode(replay.body)).toEqual(encode(buys[0]!.body));
    expect(
      (await second.db.select().from(economy_posting)).some((row) => row.asset.startsWith("item.")),
    ).toBe(true);
    ready = false;
    await expect(restarted.grant("inventory-owner", randomUUID(), "991001", 1)).rejects.toThrow();
    ready = true;
    await acquireRealmAuthority(second.db, 1, () => true);
    await expect(restarted.grant("inventory-owner", randomUUID(), "991001", 1)).rejects.toThrow();
  } finally {
    for (const database of databases) {await database.close();}
    await pg.stop();
  }
}, 120000);
