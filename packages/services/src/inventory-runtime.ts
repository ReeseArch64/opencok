import type { InventoryState } from "@opencok/contracts/inventory";
import type {
    InventoryExecutor,
    InventoryPlan,
} from "@opencok/economy/contracts/inventory-planning";
import type { InventoryRuntime } from "@opencok/economy/contracts/inventory-runtime";
import type { Rules } from "@opencok/rules/game";
import { InventoryPlanner } from "@opencok/economy/services/inventory-planner";
import { InventoryService } from "@opencok/economy/services/inventory";
import { planInventoryGrants } from "@opencok/economy/services/inventory-grants";
import { serverFeature } from "@opencok/rules/power-context";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { confirmedContinuedCost } from "./continued-cost-spending";

export interface InventoryEffects
{
    world(): Promise<ReadonlyMap<number, number>>;
    emperor(): Promise<number | null | undefined>;
}

export type RealmInventoryPlanner = InventoryPlanner<InventoryState, Rules>;

export function createInventoryRuntime(
    effects: InventoryEffects,
): InventoryRuntime<InventoryState, Rules>
{
    return {
        feature: serverFeature,
        confirmedSpending: confirmedContinuedCost,
        async resourceBonus(state, rules, now, id)
        {
            const snapshot = await state.effects();
            return playerGameEffect(
                {
                    ...snapshot,
                    profile: {
                        ...snapshot.profile,
                        decomposeSuitEffect: snapshot.profile.decomposesuiteffect ?? null,
                    },
                },
                rules,
                { kingdomId: rules.kingdomId, version: MOBILE_CLIENT_VERSION, now },
                generalSkillPoints(snapshot.generals),
                await effects.world(),
                await effects.emperor(),
                id,
            );
        },
    };
}

export function createInventoryPlanner(
    state: InventoryState,
    rules: Rules,
    effects: InventoryEffects,
    now: number,
)
{
    return new InventoryPlanner(state, rules, createInventoryRuntime(effects), now);
}

export function createInventoryService(
    execute: InventoryExecutor<InventoryState>,
    rules: Rules,
    effects: InventoryEffects,
    now = Date.now,
)
{
    return new InventoryService(execute, rules, createInventoryRuntime(effects), now);
}

export function planRealmInventoryGrants(
    state: InventoryState,
    rules: Rules,
    grants: readonly { itemId: string; count: number; }[],
    now: number,
    costs: readonly { itemId: string; count: number; }[] = [],
): InventoryPlan
{
    return planInventoryGrants(
        state,
        rules,
        createInventoryRuntime({ world: async () => new Map(), emperor: async () => null }),
        grants,
        now,
        costs,
    );
}
