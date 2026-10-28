import type { Fields, Value } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";
import type { AllianceScienceCatalog } from "./science-catalog";
import type { AllianceProgressEntry } from "./help";

export interface AllianceScienceLedger
{
    readonly pushes: { command: string; body: Fields; }[];
    total(): bigint;
}

export interface AllianceScienceState
{
    sciences: readonly AllianceRecord[];
    research: readonly AllianceRecord[];
    donations: readonly AllianceRecord[];
    history: readonly AllianceRecord[];
}

export interface AllianceScienceWrite
{
    sciences?: readonly AllianceRecord[];
    research?: readonly AllianceRecord[];
    deletedResearch?: readonly string[];
    donations?: readonly AllianceRecord[];
    history?: readonly AllianceRecord[];
    actions?: readonly AllianceProgressEntry[];
}

export interface AllianceScienceContext<TLedger extends AllianceScienceLedger>
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: AllianceScienceCatalog;
    readonly state: AllianceScienceState & {
        inventory: { resource: AllianceRecord; };
        lords: readonly AllianceRecord[];
    };
    readonly write: AllianceScienceWrite;
    readonly ledger: TLedger;
    readonly productionOwners: Set<string>;
    productionAt?: bigint;
    member(): AllianceRecord;
    alliance(): AllianceRecord;
    list(): AllianceRecord[];
    right(key: string): void;
    scienceEffect(effect: number): number;
    setMember(row: AllianceRecord): void;
    setAlliance(row: AllianceRecord): void;
}

export interface AllianceScienceResponseContext
{
    member(): AllianceRecord;
    alliance(): AllianceRecord;
    readonly ledger: Pick<AllianceScienceLedger, "total">;
}

export type AllianceScienceFactory<TLedger extends AllianceScienceLedger> = (
    context: AllianceScienceContext<TLedger>,
) => {
    snapshots(id: string): Value;
    complete(): Fields;
    command(command: string, params: Fields): Promise<Fields>;
};
