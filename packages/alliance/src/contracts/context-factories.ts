import type { AllianceContextCatalog } from "./context-catalog";
import type { AllianceContextLedger } from "./context";
import type { AllianceHelpFactory } from "./help";
import type { AllianceGiftFactory } from "./gifts";
import type { AllianceScienceFactory } from "./science";
import type { AllianceGovernanceFactory } from "./governance";
import type { AllianceApplicationsFactory } from "./applications";
import type { AllianceMembershipFactory } from "./membership";
import type { AllianceQueriesFactory } from "./queries";
import type { AllianceSnapshotFactory } from "./snapshot";

export interface AllianceContextFactories<
    TCatalog extends AllianceContextCatalog,
    TLedger extends AllianceContextLedger,
>
{
    help: AllianceHelpFactory<TCatalog>;
    gifts: AllianceGiftFactory<TLedger>;
    science: AllianceScienceFactory<TLedger>;
    governance: AllianceGovernanceFactory;
    applicationsFactory: AllianceApplicationsFactory;
    membershipFactory: AllianceMembershipFactory<TCatalog, TLedger>;
    queriesFactory: AllianceQueriesFactory;
    snapshotFactory: AllianceSnapshotFactory;
}
