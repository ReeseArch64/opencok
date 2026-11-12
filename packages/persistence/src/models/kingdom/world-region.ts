import type { Connection, Model } from "mongoose";
import { kingdomDatabase } from "../../factories/kingdom-database";
import { worldRegionSchema } from "../../schemas/kingdom/world-region";
import type { WorldRegion } from "../../types/world-region";

export function worldRegionModel(
    connection: Connection,
    kingdomId: number,
): Model<WorldRegion>
{
    if (connection.name !== kingdomDatabase(kingdomId))
    {
        throw new Error(
            "Documento deve usar o MongoDB do reino correspondente",
        );
    }
    const existing = connection.models["WorldRegion"] as
        | Model<WorldRegion>
        | undefined;
    return (
        existing
            ?? connection.model<WorldRegion>("WorldRegion", worldRegionSchema)
    );
}
