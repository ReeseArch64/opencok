import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { regionalRecallDomain } from "@opencok/services/regional-recall";
import { user_region_recall } from "@opencok/drizzle/schema/opencok_kingdom/user_region_recall";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([regionalRecallDomain]);
  h.clock.now = Date.UTC(2017, 2, 20, 12);
  await h.db.db
    .insert(stat_reg)
    .values({ uid: "owner", type: 2, time: BigInt(Date.UTC(2017, 0, 1)), country: "KR" });
  await h.db.db
    .update(userprofile)
    .set({ regTime: BigInt(Date.UTC(2017, 0, 1)), offLineTime: BigInt(Date.UTC(2017, 1, 1)) })
    .where(eq(userprofile.uid, "owner"));
  await h.db.db
    .update(user_building)
    .set({ level: 16 })
    .where(and(eq(user_building.uid, "owner"), eq(user_building.itemId, 400000)));
  return {
    ...h,
    rows: () => h.db.db.select().from(user_region_recall),
    inventory: async () =>
      (await h.db.db.select().from(user_item)).map((row) => [row.uuid, row.count]),
    initialize: () => h.command("region.recall.init", {}),
  };
}
test("regional recall initializes owned eligibility once and pays seven saved daily entitlements without client counters", async () => {
  const h = await fixture();
  try {
    const login = await h.initialize();
    expect(login.body.RegRec_endTime).toEqual(sfs.long(BigInt(Date.UTC(2017, 2, 30))));
    expect(login.body.RegRec_lastReceiveTime).toEqual(sfs.long(0n));
    const ui = await h.command("region.recall.open.ui", {});
    expect(ui.body.id).toEqual(sfs.string("9030001"));
    expect(ui.body.reward?.type).toBe(Type.Array);
    expect(ui.body.reward?.value).toHaveLength(7);
    const request = { operationId: sfs.string(randomUUID()), receive_num: sfs.int(999) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("region.recall.receive", request)));
    expect((await h.rows())[0]!.receivedaynum).toBe(1);
    const inventory = await h.inventory();
    await h.command("region.recall.receive", {});
    expect(await h.inventory()).toEqual(inventory);
    expect((await h.rows())[0]!.receivedaynum).toBe(1);
    for (let day = 1; day < 7; day++) {
      h.clock.now = Date.UTC(2017, 2, 20 + day);
      await h.command("region.recall.receive", {});
    }
    expect((await h.rows())[0]!.receivedaynum).toBe(7);
    h.clock.now += 86400000;
    const all = await h.inventory();
    await h.command("region.recall.receive", {});
    expect(await h.inventory()).toEqual(all);
    expect((await h.rows())[0]!.reward!.split(";").filter(Boolean)).toHaveLength(7);
    expect((await h.initialize()).body.RegRec_lastReceiveTime).toBeUndefined();
    expect(await h.rows()).toHaveLength(1);
    expect((await h.command("region.recall.open.ui", {}, "other")).body.reward).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("registration country, old account, offline interval, castle band and calendar gate initialization", async () => {
  const h = await fixture();
  try {
    await h.db.db.update(stat_reg).set({ country: "BR" });
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    await h.db.db.update(stat_reg).set({ country: "KR" });
    await h.db.db
      .update(userprofile)
      .set({ offLineTime: BigInt(Date.UTC(2017, 2, 19)) })
      .where(eq(userprofile.uid, "owner"));
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    await h.db.db
      .update(userprofile)
      .set({ offLineTime: BigInt(Date.UTC(2017, 1, 1)), regTime: BigInt(Date.UTC(2017, 2, 2)) })
      .where(eq(userprofile.uid, "owner"));
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    await h.db.db
      .update(userprofile)
      .set({ regTime: BigInt(Date.UTC(2017, 0, 1)) })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .update(user_building)
      .set({ level: 15 })
      .where(and(eq(user_building.uid, "owner"), eq(user_building.itemId, 400000)));
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    await h.db.db
      .update(user_building)
      .set({ level: 16 })
      .where(and(eq(user_building.uid, "owner"), eq(user_building.itemId, 400000)));
    h.clock.now = Date.UTC(2017, 3, 2);
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    expect(await h.rows()).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("recall enrollment and claims roll back with receipt failures and alliance announcement mails commit once", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(alliance_member).values([
      { uid: "owner", allianceId: "synthetic-guild" },
      { uid: "other", allianceId: "synthetic-guild" },
    ]);
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_recall_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    const reject = () =>
      h.db.db.execute(
        sql`CREATE TRIGGER reject_recall_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_recall_receipt()`,
      );
    const allow = () =>
      h.db.db.execute(sql`DROP TRIGGER reject_recall_receipt ON opencok_kingdom.command_receipt`);
    await reject();
    await expect(h.initialize()).rejects.toThrow();
    expect(await h.rows()).toHaveLength(0);
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    await allow();
    await h.initialize();
    await h.initialize();
    expect((await h.db.db.select().from(mail)).map((row) => row.toUser).sort()).toEqual([
      "other",
      "owner",
    ]);
    await reject();
    await expect(h.command("region.recall.receive", {})).rejects.toThrow();
    expect((await h.rows())[0]!.receivedaynum).toBe(0);
    expect(await h.inventory()).toHaveLength(0);
    await allow();
    await h.command("region.recall.receive", {});
    expect((await h.rows())[0]!.receivedaynum).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("regional recall uses UTC daily boundaries and retains earned gifts after the cosmetic deadline", async () => {
  const h = await fixture();
  try {
    await h.initialize();
    h.clock.now = Date.UTC(2017, 2, 20, 23, 59, 59);
    expect((await h.command("region.recall.receive", {})).body.RegRec_lastReceiveTime).toEqual(
      sfs.long(0n),
    );
    h.clock.now = Date.UTC(2017, 2, 21);
    expect((await h.command("region.recall.receive", {})).body.RegRec_lastReceiveTime?.type).toBe(
      Type.Long,
    );
    expect((await h.rows())[0]!.receivedaynum).toBe(2);
    h.clock.now = Date.UTC(2017, 3, 2);
    expect((await h.initialize()).body.RegRec_endTime).toBeUndefined();
    expect((await h.command("region.recall.receive", {})).body.reward?.type).toBe(Type.Array);
    expect((await h.rows())[0]!.receivedaynum).toBe(3);
    expect(await h.rows()).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
