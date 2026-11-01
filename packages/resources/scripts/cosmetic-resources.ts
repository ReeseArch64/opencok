import { mkdir, readFile, writeFile, realpath } from "node:fs/promises";
import { resolve, join, relative, isAbsolute, dirname, basename, sep } from "node:path";
import { cosmeticResourceXml } from "../src/cosmetic-resources";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";

const [sourceDirectory, outputDirectory] = Bun.argv.slice(2);

if (!sourceDirectory || !outputDirectory || Bun.argv.length !== 4)
{
    throw new Error("Usage: bun cosmetic-resources.ts <source-directory> <new-output-directory>");
}

const source = await realpath(sourceDirectory);
const output = join(await realpath(dirname(resolve(outputDirectory))), basename(outputDirectory));
const destination = relative(source, output);

if (
    !destination
    || (destination !== ".." && !destination.startsWith(`..${sep}`) && !isAbsolute(destination))
)
{
    throw new Error("Cosmetic resource output must be outside the read-only source directory");
}

const resources = await Promise.all(
    ([GameplayCatalog.Status, GameplayCatalog.LifeTreeS] as const).map(async (table) => ({
        table,
        xml: cosmeticResourceXml(
            await readFile(join(source, `${table}.xml`), "utf8"),
            table,
        ),
    })),
);

await mkdir(output, { recursive: false });

for (const { table, xml } of resources)
{
    await writeFile(join(output, `${table}.xml`), xml, { flag: "wx" });
}
