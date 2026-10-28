import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { ShareFeedStore } from "./feed";

export type ShareTransaction = Parameters<
    Parameters<DatabaseClient<"global">["transaction"]>[0]
>[0];

export interface ShareFeedMaintenance
{
    deleteExpired(cutoff: bigint): Promise<void>;
    health(): Promise<void>;
}

export interface ShareFeedPersistence
{
    transaction(tx: ShareTransaction, now: bigint): ShareFeedStore;
    maintenance(db: DatabaseClient<"global">): ShareFeedMaintenance;
}
