import type {
  CharacterResponse,
  ProvisionReceiptResponse as ProvisionReceipt,
} from "./responses/provisioning";

export type {
  CharacterResponse,
  ProvisionReceiptResponse as ProvisionReceipt,
} from "./responses/provisioning";

import type { Row } from "./rows.ts";

export const characterPath = "/api/v1/characters";

export const provisionPath = "/_internal/characters";

export const starterVersion = "normal-v1";

export interface VerifiedIdentity {
  issuer: string;
  subject: string;
}

export interface CharacterInput {
  kingdomId: number;
  deviceUuid: string;
  country: string;
  language: string;
}

export interface CharacterReservation extends CharacterInput {
  identityId: string;
  gameUid: string;
  name: string;
  createdAt: number;
  preset: string;
}

export interface ProvisioningStore {
  reserve(
    identity: VerifiedIdentity,
    input: CharacterInput,
  ): Promise<{ reservation: CharacterReservation; ready: boolean }>;
  activate(
    identity: VerifiedIdentity,
    reservation: CharacterReservation,
    receipt: ProvisionReceipt,
  ): Promise<CharacterResponse>;
}

export interface CharacterSeed {
  birth: import("./world-birth").WorldBirthRules;
  profile: Row;
  resource: Row;
  buildings: readonly Row[];
  queues: readonly Row[];
  tasks: readonly Row[];
  generals: readonly Row[];
  player: Row;
  lord: Row;
  vip: Row;
  shield: Row;
  shieldEnd: bigint;
  cityDefense: number;
  stamina: number;
  color: number;
}

export type CharacterCreator = (
  reservation: CharacterReservation,
  plan: (now: number) => CharacterSeed,
) => Promise<ProvisionReceipt>;

export interface IdentityVerifier {
  verify(token: string): Promise<VerifiedIdentity>;
}

export interface RealmProvisioner {
  create(reservation: CharacterReservation): Promise<ProvisionReceipt>;
}
