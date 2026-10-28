import type { AllianceRecordReaders } from "./readers";

export interface AllianceHeartPolicyRuntime
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    allianceHeartFailure(): never;
}

export interface AllianceHeartPublicationRuntime
{
    playerItemGiftRecipient(value: string): string;
    allianceHeartFailure(): never;
}

export interface AllianceHeartRuntime
    extends Pick<AllianceRecordReaders, "text" | "num">, AllianceHeartPublicationRuntime
{
    foreignAllianceFailure(): never;
}
