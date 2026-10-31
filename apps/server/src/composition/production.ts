import { readProductionProgress } from "@opencok/repositories/reconnect-progress";
import { persistProductionProgress } from "@opencok/repositories/reconnect-write";
import { ProductionService } from "@opencok/production/services/production";
import { productionContext } from "@opencok/production/services/context";
import { createProductionExecutor } from "@opencok/production/repositories/production";
import type { ProductionPreparation } from "@opencok/production/contracts/persistence";
import type { ProductionExecutor } from "@opencok/production/contracts/production";
import { createInventoryPlanner, type InventoryEffects } from "@opencok/services/inventory-runtime";
import { decodeWorldPowerEffects } from "@opencok/services/power";
import { createMutationExecutor } from "@opencok/repositories/mutation";
import { executeRealmInventoryTransaction } from "@opencok/repositories/inventory-runtime";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { RealmAuthority } from "@opencok/repositories/realm-authority";
import type { Rules } from "@opencok/rules/game";
import { createRealmAllianceSciencePolicy } from "./alliance-policy";

export function createRealmProductionService(
    execute: ProductionExecutor,
    rules: Rules,
    effects: InventoryEffects,
)
{
    return new ProductionService(
        execute,
        rules,
        (state, now) => createInventoryPlanner(state, rules, effects, now),
    );
}

export function createRealmProductionExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    preparation: ProductionPreparation,
    now = Date.now,
)
{
    return createProductionExecutor(
        {
            execute: createMutationExecutor(db, authority, now),
            inventory: executeRealmInventoryTransaction,
        },
        preparation,
        now,
    );
}

export function createRealmProductionPreparation(
    rules: Rules,
    authority: RealmAuthority,
    providers: Parameters<typeof productionContext>[3],
): ProductionPreparation
{
    return {
        async prepare(tx, owner, now)
        {
            const state = await readProductionProgress(tx, owner, rules.kingdomId, now, true);
            const planned = await planRealmProductionContext(state, rules, now, providers);
            await persistProductionProgress(tx, state, planned.write, authority, now);

            return planned.rates;
        },
    };
}

export function planRealmProductionContext(
    state: Parameters<typeof productionContext>[0],
    rules: Parameters<typeof productionContext>[1],
    now: bigint,
    providers: Parameters<typeof productionContext>[3],
)
{
    const policy = createRealmAllianceSciencePolicy();

    return productionContext(
        state,
        rules,
        now,
        providers,
        decodeWorldPowerEffects,
        (id, level) => policy.allianceScienceRule(rules, id, level),
    );
}
