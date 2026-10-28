import type {
    AllianceContextState,
    AllianceContextWrite,
} from "@opencok/alliance/contracts/context-state";
import type { InventoryState } from "./inventory";
import type {
    AllianceRepository as OwnedAllianceRepository,
} from "@opencok/alliance/contracts/mutation";

export interface AllianceState extends AllianceContextState
{
    inventory: InventoryState;
}

export interface AllianceWrite extends AllianceContextWrite
{}

export interface AllianceRepository extends OwnedAllianceRepository<AllianceState>
{}
