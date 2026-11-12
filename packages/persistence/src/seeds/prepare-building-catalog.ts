import type { Connection } from "mongoose";
import { buildingConfigurationModel } from "../models/global/building-configuration";

export async function prepareBuildingCatalog(connection: Connection): Promise<void>
{
    const Configuration = buildingConfigurationModel(connection);
    await Configuration.createCollection();
    await Configuration.createIndexes();
}
