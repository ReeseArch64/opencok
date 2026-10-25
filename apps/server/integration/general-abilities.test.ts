import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { researchDomain } from "@opencok/services/research";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sfs } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/services/generals";
import { generalRecruit } from "@opencok/rules/general-progression";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { cityHarness } from "./support/city";
test("talents, cooldowns, and refinement proposals survive replay without duplicate rewards", async () => {
  const h = await cityHarness([generalsDomain, researchDomain]);
  try {
    const base = h.rules.power.newGeneralBases!.get("53500")!;
    h.rules.power.newGeneralBases!.set("53500", {
      ...base,
      talent: "987",
      base_skill: "90000;90002",
    });
    h.rules.power.newGeneralSkills!.set("90000", {
      id: "90000",
      type: "11",
      cd_time: "10",
      para1: "0",
      base: "25",
    });
    h.rules.power.newGeneralSkills!.set("90001", {
      id: "90001",
      type: "0",
      para1: "50",
      base: "5",
      add: "1",
      skill_group: "987",
      max_lv: "5",
    });
    h.rules.power.newGeneralSkills!.set("90002", {
      id: "90002",
      type: "21",
      cd_time: "10",
      para1: "3600",
    });
    const row = generalRecruit(h.rules, 53500, "owner", BigInt(h.clock.now));
    await h.db.db.insert(new_general).values(row as typeof new_general.$inferInsert);
    const action = (name: string, fields = {}) => ({
      id: sfs.int(53500),
      M__REQUEST_ID__H: sfs.string(name),
      ...fields,
    });
    await h.command(
      "newgeneral",
      action("activatetalent", { talentid: sfs.int(90001), full: sfs.int(1) }),
    );
    expect((await h.db.db.select().from(new_general))[0]?.talentpoint).toBe(0);
    await expect(
      h.command("newgeneral", action("activatetalent", { talentid: sfs.int(90001) })),
    ).rejects.toThrow();
    const skill = action("skilluse", {
      skillId: sfs.string("90000"),
      operationId: sfs.string(randomUUID()),
    });
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.woodbind;
    const result = await h.command("newgeneral", skill);
    expect(await h.command("newgeneral", skill)).toEqual(result);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!
        .woodbind,
    ).toBe((before ?? 0n) + 25n);
    await expect(
      h.command("newgeneral", action("skilluse", { skillId: sfs.string("90000") })),
    ).rejects.toThrow();
    expect(await h.db.db.select().from(new_general_skill)).toHaveLength(1);
    await h.command("newgeneral", action("activaterefine"));
    const applied = (await h.db.db.select().from(new_general))[0]!.refineproperty;
    const refine = action("refinevalue", { operationId: sfs.string(randomUUID()) });
    const proposal = await h.command("newgeneral", refine);
    expect(await h.command("newgeneral", refine)).toEqual(proposal);
    const pending = (await h.db.db.select().from(new_general))[0]!;
    expect(pending.refineproperty).toBe(applied);
    expect(pending.oldrefineproperty).not.toBe("");
    expect(
      (await h.db.db.select().from(user_mixed_info).where(eq(user_mixed_info.uid, "owner")))[0]
        ?.generalRefineCount,
    ).toBe(1);
    const confirm = action("refinerollback", { operationId: sfs.string(randomUUID()) });
    await h.command("newgeneral", confirm);
    await h.command("newgeneral", confirm);
    expect((await h.db.db.select().from(new_general))[0]?.refineproperty).toBe(
      pending.oldrefineproperty,
    );
    await expect(h.command("newgeneral", action("refinerollback"))).rejects.toThrow();
    await h.db.db
      .insert(user_item)
      .values({ uuid: "refine-pieces", ownerId: "owner", itemId: "211128", count: 1000, value: 0 });
    await h.db.db.insert(user_state).values({
      uid: "owner",
      stateId: 509047,
      startTime: BigInt(h.clock.now),
      endTime: BigInt(h.clock.now) + 3600000n,
    });
    const batch = action("refinevalue", {
      batch: sfs.int(10),
      operationId: sfs.string(randomUUID()),
    });
    await h.command("newgeneral", batch);
    await h.command("newgeneral", batch);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "refine-pieces")))[0]?.count,
    ).toBe(800);
    expect((await h.db.db.select().from(new_general))[0]?.refinecard).toBe(200);
    await expect(
      h.command("newgeneral", action("skilluse", { skillId: sfs.string("90002") })),
    ).rejects.toThrow();
    await h.command("science.research", { itemId: sfs.string("700100"), gold: sfs.int(0) });
    const research = await h.active(6);
    const accelerate = action("skilluse", {
      skillId: sfs.string("90002"),
      operationId: sfs.string(randomUUID()),
    });
    const accelerated = await h.command("newgeneral", accelerate);
    expect(await h.command("newgeneral", accelerate)).toEqual(accelerated);
    expect(
      accelerated.pushes.find((push) => push.command === "push.gemeral.useskill.equip")?.body
        .updateTime?.value,
    ).toBe(BigInt(h.clock.now));
    const shortened = await h.active(6);
    expect(shortened.version).toBe(research.version + 1);
    expect(shortened.dueAt).toBe(BigInt(h.clock.now));
    await h.finish(6);
    expect(
      (await h.db.db.select().from(user_science).where(eq(user_science.itemId, "700100")))[0]
        ?.level,
    ).toBe(1);
    h.clock.now += 600000;
    await h.command("newgeneral", action("skilluse", { skillId: sfs.string("90000") }));
  } finally {
    await h.close();
  }
}, 60000);
