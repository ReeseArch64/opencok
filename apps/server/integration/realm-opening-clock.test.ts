import { test, expect } from "bun:test";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { initializeRealmOpeningClock } from "@opencok/repositories/realm-opening-clock";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
test("fresh realm opening time is durable across concurrent starts and imported realms never reopen automatically", async () => {
  const pg = new DisposablePostgres(),
    admin = await pg.start();
  await admin.query('CREATE DATABASE "opening_clock"');
  await admin.end();
  const db = createDatabase("kingdom", { ...pg.options, database: "opening_clock", max: 4 });
  try {
    await migrate(db.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const authority = await acquireRealmAuthority(db.db, 1, () => true);
    const starts = await Promise.all(
      [1000000, 2000000, 3000000].map((now) => initializeRealmOpeningClock(db.db, authority, now)),
    );
    expect(new Set(starts).size).toBe(1);
    const original = starts[0]!;
    expect(original! > 0n).toBe(true);
    const replacement = await acquireRealmAuthority(db.db, 1, () => true);
    expect(await initializeRealmOpeningClock(db.db, replacement, 4000000)).toBe(original);
    await expect(initializeRealmOpeningClock(db.db, authority, 5000000)).rejects.toThrow();
    expect((await db.db.select().from(server_info))[0]!.activityTime).toBe(original);
    await db.db.delete(server_info);
    await db.db.insert(userprofile).values({
      uid: "synthetic-imported",
      serverId: 1,
      name: "Imported",
      country: "BR",
      level: 1,
      exp: 0,
    });
    expect(await initializeRealmOpeningClock(db.db, replacement, 6000000)).toBeNull();
    expect(await db.db.select().from(server_info)).toHaveLength(0);
    for (const activityTime of [0n, null, 123456n]) {
      await db.db.insert(server_info).values({ uid: "server", activityTime });
      expect(await initializeRealmOpeningClock(db.db, replacement, 7000000)).toBe(activityTime);
      expect((await db.db.select().from(server_info))[0]!.activityTime).toBe(activityTime);
      await db.db.delete(server_info);
    }
    await expect(initializeRealmOpeningClock(db.db, replacement, 0)).rejects.toThrow();
    await expect(initializeRealmOpeningClock(db.db, replacement, Number.NaN)).rejects.toThrow();
  } finally {
    await db.close();
    await pg.stop();
  }
}, 120000);
