import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/services/generals";
import { generalRecruit } from "@opencok/rules/general-progression";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { decodeProductionRates } from "@opencok/mappings/production";
import { cityHarness } from "./support/city";

test("city assignments replace occupants and settle production at the assignment boundary", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    h.rules.general.stations!.set(
      [...h.rules.general.stations!.values()].find((row) => row.build === "413000")!.id!,
      {
        id: "wood",
        build: "413000",
        station: "1",
        function_online: "all",
        function_test: "all",
        version: "1.0.0",
      },
    );
    h.rules.power.newGeneralSkills!.set("90000", {
      id: "90000",
      type: "0",
      para1: "50",
      base: "50",
      add: "0",
    });
    for (const id of [53500, 53501]) {
      h.rules.power.newGeneralBases!.set(String(id), {
        ...h.rules.power.newGeneralBases!.get(String(id))!,
        base_skill: "90000;990020",
        base_star: "1",
      });
      await h.db.db
        .insert(new_general)
        .values(
          generalRecruit(
            h.rules,
            id,
            "owner",
            BigInt(h.clock.now),
          ) as typeof new_general.$inferInsert,
        );
    }
    const assign = (id: number, uuid = "owner-413000") =>
      h.command("newgeneral", {
        id: sfs.int(id),
        M__REQUEST_ID__H: sfs.string("garrison"),
        buildinguuid: sfs.string(uuid),
      });
    await expect(assign(53500, "other-413000")).rejects.toThrow();
    h.rules.power.newGeneralSkills!.set("990020", {
      id: "990020",
      type: "10",
      cd_time: "10",
      para1: "990030",
    });
    h.rules.power.statuses!.set("990030", {
      id: "990030",
      time: "60",
      effect: "50;50",
      overlap: "0",
      group: "990",
    });
    await assign(53500);
    const rates = decodeProductionRates(
      (
        await h.db.db
          .select()
          .from(building_production)
          .where(eq(building_production.buildingId, "owner-413000"))
      )[0]!.rates,
    );
    expect(rates[0]!.perHour).toBeGreaterThan(0n);
    await h.command("newgeneral", {
      id: sfs.int(53500),
      M__REQUEST_ID__H: sfs.string("skilluse"),
      skillId: sfs.string("990020"),
    });
    const boosted = decodeProductionRates(
      (
        await h.db.db
          .select()
          .from(building_production)
          .where(eq(building_production.buildingId, "owner-413000"))
      )[0]!.rates,
    );
    const expiry = boosted.findIndex((rate) => rate.at === BigInt(h.clock.now) + 60001n);
    expect(expiry).toBeGreaterThan(0);
    expect(boosted[expiry - 1]!.perHour).toBeGreaterThan(boosted[expiry]!.perHour);
    h.clock.now += 3600000;
    await assign(53501);
    const rows = await h.db.db.select().from(new_general);
    expect(rows.find((row) => row.id === 53500)).toMatchObject({ state: 1, buildingUuid: "" });
    expect(rows.find((row) => row.id === 53501)).toMatchObject({
      state: 2,
      buildingUuid: "owner-413000",
    });
    await expect(
      h.command("heroOffice", {
        M__REQUEST_ID__H: sfs.string("appoint"),
        heroId: sfs.string("53501"),
        officeId: sfs.string("53830"),
        positionName: sfs.string("master"),
      }),
    ).rejects.toThrow();
    await h.command("newgeneral", {
      id: sfs.int(53501),
      M__REQUEST_ID__H: sfs.string("canclegarrison"),
    });
  } finally {
    await h.close();
  }
}, 60000);

test("offices checkpoint experience and turntable retries preserve one daily free draw", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    await h.db.db
      .update(user_building)
      .set({ level: 15 })
      .where(eq(user_building.uuid, "owner-400000"));
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
    const office = {
      M__REQUEST_ID__H: sfs.string("appoint"),
      heroId: sfs.string("53500"),
      officeId: sfs.string("53830"),
      positionName: sfs.string("master"),
      operationId: sfs.string(randomUUID()),
    };
    const assigned = await h.command("heroOffice", office);
    expect(await h.command("heroOffice", office)).toEqual(assigned);
    const [entry] = await h.db.db.select().from(hero_office);
    h.clock.now += 3600000;
    await h.command("heroOffice", { M__REQUEST_ID__H: sfs.string("refreshExp") });
    const first = (await h.db.db.select().from(new_general))[0]!;
    await h.command("heroOffice", { M__REQUEST_ID__H: sfs.string("refreshExp") });
    expect((await h.db.db.select().from(new_general))[0]?.exp).toBe(first.exp);
    expect((await h.db.db.select().from(hero_office))[0]!.lastRefreshExpTime).toBeGreaterThan(
      entry!.lastRefreshExpTime!,
    );
    await h.command("heroOffice", {
      M__REQUEST_ID__H: sfs.string("remove"),
      heroId: sfs.string("53500"),
    });
    expect((await h.db.db.select().from(new_general))[0]?.state).toBe(1);
    h.rules.general.wheels!.set("89699", {
      id: "89699",
      minlevel: "6",
      gold: "100",
      item: "211128",
      item_num: "2",
      rate: "1",
      notice_item: "1",
    });
    const draw = {
      M__REQUEST_ID__H: sfs.string("openwheel"),
      id: sfs.string("89699"),
      num: sfs.int(10),
      operationId: sfs.string(randomUUID()),
    };
    const before = (
      await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
    )[0]!.gold!;
    const result = await h.command("generaltrun", draw);
    expect(await h.command("generaltrun", draw)).toEqual(result);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(before - 900n);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner")))[0]?.count,
    ).toBe(20);
    const info = await h.command("generaltrun", { M__REQUEST_ID__H: sfs.string("openui") });
    expect((fields(info.body.data).self_show_list!.value as Value[]).length).toBe(10);
    await expect(
      h.command("generaltrun", { ...draw, num: sfs.int(0), operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 60000);
