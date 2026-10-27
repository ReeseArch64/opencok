import { and, eq, sql } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import type { WorldBirthRules } from "@opencok/contracts/world-birth";
import { initialWorldBirth, parseWorldBirth } from "@opencok/rules/world-birth";
import type { MutationTransaction } from "./mutation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export const worldBirthIdentity = Object.freeze({
  type: -1,
  uid: "@world:0",
  key: "opencok.world.birth.v1",
});
export async function initializeWorldBirth(
  tx: MutationTransaction,
  authority: RealmAuthority,
  rules: WorldBirthRules,
  now: bigint,
): Promise<void> {
  if (now < 0n || now > 9223372036854775807n) throw new Error("Invalid world birth time");
  await fenceRealmTransaction(tx, authority);
  await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
  const [prior] = await tx
    .select()
    .from(trigger_var)
    .where(
      and(
        eq(trigger_var.type, worldBirthIdentity.type),
        eq(trigger_var.uid, worldBirthIdentity.uid),
        eq(trigger_var.key, worldBirthIdentity.key),
      ),
    )
    .for("update");
  const [profile] = await tx.select({ uid: userprofile.uid }).from(userprofile).limit(1);
  const [city] = await tx
    .select({ id: worldpoint.id })
    .from(worldpoint)
    .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.pointType, 1)))
    .limit(1);
  if (prior || profile || city)
    throw new Error("World birth initialization requires a fresh resident world");
  const state = initialWorldBirth(rules, authority.epoch),
    value = JSON.stringify(state);
  parseWorldBirth(value);
  await tx.insert(trigger_var).values({ ...worldBirthIdentity, value, refreshtime: now });
}
