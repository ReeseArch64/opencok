import type { Connection } from "mongoose";
import { resourceDepositConfigurationModel } from "../models/global/resource-deposit-configuration";
import configurations from "./data/resource-deposit-configurations.json";

export async function seedResourceConfigurations(
    connection: Connection,
): Promise<void>
{
    const Configuration = resourceDepositConfigurationModel(connection);
    const documents = configurations.map(
        (configuration) => new Configuration(configuration),
    );
    for (const document of documents)
    {
        await document.validate();
    }
    for (const document of documents)
    {
        const filter = {
            resourceType: document.resourceType,
            resourceLevel: document.resourceLevel,
            configurationVersion: document.configurationVersion,
        };
        try
        {
            await Configuration.updateOne(
                filter,
                { $setOnInsert: document.toObject() },
                { upsert: true, runValidators: true },
            );
        }
        catch (error)
        {
            if (
                !(error instanceof Error)
                || !("code" in error)
                || error.code !== 11000
            )
            {
                throw error;
            }
        }
        const stored = await Configuration.findOne(filter).orFail();
        if (
            stored.initialQuantity !== document.initialQuantity
            || stored.respawnPolicy !== document.respawnPolicy
            || stored.respawnDelaySeconds !== document.respawnDelaySeconds
        )
        {
            throw new Error(
                `Configuração publicada diverge do seed: ${document.resourceType}, nível ${document.resourceLevel}, versão ${document.configurationVersion}. Publique uma nova versão.`,
            );
        }
    }
}
