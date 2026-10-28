import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";
import type { AlliancePolicyCatalog } from "./governance-catalog";

export interface AllianceApplicationState
{
    applications: readonly AllianceRecord[];
    mails: readonly AllianceRecord[];
}

export interface AllianceApplicationWrite
{
    applications?: readonly AllianceRecord[];
    deletedApplications?: readonly string[];
    mailUpdates?: readonly AllianceRecord[];
}

export interface AllianceApplicationContext
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: AlliancePolicyCatalog & {
        mail: ReadonlyMap<string, { title?: string; }>;
    };
    readonly state: AllianceApplicationState & {
        members: readonly AllianceRecord[];
        selection: { page?: number; };
    };
    readonly write: AllianceApplicationWrite & { mails?: readonly AllianceRecord[]; };
    member(uid?: string, allianceId?: string): AllianceRecord;
    alliance(id?: string): AllianceRecord;
    profile(uid?: string): AllianceRecord;
    list(id?: string): AllianceRecord[];
    right(key: string): void;
    power(uid: string): bigint;
    castle(uid: string): number;
    scienceEffect(effect: number, allianceId?: string): number;
    join(uid: string, alliance: AllianceRecord): Fields;
}

export type AllianceApplicationsFactory = (context: AllianceApplicationContext) => {
    command(command: string, params: Fields): Fields;
    queries(command: string, params: Fields): Fields;
};
