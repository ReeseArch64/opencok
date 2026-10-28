import type { AlliancePolicyCatalog } from "./governance-catalog";

export interface AllianceMembershipMailTemplate
{
    reward?: string;
    message?: string;
    sender?: string;
    title?: string;
}

export interface AllianceMembershipCatalog extends AlliancePolicyCatalog
{
    readonly kingdomId: number;
    readonly mail: ReadonlyMap<string, AllianceMembershipMailTemplate>;
}
