import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/services/generals";
import { generalRecruit } from "@opencok/rules/general-progression";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { cityHarness } from "./support/city";
test("prison operations require the current captor and revival recovers persisted state", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    for (const id of ["hero_rob", "hero_revival"])
      h.rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });
    const row = {
      ...generalRecruit(h.rules, 53500, "other", BigInt(h.clock.now)),
      state: 4,
      serverid: 1,
      predatoruid: "owner",
      killtime: BigInt(h.clock.now) + 1000n,
    };
    await h.db.db.insert(new_general).values(row as typeof new_general.$inferInsert);
    await h.db.db
      .insert(user_building)
      .values({ uid: "other", uuid: "other-grave", itemId: 435000, level: 1, pos: 40, opType: 0 });
    const operation = (action: string) => ({
      M__REQUEST_ID__H: sfs.string(action),
      owneruid: sfs.string("other"),
      generalid: sfs.string("53500"),
    });
    await expect(h.command("robgeneral", operation("kill"))).rejects.toThrow();
    await expect(h.command("robgeneral", operation("free"), "other")).rejects.toThrow();
    const free = { ...operation("free"), operationId: sfs.string(randomUUID()) };
    const response = await h.command("robgeneral", free);
    expect(await h.command("robgeneral", free)).toEqual(response);
    expect((await h.db.db.select().from(new_general))[0]?.state).toBe(1);
    await h.db.db
      .update(new_general)
      .set({ state: 4, serverid: 1, predatoruid: "owner", killtime: BigInt(h.clock.now) })
      .where(eq(new_general.uid, "other"));
    h.rules.items.set("hero_rob", { ...h.rules.items.get("hero_rob")!, k9: "211128" });
    await h.db.db
      .insert(user_item)
      .values({ uuid: "suicide-item", ownerId: "other", itemId: "211128", count: 1, value: 0 });
    const race = await Promise.allSettled([
      h.command("robgeneral", operation("free")),
      h.command(
        "robgeneral",
        { M__REQUEST_ID__H: sfs.string("suicide"), id: sfs.string("53500") },
        "other",
      ),
    ]);
    expect(race.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const raced = (await h.db.db.select().from(new_general))[0]!;
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "suicide-item")))[0]!.count,
    ).toBe(raced.state === 1 ? 1 : 0);
    await h.db.db
      .update(new_general)
      .set({
        state: 4,
        serverid: 1,
        predatoruid: "owner",
        killtime: BigInt(h.clock.now),
        relivetime: 0n,
      })
      .where(eq(new_general.uid, "other"));
    await h.command("robgeneral", operation("kill"));
    const killed = (await h.db.db.select().from(new_general))[0]!;
    expect(killed.state).toBe(5);
    await h.command(
      "robgeneral",
      { M__REQUEST_ID__H: sfs.string("checkrelive"), generalid: sfs.string("53500") },
      "other",
    );
    expect((await h.db.db.select().from(new_general))[0]?.state).toBe(5);
    h.clock.now = Number(killed.relivetime);
    await h.command("general.init", {}, "other");
    expect((await h.db.db.select().from(new_general))[0]).toMatchObject({
      state: 1,
      predatoruid: "",
      relivetime: 0n,
    });
  } finally {
    await h.close();
  }
}, 60000);

test("resource creation locks eligible empty points and rolls back the full skill on invalid targets", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    h.rules.power.newGeneralBases!.set("53500", {
      ...h.rules.power.newGeneralBases!.get("53500")!,
      base_skill: "990010",
      base_star: "1",
    });
    h.rules.power.newGeneralSkills!.set("990010", {
      id: "990010",
      type: "16",
      cd_time: "10",
      para1: "0;1;100",
    });
    await h.db.db
      .insert(new_general)
      .values(
        generalRecruit(
          h.rules,
          53500,
          "owner",
          BigInt(h.clock.now),
        ) as typeof new_general.$inferInsert,
      );
    for (const id of [1, 2])
      await h.db.db.insert(worldpoint).values({
        id,
        worldId: 0,
        x: id,
        y: 0,
        areaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: id === 1 ? 0 : 1,
        resLevel: 0,
        resInitValue: 0,
        ownerId: id === 1 ? "" : "other",
      });
    const request = {
      M__REQUEST_ID__H: sfs.string("skilluse"),
      id: sfs.int(53500),
      skillId: sfs.string("990010"),
      resType: sfs.int(0),
      points: sfs.array([sfs.int(1), sfs.int(2)]),
    };
    await expect(h.command("newgeneral", request)).rejects.toThrow();
    expect(
      (
        await h.db.db
          .select()
          .from(worldpoint)
          .where(and(eq(worldpoint.id, 1), eq(worldpoint.worldId, 0)))
      )[0]?.pointType,
    ).toBe(0);
    expect(await h.db.db.select().from(new_general_skill)).toHaveLength(0);
    const valid = {
      ...request,
      points: sfs.array([sfs.int(1)]),
      operationId: sfs.string(randomUUID()),
    };
    const result = await h.command("newgeneral", valid);
    expect(await h.command("newgeneral", valid)).toEqual(result);
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1)))[0]).toMatchObject({
      pointType: 3,
      resInitValue: 100,
      resCostValue: 0,
      flushFlag: 1,
    });
    expect(await h.db.db.select().from(new_general_skill)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 60000);
