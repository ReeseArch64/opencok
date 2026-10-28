import type { ProvisionReceiptResponse as ProvisionReceipt } from "./responses/provisioning";

export type {
    CharacterResponse,
    ProvisionReceiptResponse as ProvisionReceipt,
} from "./responses/provisioning";

export const characterPath = "/api/v1/characters";

export const provisionPath = "/_internal/characters";

export const starterVersion = "normal-v1";

export interface VerifiedIdentity
{
    issuer: string;
    subject: string;
}

export interface CharacterInput
{
    kingdomId: number;
    deviceUuid: string;
    country: string;
    language: string;
}

export interface CharacterReservation extends CharacterInput
{
    identityId: string;
    gameUid: string;
    name: string;
    createdAt: number;
    preset: string;
}

export interface IdentityVerifier
{
    verify(token: string): Promise<VerifiedIdentity>;
}

export interface RealmProvisioner
{
    create(reservation: CharacterReservation): Promise<ProvisionReceipt>;
}
