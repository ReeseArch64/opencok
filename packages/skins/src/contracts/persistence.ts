import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { CosmeticRecord } from "./records";
import type { CosmeticReaders, CosmeticRecipientRuntime } from "./runtime";

export type CosmeticTransaction = Parameters<
    Parameters<DatabaseClient<"kingdom">["transaction"]>[0]
>[0];

export interface CosmeticPersistenceRuntime extends CosmeticReaders, CosmeticRecipientRuntime
{
    writePlayerEffects(tx: CosmeticTransaction, owner: string, write: {
        states: readonly CosmeticRecord[];
        deletedStates: readonly number[];
    }): Promise<unknown>;
}
