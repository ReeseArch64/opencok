import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";
import type { AlliancePolicyCatalog } from "./governance-catalog";

export interface AllianceGovernanceState
{
    blacklist: readonly AllianceRecord[];
}

export interface AllianceGovernanceWrite
{
    alliances?: readonly AllianceRecord[];
    deletedAlliances?: readonly string[];
    members?: readonly AllianceRecord[];
    memberships?: readonly { uid: string; allianceId: string; }[];
    blacklist?: readonly AllianceRecord[];
}

export interface AllianceGovernanceContext
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: AlliancePolicyCatalog;
    readonly state: AllianceGovernanceState;
    readonly write: AllianceGovernanceWrite;
    readonly ledger: { total(): bigint; };
    member(uid?: string): AllianceRecord;
    alliance(): AllianceRecord;
    profile(uid?: string): AllianceRecord;
    list(): AllianceRecord[];
    right(key: string): void;
    cost(key: string): void;
    snapshot(alliance?: AllianceRecord): Fields;
    remove(uid: string): Fields;
    setMember(row: AllianceRecord): void;
    setAlliance(row: AllianceRecord): void;
}

export type AllianceGovernanceFactory = (context: AllianceGovernanceContext) => {
    command(command: string, params: Fields): Fields;
};
