import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { alchemistDomain } from "@opencok/services/alchemist";
import { minstrelDomain } from "@opencok/services/minstrel";
import { activity_minstrel } from "@opencok/drizzle/schema/opencok_kingdom/activity_minstrel";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { sfs, fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([alchemistDomain, minstrelDomain]);
  h.clock.now = Date.UTC(2026, 9, 25, 12);
  h.rules.power.activityPanels!.set("57139", {
    id: "57139",
    function_on: "1",
    start: "2026-10-25-00-00",
    end: "2026-10-30-00-00",
  });
  h.rules.items.set("alchemist", { id: "alchemist", k1: "2", k2: "3", k3: "60", k4: "990001" });
  h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
  const saved = async (type = 1) =>
    (
      await h.db.db
        .select()
        .from(activity_minstrel)
        .where(and(eq(activity_minstrel.uid, "owner"), eq(activity_minstrel.type, type)))
    )[0];
  const command = (action: string, operationId = sfs.string(randomUUID())) =>
    h.command("alchemist", { M__REQUEST_ID__H: sfs.string(action), operationId });
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  return { ...h, saved, command, gold };
}
test("alchemist rewards persist independently, honor cooldowns and reset daily counters without clearing timestamps", async () => {
  const h = await fixture();
  try {
    const info = fields((await h.command("info")).body.info);
    expect(info.reward_total_times).toEqual(sfs.int(2));
    expect(info.initdelay).toEqual(sfs.int(3));
    expect(info.listen_total_times).toBeUndefined();
    const baseline = await h.gold(),
      operationId = sfs.string(randomUUID());
    const replies = await Promise.all(
      Array.from({ length: 4 }, () => h.command("reward", operationId)),
    );
    expect(replies.every((reply) => reply.body.rewards !== undefined)).toBe(true);
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.saved())!.reward).toBe(1);
    expect(await h.saved(0)).toBeUndefined();
    const before = (await h.saved())!.rewardtime;
    expect((await h.command("reward")).body.rewards).toBeUndefined();
    h.clock.now += 59999;
    expect((await h.command("reward")).body.rewards).toBeUndefined();
    h.clock.now += 1;
    await h.command("reward");
    expect(await h.gold()).toBe(baseline + 14n);
    h.clock.now += 60000;
    await expect(h.command("reward")).rejects.toThrow();
    h.clock.now = Date.UTC(2026, 9, 26);
    const reset = fields((await h.command("info")).body.info);
    expect(reset.reward).toEqual(sfs.int(0));
    expect(reset.rewardtime).toEqual(sfs.long(before! + 60000n));
    await h.command("reward");
    expect(await h.gold()).toBe(baseline + 21n);
    expect((await h.saved())!.reward).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("alchemist rejects closed or unsupported actions and rolls back a grant with its claim marker", async () => {
  const h = await fixture();
  try {
    await expect(h.command("share")).rejects.toThrow();
    expect(await h.saved()).toBeUndefined();
    h.rules.power.activityPanels!.get("57139")!.function_on = "0";
    await expect(h.command("reward")).rejects.toThrow();
    h.rules.power.activityPanels!.get("57139")!.function_on = "1";
    const baseline = await h.gold();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_alchemist_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_alchemist_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_alchemist_receipt()`,
    );
    await expect(h.command("reward")).rejects.toThrow();
    expect(await h.gold()).toBe(baseline);
    expect(await h.saved()).toBeUndefined();
    await h.db.db.execute(
      sql`DROP TRIGGER reject_alchemist_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("reward");
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.saved())!.reward).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
