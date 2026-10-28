import type { RecallTaskRepository } from "@opencok/tasks/repositories/recall-task";
import type { TargetTaskRepository } from "@opencok/tasks/repositories/target-task";
import type { QuestRepository } from "@opencok/tasks/repositories/progression";
import type { EquipmentRepository } from "@opencok/equipment/repositories/progression";
import type { BuildingRepository } from "@opencok/building/repositories/progression";
import type { TroopsRepository } from "@opencok/troops/repositories/progression";
import type { ResearchRepository } from "@opencok/research/repositories/progression";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import type { CityTransaction, CityProductionBoundary, CityBirthAllocator } from "./transaction";
import type { CityPersistenceReaders } from "./persistence-readers";
import type { CityPersistenceWriters } from "./persistence-writers";

export interface CityPersistenceAdapters
{
    readonly recallTasks: Pick<RecallTaskRepository, "readRecallTasks" | "writeRecallTasks">;
    readonly targetTasks: Pick<TargetTaskRepository, "readTargetTasks" | "writeTargetTasks">;
    readonly quests: Pick<QuestRepository, "readTasks" | "readQuests" | "writeQuests">;
    readonly equipment: Pick<
        EquipmentRepository,
        "read" | "readSuitDecompositions" | "writeEquipment"
    >;
    readonly buildings: Pick<
        BuildingRepository,
        "read" | "readExperience" | "write" | "writeExperience" | "delete"
    >;
    readonly troops: Pick<
        TroopsRepository,
        | "readArmies"
        | "readHospital"
        | "readForts"
        | "writeArmiesValidated"
        | "writeHospitalValidated"
        | "writeFortsValidated"
    >;
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
