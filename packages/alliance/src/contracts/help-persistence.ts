import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export type AllianceHelpTransaction = Parameters<
    Parameters<DatabaseClient<"kingdom">["transaction"]>[0]
>[0];
