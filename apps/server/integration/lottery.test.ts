import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { lotteryDomain } from "@opencok/services/lottery";
import { lottery_record } from "@opencok/drizzle/schema/opencok_kingdom/lottery_record";
import { user_lottery } from "@opencok/drizzle/schema/opencok_kingdom/user_lottery";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function fixture() {
  const h = await cityHarness([lotteryDomain]);
  h.clock.now = 172800000;
  await h.db.db
    .update(user_resource)
    .set({ chip: 50000, diamond: 50000 })
    .where(eq(user_resource.uid, "owner"));
  const command = (name: string, params: Fields = {}) =>
    h.command(name, { operationId: sfs.string(randomUUID()), ...params });
  const start = (type = "1", times = "0", position = "0", operationId = sfs.string(randomUUID())) =>
    command("lottery.start", {
      type: sfs.string(type),
      super: sfs.string("0"),
      useGold: sfs.string("0"),
      times: sfs.string(times),
      position: sfs.string(position),
      operationId,
    });
  return { ...h, command, start };
}

test("lottery first chest pins its sequence, replays concurrent draws and rejects stale or repeated selections", async () => {
  const h = await fixture();
  try {
    const init = await h.command("lottery.init", {});
    expect(init.body.lottery).toBeDefined();
    const id = sfs.string(randomUUID());
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.start("1", "0", "0", id)));
    expect(new Set(replies.map((r) => r.body.lottery!.value)).size).toBe(1);
    const [record] = await h.db.db.select().from(lottery_record);
    expect(record!.type).toBe(2);
    expect(record!.times1).toBe(1);
    const pinned = record!.lotteryInfo2;
    expect(
      (await h.db.db.select().from(user_lottery)).reduce((n, r) => n + (r.times ?? 0), 0),
    ).toBe(1);
    await h.command("lottery.init", {});
    expect((await h.db.db.select().from(lottery_record))[0]!.lotteryInfo2).toBe(pinned);
    const stale = await h.start("2", "99");
    expect(stale.body.times2!.value).toBe(0);
    const innerId = sfs.string(randomUUID());
    await Promise.all(Array.from({ length: 4 }, () => h.start("2", "0", "4", innerId)));
    expect((await h.db.db.select().from(lottery_record))[0]!.times2).toBe(1);
    const quantity = (await h.db.db.select().from(user_item)).reduce((n, row) => n + row.count, 0);
    await expect(h.start("2", "1", "4")).rejects.toThrow();
    expect((await h.db.db.select().from(user_item)).reduce((n, row) => n + row.count, 0)).toBe(
      quantity,
    );
    await h.command("lottery.cancel");
    await expect(h.start("2", "1", "5")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("lottery batch charges nine spins on a fresh day, ten thereafter and credits persisted chest tokens", async () => {
  const h = await fixture();
  try {
    await h.command("lottery.init", {});
    h.rules.items.set("normal_lottery", {
      id: "normal_lottery",
      ...Object.fromEntries(
        Array.from({ length: 9 }, (_, i) => [`k${i + 1}`, `100|${i === 8 ? 1 : 0}`]),
      ),
    });
    const id = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () => h.command("lottery.batch", { operationId: id })),
    );
    let [record] = await h.db.db.select().from(lottery_record);
    expect(record!.times1).toBe(10);
    expect(record!.boxTimes).toBe(10);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.chip,
    ).toBe(41000);
    await h.command("lottery.batch");
    [record] = await h.db.db.select().from(lottery_record);
    expect(record!.times1).toBe(20);
    expect(record!.boxTimes).toBe(20);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.chip,
    ).toBe(31000);
    const boxId = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () => h.command("lottery.b.use", { operationId: boxId })),
    );
    expect((await h.db.db.select().from(lottery_record))[0]!.boxTimes).toBe(19);
    await expect(h.command("lottery.b.use")).rejects.toThrow();
    await expect(h.command("lottery.batch")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("inner lottery consumes a persisted multiplier once and does not charge an invalid selection", async () => {
  const h = await fixture();
  try {
    await h.command("lottery.init", {});
    await h.start();
    await h.db.db
      .update(lottery_record)
      .set({ lotteryInfo2: "200:1|200700:2|12:300|13:2|0:100|3:100|1:100|2:100|5:10" })
      .where(eq(lottery_record.uid, "owner"));
    await h.start("2", "0", "8");
    expect((await h.db.db.select().from(lottery_record))[0]!.multiple).toBe(2);
    const id = sfs.string(randomUUID());
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.start("2", "1", "5", id)));
    expect(replies[0]!.body.rewards!.value).toHaveProperty("multiple", sfs.int(2));
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "200700")))[0]!.count,
    ).toBe(4);
    expect((await h.db.db.select().from(lottery_record))[0]!.multiple).toBe(0);
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.diamond;
    await expect(h.start("2", "2", "9")).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!
        .diamond,
    ).toBe(before);
    await h.start("2", "2", "4");
    await h.start("2", "3", "3");
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.chip,
    ).toBe(50300);
  } finally {
    await h.close();
  }
}, 120000);

test("lottery gold top-up covers only the deficit and the next day resets the free spin", async () => {
  const h = await fixture();
  try {
    await h.command("lottery.init", {});
    await h.start();
    await h.command("lottery.cancel");
    await h.db.db.update(user_resource).set({ chip: 100 }).where(eq(user_resource.uid, "owner"));
    const id = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () =>
        h.command("lottery.buy", { super: sfs.string("0"), operationId: id }),
      ),
    );
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.chip,
    ).toBe(1000);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(99991n);
    await expect(h.command("lottery.buy", { super: sfs.string("0") })).rejects.toThrow();
    h.clock.now += 86400000;
    h.rules.items.set("normal_lottery", {
      id: "normal_lottery",
      ...Object.fromEntries(
        Array.from({ length: 9 }, (_, i) => [`k${i + 1}`, `100|${i === 8 ? 1 : 0}`]),
      ),
    });
    await h.start("1", "1");
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.chip,
    ).toBe(1000);
  } finally {
    await h.close();
  }
}, 120000);
