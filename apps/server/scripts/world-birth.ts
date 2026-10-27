import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { and, eq } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { requireEnv } from "@opencok/env/database";
import { loadRules } from "@opencok/resources/rules";
import { parseWorldBirth, worldBirthRules } from "@opencok/rules/world-birth";
import { createWorldBirthAdopter, worldBirthIdentity } from "@opencok/repositories/world-birth";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
try {
  const [action, realm, ...args] = process.argv.slice(2);
  if (
    !realm ||
    !/^[1-9][0-9]*$/.test(realm) ||
    requireEnv("DATABASE_ROLE") !== "kingdom" ||
    !["inspect", "adopt"].includes(action ?? "")
  )
    throw new Error("Invalid birth operator arguments");
  const kingdomId = Number(realm);
  database = createDatabase("kingdom", {
    connectionString: requireEnv("DATABASE_URL"),
    max: 1,
    connectionTimeoutMillis: 5000,
    statement_timeout: 30000,
    query_timeout: 35000,
  });
  const owners = await database.db
    .select({ id: realm_authority.kingdomId })
    .from(realm_authority)
    .limit(2);
  if (owners.some((owner) => owner.id !== kingdomId))
    throw new Error("Foreign realm operator database");
  if (action === "inspect") {
    if (args.length) throw new Error("Invalid birth inspection arguments");
    const [saved] = await database.db
      .select()
      .from(trigger_var)
      .where(
        and(
          eq(trigger_var.type, worldBirthIdentity.type),
          eq(trigger_var.uid, worldBirthIdentity.uid),
          eq(trigger_var.key, worldBirthIdentity.key),
        ),
      );
    console.log(
      JSON.stringify(
        saved ? { available: true, ...parseWorldBirth(saved.value) } : { available: false },
      ),
    );
  } else {
    const [operator, reason, expected, priority, round, phase, operationId, extra] = args;
    if (
      extra !== undefined ||
      !operator ||
      !reason ||
      !expected ||
      !priority ||
      !round ||
      !phase ||
      !operationId ||
      !/^(missing|[1-9][0-9]*)$/.test(expected) ||
      !/^[0-9]+$/.test(priority) ||
      !/^[1-9][0-9]*$/.test(round) ||
      !/^[012]$/.test(phase)
    )
      throw new Error("Invalid birth adoption arguments");
    const rules = worldBirthRules(await loadRules(undefined, kingdomId)),
      authority = await acquireRealmAuthority(database.db, kingdomId, () => true);
    const result = await createWorldBirthAdopter(
      database.db,
      authority,
      rules,
    )({
      operator,
      reason,
      expectedVersion: expected === "missing" ? null : Number(expected),
      priority: Number(priority),
      round: Number(round),
      phase: Number(phase) as 0 | 1 | 2,
      operationId,
    });
    console.log(JSON.stringify(result));
  }
} catch {
  console.error(
    "World birth operation failed; verify realm database, authorized operator input, source phase and expected version",
  );
  process.exitCode = 1;
} finally {
  await database?.close();
}
