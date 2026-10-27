import { and, asc, eq } from "drizzle-orm";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import type {
  ProductionAccount,
  ProductionExecutor,
  ProductionRate,
} from "@opencok/contracts/timed-activity";
import type { Row } from "@opencok/contracts/rows";
import { long, text } from "@opencok/contracts/rows";
import { encodeProductionRates, decodeProductionRates } from "@opencok/mappings/production";
import { changeProductionRate, settleProduction } from "@opencok/rules/timed-activity";
import { createMutationExecutor, type MutationTransaction } from "./mutation";
import { executeInventoryTransaction } from "./inventory";
import type { Database } from "./game";
import type { RealmAuthority } from "./realm-authority";

export interface ProductionPreparation {
  recordAction?: import("./inventory").InventoryPreparation["recordAction"];
  prepare(
    tx: MutationTransaction,
    owner: string,
    now: bigint,
  ): Promise<(building: Row, from: bigint) => Promise<readonly ProductionRate[]>>;
}

export function createProductionExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  preparation: ProductionPreparation,
  now = Date.now,
): ProductionExecutor {
  const execute = createMutationExecutor(db, authority, now);

  return (command, plan) =>
    execute(command, async (tx) => {
      const captured = BigInt(now());
      const rates = await preparation.prepare(tx, command.owner, captured);

      return executeInventoryTransaction(
        tx,
        command.owner,
        async (inventory) => {
          const rows = await tx
            .select()
            .from(building_production)
            .where(eq(building_production.ownerId, command.owner))
            .orderBy(asc(building_production.buildingId))
            .limit(257)
            .for("update");

          if (rows.length > 256) {throw new Error("Production aggregate exceeds bound");}

          const accounts = rows.map((row) => ({ ...row, rates: decodeProductionRates(row.rates) }));
          const result = await plan({
            ...inventory,
            now: captured,
            accounts,
            rates,
            recordAction: preparation.recordAction
              ? (kind, itemId, count, economy) =>
                  preparation.recordAction!(
                    tx,
                    command.owner,
                    kind,
                    itemId,
                    count,
                    captured,
                    economy,
                  )
              : undefined,
          });

          if (
            result.accounts.length > 256 ||
            new Set(result.accounts.map((row) => row.buildingId)).size !== result.accounts.length
          )
            {throw new Error("Invalid production write set");}

          for (const account of result.accounts) {
            if (
              account.ownerId !== command.owner ||
              !inventory.buildings.some((row) => row.uuid === account.buildingId)
            )
              {throw new Error("Invalid production owner");}

            const previous = accounts.find((row) => row.buildingId === account.buildingId);

            if (
              previous &&
              (previous.asset !== account.asset || account.settledAt < previous.settledAt)
            )
              {throw new Error("Production checkpoint conflict");}

            settleProduction(account, account.settledAt);
            const value = { ...account, rates: encodeProductionRates(account.rates) };
            await tx
              .insert(building_production)
              .values(value)
              .onConflictDoUpdate({ target: building_production.buildingId, set: value });
          }

          for (const building of result.buildings) {
            if (!inventory.buildings.some((row) => row.uuid === building.uuid))
              {throw new Error("Unknown production building");}

            await tx
              .update(user_building)
              .set({
                refreshTime: long(building, "refreshTime"),
                effectTime: long(building, "effectTime"),
              })
              .where(
                and(
                  eq(user_building.uid, command.owner),
                  eq(user_building.uuid, text(building, "uuid")),
                ),
              );
          }

          return result;
        },
        command.command,
      );
    });
}

export async function changeProductionInTransaction<T>(
  tx: MutationTransaction,
  owner: string,
  now: bigint,
  initial: readonly ProductionAccount[],
  change: () => Promise<{
    result: T;
    rates(buildingId: string): Promise<readonly ProductionRate[]>;
  }>,
): Promise<T> {
  if (initial.length > 256 || new Set(initial.map((row) => row.buildingId)).size !== initial.length)
    {throw new Error("Invalid production rate change set");}

  const saved = await tx
    .select()
    .from(building_production)
    .where(eq(building_production.ownerId, owner))
    .orderBy(asc(building_production.buildingId))
    .limit(257)
    .for("update");

  if (saved.length > 256) {throw new Error("Production aggregate exceeds bound");}

  const buildings = await tx
    .select({ id: user_building.uuid })
    .from(user_building)
    .where(eq(user_building.uid, owner));
  const accounts = initial.map((account) => {
    if (account.ownerId !== owner || !buildings.some((row) => row.id === account.buildingId))
      {throw new Error("Invalid production rate change owner");}

    const previous = saved.find((row) => row.buildingId === account.buildingId);

    if (previous && previous.asset !== account.asset) {throw new Error("Production asset changed");}

    return settleProduction(
      previous ? { ...previous, rates: decodeProductionRates(previous.rates) } : account,
      now,
    );
  });
  const changed = await change();

  for (const account of accounts) {
    const next = changeProductionRate(account, now, await changed.rates(account.buildingId));
    const value = { ...next, rates: encodeProductionRates(next.rates) };
    await tx
      .insert(building_production)
      .values(value)
      .onConflictDoUpdate({ target: building_production.buildingId, set: value });
  }

  return changed.result;
}
