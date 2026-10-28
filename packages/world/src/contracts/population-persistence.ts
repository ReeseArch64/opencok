import type { WorldTransaction } from "./persistence";
import type { WorldResourceNewClock } from "./world-resource-new";

export interface WorldPopulationPersistenceRuntime
{
    readonly kingdomId: number;
    readonly epoch: bigint;
    fence(tx: WorldTransaction): Promise<void>;
    assertReady(): void;
    traceparent(): string | null;
}

export interface WorldResourceNewPersistenceRuntime extends WorldPopulationPersistenceRuntime
{
    parseClock(raw: string, areas: number): WorldResourceNewClock;
}
