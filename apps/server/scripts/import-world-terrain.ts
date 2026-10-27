import { createDatabase } from "@opencok/drizzle";
import { Coordination } from "@opencok/storage/coordination";
import { loadRules } from "@opencok/resources/rules";
import { parseWorldTerrain } from "@opencok/resources/world-terrain";
import { worldTerrainRules } from "@opencok/rules/world-terrain";
import { worldBirthRules } from "@opencok/rules/world-birth";
import { initializeWorldBirth } from "@opencok/repositories/world-birth";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import {
  checkWorldTerrainImportTarget,
  importWorldTerrain,
} from "@opencok/repositories/world-terrain";
import { postgresUrl } from "@opencok/env/database/schema";

let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
let coordination: Coordination | undefined;
let stage = "configuration";
try {
  const [realmRaw, sizeRaw, path, ...rest] = process.argv.slice(2);
  const options = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index],
      value = rest[index + 1];
    if (
      !key ||
      !["--catalogs", "--page-size", "--pages"].includes(key) ||
      !value ||
      options.has(key)
    )
      {throw new Error("Invalid terrain operator option");}
    options.set(key, value);
  }
  const pageSize = options.has("--page-size") ? Number(options.get("--page-size")) : 1000;
  const pageLimit = options.has("--pages") ? Number(options.get("--pages")) : 2147483647;
  if (
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 1000 ||
    !Number.isInteger(pageLimit) ||
    pageLimit < 1 ||
    pageLimit > 2147483647 ||
    !realmRaw ||
    !/^[1-9][0-9]*$/.test(realmRaw) ||
    !sizeRaw ||
    !/^[1-9][0-9]*$/.test(sizeRaw) ||
    !path ||
    process.env.DATABASE_ROLE !== "kingdom" ||
    !process.env.DATABASE_URL ||
    !process.env.GAME_ZOOKEEPER
  )
    {throw new Error("Explicit terrain operator configuration required");}
  const kingdomId = Number(realmRaw),
    size = Number(sizeRaw),
    connectionString = postgresUrl.parse(process.env.DATABASE_URL);
  if (
    !Number.isSafeInteger(kingdomId) ||
    kingdomId > 2147483647 ||
    size < 2 ||
    size > 4000 ||
    !Number.isInteger(size)
  )
    {throw new Error("Invalid terrain dimensions");}
  const file = Bun.file(path);
  if (file.size < 1 || file.size > 128 * 1024 * 1024) {throw new Error("Invalid terrain file size");}
  stage = "terrain";
  const terrain = parseWorldTerrain(new Uint8Array(await file.arrayBuffer()));
  stage = "catalogs";
  const rules = await loadRules(options.get("--catalogs"), kingdomId),
    settings = worldTerrainRules(rules),
    birth = worldBirthRules(rules);
  if (terrain.size !== size || settings.size !== size)
    {throw new Error("Authored terrain and configured dimensions differ");}
  stage = "ownership";
  coordination = new Coordination({
    kingdomId,
    zookeeper: process.env.GAME_ZOOKEEPER,
    zkPath: `/opencok-experiment/COK${kingdomId}`,
    timeoutMs: 5000,
  });
  await coordination.start();
  stage = "database";
  database = createDatabase("kingdom", {
    connectionString,
    max: 1,
    connectionTimeoutMillis: 5000,
    statement_timeout: 15000,
    query_timeout: 17000,
  });
  await checkWorldTerrainImportTarget(database.db, kingdomId);
  const authority = await acquireRealmAuthority(database.db, kingdomId, () => coordination!.ready);
  stage = "import";
  const result = await importWorldTerrain(database.db, authority, terrain, settings, {
    pageSize,
    pageLimit,
    complete: (tx, owner, now) => initializeWorldBirth(tx, owner, birth, now),
  });
  console.log(
    JSON.stringify({
      kingdomId,
      size: result.size,
      points: result.cursor,
      complete: result.complete,
    }),
  );
} catch {
  console.error(
    `Terrain import failed at ${stage}; verify explicit fresh realm configuration, ownership, source format and matching dimensions`,
  );
  process.exitCode = 1;
} finally {
  await database?.close();
  coordination?.close();
}
