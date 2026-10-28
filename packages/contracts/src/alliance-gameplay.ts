import type {
    AllianceSelection as OwnedAllianceSelection,
    AllianceContextState,
    AllianceContextWrite,
} from "@opencok/alliance/contracts/context-state";
import type { InventoryState } from "./inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

export interface AllianceSelection extends OwnedAllianceSelection
{}

export interface AllianceState extends AllianceContextState
{
    inventory: InventoryState;
}

export interface AllianceWrite extends AllianceContextWrite
{}

export interface AlliancePlan
{
    inventory: InventoryPlan;
    write: AllianceWrite;
    productionAt?: bigint;
    productionOwners?: readonly string[];
}

export interface AllianceRepository
{
    execute(
        input: MutationCommand,
        selection: AllianceSelection,
        plan: (state: AllianceState) => Promise<AlliancePlan>,
    ): Promise<Buffer>;
}
