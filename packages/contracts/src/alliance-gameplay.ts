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

export interface AllianceState extends AllianceHelpState, AllianceGiftState, AllianceScienceState
{
    now: bigint;
    inventory: InventoryState;
    selection: AllianceSelection;
    profiles: readonly Row[];
    alliances: readonly Row[];
    members: readonly Row[];
    applications: readonly Row[];
    lords: readonly Row[];
    points: readonly Row[];
    powers: readonly Row[];
    marches: readonly Row[];
    blacklist: readonly Row[];
    directory: readonly Row[];
    candidates: readonly Row[];
    directoryTotal: bigint;
    mails: readonly Row[];
}

export interface AllianceWrite extends AllianceHelpWrite, AllianceGiftWrite, AllianceScienceWrite
{
    alliances?: readonly Row[];
    deletedAlliances?: readonly string[];
    members?: readonly Row[];
    removedMembers?: readonly string[];
    memberships?: readonly { uid: string; allianceId: string; }[];
    applications?: readonly Row[];
    deletedApplications?: readonly string[];
    firstJoin?: readonly string[];
    blacklist?: readonly Row[];
    mails?: readonly Row[];
    mailUpdates?: readonly Row[];
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
