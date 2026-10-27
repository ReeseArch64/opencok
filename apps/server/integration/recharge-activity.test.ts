import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
  createRechargeActivityDomain,
  rechargeActivityOperationId,
} from "@opencok/services/recharge-activity";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { new_sercum_recharge } from "@opencok/drizzle/schema/opencok_kingdom/new_sercum_recharge";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  let accepted = 0;
  const at = BigInt(Date.UTC(2026, 9, 25, 12));
  const h = await cityHarness([
    createRechargeActivityDomain({
      accepted: async ({ owner, eventId }) => {
        accepted++;
        return owner === "owner" && eventId.startsWith("approved")
          ? { rechargeGold: eventId === "approved-first" ? 500n : 600n, occurredAt: at }
          : null;
      },
    }),
  ]);
  h.clock.now = Number(at);
  h.rules.configuration.payControl!.set("69023", {
    id: "69023",
    k1: "1.0.0",
    k2: "all",
    k72: "all",
    k107: "all",
    k5: "0",
    k7: "2026-10-25-00-00",
    k8: "2026-10-26-00-00",
  });
  h.rules.advanced.rechargeThresholds!.clear();
  h.rules.advanced.rechargeThresholds!.set("9912001", {
    id: "9912001",
    type: "1",
    pay_node: "500",
    pay_reward: "990001",
  });
  h.rules.advanced.rechargeThresholds!.set("9912002", {
    id: "9912002",
    type: "1",
    pay_node: "1000",
    pay_reward: "990001",
  });
  h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
  const saved = async () =>
    (await h.db.db.select().from(user_lord).where(eq(user_lord.uid, "owner")))[0];
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  const paid = (eventId: string) =>
    h.command("new.sercum.paid", {
      eventId: sfs.string(eventId),
      operationId: sfs.string(rechargeActivityOperationId("owner", eventId)),
      amount: sfs.long(999999999n),
    });
  const claims = () =>
    h.db.db.select().from(new_sercum_recharge).where(eq(new_sercum_recharge.uid, "owner"));
  return { ...h, saved, gold, paid, claims, accepted: () => accepted };
}
test("recharge eligibility uses accepted server amounts and every threshold grants only once", async () => {
  const h = await fixture();
  try {
    const baseline = await h.gold();
    await expect(h.command("new.sercum.reward", { id: sfs.string("9912001") })).rejects.toThrow();
    await Promise.all(Array.from({ length: 4 }, () => h.paid("approved-first")));
    expect(h.accepted()).toBe(1);
    expect((await h.saved())!.newSerCumRechargeTotal).toBe(500n);
    expect(await h.gold()).toBe(baseline);
    const login = await h.command("new.sercum.init", {});
    expect(login.body.newSerCumRechargeTotal).toEqual(sfs.long(500n));
    expect(login.body.new_sercum_little_time).toEqual(sfs.long(43200000n));
    const ui = await h.command("new.sercum.ui", {});
    expect(ui.body.new_sercum_recharge!.value as Value[]).toHaveLength(2);
    expect(fields((ui.body.new_sercum_recharge!.value as Value[])[0]).pay_node).toEqual(
      sfs.string("500"),
    );
    const args = { id: sfs.string("9912001"), operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("new.sercum.reward", args)));
    expect(await h.gold()).toBe(baseline + 7n);
    expect(await h.claims()).toHaveLength(1);
    await expect(h.command("new.sercum.reward", { id: sfs.string("9912001") })).rejects.toThrow();
    expect((await h.command("new.sercum.ui", {})).body.new_sercum_recharge_reward!.value).toEqual([
      sfs.string("9912001"),
    ]);
    await expect(h.command("new.sercum.reward", { id: sfs.string("9912002") })).rejects.toThrow();
    await h.paid("approved-second");
    expect((await h.saved())!.newSerCumRechargeTotal).toBe(1100n);
    await h.command("new.sercum.reward", { id: sfs.string("9912002") });
    expect(await h.gold()).toBe(baseline + 14n);
    await expect(
      h.command("new.sercum.paid", {
        eventId: sfs.string("approved-second"),
        operationId: sfs.string(randomUUID()),
      }),
    ).rejects.toThrow();
    expect(await h.db.db.select().from(user_lord).where(eq(user_lord.uid, "other"))).toHaveLength(
      0,
    );
  } finally {
    await h.close();
  }
}, 120000);
test("closed recharge periods recover funded mail once, including late accepted event delivery", async () => {
  const h = await fixture();
  try {
    await h.paid("approved-first");
    h.clock.now = Date.UTC(2026, 9, 26) + 1;
    await h.paid("approved-second");
    expect((await h.saved())!.newSerCumRechargeTotal).toBe(1100n);
    const baseline = await h.gold();
    await Promise.all(Array.from({ length: 4 }, () => h.command("new.sercum.init", {})));
    expect(await h.gold()).toBe(baseline);
    const messages = await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
    expect(messages).toHaveLength(2);
    expect(
      messages.every((message) => message.rewardId === "gold,0,7" && message.rewardStatus === 0),
    ).toBe(true);
    expect(await h.claims()).toHaveLength(2);
    await h.command("new.sercum.init", {});
    expect(await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"))).toHaveLength(2);
    expect((await h.command("new.sercum.ui", {})).body.new_sercum_recharge).toBeUndefined();
    await expect(h.command("new.sercum.reward", { id: sfs.string("9912001") })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("unverified events and receipt failures cannot partially update recharge totals, markers or recovery mail", async () => {
  const h = await fixture();
  try {
    await expect(h.paid("rejected-event")).rejects.toThrow();
    expect(await h.saved()).toBeUndefined();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_recharge_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_recharge_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_recharge_receipt()`,
    );
    await expect(h.paid("approved-first")).rejects.toThrow();
    expect(await h.saved()).toBeUndefined();
    await h.db.db.execute(
      sql`DROP TRIGGER reject_recharge_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.paid("approved-first");
    expect((await h.saved())!.newSerCumRechargeTotal).toBe(500n);
    h.clock.now = Date.UTC(2026, 9, 26) + 1;
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_recharge_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_recharge_receipt()`,
    );
    await expect(h.command("new.sercum.init", {})).rejects.toThrow();
    expect(await h.claims()).toHaveLength(0);
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_recharge_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("new.sercum.init", {});
    expect(await h.claims()).toHaveLength(1);
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
