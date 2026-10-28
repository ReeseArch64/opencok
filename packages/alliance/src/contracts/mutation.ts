import type { Fields } from "@opencok/messages/sfs";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type {
    AllianceContextState,
    AllianceContextWrite,
    AllianceSelection,
} from "./context-state";
import type { AllianceContextLedger } from "./context";

export interface AllianceMutationLedger extends AllianceContextLedger
{
    result(body: Fields): InventoryPlan;
}

export interface AlliancePlan
{
    inventory: InventoryPlan;
    write: AllianceContextWrite;
    productionAt?: bigint;
    productionOwners?: readonly string[];
}

export interface AllianceRepository<TState extends AllianceContextState>
{
    execute(
        input: MutationCommand,
        selection: AllianceSelection,
        plan: (state: TState) => Promise<AlliancePlan>,
    ): Promise<Buffer>;
}
