import type { Connection } from "mongoose";
import { resourceDepositConfigurationModel } from "../models/global/resource-deposit-configuration";

export async function prepareResourceCatalog(
    connection: Connection,
): Promise<void>
{
    const Configuration = resourceDepositConfigurationModel(connection);
    await Configuration.createCollection();
    await Configuration.createIndexes();
}
