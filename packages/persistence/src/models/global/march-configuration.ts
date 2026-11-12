import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { marchConfigurationSchema } from "../../schemas/global/march-configuration";
import type { MarchConfiguration } from "../../types/march-configuration";

export function marchConfigurationModel(connection: Connection): Model<MarchConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo deve usar o MongoDB global");
    }
    const existing = connection.models["MarchConfiguration"] as
        | Model<MarchConfiguration>
        | undefined;
    return existing
        ?? connection.model<MarchConfiguration>("MarchConfiguration", marchConfigurationSchema);
}
