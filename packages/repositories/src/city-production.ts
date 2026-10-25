import { and, eq, inArray } from "drizzle-orm";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import type { ProductionAccount } from "@opencok/contracts/timed-activity";
import { text, long, type Row } from "@opencok/contracts/rows";
import type { ProgressionBoundary } from "./city-progression";
import { changeProductionInTransaction, type ProductionPreparation } from "./production";

export function createCityProductionBoundary(
  preparation: ProductionPreparation,
  asset: (building: Row) => string | undefined,
): ProgressionBoundary {
  return async (tx, owner, now, change, deleted, economy) => {
    const rates = await preparation.prepare(tx, owner, now);
    const buildings = await tx.select().from(user_building).where(eq(user_building.uid, owner));
    const initial: ProductionAccount[] = [];
    for (const building of buildings) {
      const resource = asset(building);
      if (resource === undefined) continue;
      const from = long(building, "refreshTime") || (now >= 5000n ? now - 5000n : 0n);
      initial.push({
        buildingId: building.uuid,
        ownerId: owner,
        asset: resource,
        settledAt: from,
        amount: 0n,
        remainder: 0n,
        rates: await rates(building, from),
      });
    }
    await changeProductionInTransaction(tx, owner, now, initial, async () => {
      await change();
      const nextRates = await preparation.prepare(tx, owner, now);
      const next = await tx.select().from(user_building).where(eq(user_building.uid, owner));
      return {
        result: undefined,
        rates: async (buildingId) => {
          const building = next.find((row) => row.uuid === buildingId);
          if (!building) return [{ at: now, perHour: 0n, capacity: 0n }];
          return nextRates(building, now);
        },
      };
    });
    if (deleted.length) {
      const accounts = await tx
        .select()
        .from(building_production)
        .where(
          and(
            eq(building_production.ownerId, owner),
            inArray(building_production.buildingId, [...deleted]),
          ),
        );
      for (const account of accounts)
        if (account.amount > 0n) {
          if (!["wood", "stone", "iron", "food"].includes(account.asset))
            throw new Error("Invalid demolished production asset");
          economy.resource(
            text(account, "asset") as "wood" | "stone" | "iron" | "food",
            account.amount,
          );
        }
    }
  };
}
