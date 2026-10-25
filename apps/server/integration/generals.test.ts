import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { generalsDomain } from "@opencok/services/generals";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_buy } from "@opencok/drizzle/schema/opencok_kingdom/new_general_buy";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { cityHarness } from "./support/city";

test("general recruitment and fragment purchases commit once and isolate owners", async () => {
  const h = await cityHarness([generalsDomain]);
  try {
    const request = {
      id: sfs.int(53500),
      M__REQUEST_ID__H: sfs.string("recruit"),
      operationId: sfs.string(randomUUID()),
    };
    await expect(h.command("newgeneral", request)).rejects.toThrow();
    await h.db.db.insert(user_building).values({
      uid: "owner",
      uuid: "hero-building",
      itemId: 433000,
      level: 1,
      pos: 30,
      opType: 0,
    });
    const base = h.rules.power.newGeneralBases!.get("53500")!;
    h.rules.power.newGeneralBases!.set("53500", {
      ...base,
      need_pieces: "211128;20",
      sale_id: "53603",
    });
    h.rules.configuration.generalSales!.set("53603", {
      id: "53603",
      limit: "1",
      sale_price1: "100",
      card_num1: "10",
      sale_num1: "2",
    });
    const buy = {
      generalId: sfs.int(53500),
      buyCountType: sfs.int(1),
      buyCount: sfs.int(2),
      operationId: sfs.string(randomUUID()),
    };
    const purchased = await h.command("newgeneral.buy", buy);
    expect(await h.command("newgeneral.buy", buy)).toEqual(purchased);
    expect((await h.db.db.select().from(new_general_buy))[0]?.countType1).toBe(2);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(99800n);
    await expect(
      h.command("newgeneral.buy", { ...buy, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    const results = await Promise.all([
      h.command("newgeneral", request),
      h.command("newgeneral", request),
    ]);
    expect(results[0]).toEqual(results[1]);
    expect(
      (await h.db.db.select().from(new_general)).map((row) => [row.uid, row.id, row.level]),
    ).toEqual([["owner", 53500, 1]]);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"))).reduce(
        (sum, item) => sum + item.count,
        0,
      ),
    ).toBe(0);
    await expect(
      h.command("newgeneral", { ...request, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    await expect(
      h.command(
        "newgeneral",
        { id: sfs.int(53500), M__REQUEST_ID__H: sfs.string("star") },
        "other",
      ),
    ).rejects.toThrow();
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.level,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 60000);
