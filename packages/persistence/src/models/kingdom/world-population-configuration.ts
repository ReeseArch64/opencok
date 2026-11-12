import type { Connection, Model } from "mongoose";
import { kingdomDatabase } from "../../factories/kingdom-database";
import { worldPopulationConfigurationSchema } from "../../schemas/kingdom/world-population-configuration";
import type { WorldPopulationConfiguration } from "../../types/world-population-configuration";

export function worldPopulationConfigurationModel(
    connection: Connection,
    kingdomId: number,
): Model<WorldPopulationConfiguration>
{
    if (connection.name !== kingdomDatabase(kingdomId))
    {
        throw new Error(
            "Configuração de população deve usar o MongoDB do reino correspondente",
        );
    }
    const existing = connection.models["WorldPopulationConfiguration"] as
        | Model<WorldPopulationConfiguration>
        | undefined;
    return (
        existing
            ?? connection.model<WorldPopulationConfiguration>(
                "WorldPopulationConfiguration",
                worldPopulationConfigurationSchema,
            )
    );
}
