import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";
import type { AllianceProgressEntry } from "./help";
import type { AllianceGovernanceWrite } from "./governance";
import type { AllianceMembershipCatalog } from "./membership-catalog";

export interface AllianceMembershipState
{
    lords: readonly AllianceRecord[];
    points: readonly AllianceRecord[];
    marches: readonly AllianceRecord[];
}

export interface AllianceMembershipWrite
{
    removedMembers?: readonly string[];
    firstJoin?: readonly string[];
    mails?: readonly AllianceRecord[];
}

export interface AllianceMembershipContext<TCatalog extends AllianceMembershipCatalog, TLedger>
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly ledger: TLedger;
    readonly state: AllianceMembershipState & {
        members: readonly AllianceRecord[];
        directory: readonly AllianceRecord[];
    };
    readonly write: AllianceMembershipWrite & AllianceGovernanceWrite & {
        actions?: readonly AllianceProgressEntry[];
    };
    readonly productionOwners: Set<string>;
    profile(uid?: string): AllianceRecord;
    alliance(): AllianceRecord;
    list(id?: string): AllianceRecord[];
    power(uid: string): bigint;
    castle(uid: string): number;
    scienceEffect(effect: number, allianceId?: string): number;
    setMember(row: AllianceRecord): void;
    setAlliance(row: AllianceRecord): void;
    snapshot(alliance: AllianceRecord, member: AllianceRecord): Fields;
}

export type AllianceMembershipFactory<TCatalog extends AllianceMembershipCatalog, TLedger> = (
    context: AllianceMembershipContext<TCatalog, TLedger>,
) => {
    create(params: Fields): Fields;
    join(uid: string, alliance: AllianceRecord, rank?: number): Fields;
    remove(uid: string): Fields;
};
