import type { Connection, Model } from "mongoose";
import { kingdomDatabase } from "../../factories/kingdom-database";
import { worldResourceSpawnJobSchema } from "../../schemas/kingdom/world-resource-spawn-job";
import type { WorldResourceSpawnJob } from "../../types/world-resource-spawn-job";

export function worldResourceSpawnJobModel(
    connection: Connection,
    kingdomId: number,
): Model<WorldResourceSpawnJob>
{
    if (connection.name !== kingdomDatabase(kingdomId))
    {
        throw new Error(
            "Documento deve usar o MongoDB do reino correspondente",
        );
    }
    const existing = connection.models["WorldResourceSpawnJob"] as
        | Model<WorldResourceSpawnJob>
        | undefined;
    return (
        existing
            ?? connection.model<WorldResourceSpawnJob>(
                "WorldResourceSpawnJob",
                worldResourceSpawnJobSchema,
            )
    );
}
