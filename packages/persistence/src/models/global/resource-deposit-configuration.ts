import type { Connection, Model } from "mongoose";
import { databases } from "../../config/databases";
import { resourceDepositConfigurationSchema } from "../../schemas/global/resource-deposit-configuration";
import type { ResourceDepositConfiguration } from "../../types/resource-deposit-configuration";

export function resourceDepositConfigurationModel(
    connection: Connection,
): Model<ResourceDepositConfiguration>
{
    if (connection.name !== databases.global)
    {
        throw new Error("Catálogo de recursos deve usar o MongoDB global");
    }
    const existing = connection.models["ResourceDepositConfiguration"] as
        | Model<ResourceDepositConfiguration>
        | undefined;
    return (
        existing
            ?? connection.model<ResourceDepositConfiguration>(
                "ResourceDepositConfiguration",
                resourceDepositConfigurationSchema,
            )
    );
}
