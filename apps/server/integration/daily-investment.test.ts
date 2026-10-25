import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { dailyInvestmentDomain } from "@opencok/services/daily-investment";
import { invest_everyday } from "@opencok/drizzle/schema/opencok_kingdom/invest_everyday";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([dailyInvestmentDomain]);
  h.clock.now = Date.UTC(2026, 9, 25, 23, 59);
  h.rules.features.set("bank", { id: "bank", online: "all", test: "all", version: "1.0.0" });
  h.rules.advanced.dailyInvestments!.clear();
  h.rules.advanced.dailyInvestments!.set("218100", {
    id: "218100",
    condition: "1;1",
    on_sale: "1",
    gold: "100",
    time: "3",
    interest: "20;30;70",
    start_mail: "11839",
    note_mail: "11841",
  });
  const command = (command: string, params: Fields = {}) => h.command(command, params);
  const saved = async () =>
    (await h.db.db.select().from(invest_everyday).where(eq(invest_everyday.uid, "owner")))[0];
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  return { ...h, command, saved, gold };
}
test("daily investment charges once, unlocks installments at UTC midnight and permanently rejects claimed slots", async () => {
  const h = await fixture();
  try {
    const baseline = await h.gold();
    const ui = await h.command("invest.open.ui");
    expect(ui.body.id_list).toEqual({ type: Type.StringArray, value: ["218100"] });
    const params = { id: sfs.string("218100"), operationId: sfs.string(randomUUID()) };
    const deposits = await Promise.all(
      Array.from({ length: 4 }, () => h.command("invest.add", params)),
    );
    expect(deposits.every((reply) => reply.body.id_receive!.value === "0;0;0")).toBe(true);
    expect(await h.gold()).toBe(baseline - 100n);
    await expect(h.command("invest.add", { id: sfs.string("218100") })).rejects.toThrow();
    expect((await h.saved())!.isreceive).toBe("0;0;0");
    await expect(h.command("invest.receive", { pos: sfs.int(1) })).rejects.toThrow();
    const claim = { pos: sfs.int(0), operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("invest.receive", claim)));
    expect(await h.gold()).toBe(baseline - 80n);
    await expect(h.command("invest.receive", { pos: sfs.int(0) })).rejects.toThrow();
    await expect(h.command("invest.receive", { pos: sfs.int(-1) })).rejects.toThrow();
    await expect(h.command("invest.receive", { pos: sfs.int(3) })).rejects.toThrow();
    h.clock.now += 60000;
    expect((await h.command("invest.open.ui")).body.interval_day).toEqual(sfs.int(1));
    await h.command("invest.receive", { pos: sfs.int(1) });
    h.clock.now += 86400000;
    await h.command("invest.receive", { pos: sfs.int(2) });
    expect(await h.gold()).toBe(baseline + 20n);
    expect((await h.saved())!.endactive).toBe(1);
    expect((await h.saved())!.isreceive).toBe("1;1;1");
    await expect(h.command("invest.receive", { pos: sfs.int(2) })).rejects.toThrow();
    expect((await h.command("invest.open.ui")).body.id_table).toBeUndefined();
    await h.command("invest.add", { id: sfs.string("218100") });
    expect((await h.saved())!.isreceive).toBe("0;0;0");
    expect(await h.gold()).toBe(baseline - 80n);
  } finally {
    await h.close();
  }
}, 120000);
test("saved investments remain visible after sale ends and reminders persist once per UTC day", async () => {
  const h = await fixture();
  try {
    await h.command("invest.add", { id: sfs.string("218100") });
    const row = await h.saved();
    h.rules.advanced.dailyInvestments!.get("218100")!.on_sale = "0";
    await Promise.all(Array.from({ length: 4 }, () => h.command("invest.init")));
    const messages = () => h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
    expect(await messages()).toHaveLength(2);
    expect((await h.command("invest.open.ui")).body.id_list).toEqual({
      type: Type.StringArray,
      value: ["218100"],
    });
    expect((await h.command("invest.open.ui")).body.id_receive).toEqual(sfs.string("0;0;0"));
    expect((await h.saved())!.beginTime).toBe(row!.beginTime);
    h.clock.now += 60000;
    await h.command("invest.init");
    await h.command("invest.init");
    expect(await messages()).toHaveLength(3);
    const claim = await h.command("invest.receive", { pos: sfs.int(0) });
    expect(claim.body.gold).toEqual(sfs.int(20));
    expect(
      await h.db.db.select().from(invest_everyday).where(eq(invest_everyday.uid, "other")),
    ).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("investment eligibility, funding and transaction failures cannot leave a partial deposit or claim", async () => {
  const h = await fixture();
  try {
    const rule = h.rules.advanced.dailyInvestments!.get("218100")!,
      baseline = await h.gold();
    rule.condition = "1;10";
    expect((await h.command("invest.open.ui")).body.id_list!.value).toEqual([]);
    await expect(h.command("invest.add", { id: sfs.string("218100") })).rejects.toThrow();
    rule.condition = "1;1";
    rule.gold = "100001";
    await expect(h.command("invest.add", { id: sfs.string("218100") })).rejects.toThrow();
    expect(await h.saved()).toBeUndefined();
    expect(await h.gold()).toBe(baseline);
    rule.gold = "100";
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_investment_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_investment_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_investment_receipt()`,
    );
    await expect(h.command("invest.add", { id: sfs.string("218100") })).rejects.toThrow();
    expect(await h.gold()).toBe(baseline);
    expect(await h.saved()).toBeUndefined();
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_investment_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("invest.add", { id: sfs.string("218100") });
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_investment_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_investment_receipt()`,
    );
    await expect(h.command("invest.receive", { pos: sfs.int(0) })).rejects.toThrow();
    expect((await h.saved())!.isreceive).toBe("0;0;0");
    expect(await h.gold()).toBe(baseline - 100n);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_investment_receipt ON opencok_kingdom.command_receipt`,
    );
    h.rules.features.get("bank")!.online = "close";
    expect((await h.command("invest.open.ui")).body.id_list).toBeUndefined();
    await expect(h.command("invest.receive", { pos: sfs.int(0) })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
