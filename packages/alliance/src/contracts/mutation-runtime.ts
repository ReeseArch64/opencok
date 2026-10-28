import type { AllianceCommandRuntime } from "./command";
import type { AllianceContextState } from "./context-state";

export interface AllianceMutationRuntime<
    TState extends AllianceContextState,
    TCatalog,
    TLedger,
    TEffects,
> extends AllianceCommandRuntime
{
    createInventoryPlanner(
        state: TState["inventory"],
        rules: TCatalog,
        effects: TEffects,
        now: number,
    ): TLedger;
}
