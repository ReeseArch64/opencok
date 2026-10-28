import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { WorldBirthRules, WorldBirthPlacement } from "@opencok/contracts/world-birth";
import type { MutationCommand, MutationResult } from "@opencok/contracts/mutation";

type RealmDatabase = DatabaseClient<"kingdom">;

export type CharacterProvisioningTransaction = Parameters<
    Parameters<RealmDatabase["transaction"]>[0]
>[0];

export interface CharacterProvisioningTransactions
{
    readonly kingdomId: number;
    assertReady(): void;
    fence(tx: CharacterProvisioningTransaction): Promise<void>;
    allocateBirth(
        tx: CharacterProvisioningTransaction,
        mapSize: number,
        rules: WorldBirthRules,
        now: bigint,
    ): Promise<WorldBirthPlacement>;
    appendRecords(
        tx: CharacterProvisioningTransaction,
        command: MutationCommand,
        result: MutationResult,
        now: bigint,
    ): Promise<Uint8Array>;
}
