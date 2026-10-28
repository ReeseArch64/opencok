import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { PublicAllianceState } from "@opencok/contracts/profile";

type Transaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export type PublicProfileAllianceReader = (
    tx: Transaction,
    allianceId: string,
    withEffects: boolean,
) => Promise<PublicAllianceState>;
