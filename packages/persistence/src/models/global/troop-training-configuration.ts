import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { troopTrainingConfigurationSchema } from "../../schemas/global/troop-training-configuration";
import type { TroopTrainingConfiguration } from "../../types/troop-training-configuration";

export function troopTrainingConfigurationModel(
    connection: Connection,
): Model<TroopTrainingConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo de treinamento deve usar o MongoDB global");
    }
    const existing = connection.models["TroopTrainingConfiguration"] as
        | Model<TroopTrainingConfiguration>
        | undefined;
    return existing ?? connection.model<TroopTrainingConfiguration>(
        "TroopTrainingConfiguration",
        troopTrainingConfigurationSchema,
    );
}
