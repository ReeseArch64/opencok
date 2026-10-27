import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createWorldUseDomain } from "@opencok/services/world-use";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { sfs, Type, fields, decode, encode, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([createWorldUseDomain(4)], false, undefined, 4);
  try {
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: 6, worldId: 0, lastCityDefTime: 0n });
    await h.db.db.update(userprofile).set({ worldPoint: 6 }).where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(worldpoint).values(
      Array.from({ length: 16 }, (_, index) => ({
        id: index + 1,
        worldId: 0,
        x: index % 4,
        y: Math.floor(index / 4),
        areaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: index === 5 ? 1 : [0, 1, 4].includes(index) ? 8 : 0,
        ownerId: [0, 1, 4, 5].includes(index) ? "owner" : "",
        pointItem: [0, 1, 4].includes(index) ? "6" : null,
        resLevel: 0,
        resInitValue: 0,
      })),
    );
    await h.db.db.insert(user_item).values([
      { uuid: "single", ownerId: "owner", itemId: "209933", count: 2, value: 0 },
      { uuid: "four", ownerId: "owner", itemId: "209952", count: 1, value: 0 },
      { uuid: "foreign", ownerId: "other", itemId: "209933", count: 2, value: 0 },
      { uuid: "multiple", ownerId: "owner", itemId: "210086", count: 1, value: 0 },
    ]);
    const command = (uuid: string, point: number, id: string) =>
      h.command("create.boss", {
        uuid: sfs.string(uuid),
        pointIndex: sfs.int(point),
        operationId: sfs.string(id),
        monsterId: sfs.string("999999"),
        count: sfs.int(100),
      });
    const count = async (uuid: string) =>
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, uuid)))[0]?.count ?? 0;
    const point = async (id: number) =>
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, id)))[0]!;
    return { ...h, command, count, point };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("native create.boss debits the exact UUID once and emits Source ordered response and viewer-only field creation", async () => {
  const h = await fixture();
  try {
    const replies = await Promise.all(
        Array.from({ length: 4 }, () => h.command("single", 10, "same")),
      ),
      response = { itemId: sfs.string("209933"), count: sfs.int(1), itemEffectObj: sfs.object({}) };
    expect(
      replies.every((reply) =>
        Buffer.from(
          encode(
            Object.fromEntries(Object.entries(reply.body).filter(([key]) => key !== "operationId")),
          ),
        ).equals(Buffer.from(encode(response))),
      ),
    ).toBe(true);
    expect(Object.keys(replies[0]!.body).filter((key) => key !== "operationId")).toEqual([
      "itemId",
      "count",
      "itemEffectObj",
    ]);
    expect(replies[0]!.body.itemId!.type).toBe(Type.String);
    expect(replies[0]!.body.count!.type).toBe(Type.Int);
    expect(fields(replies[0]!.body.itemEffectObj)).toEqual({});
    expect(await h.count("single")).toBe(1);
    expect(await h.count("foreign")).toBe(2);
    expect(await h.point(10)).toMatchObject({
      pointType: 9,
      pointItem: "900206",
      startTime: 995000n,
      flushTime: 11795000n,
      monsterCurrHP: 0,
      flushFlag: 1,
    });
    const events = (await h.db.db.select().from(mutation_outbox)).filter(
      (row) => row.eventType === "create.boss",
    );
    expect(events).toHaveLength(1);
    const emitted: { owner: string; command: string; body: Fields }[] = [];
    await publishWorldMutation(
      events[0]!.payload,
      "create.boss",
      1,
      async (points, owner, target) => {
        expect(points).toContain(10);
        expect(owner).toBe("");
        expect(target).toBe("");
        return ["viewer"];
      },
      async (owner, command, body) => {
        emitted.push({ owner, command, body });
      },
    );
    const created = emitted.find((row) => row.command === "push.fieldMonster.create")!;
    expect(created.owner).toBe("viewer");
    expect(created.body).toEqual({
      pointIndex: sfs.int(10),
      mmhp: sfs.int(1),
      mchp: sfs.int(1),
      monsterId: sfs.string("900206"),
      rt: sfs.int(11795),
      st: sfs.int(995),
      isBoss: sfs.bool(false),
    });
    expect(Object.keys(created.body)).toEqual([
      "pointIndex",
      "mmhp",
      "mchp",
      "monsterId",
      "rt",
      "st",
      "isBoss",
    ]);
    expect(emitted.some((row) => row.owner === "owner")).toBe(false);
    expect(decode(events[0]!.payload).fieldCreated!.type).toBe(Type.Object);
  } finally {
    await h.close();
  }
}, 120000);
test("ordinary four-cell boss props preserve range metadata, use native anchors and cannot overwrite claimed ranges", async () => {
  const h = await fixture();
  try {
    h.rules.world.fieldMonsters!.set("900237", {
      ...h.rules.world.fieldMonsters!.get("900237")!,
      boss: "2",
      growTime: "999",
    });
    await h.db.db.update(worldpoint).set({ ownerId: "other" }).where(eq(worldpoint.id, 11));
    await expect(h.command("four", 16, "blocked")).rejects.toThrow();
    expect(await h.count("four")).toBe(1);
    expect((await h.point(16)).pointType).toBe(0);
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "", monsterCurrHP: 77, startTime: 12n, flushTime: 13n })
      .where(eq(worldpoint.id, 11));
    await h.db.db.update(worldpoint).set({ gridType: 0 }).where(eq(worldpoint.id, 16));
    const reply = await h.command("four", 16, "free");
    expect(reply.body.count).toEqual(sfs.int(0));
    expect(await h.count("four")).toBe(0);
    expect(await h.point(16)).toMatchObject({
      pointType: 15,
      pointItem: "900237",
      startTime: 995000n,
      monsterCurrHP: 0,
      flushFlag: 1,
    });
    for (const id of [11, 12, 15]) expect((await h.point(id)).pointType).toBe(17);
    expect(await h.point(11)).toMatchObject({
      monsterCurrHP: 77,
      startTime: 12n,
      flushTime: 13n,
      pointItem: null,
      flushFlag: 0,
    });
    const event = (await h.db.db.select().from(mutation_outbox)).find(
      (row) => row.eventType === "create.boss",
    );
    expect(fields(decode(event!.payload).fieldCreated).isBoss).toEqual(sfs.bool(true));
  } finally {
    await h.close();
  }
}, 120000);
test("foreign stacks, occupied points, Defensor goods and unresolved raw multi-ID catalogs reject without consuming an item", async () => {
  const h = await fixture();
  try {
    await expect(h.command("foreign", 10, "foreign")).rejects.toThrow();
    await expect(h.command("single", 6, "occupied")).rejects.toThrow();
    await expect(h.command("multiple", 10, "raw-multiple")).rejects.toThrow();
    h.rules.goods.set("209933", { ...h.rules.goods.get("209933")!, type2: "1" });
    await expect(h.command("single", 10, "defensor")).rejects.toThrow();
    expect(await h.count("single")).toBe(2);
    expect(await h.count("foreign")).toBe(2);
    expect(await h.count("multiple")).toBe(1);
    expect((await h.point(10)).pointType).toBe(0);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("pending march claims and failed receipt persistence cannot consume or publish an ordinary boss prop", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(world_march).values({
      uuid: "factual",
      ownerUid: "other",
      ownerId: 6,
      type: 0,
      targetId: 10,
      marchStartTime: 0n,
      worldId: 0,
    });
    await expect(h.command("single", 10, "claimed")).rejects.toThrow();
    expect(await h.count("single")).toBe(2);
    await h.db.db.delete(world_march);
    await h.db.pool.query(
      "CREATE FUNCTION reject_boss_prop() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic boss receipt failure'; END $$",
    );
    await h.db.pool.query(
      "CREATE TRIGGER reject_boss_prop BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION reject_boss_prop()",
    );
    await expect(h.command("single", 10, "rollback")).rejects.toThrow();
    expect(await h.count("single")).toBe(2);
    expect((await h.point(10)).pointType).toBe(0);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query("DROP TRIGGER reject_boss_prop ON opencok_kingdom.command_receipt");
    await h.command("single", 10, "rollback");
    expect(await h.count("single")).toBe(1);
    expect((await h.point(10)).pointType).toBe(9);
  } finally {
    await h.close();
  }
}, 120000);
