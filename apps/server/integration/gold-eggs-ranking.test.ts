import { loadRules } from "@opencok/resources/rules";
import { configureGoldEggs } from "../test/fixtures/gold-eggs";
import type { GoldEggsPeriod } from "@opencok/contracts/gold-eggs";
import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createGoldEggsRanks, createGoldEggsRuntimeStore } from "@opencok/repositories/gold-eggs";
import { GoldEggsRuntime } from "@opencok/services/gold-eggs-runtime";
import { goldEggsAwardParameters } from "@opencok/services/gold-eggs";
import { goldEggsCalendar, goldEggsPeriodId } from "@opencok/rules/gold-eggs";
import { gold_eggs } from "@opencok/drizzle/schema/opencok_kingdom/gold_eggs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { trigger_timmer } from "@opencok/drizzle/schema/opencok_kingdom/trigger_timmer";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import { goldFixture, goldEggsCommands } from "./support/gold-eggs";

test("two realms settle admitted factual rankings into owned pinned mails once, with a durable local/global phase and restart recovery", async () => {
  const one = await goldFixture(),
    two = await goldFixture();
  try {
    const rules2 = await loadRules(undefined, 2);
    configureGoldEggs(rules2);
    const target = rules2.features.get("target_quest")!;
    rules2.features.set("target_quest", { ...target, online: "close", test: "close" });
    await two.db.db.update(userprofile).set({ serverId: 2 });
    const a = await acquireRealmAuthority(one.db.db, 1, () => true),
      b = await acquireRealmAuthority(two.db.db, 2, () => true);
    const now = () => one.clock.now;
    const ranks = createGoldEggsRanks(
      [
        { kingdomId: 1, db: one.db.db, eligible: true },
        { kingdomId: 2, db: two.db.db, eligible: true },
      ],
      now,
    );
    const command1 = goldEggsCommands(one.db.db, a, one.rules, now, () => 0, ranks),
      command2 = goldEggsCommands(two.db.db, b, rules2, now, () => 0, ranks);
    await command1("goldeggs.info");
    await command2("goldeggs.info");
    await command1("goldeggs.smashing", { pos: sfs.int(0) });
    for (const pos of [0, 1, 2, 0]) await command2("goldeggs.smashing", { pos: sfs.int(pos) });
    const period = goldEggsCalendar(one.rules, BigInt(now()))!;
    await one.db.db
      .insert(gold_eggs)
      .values({ uid: "orphan", score: 999n, createtime: BigInt(now()) });
    await one.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "other"));
    await one.db.db
      .insert(gold_eggs)
      .values({ uid: "other", score: 999n, createtime: BigInt(now()) });
    for (const [uid, profile, createdAt] of [
      ["foreign", { serverId: 2 }, BigInt(now())],
      ["visiting", { serverId: 1, crossFightSrcServerId: 2 }, BigInt(now())],
      ["future", { serverId: 1 }, period.end + 1n],
      ["temporarily-banned", { serverId: 1, banTime: period.end + 3600000n }, BigInt(now())],
    ] as const) {
      await one.db.db
        .insert(userprofile)
        .values({ uid, name: "Synthetic", country: "BR", level: 1, exp: 0, ...profile });
      await one.db.db.insert(gold_eggs).values({ uid, score: 999n, createtime: createdAt });
    }
    const global = (await command1("goldeggs.rankAll")).body;
    const rows = (global.allRank!.value as Value[]).map(fields);
    expect(rows.map((row) => row.sid)).toEqual([sfs.string("2"), sfs.string("1")]);
    expect(rows[0]!.rank).toEqual(sfs.int(1));
    expect(rows[0]!.socre).toEqual(sfs.long(8));
    expect((await command1("goldeggs.rank")).body.selfRanking).toEqual(sfs.int(1));
    const store1 = createGoldEggsRuntimeStore(one.db.db, a),
      store2 = createGoldEggsRuntimeStore(two.db.db, b);
    const deliver1 = (owner: string, value: GoldEggsPeriod, global: boolean) =>
      command1("goldeggs.award.deliver", goldEggsAwardParameters(owner, value, global), owner);
    const deliver2 = (owner: string, value: GoldEggsPeriod, global: boolean) =>
      command2("goldeggs.award.deliver", goldEggsAwardParameters(owner, value, global), owner);
    const runtime1 = new GoldEggsRuntime(store1, ranks, one.rules, deliver1, now),
      runtime2 = new GoldEggsRuntime(store2, ranks, rules2, deliver2, now);
    await runtime1.refresh();
    await runtime2.refresh();
    expect(await ranks.final(period)).toBeUndefined();
    one.clock.now = Number(period.end) + 1;
    await runtime1.refresh();
    await runtime2.refresh();
    expect(await ranks.final(period)).toBeUndefined();
    for (const h of [one, two]) {
      const mails = await h.db.db.select().from(mail);
      expect(mails).toHaveLength(1);
      expect(mails[0]!.toUser).toBe("owner");
      expect(mails[0]!.rewardId).toBe("goods,200004,3");
      expect(
        (await h.db.db.select().from(mutation_outbox)).filter(
          (row) => row.eventType === "gold.eggs.mail",
        ),
      ).toHaveLength(1);
    }
    await expect(command1("goldeggs.scorereward", { pos: sfs.int(0) })).rejects.toThrow();
    const capturedBeforeFreeze = goldEggsCommands(
      one.db.db,
      a,
      one.rules,
      () => Number(period.end) - 1,
    );
    await expect(capturedBeforeFreeze("goldeggs.smashing", { pos: sfs.int(1) })).rejects.toThrow();

    one.clock.now += 3600000;
    expect((await ranks.final(period))!.map((row) => row.kingdomId)).toEqual([2, 1]);
    await Promise.all([runtime1.refresh(), runtime1.refresh(), runtime2.refresh()]);
    for (const h of [one, two]) expect(await h.db.db.select().from(mail)).toHaveLength(2);
    const restarted = new GoldEggsRuntime(
      createGoldEggsRuntimeStore(one.db.db, a),
      ranks,
      one.rules,
      deliver1,
      now,
    );
    await restarted.refresh();
    expect(await one.db.db.select().from(mail)).toHaveLength(2);
    await command1("goldeggs.award.deliver", goldEggsAwardParameters("owner", period, true));
    expect(await one.db.db.select().from(mail)).toHaveLength(2);
    await expect(
      command1("goldeggs.award.deliver", goldEggsAwardParameters("other", period, true), "other"),
    ).rejects.toThrow();
    const firstFrozen = (await command1("goldeggs.rankAll")).body;
    one.rules.power.activityPanels!.set("57175", {
      ...one.rules.power.activityPanels!.get("57175")!,
      start: "2030-01-10-00-00",
      end: "2030-01-14-00-00",
    });
    one.clock.now = Date.UTC(2030, 0, 11);
    await command1("goldeggs.info");
    expect((await one.saved()).score).toBe(0n);
    expect((await ranks.live(period)).map((row) => row.score)).toEqual([8n, 2n]);
    expect(firstFrozen.allRank).toEqual(global.allRank);
    const timers = await one.db.db.select().from(trigger_timmer);
    expect(timers.find((row) => row.timmer_name === "runtime.goldEggs")!.count).toBe(3);
    const frozenKey = `gold.eggs.local.v1.${goldEggsPeriodId(period)}`;
    const savedSnapshot = (
      await one.db.db.select().from(trigger_var).where(eq(trigger_var.key, frozenKey))
    )[0]!;
    const corrupt = JSON.parse(savedSnapshot.value);
    corrupt.rows[0].kingdomId = 2;
    await one.db.db
      .update(trigger_var)
      .set({ value: JSON.stringify(corrupt) })
      .where(eq(trigger_var.key, frozenKey));
    await expect(store1.pending()).rejects.toThrow("Duplicate gold eggs standing");
    await one.db.db
      .update(trigger_var)
      .set({ value: savedSnapshot.value })
      .where(eq(trigger_var.key, frozenKey));
    await acquireRealmAuthority(one.db.db, 1, () => true);
    await expect(
      store1.advance(goldEggsCalendar(one.rules, BigInt(now())), BigInt(now())),
    ).rejects.toThrow();
    await expect(command1("goldeggs.info")).rejects.toThrow();
  } finally {
    await one.close();
    await two.close();
  }
}, 120000);

