import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { cityInitialConfigurationSchema } from "../../schemas/global/city-initial-configuration";
import type { CityInitialConfiguration } from "../../types/city-initial-configuration";

export function cityInitialConfigurationModel(
    connection: Connection,
): Model<CityInitialConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo deve usar o MongoDB global");
    }
    const existing = connection.models["CityInitialConfiguration"] as
        | Model<CityInitialConfiguration>
        | undefined;
    return existing
        ?? connection.model<CityInitialConfiguration>(
            "CityInitialConfiguration",
            cityInitialConfigurationSchema,
        );
}
