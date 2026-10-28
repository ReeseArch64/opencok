import type { AllianceRecord } from "./records";
import type { AllianceProgressAction } from "../enums/progress-action";
import type { Fields } from "@opencok/messages/sfs";

export interface HelpGeneration
{
    version: 1;
    activityId: string;
    helpers: string[];
}

export interface AllianceProgressEntry
{
    uid: string;
    kind: `${AllianceProgressAction}`;
    count: number;
}

export interface AllianceHelpState
{
    cities: readonly AllianceRecord[];
    helps: readonly AllianceRecord[];
    queues: readonly AllianceRecord[];
    activities: readonly AllianceRecord[];
}

export interface AllianceHelpWrite
{
    actions?: readonly AllianceProgressEntry[];
    helps?: readonly AllianceRecord[];
    queues?: readonly AllianceRecord[];
    activities?: readonly AllianceRecord[];
}

export interface AllianceHelpContext<TCatalog>
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: AllianceHelpState;
    readonly write: AllianceHelpWrite;
    readonly ledger: { readonly pushes: { command: string; body: Fields; }[]; };
    member(uid?: string): AllianceRecord;
    profile(uid?: string): AllianceRecord;
    right(key: string): void;
    effect(id: number): Promise<number>;
}

export type AllianceHelpFactory<TCatalog> = (context: AllianceHelpContext<TCatalog>) => {
    command(command: string, params: Fields): Promise<Fields>;
};
