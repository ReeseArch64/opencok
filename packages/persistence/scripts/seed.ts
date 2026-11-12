import { prepareWorldDocuments } from "../src/seeds/prepare-world-documents";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { connectMongoDB } from "../src/mongoose";
import { seedKingdom } from "../src/seeds/seed-kingdom";
import { seedWorld } from "../src/seeds/seed-world";
import { prepareResourceCatalog } from "../src/seeds/prepare-resource-catalog";
import { prepareBuildingCatalog } from "../src/seeds/prepare-building-catalog";
import { seedResourceConfigurations } from "../src/seeds/seed-resource-configurations";
import { seedResourceDeposits } from "../src/seeds/seed-resource-deposits";
import { prepareGameplayCatalogs } from "../src/seeds/prepare-gameplay-catalogs";
import { persistenceOptions } from "./options";

const options = persistenceOptions();
const global = createPostgresDataSource("global", options.postgres);
const kingdom = createPostgresDataSource("kingdom_1", options.postgres);
const mongo = await connectMongoDB(options.mongodbUri, { dbName: "kingdom_1" });
try
{
    await prepareWorldDocuments(mongo, 1);
    await global.initialize();
    await kingdom.initialize();
    await prepareResourceCatalog(mongo.useDb("global", { useCache: true }));
    await prepareBuildingCatalog(mongo.useDb("global", { useCache: true }));
    await prepareGameplayCatalogs(mongo.useDb("global", { useCache: true }));
    await seedResourceConfigurations(mongo.useDb("global", { useCache: true }));
    await seedKingdom(global);
    await seedWorld(kingdom, mongo);
    await seedResourceDeposits(
        kingdom,
        mongo.useDb("global", { useCache: true }),
    );
    console.info(
        "Seed concluído: reino 1, mundo principal, objetos iniciais, terreno v1 e catálogo de recursos v1",
    );
}
finally
{
    await mongo.close();
    if (kingdom.isInitialized)
    {
        await kingdom.destroy();
    }
    if (global.isInitialized)
    {
        await global.destroy();
    }
}
