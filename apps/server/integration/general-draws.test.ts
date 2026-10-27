import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { sfs, fields } from "@opencok/messages/sfs";
import { createGeneralDrawDomain } from "@opencok/hero/services/general-draws";
import { user_gold_wheel } from "@opencok/drizzle/schema/opencok_kingdom/user_gold_wheel";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { cityHarness } from "./support/city";
test("event draws conserve tier tickets, discounted costs, scores, and one-time claims", async () => {
  const h = await cityHarness([
    createGeneralDrawDomain(async () => [
      JSON.stringify({
        uid: "owner",
        name: "Synthetic",
        kingId: 1,
        hideKing: false,
        count: 10,
        rank: 1,
      }),
    ]),
  ]);
  try {
    for (const id of ["golden_roulette", "golden_roulette_Integral_reward"])
      h.rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });
    h.rules.power.activityPanels!.set("57153", {
      start: "1970-01-01-00-00",
      end: "2100-01-01-00-00",
    });
    h.rules.general.draws!.set("89680", {
      id: "89680",
      minlevel: "1",
      gold: "100",
      items: "211128",
      num: "1",
      rate: "1",
    });
    h.rules.items.set("golden_opentime", {
      ...h.rules.items.get("golden_opentime")!,
      k16: "10;249158",
    });
    const request = {
      M__REQUEST_ID__H: sfs.string("'luckdraw"),
      itemId: sfs.string("89680"),
      num: sfs.int(10),
      operationId: sfs.string(randomUUID()),
    };
    const results = await Promise.all([
      h.command("herodraw", request),
      h.command("herodraw", request),
    ]);
    expect(results[0]).toEqual(results[1]);
    const wheel = (await h.db.db.select().from(user_gold_wheel))[0]!;
    expect(wheel).toMatchObject({
      normal_total: 10,
      normal_free: 0,
      silver_usable: 2,
      gold_usable: 1,
    });
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(99145n);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "211128")))[0]?.count,
    ).toBe(10);
    const claim = {
      M__REQUEST_ID__H: sfs.string("recieve"),
      score: sfs.int(10),
      operationId: sfs.string(randomUUID()),
    };
    const rewarded = await h.command("herodraw", claim);
    expect(await h.command("herodraw", claim)).toEqual(rewarded);
    await expect(
      h.command("herodraw", { ...claim, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    expect((await h.db.db.select().from(user_gold_wheel))[0]?.rewardFlags).toBe("10;1");
    const rank = await h.command("herodraw", { M__REQUEST_ID__H: sfs.string("rank") });
    expect(fields(rank.body.data).myLrank!.value).toBe(1);
    expect(fields(rank.body.data).myGRank!.value).toBe(1);
    h.rules.power.activityPanels!.set("57153", {
      start: "1970-01-01-00-00",
      end: "1970-01-01-00-01",
    });
    await expect(
      h.command("herodraw", { ...request, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    expect((await h.db.db.select().from(user_gold_wheel))[0]?.normal_total).toBe(10);
  } finally {
    await h.close();
  }
}, 60000);
