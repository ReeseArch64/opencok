import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";

export type ProgressionBoundary<TTransaction> = (
    tx: TTransaction,
    owner: string,
    now: bigint,
    change: () => Promise<void>,
    deleted: readonly string[],
    economy: ActivityEconomy,
) => Promise<void>;
