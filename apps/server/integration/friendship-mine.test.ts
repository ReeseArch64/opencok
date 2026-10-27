import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { createDatabase } from "@opencok/drizzle";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq } from "drizzle-orm";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { createFriendshipMineExecutor } from "@opencok/repositories/friendship-mine";
import { FriendshipMineService } from "@opencok/services/friendship-mine";
import { initialFriendshipMine } from "@opencok/rules/reconnect-mine";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test("friendship mines conserve helpers and rewards across retries and generations", async () => {
  const h = await cityHarness();
  const global = createDatabase("global", {
    ...h.db.pool.options,
    password: h.db.pool.options.password,
    max: 2,
  });
  try {
    await migrate(global.db, {
      migrationsTable: "social_global_migrations",
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    await global.db.insert(account_new).values({
      gameUid: "owner",
      uuid: "synthetic",
      server: "1",
      gameUserLevel: 1,
      lastTime: 0n,
      facebookAccount: "facebook-owner",
    });
    const now = () => h.clock.now;
    const service = new FriendshipMineService(
      createFriendshipMineExecutor(
        { kingdom: h.db, databases: { global } },
        h.authority,
        () => initialFriendshipMine(h.rules),
        now,
      ),
      h.rules,
      h.effects,
      undefined,
      now,
    );
    const command = (name: string, params: Fields = {}, key = randomUUID(), internal = false) =>
      service.command("owner", name, { operationId: sfs.string(key), ...params }, internal);
    await command("mine.callHelp");
    const help = (actor: string, generation: string, key = randomUUID()) =>
      command(
        "mine.receive.help",
        {
          actor: sfs.string(actor),
          name: sfs.string("Synthetic helper"),
          generation: sfs.string(generation),
        },
        key,
        true,
      );
    const key = randomUUID();
    const first = await help("helper-a", "0", key);
    expect(await help("helper-a", "0", key)).toEqual(first);
    expect((await help("helper-a", "0")).body.result?.value).toBe(0);
    expect((await help("helper-b", "0")).body.result?.value).toBe(1);
    expect((await help("helper-c", "0")).body.result?.value).toBe(0);
    const balance = (
      await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
    )[0]!.gold!;
    const digKey = randomUUID(),
      dig = await command("mine.dig", {}, digKey);
    expect(await command("mine.dig", {}, digKey)).toEqual(dig);
    const mine = (await h.db.db.select().from(user_mine).where(eq(user_mine.uid, "owner")))[0]!;
    expect(mine.level).toBe(2);
    expect(mine.exp).toBe(0);
    expect(mine.miner).toBe(0);
    expect(mine.call).toBe(0);
    expect(mine.mineTime).toBe(BigInt(now()) + 20n * 3_600_000n);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold! >
        balance,
    ).toBe(true);
    await expect(command("mine.dig")).rejects.toThrow();
    await expect(command("mine.callHelp")).rejects.toThrow();
    h.clock.now = Number(mine.mineTime);
    await command("mine.callHelp");
    expect((await help("helper-c", "0")).body.result?.value).toBe(0);
    for (const actor of ["helper-a", "helper-b", "helper-c"])
      {expect((await help(actor, String(mine.mineTime))).body.result?.value).toBe(1);}
    const next = await command("mine.dig");
    expect(fields(next.body.userMine).level?.value).toBe(2);
    expect(fields(next.body.userMine).exp?.value).toBe(1);
  } finally {
    await global.close();
    await h.close();
  }
}, 120_000);
