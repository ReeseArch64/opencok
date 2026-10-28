import type { ResearchRepository } from "@opencok/research/repositories/progression";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import type { CityTransaction, CityProductionBoundary, CityBirthAllocator } from "./transaction";
import type { CityPersistenceReaders } from "./persistence-readers";
import type { CityPersistenceWriters } from "./persistence-writers";

export interface CityPersistenceAdapters
{
    readonly research: Pick<
        ResearchRepository,
        "read" | "readCivilization" | "levels" | "writeValidated" | "writeCivilization"
    >;
    readonly readers: CityPersistenceReaders;
    readonly writers: CityPersistenceWriters;
    readonly birth?: CityBirthAllocator;
}

export interface CityPersistenceSession extends CityPersistenceAdapters
{
    readonly tx: CityTransaction;
    readonly owner: string;
    readonly now: bigint;
    readonly mapSize: number;
    readonly boundary: CityProductionBoundary;
    alliance: string;
    questBefore?: Pick<CityProgressionState, "tasks" | "quests">;
    cosmeticTarget?: CityProgressionState["cosmeticTarget"];
}
