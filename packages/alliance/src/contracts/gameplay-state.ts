import type { AllianceContextState } from "./context-state";

export interface AllianceGameplayState<TInventory extends AllianceContextState["inventory"]>
    extends AllianceContextState
{
    inventory: TInventory;
}
