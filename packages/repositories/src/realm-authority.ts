import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { DependencyError } from "@opencok/errors/dependency";
import type { Database } from "./game.ts";

type RealmDatabase = Database["kingdom"]["db"];
type RealmTransaction = Parameters<Parameters<RealmDatabase["transaction"]>[0]>[0];

export interface RealmAuthority {
  readonly kingdomId: number;
  readonly epoch: bigint;
  readonly instance: string;
  assertReady(): void;
}

export async function acquireRealmAuthority(
  db: RealmDatabase,
  kingdomId: number,
  ready: () => boolean,
  now = Date.now(),
): Promise<RealmAuthority> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(now)
  )
    throw new DependencyError("realm authority");
  const assertReady = () => {
    if (!ready()) throw new DependencyError("realm authority");
  };
  assertReady();
  const instance = randomUUID();
  const epoch = await db.transaction(async (tx) => {
    assertReady();
    const rows = await tx
      .insert(realm_authority)
      .values({
        kingdomId,
        ownerEpoch: 1n,
        instanceId: instance,
        acquiredAt: BigInt(now),
      })
      .onConflictDoUpdate({
        target: realm_authority.kingdomId,
        set: {
          ownerEpoch: sql`${realm_authority.ownerEpoch} + 1`,
          instanceId: instance,
          acquiredAt: BigInt(now),
        },
      })
      .returning({ epoch: realm_authority.ownerEpoch });
    if (rows.length !== 1 || rows[0]!.epoch <= 0n) throw new DependencyError("realm authority");
    assertReady();
    return rows[0]!.epoch;
  });
  assertReady();
  return Object.freeze({ kingdomId, epoch, instance, assertReady });
}

export async function fenceRealmTransaction(
  tx: RealmTransaction,
  authority: RealmAuthority,
  mode: "share" | "update" = "share",
): Promise<void> {
  authority.assertReady();
  const rows = await tx
    .select({ epoch: realm_authority.ownerEpoch })
    .from(realm_authority)
    .where(
      and(
        eq(realm_authority.kingdomId, authority.kingdomId),
        eq(realm_authority.ownerEpoch, authority.epoch),
        eq(realm_authority.instanceId, authority.instance),
      ),
    )
    .limit(1)
    .for(mode);
  if (rows.length !== 1) throw new DependencyError("realm authority");
  authority.assertReady();
}

const guarded = new WeakSet<object>();
export function fenceRealmDatabase(db: RealmDatabase, authority: RealmAuthority): void {
  if (guarded.has(db)) throw new DependencyError("realm authority already installed");
  const transaction = db.transaction.bind(db);
  db.transaction = (apply, config) => {
    if (config?.accessMode === "read only") return transaction(apply, config);
    return transaction(async (tx) => {
      await fenceRealmTransaction(tx, authority);
      const result = await apply(tx);
      authority.assertReady();
      return result;
    }, config);
  };
  for (const method of ["insert", "update", "delete"] as const)
    Object.defineProperty(db, method, {
      value: () => {
        throw new DependencyError("realm write requires transaction");
      },
    });
  guarded.add(db);
}
