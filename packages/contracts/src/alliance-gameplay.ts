import type {
    AllianceMembershipState,
    AllianceMembershipWrite,
} from "@opencok/alliance/contracts/membership";
import type {
    AllianceApplicationState,
    AllianceApplicationWrite,
} from "@opencok/alliance/contracts/applications";
import type {
    AllianceGovernanceState,
    AllianceGovernanceWrite,
} from "@opencok/alliance/contracts/governance";
import type {
    AllianceScienceState,
    AllianceScienceWrite,
} from "@opencok/alliance/contracts/science";
import type { AllianceGiftState, AllianceGiftWrite } from "@opencok/alliance/contracts/gifts";
import type { AllianceHelpState, AllianceHelpWrite } from "@opencok/alliance/contracts/help";
import type { Row } from "./rows";
import type { InventoryState } from "./inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";

export interface AllianceSelection
{
    allianceId?: string;
    playerId?: string;
    mailId?: string;
    helpId?: string;
    giftEvent?: string;
    key?: string;
    searchPlayers?: boolean;
    language?: string;
    pageSize?: number;
    page?: number;
}

export interface AllianceState
    extends
        AllianceHelpState,
        AllianceGiftState,
        AllianceScienceState,
        AllianceGovernanceState,
        AllianceApplicationState,
        AllianceMembershipState
{
    now: bigint;
    inventory: InventoryState;
    selection: AllianceSelection;
    profiles: readonly Row[];
    alliances: readonly Row[];
    members: readonly Row[];
    powers: readonly Row[];
    directory: readonly Row[];
    candidates: readonly Row[];
    directoryTotal: bigint;
}

export interface AllianceWrite
    extends
        AllianceHelpWrite,
        AllianceGiftWrite,
        AllianceScienceWrite,
        AllianceGovernanceWrite,
        AllianceApplicationWrite,
        AllianceMembershipWrite
{
}

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

export interface AlliancePublicationSnapshot
{
    profiles: readonly Row[];
    record?: Row;
    members: readonly Row[];
    queues: readonly Row[];
    helps: readonly Row[];
    sciences: readonly Row[];
    research: readonly Row[];
}
