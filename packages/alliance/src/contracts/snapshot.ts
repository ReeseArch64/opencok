import type { Fields, Value } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";

export interface AllianceSnapshotContext
{
    readonly owner: string;
    readonly state: { members: readonly AllianceRecord[]; };
    readonly write: { members?: readonly AllianceRecord[]; removedMembers?: readonly string[]; };
    alliance(): AllianceRecord;
    list(id: string): AllianceRecord[];
    profile(uid: string): AllianceRecord;
    power(uid: string): bigint;
    scienceEffect(effect: number, id: string): number;
    scienceSnapshots(id: string): Value;
}

export type AllianceSnapshotFactory = (context: AllianceSnapshotContext) => {
    snapshot(alliance?: AllianceRecord, member?: AllianceRecord): Fields;
};