test("expired unadmitted campaigns never backfill ranking prizes; runtime snapshots, timers and receipts roll back together", async () => {
  const h = await goldFixture();
  try {
    const a = await acquireRealmAuthority(h.db.db, 1, () => true),
      store = createGoldEggsRuntimeStore(h.db.db, a);
    const period = goldEggsCalendar(h.rules, BigInt(h.clock.now))!;
    await h.db.db
      .insert(gold_eggs)
      .values({ uid: "owner", score: 100n, createtime: BigInt(h.clock.now) });
    h.clock.now = Number(period.end) + 1;
    await h.db.pool.query(
      "create function reject_gold_snapshot() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
    );
    await h.db.pool.query(
      "create trigger reject_gold_snapshot before insert on opencok_kingdom.command_receipt for each row execute function reject_gold_snapshot()",
    );
    await expect(
      store.advance(goldEggsCalendar(h.rules, BigInt(h.clock.now)), BigInt(h.clock.now)),
    ).rejects.toThrow();
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    expect(await h.db.db.select().from(trigger_timmer)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query("drop trigger reject_gold_snapshot on opencok_kingdom.command_receipt");
    await store.advance(goldEggsCalendar(h.rules, BigInt(h.clock.now)), BigInt(h.clock.now));
    expect((await store.periods())[0]!.admitted).toBe(false);
    expect(await store.pending()).toEqual([]);
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(1);
    const key = `gold.eggs.local.v1.${goldEggsPeriodId(period)}`;
    expect(
      JSON.parse(
        (await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, key)))[0]!.value,
      ).rows,
    ).toEqual([]);
  } finally {
    await h.close();
  }
}, 120000);
