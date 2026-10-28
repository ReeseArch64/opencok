import type { AllianceQuerySelection, AllianceQueryState } from "./queries";
import type { AllianceMembershipState, AllianceMembershipWrite } from "./membership";
import type { AllianceApplicationState, AllianceApplicationWrite } from "./applications";
import type { AllianceGovernanceState, AllianceGovernanceWrite } from "./governance";
import type { AllianceScienceState, AllianceScienceWrite } from "./science";
import type { AllianceGiftState, AllianceGiftWrite } from "./gifts";
import type { AllianceHelpState, AllianceHelpWrite } from "./help";
import type { AllianceRecord as Row } from "./records";

export interface AllianceSelection extends AllianceQuerySelection
{
    mailId?: string;
    helpId?: string;
    giftEvent?: string;
}

export interface AllianceContextState
    extends
        AllianceHelpState,
        AllianceGiftState,
        AllianceScienceState,
        AllianceGovernanceState,
        AllianceApplicationState,
        AllianceMembershipState,
        AllianceQueryState
{
    now: bigint;
    inventory: { profile: Row; resource: Row; };
    selection: AllianceSelection;
    profiles: readonly Row[];
    alliances: readonly Row[];
    members: readonly Row[];
    powers: readonly Row[];
}

export interface AllianceContextWrite
    extends
        AllianceHelpWrite,
        AllianceGiftWrite,
        AllianceScienceWrite,
        AllianceGovernanceWrite,
        AllianceApplicationWrite,
        AllianceMembershipWrite
{
}
