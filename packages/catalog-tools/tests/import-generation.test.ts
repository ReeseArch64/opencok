import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { digest } from "../src/resources/client-sources";
import { writeCatalogModules } from "../src/generators/catalog-modules";
import { writeBuildingModules } from "../src/generators/building-modules";
import { catalogSources, buildingXml } from "./support/import-fixtures";

async function snapshot(directory: string): Promise<[string, string][]>
{
    const files = await readdir(directory, { recursive: true, withFileTypes: true });
    const entries: [string, string][] = [];

    for (const file of files)
    {
        if (file.isFile())
        {
            const path = join(file.parentPath, file.name);
            entries.push([
                relative(directory, path).split(sep).join("/"),
                await readFile(path, "utf8"),
            ]);
        }
    }

    return entries.sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
}

function originalBuildingOutput(entries: [string, string][]): [string, string][]
{
    const contract = "@opencok/building/contracts/building";
    expect(entries.filter(([, source]) => source.includes(contract))).toHaveLength(3);
    expect(entries.some(([, source]) => source.includes("@opencok/contracts/building"))).toBe(
        false,
    );

    return entries.map(([path, source]) => [
        path,
        source.replaceAll(contract, "@opencok/contracts/building"),
    ]);
}

test("generators preserve catalog bytes and building data after the owned contract import changes", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-import-generation-"));
    const resources = join(directory, "resources");
    const heroTypes = join(directory, "hero-types");
    const buildings = join(directory, "buildings");

    try
    {
        await writeCatalogModules(catalogSources(), { resources, heroTypes });
        await writeBuildingModules(buildingXml, pathToFileURL(buildings + "/"));
        const output = await snapshot(resources);
        const heroOutput = await snapshot(heroTypes);
        const buildingOutput = await snapshot(buildings);
        expect(output).toHaveLength(16);
        expect(digest(JSON.stringify(output))).toBe(
            "101ec2c769a754eaa273f0fac387ac3fefc2d8c51971cb2bf496de5d26666822",
        );
        expect(heroOutput).toHaveLength(1);
        expect(digest(JSON.stringify(heroOutput))).toBe(
            "70935498eab4d4542728ac009e5f5106da2d40fca9dce34b4e27c4a14ece9903",
        );
        expect(buildingOutput).toHaveLength(5);
        expect(digest(JSON.stringify(originalBuildingOutput(buildingOutput)))).toBe(
            "5f12648b72c91f3d6479ff736f7d1018dcb4780e17464aa22b7c0dec2ffd12d9",
        );
        const records = output.find(([path]) => path === "catalogs/data/item.records0.ts")![1];
        expect(records).toContain("\"id\":\"001\"");
        expect(records).toContain("9007199254740993n");
        expect(output.find(([path]) => path === "catalogs/data/general_base.records0.ts")![1])
            .toContain("heroDefinitionByIdentity[HeroIdentity.Mulan]");
        expect(output.find(([path]) => path === "catalogs/data/dragon_base.records0.ts")![1])
            .toContain("dragonDefinitionByIdentity.get(DragonIdentity.BlackDragon)");
        await writeFile(join(resources, "catalogs/data/obsolete.ts"), "stale");
        await writeFile(join(heroTypes, "obsolete.ts"), "stale");
        await writeCatalogModules(catalogSources(), { resources, heroTypes });
        expect(await snapshot(resources)).toEqual(output);
        expect(await snapshot(heroTypes)).toEqual(heroOutput);
    }
    finally
    {
        await rm(directory, { recursive: true, force: true });
    }
});

test("CLI supports isolated output from another directory and rejects a partial catalog destination", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-import-cli-"));
    const input = join(directory, "building.xml");
    const output = join(directory, "buildings");

    try
    {
        await writeFile(input, buildingXml);
        const run = async (script: string, args: string[]) => {
            const child = Bun.spawn([
                process.execPath,
                "--no-env-file",
                new URL("../scripts/" + script + ".ts", import.meta.url).pathname,
                ...args,
            ], { cwd: directory, stdout: "pipe", stderr: "pipe" });
            const [code, stdout, stderr] = await Promise.all([
                child.exited,
                new Response(child.stdout).text(),
                new Response(child.stderr).text(),
            ]);

            return { code, stdout, stderr };
        };
        const imported = await run("import-building-definitions", [input, "buildings"]);
        expect(imported.code).toBe(0);
        expect(imported.stdout).toContain("2 building levels across 2 building types");
        expect(digest(JSON.stringify(originalBuildingOutput(await snapshot(output))))).toBe(
            "5f12648b72c91f3d6479ff736f7d1018dcb4780e17464aa22b7c0dec2ffd12d9",
        );
        expect(await readFile(input, "utf8")).toBe(buildingXml);
        const partial = await run("import-gameplay-catalogs", [directory, output]);
        expect(partial.code).not.toBe(0);
        expect(partial.stderr).toContain("Supply both resource and Hero type destinations");
        const sourceDirectory = join(directory, "source");
        await mkdir(sourceDirectory);
        const incomplete = await run("import-gameplay-catalogs", [sourceDirectory, output, output]);
        expect(incomplete.code).not.toBe(0);
        expect(incomplete.stderr).toContain("Supply the complete authorized catalog directory");
        const overlapping = await run("import-building-definitions", [input, directory]);
        expect(overlapping.code).not.toBe(0);
        expect(overlapping.stderr).toContain("must be separate from authorized inputs");
        expect(await readFile(input, "utf8")).toBe(buildingXml);
    }
    finally
    {
        await rm(directory, { recursive: true, force: true });
    }
});
