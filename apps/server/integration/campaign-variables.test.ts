import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { sfs, str } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([anniversaryDomain]);
  h.clock.now = Date.UTC(2030, 0, 1, 23, 59);
  h.rules.advanced.campaignRules = [
    {
      id: "synthetic-generic",
      state: 2,
      openType: 2,
      events: [{ code: 58, parameters: "generic" }],
      conditions: [{ code: 32, parameters: "0-3;500" }],
      actions: [
        { code: 9, parameters: "$kingwar_testitem_sent_2;+;1" },
        { code: 9, parameters: "P$long_flower_rank_times;+;1" },
        { code: 24, parameters: "I$long_sss;999" },
        { code: 9, parameters: "P$long_Union Marquee Count;+;1" },
      ],
    },
  ];
  return {
    ...h,
    act: (id = randomUUID()) =>
      h.command("campaign.action", {
        event: sfs.int(58),
        selector: sfs.string("generic"),
        operationId: sfs.string(id),
      }),
    read: (keys: string) => h.command("get.activity.value", { keys: sfs.string(keys) }),
  };
}
test("generic declared campaign variables retain exact long values and isolate personal and realm scopes", async () => {
  const h = await fixture();
  try {
    const server = [...h.rules.advanced.campaignVariables!.values()].find(
      (v) => v.scope === "S" && !v.id.startsWith("long_3th_"),
    )!;
    await h.db.db.insert(trigger_var).values([
      {
        type: 1,
        uid: "owner",
        key: "long_kingwar_testitem_sent_2",
        value: "9007199254740993",
        refreshtime: BigInt(h.clock.now),
      },
      {
        type: 1,
        uid: "other",
        key: "long_kingwar_testitem_sent_2",
        value: "8",
        refreshtime: BigInt(h.clock.now),
      },
      { type: 2, uid: "1", key: server.id, value: "37", refreshtime: BigInt(h.clock.now) },
      { type: 2, uid: "2", key: server.id, value: "41", refreshtime: BigInt(h.clock.now) },
    ]);
    const keys = `$kingwar_testitem_sent_2;S$${server.id};I$long_sss`,
      body = (await h.read(keys)).body;
    expect(str(body, "keys")).toBe(keys);
    expect(str(body, "values")).toBe(
      `$kingwar_testitem_sent_2=9007199254740993;S$${server.id}=37;I$long_sss=100`,
    );
    expect(
      (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, "other")))[0]?.value,
    ).toBe("8");
    await expect(h.read("P$long_undeclared_campaign")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("generic personal counters use inclusive realm ranges, replay once and leave static declarations immutable", async () => {
  const h = await fixture();
  try {
    const id = randomUUID();
    await h.act(id);
    await h.act(id);
    expect(
      str(
        (await h.read("$kingwar_testitem_sent_2;P$long_flower_rank_times;I$long_sss")).body,
        "values",
      ),
    ).toBe("$kingwar_testitem_sent_2=1;P$long_flower_rank_times=1;I$long_sss=100");
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(3);
    expect(str((await h.read("P$long_Union Marquee Count")).body, "values")).toBe(
      "P$long_Union Marquee Count=1",
    );
    h.rules.advanced.campaignRules = [
      { ...h.rules.advanced.campaignRules![0]!, conditions: [{ code: 32, parameters: "2-50;70" }] },
    ];
    await h.act();
    expect(str((await h.read("$kingwar_testitem_sent_2")).body, "values")).toBe(
      "$kingwar_testitem_sent_2=1",
    );
  } finally {
    await h.close();
  }
}, 120000);
test("generic campaign writes roll back with their receipt and preserve unrelated legacy counters", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .insert(trigger_var)
      .values({ type: 1, uid: "owner", key: "long_private_counter", value: "55", refreshtime: 1n });
    await h.db.pool.query(
      `create function reject_generic_campaign() returns trigger language plpgsql as $$ begin if new.command='campaign.action' then raise exception 'synthetic campaign failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_generic_campaign before insert on opencok_kingdom.command_receipt for each row execute function reject_generic_campaign()`,
    );
    const id = randomUUID();
    await expect(h.act(id)).rejects.toThrow();
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(1);
    await h.db.pool.query(
      `drop trigger reject_generic_campaign on opencok_kingdom.command_receipt`,
    );
    await h.act(id);
    expect(
      (
        await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_private_counter"))
      )[0]?.value,
    ).toBe("55");
    expect(
      (
        await h.db.db
          .select()
          .from(trigger_var)
          .where(
            and(eq(trigger_var.uid, "owner"), eq(trigger_var.key, "long_kingwar_testitem_sent_2")),
          )
      )[0]?.value,
    ).toBe("1");
  } finally {
    await h.close();
  }
}, 120000);
test("generic daily personal counters refresh at the saved UTC boundary without resetting another actor", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(trigger_var).values({
      type: 1,
      uid: "other",
      key: "long_flower_rank_times",
      value: "7",
      refreshtime: BigInt(h.clock.now),
    });
    await h.act();
    h.clock.now += 60000;
    expect(str((await h.read("$flower_rank_times;$kingwar_testitem_sent_2")).body, "values")).toBe(
      "$flower_rank_times=0;$kingwar_testitem_sent_2=1",
    );
    await h.act();
    expect(str((await h.read("$flower_rank_times;$kingwar_testitem_sent_2")).body, "values")).toBe(
      "$flower_rank_times=1;$kingwar_testitem_sent_2=2",
    );
    expect(
      (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, "other")))[0]?.value,
    ).toBe("7");
  } finally {
    await h.close();
  }
}, 120000);
