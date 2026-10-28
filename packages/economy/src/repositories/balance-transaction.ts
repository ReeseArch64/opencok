import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { MutationCommand, MutationResult } from "@opencok/ledger/contracts/mutation";

type RealmDatabase = DatabaseClient<"kingdom">;

export type BalanceTransaction = Parameters<Parameters<RealmDatabase["transaction"]>[0]>[0];

export type BalanceTransactionExecutor = (
    command: MutationCommand,
    apply: (tx: BalanceTransaction) => Promise<MutationResult>,
) => Promise<Buffer>;
