import type { Connection, Model } from "mongoose";
import { kingdomDatabase } from "../../factories/kingdom-database";
import { worldLayoutSchema } from "../../schemas/kingdom/world-layout";
import type { WorldLayout } from "../../types/world-layout";

export function worldLayoutModel(
    connection: Connection,
    kingdomId: number,
): Model<WorldLayout>
{
    if (connection.name !== kingdomDatabase(kingdomId))
    {
        throw new Error("Layout deve usar o MongoDB do reino correspondente");
    }
    const existing = connection.models["WorldLayout"] as
        | Model<WorldLayout>
        | undefined;
    return (
        existing
            ?? connection.model<WorldLayout>("WorldLayout", worldLayoutSchema)
    );
}
