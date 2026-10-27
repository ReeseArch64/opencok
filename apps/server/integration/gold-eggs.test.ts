import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { gold_eggs } from "@opencok/drizzle/schema/opencok_kingdom/gold_eggs";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { goldFixture, goldEggsCommands } from "./support/gold-eggs";
test("gold eggs persist real weighted boards, budgets and grants with canonical retries, score claims and actual paid costs", async () => {
  const h = await goldFixture();
  try {
    await expect(h.smash(0)).rejects.toThrow();
    const info = (await h.command("goldeggs.info", {})).body;
    expect((info.list!.value as Value[]).map(fields).map((row) => row.id)).toEqual(
      Array(3).fill(sfs.string("9051002")),
    );
    expect(info.freetimes).toEqual(sfs.int(2));
    expect(info.freeflush).toEqual(sfs.int(1));
    const operationId = sfs.string(randomUUID()),
      first = await h.smash(0, { operationId }),
      draws = h.draws();
    expect(await h.smash(0, { operationId })).toEqual(first);
    expect(h.draws()).toBe(draws);
    expect(await h.count()).toBe(1);
    expect((await h.saved()).score).toBe(2n);
    const racing = await Promise.allSettled([h.smash(1), h.smash(1)]);
    expect(racing.filter((row) => row.status === "fulfilled")).toHaveLength(1);
    expect((await h.saved()).freetimes).toBe(0);
    expect(await h.gold()).toBe(100000n);
    await expect(h.command("goldeggs.smashingall", {})).rejects.toThrow("175408");
    const third = await h.smash(2);
    expect(third.body.gold).toEqual(sfs.long(99800));
    expect(third.body.list?.value as Value[]).toHaveLength(3);
    expect((await h.saved()).score).toBe(6n);
    expect(await h.count()).toBe(3);
    expect(
      (
        await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_gold_egg_grants"))
      )[0]?.value,
    ).toBe("3");
    const claim = sfs.string(randomUUID());
    await h.command("goldeggs.scorereward", { pos: sfs.int(0), operationId: claim });
    await h.command("goldeggs.scorereward", { pos: sfs.int(0), operationId: claim });
    expect(await h.count("200003")).toBe(2);
    expect(await h.gold()).toBe(99807n);
    await expect(h.command("goldeggs.scorereward", { pos: sfs.int(0) })).rejects.toThrow();
    await h.command("goldeggs.flush", {});
    expect(await h.gold()).toBe(99807n);
    await h.command("goldeggs.flush", {});
    expect(await h.gold()).toBe(99757n);
    await h.command("goldeggs.flush", {});
    expect(await h.gold()).toBe(99657n);
    expect((await h.saved()).flushcount).toBe(2);
    h.clock.now += 86400000;
    const later = (await h.command("goldeggs.info", {})).body;
    expect(later.freetimes).toEqual(sfs.int(0));
    expect(later.freeflush).toEqual(sfs.int(0));
    expect(later.goldflush).toEqual(sfs.int(200));
    await expect(h.smash(-1)).rejects.toThrow();
    await expect(h.smash(3)).rejects.toThrow();
    await expect(h.command("goldeggs.smashing", { pos: sfs.long(0) })).rejects.toThrow();
    const before = await h.saved(),
      items = await h.db.db.select().from(user_item),
      balance = await h.gold(),
      outbox = await h.db.db.select().from(mutation_outbox);
    await h.db.pool.query(
      "create function reject_gold_eggs() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
    );
    await h.db.pool.query(
      "create trigger reject_gold_eggs before insert on opencok_kingdom.command_receipt for each row execute function reject_gold_eggs()",
    );
    await expect(h.smash(0)).rejects.toThrow();
    expect(await h.saved()).toEqual(before);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(await h.gold()).toBe(balance);
    expect(await h.db.db.select().from(mutation_outbox)).toEqual(outbox);
  } finally {
    await h.close();
  }
}, 120000);
test("multipliers and bulk permutation retain Source weighted-loop and trailing multiplier behavior without using free turns", async () => {
  const h = await goldFixture();
  try {
    await h.command("goldeggs.info", {});
    await h.db.db
      .update(gold_eggs)
      .set({ statelist: "9051005;3;0|9051002;1;0|9051002;1;0" })
      .where(eq(gold_eggs.uid, "owner"));
    expect((await h.smash(0)).body.multiple).toEqual(sfs.int(3));
    await h.smash(1);
    expect(await h.count()).toBe(3);
    expect((await h.saved()).multiple).toBe(1);
    await h.command("goldeggs.flush", {});
    await h.db.db
      .update(gold_eggs)
      .set({ statelist: "9051002;1;0|9051002;1;0|9051005;3;0" })
      .where(eq(gold_eggs.uid, "owner"));
    const before = await h.gold(),
      free = (await h.saved()).freetimes,
      operationId = sfs.string(randomUUID());
    const result = await h.command("goldeggs.smashingall", { operationId });
    expect(await h.command("goldeggs.smashingall", { operationId })).toEqual(result);
    expect(await h.gold()).toBe(before - 5700n);
    expect((await h.saved()).freetimes).toBe(free);
    expect(await h.count()).toBe(9);
    expect((await h.saved()).multiple).toBe(3);
    expect(result.body.step).toEqual(sfs.string("0;1;2"));
    expect(
      (result.body.flushlist!.value as Value[])
        .map(fields)
        .every((row) => row.state?.value === false),
    ).toBe(true);
    await h.smash(0);
    expect(await h.count()).toBe(12);
    expect((await h.saved()).multiple).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("restart preserves pending cells and pinned receipts, stale owners are fenced and new periods cannot reuse old score claims", async () => {
  const h = await goldFixture();
  try {
    await h.command("goldeggs.info", {});
    const operationId = sfs.string(randomUUID()),
      first = await h.smash(0, { operationId });
    const authority = await acquireRealmAuthority(h.db.db, 1, () => true);
    let draws = 0;
    const command = goldEggsCommands(
      h.db.db,
      authority,
      h.rules,
      () => h.clock.now,
      (maximum) => {
        draws++;
        return maximum - 1;
      },
    );
    const replay = await command("goldeggs.smashing", { pos: sfs.int(0), operationId });
    expect(replay).toEqual(first);
    expect(draws).toBe(0);
    expect((await command("goldeggs.info")).body.freetimes).toEqual(sfs.int(1));
    expect(draws).toBe(0);
    await expect(h.smash(1)).rejects.toThrow();
    h.clock.now = Date.UTC(2030, 0, 11);
    h.rules.power.activityPanels!.set("57175", {
      ...h.rules.power.activityPanels!.get("57175")!,
      start: "2030-01-10-00-00",
      end: "2030-01-14-00-00",
    });
    await expect(command("goldeggs.scorereward", { pos: sfs.int(0) })).rejects.toThrow();
    await command("goldeggs.info");
    expect((await h.saved()).score).toBe(0n);
    expect((await h.saved()).score_reward).toBe("");
    await expect(
      command("goldeggs.scorereward", { pos: sfs.int(0), start: sfs.long(Date.UTC(2030, 0, 1)) }),
    ).rejects.toThrow();
    const receipts = await h.db.db.select().from(command_receipt);
    expect(receipts.filter((row) => row.command === "goldeggs.smashing")).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
