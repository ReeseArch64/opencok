import type { Connection } from "mongoose";
import { troopConfigurationModel } from "../models/global/troop-configuration";
import { troopTrainingConfigurationModel } from "../models/global/troop-training-configuration";
import { marchConfigurationModel } from "../models/global/march-configuration";
import { cityInitialConfigurationModel } from "../models/global/city-initial-configuration";

export async function prepareGameplayCatalogs(connection: Connection): Promise<void>
{
    const models = [
        troopConfigurationModel(connection),
        troopTrainingConfigurationModel(connection),
        marchConfigurationModel(connection),
        cityInitialConfigurationModel(connection),
    ];
    for (const model of models)
    {
        await model.createCollection();
        await model.createIndexes();
    }
}
