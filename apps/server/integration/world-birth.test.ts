import { expect, test } from "bun:test";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { loadRules } from "@opencok/resources/rules";
import { worldBirthRules, parseWorldBirth } from "@opencok/rules/world-birth";
import { initializeWorldBirth, worldBirthIdentity } from "@opencok/repositories/world-birth";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

test("fresh birth initialization commits only with the imported world, rejects existing players and fences stale owners", async () => {
  const pg = new DisposablePostgres();
  let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "world_birth"');
    await admin.end();
    db = createDatabase("kingdom", { ...pg.options, database: "world_birth", max: 4 });
    await migrate(db.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const rules = worldBirthRules(await loadRules()),
      authority = await acquireRealmAuthority(db.db, 1, () => true);
    await expect(
      db.db.transaction(async (tx) => {
        await initializeWorldBirth(tx, authority, rules, 1000000n);
        throw new Error("forced import rollback");
      }),
    ).rejects.toThrow("forced import rollback");
    expect(await db.db.select().from(trigger_var)).toHaveLength(0);
    await db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n));
    const [saved] = await db.db.select().from(trigger_var);
    expect(saved).toMatchObject({ ...worldBirthIdentity, refreshtime: 1000000n });
    expect(parseWorldBirth(saved!.value)).toMatchObject({
      schema: 1,
      version: 1,
      priority: 43000,
      round: 1,
      phase: 0,
      epoch: String(authority.epoch),
      counts: {},
    });
    await expect(
      db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n)),
    ).rejects.toThrow("fresh resident world");
    await acquireRealmAuthority(db.db, 1, () => true);
    await expect(
      db.db.transaction((tx) => initializeWorldBirth(tx, authority, rules, 1000000n)),
    ).rejects.toThrow();
    expect(await db.db.select().from(trigger_var)).toEqual([saved!]);
    await db.db.delete(trigger_var);
    await db.db.insert(userprofile).values({
      uid: "existing-resident",
      serverId: 1,
      name: "Synthetic",
      country: "BR",
      level: 1,
      exp: 0,
    });
    const owner = await acquireRealmAuthority(db.db, 1, () => true);
    await expect(
      db.db.transaction((tx) => initializeWorldBirth(tx, owner, rules, 1000000n)),
    ).rejects.toThrow("fresh resident world");
    expect(await db.db.select().from(trigger_var)).toHaveLength(0);
  } finally {
    await db?.close();
    await pg.stop();
  }
}, 120000);
