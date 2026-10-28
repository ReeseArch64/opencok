import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export type AllianceTransaction = Parameters<
    Parameters<DatabaseClient<"kingdom">["transaction"]>[0]
>[0];
