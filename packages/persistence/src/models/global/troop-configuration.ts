import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { troopConfigurationSchema } from "../../schemas/global/troop-configuration";
import type { TroopConfiguration } from "../../types/troop-configuration";

export function troopConfigurationModel(connection: Connection): Model<TroopConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo deve usar o MongoDB global");
    }
    const existing = connection.models["TroopConfiguration"] as
        | Model<TroopConfiguration>
        | undefined;
    return existing
        ?? connection.model<TroopConfiguration>("TroopConfiguration", troopConfigurationSchema);
}
