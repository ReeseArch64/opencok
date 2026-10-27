import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { worldTerrainRules } from "@opencok/rules/world-terrain";
import { worldBirthRules } from "@opencok/rules/world-birth";
import { Coordination } from "@opencok/storage/coordination";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { assertWorldTerrain } from "@opencok/repositories/world-terrain";
import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { eq } from "drizzle-orm";
import { worldTerrainKey } from "@opencok/rules/world-terrain";
import { terrainCliHarness } from "./support/terrain-cli";
test("real CLI refuses a live ZooKeeper owner without stealing its epoch and resumes bounded pages after releasing dependencies", async () => {
  const h = await terrainCliHarness(),
    owner = new Coordination(h.config);
  try {
    const catalogs = await loadRules(h.directory, h.config.kingdomId);
    worldTerrainRules(catalogs);
    worldBirthRules(catalogs);
    await owner.start();
    const authority = await acquireRealmAuthority(h.db.db, h.config.kingdomId, () => owner.ready),
      before = await h.db.db.select().from(realm_authority);
    const denied = await h.run();
    expect(denied.code).toBe(1);
    expect(denied.stderr).toContain("Terrain import failed at ownership");
    expect(await h.db.db.select().from(realm_authority)).toEqual(before);
    expect(await h.db.db.select().from(worldpoint)).toHaveLength(0);
    expect(owner.ready).toBe(true);
    owner.close();
    const partial = await h.run(["--page-size", "4", "--pages", "1"]);
    expect(partial.code, partial.stderr).toBe(0);
    expect(JSON.parse(partial.stdout)).toMatchObject({ size: 5, points: 4, complete: false });
    expect(await h.db.db.select().from(worldpoint)).toHaveLength(4);
    const completed = await h.run();
    expect(completed.code, completed.stderr).toBe(0);
    expect(JSON.parse(completed.stdout)).toMatchObject({ size: 5, points: 25, complete: true });
    expect(await h.db.db.select().from(worldpoint)).toHaveLength(25);
    expect(
      JSON.parse(
        (await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, worldTerrainKey)))[0]!
          .value,
      ).complete,
    ).toBe(true);
    const successor = new Coordination(h.config);
    await successor.start();
    try {
      const fresh = await acquireRealmAuthority(h.db.db, h.config.kingdomId, () => successor.ready);
      expect(fresh.epoch).toBeGreaterThan(authority.epoch);
      expect((await assertWorldTerrain(h.db.db, fresh, 5))?.complete).toBe(true);
    } finally {
      successor.close();
    }
    expect((await h.run([], { size: 4 })).code).toBe(1);
    expect(await h.db.db.select().from(worldpoint)).toHaveLength(25);
  } finally {
    if (owner.ready) owner.close();
    await h.close();
  }
}, 180000);
