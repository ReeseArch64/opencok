import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { activity_minstrel } from "@opencok/drizzle/schema/opencok_kingdom/activity_minstrel";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { minstrelDomain } from "@opencok/services/minstrel";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test("minstrel honors event gates, claims and cooldowns across concurrent retries and daily reset", async () => {
  const h = await cityHarness([minstrelDomain]);
  try {
    const request = (action: string) => ({
      M__REQUEST_ID__H: sfs.string(action),
      operationId: sfs.string(randomUUID()),
    });
    await expect(h.command("minstrel", request("listen"))).rejects.toThrow();
    h.rules.power.activityPanels!.set("57112", {
      function_on: "1",
      start: "1970-01-01-00-00",
      end: "1970-01-10-00-00",
    });
    const listen = request("listen");
    await Promise.all(Array.from({ length: 4 }, () => h.command("minstrel", listen)));
    const saved = async () =>
      (
        await h.db.db.select().from(activity_minstrel).where(eq(activity_minstrel.uid, "owner"))
      )[0]!;
    expect((await saved()).listen).toBe(1);
    const second = await h.command("minstrel", request("listen"));
    expect(second.body.rewards).toBeUndefined();
    await h.command("minstrel", request("reward"));
    await expect(h.command("minstrel", request("reward"))).rejects.toThrow();
    expect((await saved()).reward).toBe(1);
    h.clock.now += 30000;
    await h.command("minstrel", request("reward"));
    expect((await saved()).reward).toBe(2);
    const share = request("share");
    await Promise.all(Array.from({ length: 3 }, () => h.command("minstrel", share)));
    await h.command("minstrel", request("share"));
    expect((await saved()).share).toBe(2);
    expect((await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"))).length).toBe(1);
    h.clock.now += 86400000;
    await h.command("minstrel", request("info"));
    expect((await saved()).listen).toBe(0);
    expect((await saved()).reward).toBe(0);
    expect((await saved()).share).toBe(0);
    expect((await saved()).rewardtime).toBe(1030000n);
  } finally {
    await h.close();
  }
}, 120000);
