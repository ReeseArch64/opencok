import type {
    CharacterInput,
    CharacterReservation,
    CharacterResponse,
    ProvisionReceipt,
    VerifiedIdentity,
} from "@opencok/contracts/provisioning";

export interface ProvisioningStore
{
    reserve(
        identity: VerifiedIdentity,
        input: CharacterInput,
    ): Promise<{ reservation: CharacterReservation; ready: boolean; }>;
    activate(
        identity: VerifiedIdentity,
        reservation: CharacterReservation,
        receipt: ProvisionReceipt,
    ): Promise<CharacterResponse>;
}
