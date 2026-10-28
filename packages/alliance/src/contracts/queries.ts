import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "./records";

export interface AllianceQuerySelection
{
    allianceId?: string;
    playerId?: string;
    key?: string;
    searchPlayers?: boolean;
    language?: string;
    pageSize?: number;
    page?: number;
}

export interface AllianceQueryState
{
    directory: readonly AllianceRecord[];
    candidates: readonly AllianceRecord[];
    directoryTotal: bigint;
}

export interface AllianceQueryContext
{
    readonly owner: string;
    readonly allianceId: string;
    readonly state: AllianceQueryState & {
        selection: AllianceQuerySelection;
        profiles: readonly AllianceRecord[];
        alliances: readonly AllianceRecord[];
        applications: readonly AllianceRecord[];
        lords: readonly AllianceRecord[];
    };
    list(id?: string): AllianceRecord[];
    profile(uid: string): AllianceRecord;
    alliance(id?: string): AllianceRecord;
    right(key: string): void;
    power(uid: string): bigint;
    snapshot(alliance?: AllianceRecord): Fields;
}

export type AllianceQueriesFactory = (context: AllianceQueryContext) => {
    command(command: string): Fields;
};
