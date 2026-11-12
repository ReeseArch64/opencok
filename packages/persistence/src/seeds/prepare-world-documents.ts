import { worldPopulationConfigurationModel } from "../models/kingdom/world-population-configuration";
import { worldPopulationConfigurationDocumentValidator } from "../validators/world-population-configuration-document";
import type { Connection } from "mongoose";
import { worldRegionModel } from "../models/kingdom/world-region";
import { worldResourceSpawnJobModel } from "../models/kingdom/world-resource-spawn-job";
import { worldRegionDocumentValidator } from "../validators/world-region-document";
import { worldResourceSpawnJobDocumentValidator } from "../validators/world-resource-spawn-job-document";

export async function prepareWorldDocuments(
    connection: Connection,
    kingdomId: number,
): Promise<void>
{
    const Region = worldRegionModel(connection, kingdomId);
    const Job = worldResourceSpawnJobModel(connection, kingdomId);
    const Population = worldPopulationConfigurationModel(connection, kingdomId);
    if (!connection.db)
    {
        throw new Error("MongoDB desconectado");
    }
    await Region.createCollection();
    await Job.createCollection();
    await connection.db.command({
        collMod: "world_regions",
        validator: worldRegionDocumentValidator,
        validationLevel: "strict",
        validationAction: "error",
    });
    await connection.db.command({
        collMod: "world_resource_spawn_jobs",
        validator: worldResourceSpawnJobDocumentValidator,
        validationLevel: "strict",
        validationAction: "error",
    });
    await Region.collection.updateMany(
        { activePopulationConfigurationId: { $exists: false } },
        { $set: { activePopulationConfigurationId: null } },
    );
    await Population.createCollection();
    await connection.db.command({
        collMod: "world_population_configurations",
        validator: worldPopulationConfigurationDocumentValidator,
        validationLevel: "strict",
        validationAction: "error",
    });
    await Population.createIndexes();
    await Region.createIndexes();
    await Job.createIndexes();
}
