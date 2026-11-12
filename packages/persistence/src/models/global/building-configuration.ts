import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { buildingConfigurationSchema } from "../../schemas/global/building-configuration";
import type { BuildingConfiguration } from "../../types/building-configuration";

export function buildingConfigurationModel(connection: Connection): Model<BuildingConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo de construções deve usar o MongoDB global");
    }
    const existing = connection.models["BuildingConfiguration"] as
        | Model<BuildingConfiguration>
        | undefined;
    return existing ?? connection.model<BuildingConfiguration>(
        "BuildingConfiguration",
        buildingConfigurationSchema,
    );
}
