import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import {
  playerItemGiftDomain,
  publishPlayerItemGiftMutation,
} from "@opencok/services/player-item-gifts";
import { pendingPlayerItemGiftOwners } from "@opencok/repositories/player-item-gifts";
import { receive_item } from "@opencok/drizzle/schema/opencok_kingdom/receive_item";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, Type, encode, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([playerItemGiftDomain]);
  await h.db.db
    .insert(user_item)
    .values({ uuid: "synthetic-gift", ownerId: "owner", itemId: "210059", count: 3, value: 0 });
  const count = async (owner: string, itemId: string) =>
    (
      await h.db.db
        .select()
        .from(user_item)
        .where(and(eq(user_item.ownerId, owner), eq(user_item.itemId, itemId)))
    ).reduce((sum, row) => sum + row.count, 0);
  const send = (params: Fields = {}) =>
    h.command("item.send", { uid: sfs.string("other"), itemId: sfs.string("210059"), ...params });
  const receive = (params: Fields = {}, owner = "other") => h.command("gift.init", params, owner);
  return { ...h, count, send, receive };
}
test("item gifts debit once, persist for an offline recipient and grant exactly once on owned login recovery", async () => {
  const h = await fixture();
  try {
    const sent = { operationId: sfs.string(randomUUID()), num: sfs.int(9999) };
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.send(sent)));
    expect(replies.every((reply) => reply.body.result?.value === true)).toBe(true);
    expect(await h.count("owner", "210059")).toBe(2);
    expect(await h.count("other", "210052")).toBe(0);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(1);
    expect(await pendingPlayerItemGiftOwners(h.db.db, ["owner"])).toHaveLength(0);
    expect(await pendingPlayerItemGiftOwners(h.db.db, ["owner", "other"])).toEqual(["other"]);
    const receive = { operationId: sfs.string(randomUUID()) },
      deliveries = await Promise.all(Array.from({ length: 4 }, () => h.receive(receive)));
    expect(deliveries.every((reply) => reply.body.item_allname?.type === Type.StringArray)).toBe(
      true,
    );
    expect(deliveries[0]!.body.item_allname!.value).toEqual(["Synthetic"]);
    expect(deliveries[0]!.body.item_allitemId).toEqual({
      type: Type.StringArray,
      value: ["210059"],
    });
    expect(await h.count("other", "210052")).toBe(1);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(0);
    expect((await h.receive()).body.item_allname).toBeUndefined();
    expect(await h.count("other", "210052")).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("unknown recipients, foreign realms, ordinary items and missing owned gift tokens reject before charging", async () => {
  const h = await fixture();
  try {
    await expect(h.send({ uid: sfs.string("missing") })).rejects.toThrow();
    await expect(h.send({ itemId: sfs.string("210052") })).rejects.toThrow();
    await expect(
      h.command("item.send", { uid: sfs.string("owner"), itemId: sfs.string("210059") }, "other"),
    ).rejects.toThrow();
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "other"));
    await expect(h.send()).rejects.toThrow();
    expect(await h.count("owner", "210059")).toBe(3);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("a failed receipt restores both sent-gift costs and received-gift queues with their inventory grant", async () => {
  const h = await fixture();
  try {
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_gift_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    const reject = () =>
      h.db.db.execute(
        sql`CREATE TRIGGER reject_gift_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_gift_receipt()`,
      );
    const allow = () =>
      h.db.db.execute(sql`DROP TRIGGER reject_gift_receipt ON opencok_kingdom.command_receipt`);
    await reject();
    await expect(h.send()).rejects.toThrow();
    expect(await h.count("owner", "210059")).toBe(3);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(0);
    await allow();
    await h.send();
    await reject();
    await expect(h.receive()).rejects.toThrow();
    expect(await h.count("other", "210052")).toBe(0);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(1);
    await allow();
    await h.receive();
    expect(await h.count("other", "210052")).toBe(1);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("received gifts drain in bounded batches and keep structured sender names and reference one-item semantics", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .update(userprofile)
      .set({ name: "Synthetic, sender" })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(receive_item).values(
      Array.from({ length: 65 }, (_, index) => ({
        uid: "other",
        senduid: "owner",
        itemId: "210059",
        itemNum: index === 0 ? 999 : 1,
        createTime: BigInt(h.clock.now),
      })),
    );
    const batch = await h.receive();
    expect(batch.body.item_allname!.value).toHaveLength(64);
    expect(
      (batch.body.item_allname!.value as string[]).every((name) => name === "Synthetic, sender"),
    ).toBe(true);
    expect(await h.count("other", "210052")).toBe(64);
    expect(await h.db.db.select().from(receive_item)).toHaveLength(1);
    await h.receive();
    expect(await h.count("other", "210052")).toBe(65);
    expect(await pendingPlayerItemGiftOwners(h.db.db, ["other"])).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("online gift delivery persists private item and sender notifications with its committed grant", async () => {
  const h = await fixture();
  try {
    await h.send();
    const receipt = { notify: sfs.bool(true), operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 3 }, () => h.receive(receipt)));
    const events = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "gift.init"));
    expect(events).toHaveLength(1);
    const delivered: { owner: string; command: string; body: Fields }[] = [];
    await publishPlayerItemGiftMutation(events[0]!.payload, async (owner, command, body) => {
      delivered.push({ owner, command, body });
    });
    expect(delivered.map((row) => `${row.owner}:${row.command}`)).toEqual([
      "other:push.useritem",
      "other:push.item.having",
    ]);
    expect(delivered[1]!.body).toEqual({
      name: sfs.string("Synthetic"),
      itemId: sfs.string("210059"),
    });
    expect(delivered[0]!.body.useritemlist?.type).toBe(Type.Array);
    await expect(
      publishPlayerItemGiftMutation(
        encode({
          owner: sfs.string("other"),
          pushes: sfs.array([
            sfs.object({ command: sfs.string("arbitrary"), body: sfs.object({}) }),
            sfs.object({}),
          ]),
        }),
        async () => {},
      ),
    ).rejects.toThrow();
    expect(await h.count("other", "210052")).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
