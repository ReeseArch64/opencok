import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/hero/services/generals";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { tavern } from "@opencok/drizzle/schema/opencok_kingdom/tavern";
import { cityHarness } from "./support/city";
test("legacy defense replacement, dismissal, and tavern picks preserve ownership and offers", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    for (const [uuid, id, status] of [
      ["a", "240000", 1],
      ["b", "240001", 0],
    ] as const)
      await h.db.db
        .insert(user_general)
        .values({ uuid, uid: "owner", generalId: id, level: 1, status, abilityIndex: 1 });
    await h.command("general.def.ch", { src: sfs.string("b"), dst: sfs.string("a") });
    expect(
      (await h.db.db.select().from(user_general).where(eq(user_general.uuid, "a")))[0]?.status,
    ).toBe(0);
    expect(
      (await h.db.db.select().from(user_general).where(eq(user_general.uuid, "b")))[0]?.status,
    ).toBe(1);
    await expect(h.command("general.fire", { uuid: sfs.string("b") }, "other")).rejects.toThrow();
    await h.command("general.fire", { uuid: sfs.string("b") });
    expect((await h.db.db.select().from(user_general))[0]).toMatchObject({ uuid: "a", status: 1 });
    await expect(h.command("general.fire", { uuid: sfs.string("a") })).rejects.toThrow();
    await h.db.db.insert(tavern).values({
      uid: "owner",
      free: 0,
      firstFree: 0,
      firstPay: 0,
      freeTimes: 0,
      payTimes: 0,
      generals: "240002,240003",
      recruit1: 0,
      recruit2: 0,
      recruit3: 0,
      recruit4: 0,
      recruit5: 0,
      recruit6: 0,
      addFreeTime: 0n,
      resetResult: 0,
    });
    await h.command("general.pick", { pos: sfs.int(1) });
    const saved = (await h.db.db.select().from(tavern))[0]!;
    expect(["240002", "240003"]).toContain(saved.generalId1!);
    expect(saved.generals!.split(",")).not.toContain(saved.generalId1!);
    await expect(h.command("general.pick", { pos: sfs.int(1) })).rejects.toThrow();
    await h.command("general.recruit", { pos: sfs.int(1) });
    expect(await h.db.db.select().from(user_general)).toHaveLength(2);
    expect((await h.db.db.select().from(tavern))[0]?.recruit1).toBe(1);
    await expect(h.command("general.recruit", { pos: sfs.int(1) })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 60000);
