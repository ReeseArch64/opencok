import type { CharacterReservation, ProvisionReceipt } from "@opencok/contracts/provisioning";
import type { Row } from "@opencok/contracts/rows";

export interface CharacterSeed
{
    birth: import("@opencok/contracts/world-birth").WorldBirthRules;
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
