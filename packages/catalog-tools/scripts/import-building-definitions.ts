import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { writeBuildingModules } from "../src/generators/building-modules.ts";

const path = process.argv[2];
if (!path)
{
    throw new Error("Supply an authorized building.xml source");
}
const directory = process.argv[3]
    ? pathToFileURL(resolve(process.argv[3]) + "/")
    : new URL("../../resources/src/buildings/", import.meta.url);
await writeBuildingModules(await Bun.file(path).text(), directory);
