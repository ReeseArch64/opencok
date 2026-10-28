import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeBuildingModules } from "../src/generators/building-modules.ts";
import { validateImportDestinations } from "../src/resources/import-destinations.ts";

const path = process.argv[2];

if (!path)
{
    throw new Error("Supply an authorized building.xml source");
}

const directory = process.argv[3]
    ? pathToFileURL(resolve(process.argv[3]) + "/")
    : new URL("../../building/src/resources/buildings/", import.meta.url);

await validateImportDestinations(path, [fileURLToPath(directory)]);
await writeBuildingModules(await Bun.file(path).text(), directory);
