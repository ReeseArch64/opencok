import "reflect-metadata";

import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import {
    City,
    CharacterResources,
    Character,
    Account,
    CharacterProvisioning,
    Kingdom,
    World,
    WorldObject,
    WorldResourceDeposit,
    WorldObjectCell,
    CityBuilding,
    ConstructionJob,
    CommandReceipt,
    EconomyPosting,
    MutationOutbox,
    BuildingProduction,
    CharacterTroops,
    WorldMarch,
    WorldMarchTroop,
    WorldMarchCheckpoint,
    GatheringJob,
    TrainingJob,
} from "../models";
import { kingdomDatabase } from "./kingdom-database";
import type { PostgresDatabase } from "../types/postgres-database";
import type { PostgresOptions } from "../types/postgres-options";

export function createPostgresDataSource(
    database: PostgresDatabase,
    options: PostgresOptions = {},
): DataSource
{
    if (database !== "global" && database !== "payments")
    {
        const id = Number(database.slice("kingdom_".length));
        if (kingdomDatabase(id) !== database)
        {
            throw new RangeError("Banco PostgreSQL inválido");
        }
    }
    const entities = database === "global"
        ? [Account, CharacterProvisioning, Kingdom]
        : database === "payments"
        ? []
        : [
            City,
            CharacterResources,
            Character,
            World,
            WorldObject,
            WorldResourceDeposit,
            WorldObjectCell,
            CityBuilding,
            ConstructionJob,
            CommandReceipt,
            EconomyPosting,
            MutationOutbox,
            BuildingProduction,
            CharacterTroops,
            WorldMarch,
            WorldMarchTroop,
            WorldMarchCheckpoint,
            GatheringJob,
            TrainingJob,
        ];
    return new DataSource({
        type: "postgres",
        uuidExtension: "pgcrypto",
        installExtensions: false,
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        ...options,
        database,
        entities,
        migrations: [
            fileURLToPath(
                new URL(
                    `../migrations/${
                        database === "global" || database === "payments" ? database : "kingdom"
                    }/*.ts`,
                    import.meta.url,
                ),
            ),
        ],
        migrationsTableName: "typeorm_migrations",
        synchronize: false,
        migrationsRun: false,
    });
}
