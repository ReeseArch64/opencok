import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export type WorldTransaction = Parameters<
    Parameters<DatabaseClient<"kingdom">["transaction"]>[0]
>[0];

export type WorldTransactionFence = (transaction: WorldTransaction) => Promise<void>;
